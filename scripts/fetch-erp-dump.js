#!/usr/bin/env node
/*
 * Busca o dump de produtos do ERP direto por HTTP (protocolo MCP em modo
 * stateless, sem handshake de sessão), sem depender de um cliente/conector
 * MCP instalado — necessário porque a rotina agendada na nuvem não carrega
 * o `.mcp.json` do repositório (só conectores da conta claude.ai).
 *
 * Lê a URL e a chave de API do próprio `.mcp.json` (servidor
 * "indaia-comercial"), para não duplicar o segredo em dois lugares.
 *
 * Uso:
 *   node scripts/fetch-erp-dump.js <saida.json>
 */
const fs = require('fs');
const path = require('path');

const BATCH_SIZE = 150; // a resposta do MCP trunca perto de 100k caracteres — em lotes menores, fica sempre abaixo disso

function buildQuery(offset) {
  return `SELECT nome, categoria_nome, valor, valor_minimo, unidade, desconto_maximo
FROM produtos
WHERE deleted_at IS NULL AND status = 'ativo' AND categoria_nome IS NOT NULL
ORDER BY categoria_nome, nome
LIMIT ${BATCH_SIZE} OFFSET ${offset}`;
}

async function callIndaiaSql(server, query) {
  const apiKeyHeaderName = Object.keys(server.headers || {}).find(h => /api-key/i.test(h)) || 'X-API-Key';
  const apiKey = server.headers[apiKeyHeaderName];

  const res = await fetch(server.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream',
      [apiKeyHeaderName]: apiKey,
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: { name: 'indaia_sql', arguments: { query } },
    }),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ao chamar ${server.url}: ${await res.text()}`);
  }

  const body = await res.json();
  if (body.error) {
    throw new Error(`Erro JSON-RPC: ${JSON.stringify(body.error)}`);
  }
  const content = body.result && body.result.content && body.result.content[0];
  if (!content || content.type !== 'text') {
    throw new Error(`Resposta inesperada do MCP: ${JSON.stringify(body).slice(0, 500)}`);
  }

  const payload = JSON.parse(content.text);
  if (payload.truncado) {
    throw new Error(`Resposta truncada mesmo em lotes de ${BATCH_SIZE} — reduza BATCH_SIZE em fetch-erp-dump.js. Aviso: ${payload.aviso}`);
  }
  if (!Array.isArray(payload.linhas)) {
    throw new Error(`Payload sem "linhas": ${content.text.slice(0, 500)}`);
  }
  return payload.linhas;
}

async function main() {
  const outPath = process.argv[2];
  if (!outPath) {
    console.error('Uso: node scripts/fetch-erp-dump.js <saida.json>');
    process.exitCode = 1;
    return;
  }

  const mcpConfigPath = path.join(__dirname, '..', '.mcp.json');
  const mcpConfig = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf-8'));
  const server = mcpConfig.mcpServers && mcpConfig.mcpServers['indaia-comercial'];
  if (!server) throw new Error('Servidor "indaia-comercial" não encontrado em .mcp.json');

  const linhas = [];
  let offset = 0;
  for (;;) {
    const batch = await callIndaiaSql(server, buildQuery(offset));
    linhas.push(...batch);
    if (batch.length < BATCH_SIZE) break;
    offset += BATCH_SIZE;
  }

  fs.writeFileSync(outPath, JSON.stringify({ linhas }, null, 2), 'utf-8');
  console.log(`OK — ${linhas.length} linhas salvas em ${outPath} (${Math.ceil(linhas.length / BATCH_SIZE)} lote(s) de ${BATCH_SIZE})`);
}

main().catch(e => {
  console.error('Falha ao buscar dump do ERP:', e.message);
  process.exitCode = 1;
});
