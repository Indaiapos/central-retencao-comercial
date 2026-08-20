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

A página inicial é só um campo de busca (`#masterSearch`) — sem atalhos, sem menu lateral, sem seções fixas. Tudo é um **banco de informações indexado** (`SEARCH_INDEX`, no fim da seção de dados do `script.js`). Cada entrada do índice tem `keywords` (texto normalizado usado no filtro) e uma função `render()` que monta o card daquele resultado. Ao digitar, o portal filtra `SEARCH_INDEX` por substring nas `keywords` e mostra **só** os cards que bateram — nada além disso fica visível.

Um card de **motivo** já vem completo: textos prontos, perguntas, argumentação, liberações (clicáveis, expandem o detalhe do R-0X ali mesmo, sem sair do card) e o caso real relacionado embutido — tudo isso é montado por `buildMotivoResult()`.

## Como editar

### Adicionar ou alterar um motivo de cancelamento
Edite o array `MOTIVOS` em `script.js`. Cada item aceita:
- `titulo`, `icone`, `desc`, `sinonimos[]` (termos alternativos que o consultor pode digitar para achar esse motivo — não mude a regra de negócio, só ajuda a busca)
- `comoIdentificar[]`, `perguntas[]`, `argumentos[]`, `alternativas[]`, `erros[]`, `estagio`
- `mensagens[]`: **sempre inclua mais de uma opção de texto** (`{ tom, texto }`) para o consultor escolher a que melhor encaixa na conversa — é o que aparece em destaque no resultado da busca, com botão de copiar.
- `casoRealId`: o `id` de um item de `CASOS` para linkar um caso real, ou `null` se ainda não houver caso registrado. **Não invente um caso real** — deixe `null` até haver um registro de verdade.

Novos motivos entram automaticamente na busca — não precisa editar mais nada.

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

Novos itens entram automaticamente na busca — não precisa editar mais nada. Hoje só existe "Troca de Data"; os próximos (troca de ambiente, redução contratual etc.) devem seguir a mesma estrutura, um de cada vez, e só com regras confirmadas pela gestão — nunca inventadas.

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

### Valores Praticados (preços) e o painel de admin
Os preços não ficam no `script.js` — ficam em **`precos.json`**, carregado em tempo de execução (`fetch('precos.json')`) porque é o mesmo arquivo que a página **`admin.html`** edita e salva direto no GitHub. Isso significa:

- Editar preço por preço à mão em `precos.json` também funciona (é só JSON), mas o jeito pensado para o dia a dia é abrir `admin.html` e editar pela interface, com login por **senha** — sem precisar mexer em código nem lidar com token no dia a dia.
- **Como funciona o login sem servidor:** como este site não tem backend, não existe um lugar realmente secreto para guardar usuário/senha. Em vez disso, `admin.html` guarda um token do GitHub **criptografado com a senha escolhida** (PBKDF2 + AES-GCM, via Web Crypto API do navegador) num arquivo público do repositório, `admin-key.json`. Sem a senha certa, esse arquivo não serve para nada. Isso é configurado **uma única vez** na aba "Primeira vez / trocar senha" de `admin.html` (pede o token do GitHub só nesse momento); depois disso, o login do dia a dia é só a senha. Use uma senha longa (16+ caracteres) — como o arquivo criptografado é público, a força da senha é a única proteção real. Para trocar a senha depois, volte na mesma aba de configuração (pede o token de novo, porque gerar uma nova configuração exige provar que você tem acesso de escrita ao repositório).
- Isso é adequado para uso interno de confiança (edição de tabela de preços), não para dados sensíveis — quem souber a senha, com esforço técnico, consegue extrair o token.
- Cada categoria em `precos.json` tem: `id`, `titulo`, `icone`, `desc`, `sinonimos[]` (ajuda a busca), `colunas[]` (cabeçalhos das colunas de valor, ex.: `["Margem inicial", "Mínimo"]`), `itens[]` (cada um com `nome` e `valores[]`, na mesma ordem de `colunas`) e `observacao` (opcional, vira um aviso no card).
- Ao salvar pelo admin, o commit vai direto para o GitHub e o GitHub Pages reconstrói o site em cerca de 1 minuto.
- **Importante:** como é local ao navegador, `fetch('precos.json')` só funciona servido por http(s) — não funciona abrindo `index.html` direto do disco (`file://`) por causa de CORS. Use um servidor local (`npx serve`, `python -m http.server` etc.) para testar, ou teste direto no GitHub Pages.
- Além das 3 categorias originais (Alteração de Data, Taxas para Serviços Terceirizados, Consumação), o banco já traz Produtora Essencial, Cardápios, Decorações, Serviços e Floral, vindos das abas correspondentes da planilha de valores. As próximas categorias (DJ, Cerimonial, Fotografia, Ateliê de Vestidos etc.) entram aos poucos, sempre a partir de dados reais confirmados — nunca inventados.
- 13 itens dessas abas ficaram de fora por enquanto: a planilha não seguia o padrão de colunas das demais linhas para eles, então precisam de confirmação antes de entrar (Mesa de Frios do cardápio, Cascata de Negroni Classic, Trilho Floral de Cerimônia, Open Drinks Extra Premium - Open Bar 6, e o grupo TAXAS do Serviços: Gerador, ECAD, Taxa de Bartender, Estacionamento, Taxa para Terceirizar Lanche/Mesa de Frios/Espaço Kids).

### Adicionar um novo "tema" de busca (fora dos motivos)
Coisas como Matriz, Escada completa, Não fazer etc. são entradas manuais no `SEARCH_INDEX` (bloco `bundle-*`) com `keywords` e `render`. Para adicionar um tema novo, siga o mesmo padrão — ele fica disponível assim que alguém pesquisar pelas palavras certas.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub (ou use um existente) e adicione estes arquivos.
2. Faça commit e push para a branch principal.
3. Em **Settings → Pages**, selecione a branch (`main`) e a pasta raiz (`/`).
4. Aguarde alguns minutos — o site ficará disponível em `https://<usuario>.github.io/<repositorio>/`.

Não há build step nem dependências externas: o projeto funciona diretamente ao abrir `index.html` no navegador ou publicado em qualquer hospedagem estática.

## Sobre as informações de negócio

Os percentuais, prazos e regras contratuais deste portal vêm de documentos oficiais fornecidos pela gestão (Manual de Negociação R-09) ou de casos reais registrados no Indaiá Chat. Nada foi inventado. Onde a informação ainda não existe (ex.: alçada de aprovação por cargo), o portal marca claramente como **A DEFINIR** — mantenha essa marcação até receber a confirmação oficial.
