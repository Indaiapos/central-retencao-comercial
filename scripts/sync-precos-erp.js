#!/usr/bin/env node
/*
 * Sincroniza as categorias "Produtos (ERP)" de precos.json a partir de um dump
 * da tabela `produtos` do ERP Indaiá (ver README, seção "Sincronização com o ERP").
 *
 * Uso:
 *   node scripts/sync-precos-erp.js <dump.json>
 *
 * <dump.json> é o resultado bruto de indaia_sql, no formato { "linhas": [...] },
 * com colunas: nome, categoria_nome, valor, valor_minimo, unidade, desconto_maximo.
 *
 * Categorias com grupo "Produtos (ERP)" são recriadas do zero a cada sync — os
 * itens e valores sempre refletem o ERP. Campos editoriais (desc, sinonimos,
 * icone, observacao) são preservados entre execuções quando a categoria já
 * existe (casada por `erpCategoriaNome`), então dá pra ajustar o texto pelo
 * admin sem perder a edição no próximo sync.
 */
const fs = require('fs');
const path = require('path');

const PRECOS_PATH = path.join(__dirname, '..', 'precos.json');
const GROUP_ERP = 'Produtos (ERP)';

function fmtMoney(v) {
  const n = typeof v === 'string' ? parseFloat(v) : v;
  if (!isFinite(n)) return 'R$ 0,00';
  return 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function main() {
  const dumpPath = process.argv[2];
  if (!dumpPath) {
    console.error('Uso: node scripts/sync-precos-erp.js <dump.json>');
    process.exit(1);
  }

  const dump = JSON.parse(fs.readFileSync(dumpPath, 'utf-8'));
  const rows = dump.linhas || dump;
  if (!Array.isArray(rows)) throw new Error('Formato inesperado no dump — esperava { linhas: [...] }');

  const precos = JSON.parse(fs.readFileSync(PRECOS_PATH, 'utf-8'));

  // Categorias ERP existentes hoje, indexadas por nome de categoria no ERP —
  // usadas só para preservar campos editoriais entre execuções.
  const existingByErpNome = {};
  precos.categorias.forEach(cat => {
    if (cat.grupo === GROUP_ERP && cat.erpCategoriaNome) {
      existingByErpNome[cat.erpCategoriaNome] = cat;
    }
  });

  // Agrupa as linhas do dump por categoria_nome.
  const porCategoria = {};
  let ignoradosSemCategoria = 0;
  rows.forEach(r => {
    const catNome = (r.categoria_nome || '').trim();
    if (!catNome) { ignoradosSemCategoria++; return; }
    if (!porCategoria[catNome]) porCategoria[catNome] = [];
    porCategoria[catNome].push(r);
  });

  const novasCategoriasErp = [];
  const idsUsados = new Set(precos.categorias.filter(c => c.grupo !== GROUP_ERP).map(c => c.id));

  Object.keys(porCategoria).sort().forEach(catNome => {
    const itens = porCategoria[catNome]
      .filter(r => r.nome && r.nome.trim())
      .map(r => ({ nome: r.nome.trim(), valores: [fmtMoney(r.valor), fmtMoney(r.valor_minimo)] }));
    if (!itens.length) return;

    const prev = existingByErpNome[catNome];
    let id = prev ? prev.id : 'erp-' + slugify(catNome);
    let n = 2;
    while (idsUsados.has(id) && id !== (prev && prev.id)) id = 'erp-' + slugify(catNome) + '-' + (n++);
    idsUsados.add(id);

    novasCategoriasErp.push({
      id,
      titulo: catNome,
      grupo: GROUP_ERP,
      erpCategoriaNome: catNome,
      icone: prev ? prev.icone : '📦',
      desc: prev ? prev.desc : '',
      sinonimos: prev ? prev.sinonimos : [],
      colunas: ['Valor Cheio', 'Mínimo'],
      itens,
      observacao: prev ? prev.observacao : null,
    });
  });

  const removidas = Object.keys(existingByErpNome).filter(nome => !porCategoria[nome]);

  const categoriasFinais = precos.categorias
    .filter(c => c.grupo !== GROUP_ERP)
    .concat(novasCategoriasErp);

  precos.categorias = categoriasFinais;
  precos.atualizadoEm = new Date().toISOString().slice(0, 10);

  fs.writeFileSync(PRECOS_PATH, JSON.stringify(precos, null, 2) + '\n', 'utf-8');

  const totalItens = novasCategoriasErp.reduce((s, c) => s + c.itens.length, 0);
  console.log('Categorias ERP sincronizadas:', novasCategoriasErp.length);
  console.log('Itens ERP sincronizados:', totalItens);
  console.log('Categorias ERP removidas (não existem mais no ERP):', removidas.length, removidas);
  console.log('Linhas do dump ignoradas por falta de categoria_nome:', ignoradosSemCategoria);
}

main();
