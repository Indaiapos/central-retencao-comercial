# Banco de Informações Pós-Vendas — Indaiá Eventos

Portal interno de pós-vendas para orientar consultores, supervisores e gerentes. Cobre tanto o atendimento a clientes que manifestam intenção de cancelar contratos (transformando o cancelamento em um fluxo comercial estruturado: **ouvir → entender → diagnosticar → argumentar → solucionar → negociar → reter** — e só depois, se necessário, **cancelar**) quanto procedimentos operacionais do dia a dia do pós-venda que não envolvem risco de cancelamento — troca de data, troca de ambiente, redução contratual, entre outros que serão incluídos aos poucos.

Uso interno da equipe comercial. Contém nomes de clientes reais em casos de estudo — não publicar ou compartilhar este conteúdo fora da empresa.

## Estrutura

```
index.html   → estrutura da página (seções e pontos de montagem)
style.css    → identidade visual (cores, tipografia, layout responsivo)
script.js    → todo o conteúdo (dados) + lógica de renderização/interação
README.md    → este arquivo
```

Todo o conteúdo textual (motivos, escada de liberações, casos reais, scripts, matriz, indicadores) vive em objetos JavaScript no topo do `script.js`. O HTML é montado automaticamente a partir desses dados — não é necessário editar HTML para atualizar conteúdo.

## Como o portal funciona

A página inicial é só um campo de busca (`#masterSearch`) e uma fileira de atalhos (`#quickChips`). Não há mais menu lateral nem seções fixas: tudo é um **banco de informações indexado** (`SEARCH_INDEX`, no fim da seção de dados do `script.js`). Cada entrada do índice tem `keywords` (texto normalizado usado no filtro) e uma função `render()` que monta o card daquele resultado. Ao digitar, o portal filtra `SEARCH_INDEX` por substring nas `keywords` e mostra **só** os cards que bateram — nada além disso fica visível.

Um card de **motivo** já vem completo: textos prontos, perguntas, argumentação, liberações (clicáveis, expandem o detalhe do R-0X ali mesmo, sem sair do card) e o caso real relacionado embutido — tudo isso é montado por `buildMotivoResult()`.

## Como editar

### Adicionar ou alterar um motivo de cancelamento
Edite o array `MOTIVOS` em `script.js`. Cada item aceita:
- `titulo`, `icone`, `desc`, `sinonimos[]` (termos alternativos que o consultor pode digitar para achar esse motivo — não mude a regra de negócio, só ajuda a busca)
- `comoIdentificar[]`, `perguntas[]`, `argumentos[]`, `alternativas[]`, `erros[]`, `estagio`
- `mensagens[]`: **sempre inclua mais de uma opção de texto** (`{ tom, texto }`) para o consultor escolher a que melhor encaixa na conversa — é o que aparece em destaque no resultado da busca, com botão de copiar.
- `casoRealId`: o `id` de um item de `CASOS` para linkar um caso real, ou `null` se ainda não houver caso registrado. **Não invente um caso real** — deixe `null` até haver um registro de verdade.

Novos motivos entram automaticamente na busca e ganham um chip — não precisa editar mais nada.

### Atualizar a escada de liberações (R-01 a R-09)
Edite o array `RSTEPS`. Os percentuais, prazos e regras vieram do "Manual de Negociação — Protocolo R-09 · Retenção" fornecido pela gestão. **Não altere valores sem confirmação oficial** — se uma regra nova chegar, atualize o objeto correspondente e mantenha as demais intactas. O campo `sinonimos[]` só ajuda a busca (ex.: "multa" encontra R-08).

### Adicionar um novo procedimento pós-venda (troca de data, troca de ambiente, redução contratual...)
Esses temas não são "motivos de cancelamento" — são procedimentos que o cliente pede diretamente, sem necessariamente cogitar cancelar. Edite o array `PROCEDIMENTOS` em `script.js`. Cada item aceita:
- `titulo`, `icone`, `desc`, `sinonimos[]`
- `quandoUsar`: um parágrafo curto explicando quando esse procedimento se aplica
- `passoAPasso[]`: a sequência de ações, nessa ordem
- `perguntas[]`: o que perguntar ou verificar antes de agir
- `alternativas[]`: liberações da escada (R-0X) relacionadas, se houver
- `erros[]`
- `mensagens[]`: **mais de uma opção de texto pronto**, igual aos motivos

Novos itens entram automaticamente na busca e ganham um chip no grupo "Procedimentos Pós-Venda" — não precisa editar mais nada. Hoje só existe "Troca de Data"; os próximos (troca de ambiente, redução contratual etc.) devem seguir a mesma estrutura, um de cada vez, e só com regras confirmadas pela gestão — nunca inventadas.

### Adicionar um novo caso real
Edite o array `CASOS`. Campos: `nome`, `evento`, `categoria`, `status` (`cancelado` | `andamento` | `disputa`), `motivo`, `oferta`, `rcodes[]` (ids de `RSTEPS` usados no caso, ex.: `['r03','r08']`) e `tatica` (leitura tática — o que o caso ensina sobre a aderência à escada). Casos vêm do histórico do Indaiá Chat; ao adicionar um novo, confirme os fatos antes de publicar.

### Matriz de Liberações (alçada por cargo)
A matriz (`MATRIZ`, derivada automaticamente de `RSTEPS`) hoje marca a alçada por cargo como **A DEFINIR**, porque a gestão ainda não confirmou o que cada nível (Consultor / Supervisor / Gerente / Diretoria) pode aprovar sozinho. Quando essa informação for fornecida, adicione os campos `consultor`, `supervisor`, `gerente`, `diretoria` a cada item de `RSTEPS` e ajuste `buildMatrizBlock()` em `script.js` para exibir os ícones (✓ / ⚠ / ✕) em vez do badge "A DEFINIR".

### Atualizar scripts gerais
Edite o array `SCRIPTS` — só os scripts que **não dependem do motivo** (ex.: primeiro contato, cliente não quer negociar) ficam aqui. Scripts específicos de um motivo vivem em `MOTIVOS[].mensagens`.

### Atualizar indicadores
`INDICADORES_DEMO` são **dados demonstrativos**, identificados como tal na tela. O bloco "Casos reais analisados" é calculado automaticamente a partir de `CASOS` (contagem real por categoria) dentro de `buildIndicadoresBlock()`. Quando houver uma fonte de dados real, substitua `INDICADORES_DEMO` por uma chamada que popule esse array antes da renderização.

### Árvore de decisão
Edite o objeto `ARVORE`. Cada ramo tem uma `pergunta` e um mapa de `opcoes`, onde cada opção define o `texto` da recomendação e os `rcodes` relacionados (chip que expande o detalhe da etapa correspondente ali mesmo).

### Adicionar um novo "tema" de busca (fora dos motivos)
Coisas como Matriz, Escada completa, Não fazer etc. são entradas manuais no `SEARCH_INDEX` (bloco `bundle-*`) com `keywords` e `render`. Para adicionar um tema novo, siga o mesmo padrão e, se quiser um atalho, adicione um chip na lista `outrosTemas` dentro de `initSearch()`.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub (ou use um existente) e adicione estes arquivos.
2. Faça commit e push para a branch principal.
3. Em **Settings → Pages**, selecione a branch (`main`) e a pasta raiz (`/`).
4. Aguarde alguns minutos — o site ficará disponível em `https://<usuario>.github.io/<repositorio>/`.

Não há build step nem dependências externas: o projeto funciona diretamente ao abrir `index.html` no navegador ou publicado em qualquer hospedagem estática.

## Sobre as informações de negócio

Os percentuais, prazos e regras contratuais deste portal vêm de documentos oficiais fornecidos pela gestão (Manual de Negociação R-09) ou de casos reais registrados no Indaiá Chat. Nada foi inventado. Onde a informação ainda não existe (ex.: alçada de aprovação por cargo), o portal marca claramente como **A DEFINIR** — mantenha essa marcação até receber a confirmação oficial.
