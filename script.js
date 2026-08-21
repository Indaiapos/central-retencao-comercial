/* ==========================================================================
   Central de Retenção Comercial — Indaiá Eventos
   Banco de informações em formato de busca. Todo o conteúdo vive nos
   objetos abaixo (seções 1-8). A partir da seção "ÍNDICE DE BUSCA" tudo é
   montado dinamicamente conforme o que o consultor digita — não há mais
   seções fixas na página. Ver README.md para instruções de edição.
   ========================================================================== */

/* -------------------------------------------------------------------------
   1. ESCADA DE FLEXIBILIZAÇÃO (R-01 a R-09)
   Transcrição fiel do "Manual de Negociação — Protocolo R-09 · Retenção".
   Não alterar percentuais/prazos sem confirmação da gestão.
   ------------------------------------------------------------------------- */
const RSTEPS = [
  {
    id: 'r01', codigo: 'R-01', nome: 'Redução das Parcelas', fase: 'I',
    intensidade: 1, label: 'Leve',
    desc: 'Aliviar o fluxo mensal do cliente sem tocar no valor total do contrato.',
    acoes: [
      'Reduzir o valor das parcelas para o mínimo de R$ 500,00.',
      'Direcionar todo o valor restante para o Saldo Final.'
    ],
    sinonimos: ['reduzir parcela', 'parcela minima', 'diminuir parcela']
  },
  {
    id: 'r02', codigo: 'R-02', nome: 'Cortesias', fase: 'I',
    intensidade: 1, label: 'Leve',
    desc: 'Encantar com um benefício desejado, preservando o vínculo com a experiência.',
    acoes: ['Oferecer a cortesia que o cliente deseja, limitada a 40% do contrato.'],
    alerta: 'Acima de 40% — conversar com a gestão.',
    sinonimos: ['cortesia', 'brinde', 'bonus']
  },
  {
    id: 'r03', codigo: 'R-03', nome: 'Redução Contratual', fase: 'I',
    intensidade: 2, label: 'Moderada',
    desc: 'Enxugar o escopo do contrato retirando o atrito das penalidades.',
    acoes: [
      'Isentar a multa da redução contratual.',
      'Permitir isenção superior a 20% do contrato.'
    ],
    sinonimos: ['reduzir escopo', 'reduzir contrato', 'ajustar contrato']
  },
  {
    id: 'r04', codigo: 'R-04', nome: 'Congelamento de Parcelas', fase: 'II',
    intensidade: 2, label: 'Moderada',
    desc: 'Pausar os pagamentos por um período proporcional ao tempo até o evento.',
    prazos: [
      { rotulo: 'Longo prazo · acima de 2 anos', valor: '4 meses' },
      { rotulo: 'Médio prazo · de 1 a 2 anos', valor: '3 meses' },
      { rotulo: 'Curto prazo · menos de 1 ano', valor: '2 meses' }
    ],
    sinonimos: ['congelar parcela', 'pausar pagamento', 'pausar parcela']
  },
  {
    id: 'r05', codigo: 'R-05', nome: 'Alteração de Data', fase: 'II',
    intensidade: 3, label: 'Moderada',
    desc: 'Remarcar o evento com taxa proporcional — ou isenta — conforme a antecedência.',
    prazos: [
      { rotulo: 'Curto prazo (< 180 dias) · abre em', valor: '50% · mín. 25%' },
      { rotulo: 'Longo prazo (> 180 dias) · abre em', valor: '20% · mín. 10%' }
    ],
    alerta: 'Desconto maior na taxa — conversar com a gestão.',
    nota: 'Valores atualizados a partir da planilha de Valores Praticados (substitui a regra anterior). Ver detalhe editável em "Valores Praticados → Alteração de Data".',
    sinonimos: ['remarcar', 'trocar data', 'mudar data', 'taxa de alteracao']
  },
  {
    id: 'r06', codigo: 'R-06', nome: 'Liberação de Data', fase: 'II',
    intensidade: 3, label: 'Moderada',
    desc: 'Soltar a data reservada e sustentar o vínculo por pagamentos mensais.',
    acoes: [
      'Aplicável a cliente com evento superior a 1 ano.',
      'Liberar a data e combinar pagamentos mensais das parcelas.',
      'Em seguida, negociar a troca de data.'
    ],
    sinonimos: ['liberar data', 'soltar data']
  },
  {
    id: 'r07', codigo: 'R-07', nome: 'Promissória', fase: 'III',
    intensidade: 4, label: 'Alta',
    desc: 'Encerrar honrando o compromisso financeiro em um plano estruturado no tempo.',
    acoes: [
      'Valor já pago do contrato deve ser superior a 30% do total.',
      'Até o saldo final, quitar 70% do valor total do contrato.',
      'Os 30% restantes em até 4 meses após a realização do evento.'
    ],
    sinonimos: ['promissoria', 'plano de pagamento pos cancelamento']
  },
  {
    id: 'r08', codigo: 'R-08', nome: 'Multa de Cancelamento', fase: 'III',
    intensidade: 4, label: 'Alta',
    desc: 'Encerrar o contrato aplicando a penalidade proporcional à antecedência.',
    prazos: [
      { rotulo: 'Curto prazo', valor: 'multa mín. 40%' },
      { rotulo: 'Longo prazo', valor: 'multa mín. 25%' }
    ],
    alerta: 'Desconto maior na multa — conversar com a gestão.',
    sinonimos: ['multa', 'penalidade', 'multa de cancelamento', 'clausula']
  },
  {
    id: 'r09', codigo: 'R-09', nome: 'Negociar a Multa & Manter o Evento Ativo', fase: 'III',
    intensidade: 5, label: 'Máxima',
    desc: 'Transformar a penalidade em ponte: manter o evento vivo até a decisão final do cliente.',
    acoes: [
      'Após acordo sobre a multa, oferecer — a evento superior a 2 anos — manter o evento ativo.',
      'Cliente segue pagando as parcelas até atingir o percentual negociado.',
      'Ao atingir, o cliente decide: manter o evento ou cancelar.'
    ],
    sinonimos: ['manter evento ativo', 'ultima tentativa de retencao']
  }
];

const FASES = {
  'I': 'Fase I · Ajuste & Permanência',
  'II': 'Fase II · Reestruturação & Tempo',
  'III': 'Fase III · Encerramento Negociado'
};

/* -------------------------------------------------------------------------
   2. MOTIVOS DE CANCELAMENTO
   mensagens[] traz sempre mais de uma opção de texto por situação, para o
   consultor escolher a que melhor se encaixa na conversa.
   casoRealId liga o motivo a um card em CASOS (seção 4). Deixe null quando
   ainda não houver caso real registrado — não inventar exemplo.
   ------------------------------------------------------------------------- */
const MOTIVOS = [
  {
    id: 'financeiro', icone: '💰', titulo: 'Financeiro',
    desc: 'Dificuldade de pagamento, redução de renda, desemprego ou orçamento comprometido.',
    sinonimos: ['dinheiro', 'parcela', 'desemprego', 'renda', 'pagamento', 'sem grana', 'orcamento'],
    comoIdentificar: ['Cliente menciona valor, parcela, renda ou desemprego antes de qualquer outro assunto.'],
    perguntas: [
      'O principal motivo hoje seria realmente financeiro?',
      'A dificuldade está relacionada ao valor total ou ao valor das parcelas?',
      'Se conseguíssemos reorganizar a condição de pagamento, isso ajudaria?',
      'Existe algum valor mensal que ficaria mais confortável?',
      'Existe algum serviço que poderíamos revisar antes de considerar o cancelamento?'
    ],
    argumentos: [
      'Antes de cancelar todo o planejamento já realizado, vale verificar possibilidades de reorganização.',
      'Explorar alteração de vencimentos, extensão de pagamento, revisão de serviços adicionais, redução de escopo, créditos e condições comerciais autorizadas.',
      'Nunca iniciar diretamente oferecendo desconto.'
    ],
    alternativas: ['R-01 · Redução das Parcelas', 'R-04 · Congelamento de Parcelas', 'R-03 · Redução Contratual', 'R-05 · Alteração de Data, quando aplicável'],
    erros: ['Oferecer desconto na multa antes de entender se o aperto é temporário.', 'Ignorar se o problema é no valor total ou nas parcelas — a solução é diferente para cada caso.'],
    estagio: 'Etapa 1-2 · iniciar por R-01/R-04 antes de discutir R-08.',
    mensagens: [
      { tom: 'Abertura / diagnóstico', texto: 'Imagino que essa decisão não seja fácil depois de todo o planejamento até aqui. Antes de pensarmos em cancelar, me conta: a dificuldade está mais no valor das parcelas ou no valor total do contrato? Dependendo da resposta, talvez consigamos reorganizar as condições de pagamento sem precisar chegar ao cancelamento.' },
      { tom: 'Se o problema é o valor mensal', texto: 'Consigo reduzir o valor da parcela para o mínimo e direcionar o restante para o saldo final — assim o mês a mês fica mais leve, sem mudar o valor total do contrato. Também dá para congelar as parcelas por um tempo, dependendo de quanto falta para o evento. Faz sentido explorarmos isso antes de pensar em cancelar?' },
      { tom: 'Se o problema é o valor total', texto: 'Nesse caso, talvez o caminho não seja mexer nas parcelas, e sim revisar o que está incluso no contrato. Consigo montar com você uma versão mais enxuta, cortando alguns itens, sem precisar cancelar tudo o que já foi planejado.' }
    ],
    casoRealId: 'gabriela'
  },
  {
    id: 'mudanca-planos', icone: '🔄', titulo: 'Mudança de planos',
    desc: 'Cliente decidiu alterar completamente o evento ou não pretende mais realizá-lo.',
    sinonimos: ['desistiu', 'nao vai mais casar', 'mudou de ideia', 'cancelar tudo'],
    comoIdentificar: ['Fala em "não vamos mais fazer" em vez de "vamos adiar/reduzir".'],
    perguntas: ['O evento em si deixou de existir ou só o formato mudou?', 'Existe alguma versão menor ou diferente do evento que ainda faria sentido?'],
    argumentos: ['Explorar se uma redução contratual (R-03) resolve antes de tratar como cancelamento total.'],
    alternativas: ['R-03 · Redução Contratual', 'R-06 · Liberação de Data (mantendo vínculo)'],
    erros: ['Tratar como cancelamento definitivo sem checar se algum formato menor resolveria.'],
    estagio: 'Etapa 1-2.',
    mensagens: [
      { tom: 'Abertura / diagnóstico', texto: 'Entendo. Antes de tratarmos isso como um cancelamento, me conta: o evento em si não vai mais acontecer, ou é mais uma mudança de formato ou tamanho? Às vezes conseguimos adaptar o contrato para o novo formato sem precisar encerrar tudo.' },
      { tom: 'Se o evento não vai mais existir', texto: 'Entendo. Se realmente não vai rolar o evento, quero te explicar com transparência como funciona o processo daqui pra frente, sem enrolação.' },
      { tom: 'Se for mudança de formato', texto: 'Que bom que ainda pretendem celebrar, só de um jeito diferente! Me conta como vocês estão pensando agora, porque provavelmente dá para adaptar o contrato para o novo formato sem burocracia.' }
    ],
    casoRealId: null
  },
  {
    id: 'mudanca-data', icone: '📅', titulo: 'Mudança de data',
    desc: 'O evento continuará acontecendo, mas a data originalmente contratada não atende mais.',
    sinonimos: ['remarcar', 'adiar', 'antecipar', 'nova data', 'trocar data'],
    comoIdentificar: ['Cliente fala em remarcar, adiar ou antecipar, não em cancelar.'],
    perguntas: ['Existe uma nova data já em mente?', 'O motivo da mudança é pontual (conflito de agenda) ou estrutural (financeiro, família)?'],
    argumentos: ['Apresentar R-05 como solução direta: taxa proporcional à antecedência, podendo ser isenta em longo prazo.'],
    alternativas: ['R-05 · Alteração de Data', 'R-06 · Liberação de Data, se o evento for superior a 1 ano'],
    erros: ['Tratar pedido de remarcação como pedido de cancelamento.'],
    estagio: 'Etapa 2-3 · R-05 pode precisar de alinhamento com a gestão se o desconto na taxa for maior que o padrão.',
    mensagens: [
      { tom: 'Abertura / diagnóstico', texto: 'Sem problema, remarcar é bem mais simples do que cancelar! Você já tem uma nova data em mente? Consigo verificar a disponibilidade e te passar as condições para a alteração — dependendo da antecedência, a taxa pode até ser isenta.' },
      { tom: 'Sem nova data ainda', texto: 'Sem problema, não precisa ter a nova data fechada agora. Me dá uma faixa de período que vocês estão pensando que eu já vejo a disponibilidade e volto com opções.' },
      { tom: 'Antecedência curta', texto: 'Como está mais próximo da data, pode ter uma taxa de alteração — mas ainda assim costuma sair bem mais em conta do que cancelar. Deixa eu calcular certinho para vocês.' }
    ],
    casoRealId: null
  },
  {
    id: 'reducao-convidados', icone: '👥', titulo: 'Redução de convidados',
    desc: 'O cliente percebe que o evento será menor e acredita que o contrato deixou de fazer sentido.',
    sinonimos: ['menos convidados', 'diminuiu a lista', 'lista menor'],
    comoIdentificar: ['Cliente menciona lista de convidados encolhendo, não motivo financeiro ou pessoal.'],
    perguntas: ['O novo número de convidados ainda cabe no pacote atual?', 'O que motivou a redução — foi uma escolha ou uma limitação?'],
    argumentos: ['Apresentar redução contratual (R-03) como caminho natural antes de cogitar cancelamento.'],
    alternativas: ['R-03 · Redução Contratual'],
    erros: ['Assumir que menos convidados significa que o cliente quer cancelar — geralmente quer ajustar.'],
    estagio: 'Etapa 1-2.',
    mensagens: [
      { tom: 'Abertura / diagnóstico', texto: 'Faz todo sentido ajustar para o novo número de convidados. Me conta quantas pessoas vocês estão projetando agora — na maioria dos casos conseguimos adequar o contrato ao novo tamanho, sem precisar cancelar.' },
      { tom: 'Redução grande', texto: 'Entendi, é uma redução bem significativa. Vamos rever juntos o que faz sentido manter — buffet, bebida, decoração — para deixar o contrato do tamanho certo para o novo número de convidados.' },
      { tom: 'Cabendo no pacote atual', texto: 'Boa notícia: pelo que você me passou, esse número ainda cabe tranquilo no pacote atual, então nem precisamos mexer no contrato — só ajustar os detalhes operacionais.' }
    ],
    casoRealId: null
  },
  {
    id: 'insatisfacao-atendimento', icone: '💬', titulo: 'Insatisfação com atendimento',
    desc: 'Cliente relata problemas de comunicação, demora, atendimento ou experiência durante a jornada.',
    sinonimos: ['reclamacao', 'enganado', 'mal atendido', 'sumiu', 'demora'],
    comoIdentificar: ['Cliente reclama de ter sido "enganado", de falta de aviso, de trocas de atendente ou de não ter sido informado sobre alguma cobrança.'],
    perguntas: ['O que especificamente aconteceu e quando?', 'Isso já foi reportado antes?', 'O que resolveria essa situação além do cancelamento?'],
    argumentos: [
      'Reconhecer o problema sem minimizar.',
      'Explicar com transparência total qualquer cobrança ou condição que gerou a sensação de surpresa.',
      'Avaliar uma cortesia (R-02) como reparação antes de discutir multa.'
    ],
    alternativas: ['R-02 · Cortesias', 'R-03 · Redução Contratual'],
    erros: ['Discutir com o cliente ou minimizar o problema relatado.', 'Pular direto para negociar a multa de cancelamento sem tentar reparar a insatisfação primeiro.'],
    estagio: 'Etapa 1 · resolver na base antes de qualquer escalonamento.',
    mensagens: [
      { tom: 'Escuta / acolhimento', texto: 'Sinto muito que isso tenha acontecido, e quero entender exatamente o que houve para conseguir resolver da forma certa. Pode me contar com calma o que aconteceu? Antes de falar em cancelamento, quero ver o que está ao meu alcance para reparar isso com vocês.' },
      { tom: 'Após entender o problema', texto: 'Peço desculpas por isso — não é o padrão que a gente busca ter com vocês. Deixa eu já te trazer uma solução concreta, e não só um pedido de desculpas.' },
      { tom: 'Reforço de compromisso', texto: 'Quero que isso não se repita. Vou acompanhar pessoalmente os próximos passos do seu atendimento para garantir que tudo corra do jeito que deveria ter sido desde o início.' }
    ],
    casoRealId: 'eduarda'
  },
  {
    id: 'insatisfacao-servico', icone: '🏛️', titulo: 'Insatisfação com serviço ou estrutura',
    desc: 'Cliente demonstra insegurança relacionada ao espaço, serviços, fornecedores ou estrutura contratada.',
    sinonimos: ['espaco', 'estrutura', 'fornecedor', 'cardapio', 'buffet ruim'],
    comoIdentificar: ['Reclama do espaço, cardápio, fornecedor ou de alguma entrega específica do contrato.'],
    perguntas: ['O que especificamente não atendeu à expectativa?', 'Existe uma alternativa dentro da nossa estrutura que resolveria?'],
    argumentos: ['Apresentar alternativas de espaço, fornecedor ou serviço equivalentes antes de discutir saída do contrato.'],
    alternativas: ['R-03 · Redução Contratual', 'R-02 · Cortesias, como reparação pontual'],
    erros: ['Ignorar a reclamação técnica e ir direto para a negociação financeira.'],
    estagio: 'Etapa 1-2.',
    mensagens: [
      { tom: 'Abertura / diagnóstico', texto: 'Entendo a preocupação. Me conta com mais detalhes o que te deixou inseguro(a) em relação ao espaço ou serviço — quero verificar com o time se existe uma alternativa dentro da nossa estrutura que resolva isso antes de pensarmos em qualquer outra coisa.' },
      { tom: 'Oferecendo alternativa', texto: 'Consigo te mostrar uma outra opção dentro da nossa estrutura que talvez resolva exatamente o que te incomodou — antes de pensarmos em qualquer outra coisa, vale a pena dar uma olhada?' },
      { tom: 'Pedindo detalhe técnico', texto: 'Para eu te ajudar da forma certa, me conta especificamente o que te deixou inseguro(a): foi o espaço, o cardápio, algum fornecedor? Assim eu já verifico com o time responsável.' }
    ],
    casoRealId: null
  },
  {
    id: 'concorrencia', icone: '⚖️', titulo: 'Comparação com concorrência',
    desc: 'Cliente encontrou uma proposta aparentemente mais barata ou diferente em outra empresa.',
    sinonimos: ['concorrente', 'outro buffet', 'outro espaco', 'mais barato', 'achou mais barato'],
    comoIdentificar: ['Cliente cita outro fornecedor ou menciona "encontramos algo mais em conta".'],
    perguntas: ['O que mais chamou sua atenção na outra proposta?', 'Foi principalmente o valor?', 'Existe algum serviço diferente?', 'A estrutura é equivalente?', 'O que vocês consideram indispensável para o evento?'],
    argumentos: ['Comparar estrutura, serviços, segurança contratual, equipe, operação, experiência, entregas incluídas e possíveis custos extras da outra proposta.'],
    alternativas: ['R-02 · Cortesias, se fizer sentido reforçar valor percebido'],
    erros: ['Falar mal do concorrente.', 'Entrar direto em queda de preço sem antes reforçar diferenciais.'],
    estagio: 'Etapa 1.',
    mensagens: [
      { tom: 'Comparativo, sem atacar o concorrente', texto: 'Que bom que vocês estão pesquisando com cuidado, isso mostra o quanto esse dia é importante. Pode me contar o que mais chamou atenção na outra proposta? Assim consigo te mostrar com clareza o que está incluso aqui e o que normalmente pega os casais de surpresa em propostas mais baratas.' },
      { tom: 'Reforçando diferenciais', texto: 'Uma coisa que muitos casais só percebem depois é que aqui tudo está centralizado num único contrato — buffet, decoração, cerimonial, audiovisual — sem precisar correr atrás de fornecedor separado. Isso costuma pesar bastante na decisão final.' },
      { tom: 'Se for só preço', texto: 'Entendo que o valor pesa bastante. Antes de eu te falar sobre qualquer condição, me conta: tirando o preço, teve algo na outra proposta que vocês preferiram, ou é só uma questão de valor mesmo?' }
    ],
    casoRealId: null
  },
  {
    id: 'separacao', icone: '💔', titulo: 'Separação do casal',
    desc: 'Cancelamento relacionado ao término do relacionamento.',
    sinonimos: ['terminaram', 'rompeu', 'separaram', 'brigaram', 'noivado desfeito'],
    comoIdentificar: ['Um ou ambos os contratantes comunicam o fim do relacionamento.'],
    perguntas: ['Existe decisão conjunta sobre o encerramento?', 'Como preferem que a comunicação e o registro sejam feitos, considerando os dois nomes no contrato?'],
    argumentos: ['Não insistir em retenção. Focar em explicar o processo com respeito e clareza.'],
    alternativas: ['R-07 · Promissória, se fizer sentido financeiramente', 'R-08 · Multa de Cancelamento'],
    erros: ['Tentar reter emocionalmente ou fazer perguntas invasivas sobre o relacionamento.'],
    estagio: 'Etapa 4-5 · normalmente segue direto para encerramento.',
    mensagens: [
      { tom: 'Respeitoso, sem argumentação comercial', texto: 'Sinto muito por isso. Vou te explicar com calma como funciona o processo a partir daqui, e fico à disposição para qualquer dúvida — pode ficar tranquilo(a) que vamos conduzir tudo com respeito ao momento de vocês.' },
      { tom: 'Se pedirem orientação prática', texto: 'Posso te explicar com calma quais são os próximos passos e o que precisa ser formalizado entre vocês dois — sem pressa, no tempo que for melhor para vocês.' }
    ],
    casoRealId: null
  },
  {
    id: 'familiar', icone: '🏠', titulo: 'Problemas familiares ou pessoais',
    desc: 'Questões familiares ou situações particulares que impactam a realização do evento.',
    sinonimos: ['doenca', 'luto', 'saude', 'falecimento', 'problema de saude'],
    comoIdentificar: ['Cliente menciona doença, luto ou situação pessoal delicada.'],
    perguntas: ['A situação é temporária ou muda definitivamente os planos?', 'Existe uma data futura em que faria mais sentido retomar?'],
    argumentos: ['Se temporário, priorizar congelamento (R-04) ou alteração de data (R-05) antes de falar em cancelamento.', 'Se definitivo, conduzir o encerramento com empatia, buscando a isenção de multa quando cabível.'],
    alternativas: ['R-04 · Congelamento de Parcelas', 'R-05 · Alteração de Data', 'R-08 · Multa de Cancelamento, com isenção quando aplicável'],
    erros: ['Insistir comercialmente diante de um motivo de saúde ou luto.', 'Pular etapas leves e ir direto para a negociação de multa sem tentar acolher com alternativas de tempo.'],
    estagio: 'Etapa 2 antes da Etapa 4 — não pular direto para a multa.',
    mensagens: [
      { tom: 'Acolhimento, com muita sensibilidade', texto: 'Sinto muito por tudo que estão passando. Antes de falarmos em cancelar, quero entender: é algo que muda os planos por um tempo ou definitivamente? Se for algo temporário, talvez consigamos pausar ou remarcar sem precisar encerrar o contrato.' },
      { tom: 'Se for temporário', texto: 'Que bom que ainda existe a vontade de celebrar. Podemos pausar as parcelas por um tempo ou remarcar para uma data mais tranquila, sem precisar encerrar o contrato agora.' },
      { tom: 'Se for definitivo', texto: 'Entendo perfeitamente, e quero te acompanhar da forma mais leve possível nesse processo. Vou verificar com a gestão as condições de encerramento mais justas para esse momento que vocês estão vivendo.' }
    ],
    casoRealId: 'fabiola'
  },
  {
    id: 'mudanca-cidade', icone: '🧳', titulo: 'Mudança de cidade',
    desc: 'Cliente mudou ou pretende mudar de cidade e considera inviável manter o evento.',
    sinonimos: ['mudou de cidade', 'se mudou', 'vai morar fora'],
    comoIdentificar: ['Cliente menciona mudança de endereço, emprego em outra cidade ou dificuldade logística para os convidados.'],
    perguntas: ['A mudança é definitiva?', 'Faria sentido transferir o evento para uma unidade Indaiá mais próxima da nova cidade?'],
    argumentos: ['Apresentar unidades Indaiá na nova região, se existir, como alternativa à saída do contrato.'],
    alternativas: ['R-06 · Liberação de Data, mantendo vínculo por pagamentos mensais', 'R-05 · Alteração de Data'],
    erros: ['Não considerar transferência de unidade antes de tratar como perda do cliente.'],
    estagio: 'Etapa 2-3.',
    mensagens: [
      { tom: 'Abertura / diagnóstico', texto: 'Entendo perfeitamente. Antes de tratarmos isso como um cancelamento, deixa eu verificar se temos alguma unidade Indaiá na região para onde vocês estão indo — às vezes dá para transferir o evento em vez de encerrar o contrato.' },
      { tom: 'Se tiver unidade na nova cidade', texto: 'Boa notícia: temos unidade Indaiá aí perto de vocês! Posso te conectar com o time de lá para dar continuidade ao planejamento sem perder nada do que já foi construído até aqui.' },
      { tom: 'Se não tiver unidade próxima', texto: 'Entendo que a logística fica bem mais difícil de longe. Mesmo assim, antes de tratarmos como cancelamento, deixa eu ver com a gestão se existe alguma forma de manter o vínculo à distância.' }
    ],
    casoRealId: null
  },
  {
    id: 'outro', icone: '❓', titulo: 'Outro motivo',
    desc: 'Motivo que não se encaixa nas categorias acima — usar o diagnóstico geral.',
    sinonimos: ['nao sei', 'nao informou', 'motivo desconhecido'],
    comoIdentificar: ['Nenhum dos padrões acima se aplica claramente.'],
    perguntas: ['Se conseguíssemos resolver este ponto, você teria interesse em permanecer conosco?'],
    argumentos: ['Usar o checklist de diagnóstico geral antes de qualquer proposta.'],
    alternativas: ['Definido conforme o diagnóstico revelar.'],
    erros: ['Avançar para uma liberação comercial sem entender o motivo real.'],
    estagio: 'Etapa 0 · sempre começar pelo diagnóstico.',
    mensagens: [
      { tom: 'Acolhedor + investigativo + comercial', texto: 'Entendi. Antes de seguirmos com o processo de cancelamento, queria entender um pouco melhor o que levou vocês a essa decisão. Dependendo do motivo, talvez exista alguma alternativa que possamos analisar juntos antes de encerrarmos o contrato.' },
      { tom: 'Pergunta-chave, se ainda não achou o motivo', texto: 'Só para eu te ajudar direitinho: hoje, se a gente conseguisse resolver o principal ponto que está pesando nessa decisão, vocês teriam interesse em continuar com o planejamento?' }
    ],
    casoRealId: 'diego'
  }
];

/* -------------------------------------------------------------------------
   2b. PROCEDIMENTOS PÓS-VENDA
   Diferente de MOTIVOS (que trata sinais de que o cliente quer cancelar),
   isto cobre pedidos operacionais diretos do cliente — troca de data,
   troca de ambiente, redução contratual etc. — independente de haver
   risco de cancelamento. Comece só com "Troca de Data"; os próximos
   temas (troca de ambiente, redução contratual...) entram depois, um de
   cada vez.
   ------------------------------------------------------------------------- */
const PROCEDIMENTOS = [
  {
    id: 'troca-data', icone: '📅', titulo: 'Troca de Data',
    desc: 'Passo a passo para conduzir qualquer pedido de alteração da data do evento — disponibilidade, taxa e formalização.',
    sinonimos: ['trocar data', 'mudar data', 'remarcar', 'alteracao de data', 'nova data', 'adiar evento', 'antecipar evento', 'mudanca de data'],
    quandoUsar: 'Use este procedimento sempre que o cliente pedir para alterar a data do evento — não importa se veio como um pedido direto ou embutido numa conversa sobre cancelamento.',
    passoAPasso: [
      'Perguntar se já existe uma nova data em mente ou apenas um período/faixa de meses.',
      'Verificar a disponibilidade da nova data (ou período) no espaço e na equipe já contratados.',
      'Calcular a taxa de alteração conforme a antecedência até a data original contratada.',
      'Se o evento for superior a 1 ano e a nova data ainda não estiver definida, avaliar manter o vínculo por pagamentos mensais até a definição.',
      'Formalizar a alteração por escrito (aditivo contratual ou confirmação registrada) antes de tratar a nova data como certa.'
    ],
    perguntas: [
      'Já existe uma nova data definida, ou ainda estão avaliando um período?',
      'O motivo da mudança é pontual (conflito de agenda) ou estrutural (financeiro, saúde, família)?',
      'A mudança é para uma data mais próxima ou mais distante da original?',
      'Existe alguma condição promocional vinculada à data original que precisa ser revista?'
    ],
    alternativas: ['R-05 · Alteração de Data', 'R-06 · Liberação de Data, se o evento for superior a 1 ano'],
    erros: [
      'Tratar todo pedido de alteração de data como se fosse um cancelamento.',
      'Confirmar a nova data com o cliente antes de checar disponibilidade real do espaço.',
      'Aplicar a taxa sem explicar com transparência de onde ela vem.'
    ],
    mensagens: [
      { tom: 'Abertura do atendimento', texto: 'Perfeito, vamos cuidar da alteração de data para vocês. Você já tem uma nova data em mente, ou prefere que eu verifique a disponibilidade para um período específico?' },
      { tom: 'Explicando a taxa', texto: 'Como a mudança está sendo pedida com essa antecedência da data original, pode existir uma taxa de alteração — vou calcular certinho assim que confirmarmos a nova data. Ainda assim, costuma sair bem mais em conta do que um cancelamento.' },
      { tom: 'Sem nova data definida ainda', texto: 'Sem problema, não precisamos travar a nova data agora. Podemos manter o vínculo com pagamentos mensais enquanto vocês decidem, e assim que tiverem uma data, já fazemos a alteração formal.' }
    ]
  }
];

/* -------------------------------------------------------------------------
   3. DIAGNÓSTICO
   ------------------------------------------------------------------------- */
const DIAGNOSTICO_CHECKLIST = [
  'O cliente quer realmente cancelar ou está buscando uma solução?',
  'O problema é financeiro?',
  'O problema é momentâneo ou definitivo?',
  'Existe intenção de continuar realizando o evento?',
  'O evento continuará na mesma data?',
  'O cliente encontrou outro fornecedor?',
  'Existe alguma insatisfação?',
  'Uma alteração de escopo resolveria?',
  'Uma alteração de data resolveria?',
  'Uma alteração financeira resolveria?',
  'Existe alguma condição que faria o cliente permanecer?'
];

/* -------------------------------------------------------------------------
   4. CASOS REAIS
   Extraídos do histórico de atendimento do Indaiá Chat (uso interno).
   Nomes mantidos conforme registro no CRM; CPFs e telefones omitidos.
   rcodes = quais liberações foram efetivamente usadas no caso.
   ------------------------------------------------------------------------- */
const CASOS = [
  {
    id: 'gabriela', nome: 'Gabriela Marques', evento: 'Casamento', categoria: 'Financeiro',
    status: 'cancelado',
    motivo: 'Perdeu o emprego: "final de julho agora meu contrato se encerra e estarei desempregada". Antes disso, a consultora já havia reduzido o valor por convidado de R$ 800 para R$ 507, mas o novo cenário tornou o contrato inviável.',
    oferta: 'Isenção total da multa de cancelamento, concedida em caráter privado. Fechado em 03/08/2026 (close_reason: "Segui com o cancelamento (sem multa, informado no privado)").',
    rcodes: ['r08'],
    tatica: 'Foi direto para R-08 com isenção total. O registro não mostra tentativa de R-01 (redução de parcelas) ou R-04 (congelamento) antes — como o motivo era definitivo (perda de emprego, não um aperto pontual), pular fases leves pode ter sido acertado, mas vale registrar a justificativa para não virar padrão informal de pular etapas.'
  },
  {
    id: 'milena', nome: 'Milena', evento: 'Casamento', categoria: 'Financeiro / Familiar',
    status: 'cancelado',
    motivo: 'Alegou "questões familiares e financeiras", sem detalhar mais mesmo quando perguntada diretamente pela consultora.',
    oferta: 'Proposta de redução de contrato (R-03) foi recusada pela cliente. Penalidade descontada do valor já pago (R$ 7.089,00); saldo remanescente de R$ 7.461,79 parcelado em até 4x.',
    rcodes: ['r03', 'r08'],
    tatica: 'Boa aderência à escada: tentou R-03 antes de avançar para R-08. Mesmo com a recusa do cliente, o parcelamento do saldo em 4x amenizou o impacto — é um exemplo de como negociar a saída sem abrir mão de toda a governança.'
  },
  {
    id: 'thais', nome: 'Thais Karoline Ventura de Almeida & Raul Jucelino Silveira', evento: 'Casamento', categoria: 'Financeiro / Jurídico',
    status: 'cancelado',
    motivo: 'Motivo original não capturado no chat (decisão tratada em reunião/ligação). A negociação subsequente foi puramente jurídico-financeira.',
    oferta: 'Multa contratual (cláusula 9b, 60%) calculada em R$ 8.648,49 sobre o saldo. Cliente citou CDC art. 51 IV e CC art. 413 (retenção acima de 20% seria abusiva) e propôs abrir mão de qualquer devolução dos R$ 42.333,01 já pagos em troca da isenção total do saldo da multa. A empresa aceitou — Termo de Distrato e Quitação Recíproca assinado em 24/07/2026.',
    rcodes: ['r08'],
    tatica: 'A isenção total só veio depois de argumentação jurídica formal (CDC/CC citados pelo cliente) — ou seja, na prática o desconto máximo em R-08 está sendo liberado quando há risco jurídico, não como parte do fluxo comercial normal. Vale formalizar com a gestão até onde a equipe pode ir sozinha antes de esse tipo de pressão aparecer.'
  },
  {
    id: 'eduarda', nome: 'Eduarda Albuquerque', evento: 'Casamento (contrato de R$ 65.426,15)', categoria: 'Insatisfação com atendimento',
    status: 'cancelado',
    motivo: 'Sentiu-se lesada com práticas comerciais: um item comprado a preço cheio (pista de LED, R$ 2.500) entrou em promoção pouco depois por R$ 800; comparou com conhecidos que fecharam o mesmo pacote mais barato; relatou sensação de ter sido "induzida a aceitar valores exorbitantes" na assinatura.',
    oferta: 'Negociação de multa (cláusula 9a, 35%) escalou em etapas: começou em R$ 22.899,15, reduziu para 30% (R$ 19.561,08), depois 15% (R$ 9.813,91), e finalmente aceitou quitação considerando apenas o valor já pago (R$ 7.733,05), sem saldo devedor. Cliente também citou CDC art. 51 IV e CC art. 413.',
    rcodes: ['r08'],
    tatica: 'O motivo raiz era confiança quebrada (preço), não capacidade de pagamento — não há registro de terem tentado uma cortesia (R-02) ou redução contratual (R-03) para reparar a insatisfação antes de entrar direto na negociação de multa. Esse é o tipo de caso que a Etapa 1 deveria resolver antes de chegar à Etapa 4.'
  },
  {
    id: 'claudinha', nome: 'Claudinha', evento: 'Casamento (contrato de R$ 29.071,15)', categoria: 'Insatisfação com atendimento',
    status: 'disputa',
    motivo: 'Não foi informada com clareza sobre a cobrança de convidados extras: "perguntamos na consulta se poderíamos levar terceiros, mas não sabíamos que seria necessário pagar por isso, ficamos em choque na hora." Chegou a decidir não desistir, mas voltou cinco dias depois optando pelo cancelamento.',
    oferta: 'Explicada a multa de 35% (cláusula 9a) → saldo de R$ 8.474,90 em parcela única em 30 dias. Cliente pediu prazo para verificar outra possibilidade com a gestão; contratou advogado antes de uma resolução final no chat.',
    rcodes: ['r08'],
    tatica: 'É o exemplo mais claro de objeção evitável: uma falha de transparência na venda virou negociação de multa. O caminho recomendado seria uma cortesia pontual (R-02) ou ajuste de escopo (R-03) para reparar a surpresa, antes de qualquer conversa sobre encerrar o contrato.'
  },
  {
    id: 'fabiola', nome: 'Fabiola Juliete Do Rosario', evento: '15 anos', categoria: 'Problemas familiares ou pessoais',
    status: 'cancelado',
    motivo: 'Motivo misto: doença da mãe ("minha mãe não tá nada bem... estou com medo de acontecer algo") combinada com orçamento apertado para custear upgrade de cardápio. Processo de decisão ambivalente ao longo de duas semanas.',
    oferta: 'Desconto adicional no contrato (chegando a R$ 30.383,73) e upgrade de cardápio com condição especial, além de forte esforço para reter antes de aceitar o cancelamento. Explicada a multa de 35%, parcelável em até 4x. Cliente confirmou "Pode cancelar" em 17/03/2026.',
    rcodes: ['r02', 'r03', 'r08'],
    tatica: 'É o caso mais alinhado ao espírito da escada: tentou cortesia/desconto (R-02/R-03) e só avançou para a multa (R-08) depois de esgotar as alternativas, parcelando o saldo para reduzir o impacto. Mesmo assim resultou em cancelamento — mostra que seguir corretamente a escada nem sempre evita a perda, mas garante que todas as portas foram abertas antes.'
  },
  {
    id: 'diego', nome: 'Diego Doege', evento: 'Casamento', categoria: 'Outro (motivo não informado)',
    status: 'andamento',
    motivo: 'Mensagem inicial: "Gostaria de fazer o cancelamento do casamento que tinha sido agendado no nome de Diego Doege." Nenhum motivo foi levantado antes de pedir o contrato.',
    oferta: 'Nenhuma — o atendimento foi transferido direto para a "Gerente de Eventos" sem diagnóstico prévio.',
    rcodes: [],
    tatica: 'Oportunidade de treinamento clara: o fluxo prevê Etapa 0 (Diagnóstico) antes de qualquer encaminhamento. Pular direto para a gerência sem perguntar o motivo tira da empresa a chance de resolver em uma etapa mais leve (R-01 a R-04) e sobrecarrega a gestão com casos que talvez nem precisassem chegar lá.'
  },
  {
    id: 'sergio', nome: 'Sergio (em nome de Antônio Corrêa)', evento: 'Casamento — evento já cancelado anteriormente', categoria: 'Outro (pós-cancelamento)',
    status: 'disputa',
    motivo: 'Não é uma negociação de cancelamento em si: o contato pede "retorno quanto à possibilidade de restituição de valores pagos" por um casamento que já havia sido cancelado antes.',
    oferta: 'Não identificada nos dados disponíveis — as mensagens capturadas são apenas opções de menu do bot, sem resposta humana clara registrada.',
    rcodes: [],
    tatica: 'Reforça a importância da Etapa 5 (Encerramento): sem um registro claro do que foi acordado no momento do cancelamento, o cliente volta meses depois pedindo reembolso e a empresa fica sem histórico para responder com segurança.'
  },
  {
    id: 'ronaldo', nome: 'Ronaldo Agostinho Costa (via advogada)', evento: '15 anos — cancelamento de 2022', categoria: 'Outro (pós-cancelamento)',
    status: 'disputa',
    motivo: 'Cancelamento antigo (evento previsto para 2022) por não conseguirem "honrar com todo o compromisso" financeiramente. O contato atual é sobre negativação no Serasa por uma dívida que, segundo o cliente, deveria ter sido perdoada no acordo original.',
    oferta: 'Empresa propôs pagamento adicional de R$ 901,12 para baixa da restrição; advogada rejeitou, citando jurisprudência de que a retenção de 17% do contrato já quitaria a multa proporcional.',
    rcodes: ['r08'],
    tatica: 'Mesmo padrão do caso Sergio: um acordo de cancelamento mal documentado gerou atrito anos depois. Todo encerramento (R-07, R-08, R-09) precisa terminar com um termo formal e claro sobre o que fica quitado — não apenas uma promessa verbal.'
  }
];
const STATUS_LABEL = { cancelado: 'Cancelado', andamento: 'Em andamento', disputa: 'Disputa pós-cancelamento' };
const STATUS_CLASS = { cancelado: 'status-cancelado', andamento: 'status-andamento', disputa: 'status-disputa' };

/* -------------------------------------------------------------------------
   5. MATRIZ DE LIBERAÇÕES
   Alçada por cargo ainda não foi confirmada pela gestão (marcado A DEFINIR).
   Os únicos pontos de escalonamento confirmados são os que o próprio manual
   já sinaliza com "conversar com a gestão".
   ------------------------------------------------------------------------- */
const MATRIZ = RSTEPS.map(r => ({
  codigo: r.codigo,
  nome: r.nome,
  fase: r.fase,
  intensidade: r.label,
  observacao: r.alerta ? r.alerta : 'Sem sinalização explícita de escalonamento no manual — alçada por cargo a definir com a gestão.'
}));

/* -------------------------------------------------------------------------
   6. SCRIPTS GERAIS
   Scripts específicos por motivo vivem em MOTIVOS[].mensagens. Aqui ficam
   só os de uso geral, que não dependem de já saber o motivo.
   ------------------------------------------------------------------------- */
const SCRIPTS = [
  {
    id: 'primeiro-contato', titulo: 'Primeiro contato', tom: 'Acolhedor + investigativo + comercial',
    texto: 'Entendi. Antes de seguirmos com o processo de cancelamento, queria entender um pouco melhor o que levou vocês a essa decisão. Dependendo do motivo, talvez exista alguma alternativa que possamos analisar juntos antes de encerrarmos o contrato.'
  },
  {
    id: 'nao-negociar-script', titulo: 'Cliente não quer negociar', tom: 'Respeitoso, sem insistência excessiva',
    texto: 'Entendo perfeitamente, e respeito totalmente a decisão de vocês. Vou te explicar com clareza como funciona o processo de cancelamento a partir daqui, e fico à disposição para qualquer dúvida durante o caminho.'
  }
];

/* -------------------------------------------------------------------------
   6b. MATERIAIS DE APRESENTAÇÃO (cardápios digitais)
   Links externos (Vercel) que o consultor manda pro cliente ver os
   cardápios/materiais de cada tipo de evento. Só links de verdade — não
   inventar nem tentar prever conteúdo, é a equipe que mantém essas páginas.
   ------------------------------------------------------------------------- */
const MATERIAIS = [
  {
    titulo: 'Material de Casamento',
    icone: '👰🏼‍♀️🤵🏼',
    links: [
      { label: 'Gastronomia', url: 'https://cardapio-buffet-lime.vercel.app/' },
      { label: 'Doces', url: 'https://cardapio-doces-lemon.vercel.app' },
      { label: 'Open Bar', url: 'https://cardapio-buffet-lime.vercel.app/open-bar.html' },
      { label: 'Open Bar de Drinks', url: 'https://open-drinks.vercel.app/' },
      { label: 'Doces (Confeitaria Indaiá)', url: 'https://confeitaria-indaia.vercel.app/' }
    ]
  },
  {
    titulo: 'Material de 15 Anos',
    icone: '👸🏼',
    links: [
      { label: 'Gastronomia', url: 'https://cardapio-15anos.vercel.app/gastronomia.html' },
      { label: 'Doces', url: 'https://doces-15anos.vercel.app/' },
      { label: 'Open Bar', url: 'https://cardapio-15anos.vercel.app/open-bar.html' },
      { label: 'Open Bar de Drinks (sem álcool)', url: 'https://open-drinks-15anos.vercel.app/' },
      { label: 'Doces (Confeitaria Indaiá)', url: 'https://confeitaria-indaia.vercel.app/' }
    ]
  },
  {
    titulo: 'Confeitaria Indaiá',
    icone: '🍰',
    links: [
      { label: 'Doces', url: 'https://confeitaria-indaia.vercel.app/' }
    ]
  }
];

/* -------------------------------------------------------------------------
   7. ÁRVORE DE DECISÃO
   ------------------------------------------------------------------------- */
const ARVORE = {
  financeiro: {
    pergunta: 'O problema é o valor total ou o valor mensal?',
    opcoes: {
      'Valor mensal': { texto: 'Sugerir reestruturação financeira: reduzir parcelas ao mínimo e/ou congelar por um período proporcional ao tempo até o evento.', rcodes: ['r01', 'r04'] },
      'Valor total': { texto: 'Verificar escopo e serviços contratados — uma redução contratual costuma resolver antes de discutir a saída do contrato.', rcodes: ['r03'] }
    }
  },
  data: {
    pergunta: 'O evento continuará, só a data não serve mais?',
    opcoes: {
      'Sim, só a data': { texto: 'Encaminhar para alteração de data, com taxa proporcional à antecedência (isenta em longo prazo).', rcodes: ['r05'] },
      'Também estou repensando o evento': { texto: 'Voltar ao diagnóstico geral — o motivo real pode ser outro (financeiro, familiar, mudança de planos).', rcodes: [] }
    }
  },
  insatisfacao: {
    pergunta: 'A insatisfação é com atendimento/comunicação ou com o serviço/estrutura contratada?',
    opcoes: {
      'Atendimento': { texto: 'Priorizar escuta e reparo. Avaliar uma cortesia como reconstrução de confiança antes de qualquer negociação financeira.', rcodes: ['r02'] },
      'Serviço ou estrutura': { texto: 'Revisar o escopo contratado e apresentar alternativas dentro da estrutura antes de tratar como cancelamento.', rcodes: ['r03'] }
    }
  },
  concorrencia: {
    pergunta: 'O que pesou mais na comparação: preço ou diferencial percebido?',
    opcoes: {
      'Preço': { texto: 'Reforçar o valor entregue (estrutura, segurança contratual, equipe) antes de qualquer desconto. Uma cortesia pode reforçar a decisão sem abrir mão de margem maior.', rcodes: ['r02'] },
      'Diferencial do outro espaço': { texto: 'Agendar nova apresentação/tour reforçando os diferenciais Indaiá para a necessidade específica do casal.', rcodes: [] }
    }
  },
  reducao: {
    pergunta: 'O novo tamanho do evento ainda cabe no contrato atual?',
    opcoes: {
      'Sim': { texto: 'Apenas ajustar detalhes operacionais — não é necessário reduzir contrato.', rcodes: [] },
      'Não': { texto: 'Propor redução contratual, com isenção de multa da própria redução.', rcodes: ['r03'] }
    }
  },
  pessoal: {
    pergunta: 'A situação pessoal é temporária ou definitiva?',
    opcoes: {
      'Temporária': { texto: 'Priorizar congelamento de parcelas ou alteração de data antes de falar em cancelamento.', rcodes: ['r04', 'r05'] },
      'Definitiva': { texto: 'Conduzir o encerramento com empatia, priorizando isenção de multa quando aplicável, sem pressão comercial.', rcodes: ['r08'] }
    }
  },
  outro: {
    pergunta: 'Ainda não está claro o motivo — volte ao checklist de diagnóstico.',
    opcoes: {
      'Ir para o diagnóstico': { texto: 'Use a pergunta-chave: "Se conseguíssemos resolver este ponto, você teria interesse em permanecer conosco?" antes de qualquer proposta.', rcodes: [] }
    }
  }
};

/* -------------------------------------------------------------------------
   8. INDICADORES (DEMONSTRATIVOS)
   ------------------------------------------------------------------------- */
const INDICADORES_DEMO = [
  { label: 'Financeiro', valor: 38 },
  { label: 'Insatisfação com atendimento', valor: 19 },
  { label: 'Mudança de planos', valor: 14 },
  { label: 'Redução de convidados', valor: 9 },
  { label: 'Problemas familiares/pessoais', valor: 8 },
  { label: 'Concorrência', valor: 6 },
  { label: 'Outros', valor: 6 }
];

/* -------------------------------------------------------------------------
   9. VALORES PRATICADOS (PREÇOS)
   Carregado em tempo de execução a partir de precos.json — é o mesmo
   arquivo que a página de admin (admin.html) edita e salva direto no
   GitHub. Por isso os dados não ficam aqui como um array fixo: PRECOS
   começa vazio e é preenchido pela função loadPrecos() antes da busca
   ser inicializada. Fonte original: planilha "[PÓS-VENDAS] NEGOCIAÇÃO
   VALORES" — valores sujeitos a reajuste, por isso editáveis pelo admin.
   ------------------------------------------------------------------------- */
let PRECOS = [];
let PRECOS_META = {};

async function loadPrecos() {
  try {
    const res = await fetch('precos.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    PRECOS = data.categorias || [];
    PRECOS_META = { atualizadoEm: data.atualizadoEm || null };
  } catch (e) {
    console.warn('Não foi possível carregar precos.json (normal se estiver abrindo o arquivo direto do disco, sem servidor):', e);
    PRECOS = [];
    PRECOS_META = {};
  }
}

/* ==========================================================================
   HELPERS DE DOM
   ========================================================================== */
function el(tag, opts = {}, children = []) {
  const node = document.createElement(tag);
  if (opts.class) node.className = opts.class;
  if (opts.html !== undefined) node.innerHTML = opts.html;
  if (opts.text !== undefined) node.textContent = opts.text;
  if (opts.attrs) Object.entries(opts.attrs).forEach(([k, v]) => node.setAttribute(k, v));
  children.forEach(c => c && node.appendChild(c));
  return node;
}

function sectionBlock(titulo, itens) {
  const wrap = el('div');
  wrap.appendChild(el('h4', { text: titulo }));
  const ul = el('ul');
  itens.forEach(i => ul.appendChild(el('li', { text: i })));
  wrap.appendChild(ul);
  return wrap;
}
function labelPara(titulo, texto) {
  const wrap = el('div');
  wrap.appendChild(el('h4', { text: titulo }));
  wrap.appendChild(el('p', { text: texto }));
  return wrap;
}

function normalize(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
}

function buildMensagemBubble(msg) {
  const wrap = el('div', { attrs: { style: 'margin-bottom:10px' } });
  const tomRow = el('div', { class: 's-tom', attrs: { style: 'display:flex;justify-content:space-between;align-items:center;gap:8px' } });
  tomRow.appendChild(el('span', { text: msg.tom }));
  const copyBtn = el('button', { class: 'copy-btn', text: '📋 Copiar', attrs: { type: 'button' } });
  copyBtn.addEventListener('click', () => copyToClipboard(msg.texto, copyBtn));
  tomRow.appendChild(copyBtn);
  wrap.appendChild(tomRow);
  wrap.appendChild(el('div', { class: 'whats-bubble', text: msg.texto }));
  return wrap;
}

function copyToClipboard(text, btn) {
  const done = () => {
    const original = btn.textContent;
    btn.textContent = '✓ Copiado';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = original; btn.classList.remove('copied'); }, 1600);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(done);
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    done();
  }
}

/* Chips de liberação que expandem o detalhe da etapa R-0X ali mesmo,
   sem sair do card (nada de navegar para outra seção). */
function buildRCodeChipsRow(codes) {
  const wrap = document.createElement('div');
  const chipRow = el('div', { class: 'caso-rcodes' });
  const slot = el('div', { class: 'inline-rstep-slot' });
  let active = null;
  codes.forEach(c => {
    const chip = el('button', { class: 'rcode-chip', text: c.label, attrs: { type: 'button' } });
    if (!c.rid) {
      chip.disabled = true;
    } else {
      chip.addEventListener('click', () => {
        if (active === c.rid) { slot.innerHTML = ''; active = null; chip.classList.remove('active'); return; }
        chipRow.querySelectorAll('.rcode-chip').forEach(x => x.classList.remove('active'));
        chip.classList.add('active');
        slot.innerHTML = '';
        const r = RSTEPS.find(x => x.id === c.rid);
        if (r) slot.appendChild(buildRStepCard(r));
        active = c.rid;
      });
    }
    chipRow.appendChild(chip);
  });
  wrap.appendChild(chipRow);
  wrap.appendChild(slot);
  return wrap;
}

function extractRCodesFromAlternativas(alternativas) {
  return alternativas.map(a => {
    const match = a.match(/R-0\d/);
    return { rid: match ? 'r' + match[0].slice(2) : null, label: a };
  });
}

/* ==========================================================================
   BUILDERS — cada um monta um bloco de resultado autocontido
   ========================================================================== */
function buildRStepCard(r) {
  const card = el('div', { class: 'rcard' });
  card.appendChild(el('div', { class: 'r-num', text: r.codigo.replace('R-', '') }));
  const right = el('div');
  right.appendChild(el('div', { class: 'r-head' }, [
    el('span', { class: 'r-code', text: r.codigo + ' · ' + r.nome }),
    el('span', { class: 'r-dots', text: '●'.repeat(r.intensidade) + '○'.repeat(5 - r.intensidade) }),
    el('span', { class: 'r-intensidade', text: r.label })
  ]));
  right.appendChild(el('p', { class: 'r-desc', text: r.desc }));
  if (r.acoes) {
    const ul = el('ul');
    r.acoes.forEach(a => ul.appendChild(el('li', { text: a })));
    right.appendChild(ul);
  }
  if (r.prazos) {
    const row = el('div', { class: 'r-table' });
    r.prazos.forEach(p => {
      const span = el('span');
      span.innerHTML = p.rotulo + ' &nbsp;<b>' + p.valor + '</b>';
      row.appendChild(span);
    });
    right.appendChild(row);
  }
  if (r.alerta) right.appendChild(el('span', { class: 'r-alert', text: '⚠ ' + r.alerta }));
  if (r.nota) right.appendChild(el('p', { attrs: { style: 'margin-top:8px;font-size:.78rem;color:var(--ink-faint)' }, text: r.nota }));
  card.appendChild(right);
  return card;
}

function buildCasoCard(c) {
  const card = el('div', { class: 'card caso-card' });
  card.appendChild(el('div', { class: 'caso-head' }, [
    el('div', {}, [
      el('div', { class: 'caso-nome', text: c.nome }),
      el('div', { class: 'caso-evento', text: c.evento + ' · ' + c.categoria })
    ]),
    el('span', { class: 'caso-status ' + STATUS_CLASS[c.status], text: STATUS_LABEL[c.status] })
  ]));
  card.appendChild(labelPara('Motivo alegado', c.motivo));
  card.appendChild(labelPara('O que a empresa ofereceu', c.oferta));
  if (c.rcodes.length) {
    card.appendChild(el('h4', { text: 'Liberações usadas (clique para ver o detalhe)' }));
    const codes = c.rcodes.map(rid => { const r = RSTEPS.find(x => x.id === rid); return { rid, label: r.codigo }; });
    card.appendChild(buildRCodeChipsRow(codes));
  }
  card.appendChild(el('div', { class: 'caso-tatica', html: '<b>Leitura tática:</b> ' + c.tatica }));
  return card;
}

function buildScriptCard(s) {
  const card = el('div', { class: 'card script-card' });
  card.appendChild(el('h3', { text: s.titulo }));
  card.appendChild(el('div', { class: 's-tom', text: 'Tom: ' + s.tom }));
  card.appendChild(el('div', { class: 'whats-bubble', text: s.texto }));
  const copyBtn = el('button', { class: 'copy-btn', text: '📋 Copiar', attrs: { type: 'button', style: 'margin-top:8px' } });
  copyBtn.addEventListener('click', () => copyToClipboard(s.texto, copyBtn));
  card.appendChild(copyBtn);
  return card;
}

function buildMotivoResult(m) {
  const card = el('div', { class: 'card motivo-result' });
  card.appendChild(el('div', { class: 'topic-result-head' }, [
    el('span', { class: 'm-icon', text: m.icone }),
    el('h3', { text: m.titulo }),
    el('span', { class: 'pill pill-alert', text: m.estagio.split('·')[0].trim() })
  ]));
  card.appendChild(el('p', { class: 'topic-result-desc', text: m.desc }));

  if (m.mensagens && m.mensagens.length) {
    card.appendChild(el('h4', { text: 'Textos prontos para usar (' + m.mensagens.length + ' opções)' }));
    m.mensagens.forEach(msg => card.appendChild(buildMensagemBubble(msg)));
  }
  if (m.perguntas && m.perguntas.length) {
    card.appendChild(el('h4', { text: 'Perguntas-chave' }));
    const ul = el('ul', { class: 'topic-perguntas' });
    m.perguntas.forEach(p => ul.appendChild(el('li', { text: p })));
    card.appendChild(ul);
  }
  if (m.argumentos && m.argumentos.length) {
    card.appendChild(sectionBlock('Como argumentar', m.argumentos));
  }
  if (m.alternativas && m.alternativas.length) {
    card.appendChild(el('h4', { text: 'Liberações aplicáveis (clique para ver o detalhe)' }));
    card.appendChild(buildRCodeChipsRow(extractRCodesFromAlternativas(m.alternativas)));
  }
  if (m.erros && m.erros.length) {
    card.appendChild(sectionBlock('Erros a evitar', m.erros));
  }

  const caso = CASOS.find(c => c.id === m.casoRealId);
  card.appendChild(el('h4', { text: 'Caso real relacionado' }));
  if (caso) {
    card.appendChild(buildCasoCard(caso));
  } else {
    card.appendChild(el('p', { class: 'm-nocase', text: 'Nenhum caso real registrado ainda para este motivo no Indaiá Chat.' }));
  }
  return card;
}

function buildProcedimentoResult(p) {
  const card = el('div', { class: 'card motivo-result' });
  card.appendChild(el('div', { class: 'topic-result-head' }, [
    el('span', { class: 'm-icon', text: p.icone }),
    el('h3', { text: p.titulo })
  ]));
  card.appendChild(el('p', { class: 'topic-result-desc', text: p.desc }));
  card.appendChild(labelPara('Quando usar', p.quandoUsar));

  if (p.mensagens && p.mensagens.length) {
    card.appendChild(el('h4', { text: 'Textos prontos para usar (' + p.mensagens.length + ' opções)' }));
    p.mensagens.forEach(msg => card.appendChild(buildMensagemBubble(msg)));
  }
  if (p.passoAPasso && p.passoAPasso.length) {
    const wrap = el('div');
    wrap.appendChild(el('h4', { text: 'Passo a passo' }));
    const ol = el('ol', { class: 'passo-a-passo' });
    p.passoAPasso.forEach(step => ol.appendChild(el('li', { text: step })));
    wrap.appendChild(ol);
    card.appendChild(wrap);
  }
  if (p.perguntas && p.perguntas.length) {
    card.appendChild(el('h4', { text: 'O que perguntar / verificar' }));
    const ul = el('ul', { class: 'topic-perguntas' });
    p.perguntas.forEach(q => ul.appendChild(el('li', { text: q })));
    card.appendChild(ul);
  }
  if (p.alternativas && p.alternativas.length) {
    card.appendChild(el('h4', { text: 'Liberações relacionadas (clique para ver o detalhe)' }));
    card.appendChild(buildRCodeChipsRow(extractRCodesFromAlternativas(p.alternativas)));
  }
  if (p.erros && p.erros.length) {
    card.appendChild(sectionBlock('Erros a evitar', p.erros));
  }
  return card;
}

function buildPrecoCategoriaResult(cat) {
  const wrap = el('div', { class: 'card bundle-card' });
  wrap.appendChild(el('h3', { html: cat.icone + ' ' + cat.titulo + ' <span class="pill pill-real">valores praticados</span>' }));
  if (cat.desc) wrap.appendChild(el('p', { text: cat.desc }));

  const tableWrap = el('div', { class: 'table-wrap' });
  const table = el('table', { class: 'matriz' });
  const headRow = el('tr');
  headRow.appendChild(el('th', { text: 'Item' }));
  (cat.colunas || []).forEach(c => headRow.appendChild(el('th', { text: c })));
  const thead = el('thead');
  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = el('tbody');
  (cat.itens || []).forEach(item => {
    const tr = el('tr');
    tr.appendChild(el('td', { html: '<b>' + item.nome + '</b>' }));
    (item.valores || []).forEach(v => tr.appendChild(el('td', { text: v })));
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  tableWrap.appendChild(table);
  wrap.appendChild(tableWrap);

  if (cat.observacao) {
    wrap.appendChild(el('div', { class: 'callout info', attrs: { style: 'margin-top:14px' }, text: cat.observacao }));
  }
  wrap.appendChild(el('p', { attrs: { style: 'margin-top:14px;font-size:.76rem;color:var(--ink-faint)' }, text: 'Valores sujeitos a reajuste · atualizado em ' + (PRECOS_META.atualizadoEm || '—') + '.' }));
  return wrap;
}

function buildPrecoItemResult(cat, item) {
  const wrap = el('div', { class: 'card bundle-card preco-item-card' });
  wrap.appendChild(el('div', {
    class: 'preco-item-context',
    html: cat.icone + ' ' + cat.titulo + ' <span class="pill pill-real">valores praticados</span>'
  }));
  wrap.appendChild(el('h3', { text: item.nome }));

  const valuesRow = el('div', { class: 'preco-item-values' });
  (cat.colunas || []).forEach((label, i) => {
    const box = el('div', { class: 'preco-item-value' });
    box.appendChild(el('span', { class: 'preco-item-value-label', text: label }));
    box.appendChild(el('span', { class: 'preco-item-value-num', text: (item.valores || [])[i] || '—' }));
    valuesRow.appendChild(box);
  });
  wrap.appendChild(valuesRow);

  wrap.appendChild(el('p', { attrs: { style: 'margin-top:14px;font-size:.76rem;color:var(--ink-faint)' }, text: 'Valores sujeitos a reajuste · atualizado em ' + (PRECOS_META.atualizadoEm || '—') + '.' }));
  return wrap;
}

function buildEscadaCompletaBlock() {
  const wrap = el('div', { class: 'card bundle-card' });
  wrap.appendChild(el('h3', { text: 'Escada de Liberações · R-01 → R-09' }));
  wrap.appendChild(el('p', { text: 'Percorra de cima para baixo; suba de nível apenas quando o passo anterior não bastar. Nunca começar pela maior concessão disponível.' }));
  let currentFase = null;
  RSTEPS.forEach(r => {
    if (r.fase !== currentFase) { currentFase = r.fase; wrap.appendChild(el('div', { class: 'fase-label', text: FASES[currentFase] })); }
    wrap.appendChild(buildRStepCard(r));
  });
  return wrap;
}

function buildMatrizBlock() {
  const wrap = el('div', { class: 'card bundle-card' });
  wrap.appendChild(el('h3', { text: 'Matriz de Liberações' }));
  wrap.appendChild(el('p', { text: 'A alçada por cargo (Consultor / Supervisor / Gerente / Diretoria) ainda não foi confirmada pela gestão — marcada como A DEFINIR até essa informação ser fornecida. Os pontos já sinalizados pelo manual como "conversar com a gestão" aparecem destacados.' }));
  const tableWrap = el('div', { class: 'table-wrap' });
  const table = el('table', { class: 'matriz' });
  table.appendChild(el('thead', { html: '<tr><th>Liberação</th><th>Fase</th><th>Intensidade</th><th>Alçada / observação</th></tr>' }));
  const tbody = el('tbody');
  MATRIZ.forEach(row => {
    const tr = el('tr');
    tr.appendChild(el('td', { html: '<b>' + row.codigo + '</b> · ' + row.nome }));
    tr.appendChild(el('td', { text: row.fase }));
    tr.appendChild(el('td', { text: row.intensidade }));
    const obsTd = el('td');
    const isFlag = row.observacao.indexOf('conversar com a gestão') !== -1;
    obsTd.appendChild(el('span', { class: isFlag ? 'badge-flag' : 'badge-definir', text: isFlag ? row.observacao : 'A DEFINIR' }));
    if (!isFlag) obsTd.appendChild(el('div', { html: row.observacao, attrs: { style: 'margin-top:6px;font-size:.78rem;color:var(--ink-faint)' } }));
    tr.appendChild(obsTd);
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  tableWrap.appendChild(table);
  wrap.appendChild(tableWrap);
  return wrap;
}

function buildMateriaisBlock() {
  const wrap = el('div', { class: 'card bundle-card' });
  wrap.appendChild(el('h3', { text: 'Materiais de Apresentação (cardápios digitais)' }));
  wrap.appendChild(el('p', { text: 'Links para mandar ao cliente ver os cardápios e materiais de cada tipo de evento.' }));

  MATERIAIS.forEach(grupo => {
    const grupoWrap = el('div', { attrs: { style: 'margin-top:18px' } });
    grupoWrap.appendChild(el('h4', { text: grupo.icone + ' ' + grupo.titulo }));
    const linksWrap = el('div', { class: 'material-links' });
    grupo.links.forEach(link => {
      linksWrap.appendChild(el('a', {
        class: 'material-link',
        text: link.label,
        attrs: { href: link.url, target: '_blank', rel: 'noopener noreferrer' }
      }));
    });
    grupoWrap.appendChild(linksWrap);
    wrap.appendChild(grupoWrap);
  });

  return wrap;
}

function buildDiagnosticoBlock() {
  const wrap = el('div', { class: 'card bundle-card' });
  wrap.appendChild(el('h3', { text: 'Diagnóstico do Cliente' }));
  wrap.appendChild(el('p', { text: 'O consultor não deve apresentar desconto, condição especial ou alteração contratual antes de entender exatamente por que o cliente está considerando cancelar.' }));
  const ul = el('ul', { class: 'checklist' });
  DIAGNOSTICO_CHECKLIST.forEach(item => ul.appendChild(el('li', { text: item })));
  wrap.appendChild(ul);
  const kq = el('div', { class: 'key-question' });
  kq.appendChild(el('p', { class: 'q', text: '"Se conseguíssemos resolver este ponto, você teria interesse em permanecer conosco?"' }));
  kq.appendChild(el('p', { text: 'Essa pergunta ajuda a identificar se o motivo apresentado é realmente o principal impeditivo — ou se existe algo mais por trás da solicitação.' }));
  wrap.appendChild(kq);
  return wrap;
}

function buildNaoFazerBlock() {
  const wrap = el('div', { class: 'card bundle-card' });
  wrap.appendChild(el('h3', { text: 'O que não fazer' }));
  const items = ['Oferecer desconto imediatamente', 'Discutir com o cliente', 'Minimizar o problema', 'Falar mal de concorrentes', 'Prometer condições sem autorização', 'Apresentar todas as liberações de uma só vez', 'Criar falsas urgências', 'Dificultar artificialmente o cancelamento', 'Esconder informações contratuais', 'Pressionar emocionalmente o cliente'];
  const ul = el('ul', { class: 'naofazer-grid' });
  items.forEach(i => ul.appendChild(el('li', { text: i })));
  wrap.appendChild(ul);
  wrap.appendChild(el('div', { class: 'callout danger', attrs: { style: 'margin-top:18px' }, html: '<strong>Retenção não significa impedir o cancelamento.</strong> Significa garantir que todas as soluções possíveis foram avaliadas antes da decisão final.' }));
  return wrap;
}

function buildEncerramentoBlock() {
  const wrap = el('div', { class: 'card bundle-card' });
  wrap.appendChild(el('h3', { text: 'Encerramento' }));
  wrap.appendChild(el('p', { text: 'Se todas as possibilidades foram corretamente exploradas e o cliente mantém a decisão:' }));
  const items = ['Respeitar a decisão', 'Explicar o procedimento com clareza', 'Registrar o motivo real do cancelamento', 'Registrar todas as alternativas apresentadas', 'Formalizar por escrito o que foi acordado (valores, isenções, prazos)', 'Encaminhar para o processo oficial de cancelamento'];
  const ul = el('ul', { class: 'encerramento-list' });
  items.forEach(i => ul.appendChild(el('li', { text: i })));
  wrap.appendChild(ul);
  wrap.appendChild(el('div', { class: 'callout info', attrs: { style: 'margin-top:18px' }, html: '<strong>Por que isso importa:</strong> dois dos casos reais analisados (Sergio/Antônio Corrêa e Ronaldo Agostinho Costa) voltaram a gerar atrito meses ou anos depois — pedido de restituição e negativação indevida — exatamente por falta de um registro formal e claro do que foi combinado no momento do cancelamento.' }));
  return wrap;
}

function buildCasosReaisBundle() {
  const wrap = el('div', { class: 'card bundle-card' });
  wrap.appendChild(el('h3', { text: 'Casos Reais de Cancelamento' }));
  wrap.appendChild(el('p', { text: 'Casos extraídos do histórico real de atendimento (uso interno — não compartilhar externamente).' }));
  const grid = el('div', { class: 'card-grid' });
  CASOS.forEach(c => grid.appendChild(buildCasoCard(c)));
  wrap.appendChild(grid);
  return wrap;
}

function buildIndicadoresBlock() {
  const wrap = el('div', { class: 'card bundle-card' });
  wrap.appendChild(el('h3', { html: 'Cancelamentos por motivo <span class="pill pill-demo">demonstrativo</span>' }));
  const bars = el('div');
  const max = Math.max(...INDICADORES_DEMO.map(d => d.valor));
  INDICADORES_DEMO.forEach(d => {
    bars.appendChild(el('div', { class: 'bar-row' }, [
      el('div', { class: 'bar-label', text: d.label }),
      el('div', { class: 'bar-track' }, [el('div', { class: 'bar-fill', attrs: { style: 'width:' + (d.valor / max * 100) + '%' } })]),
      el('div', { class: 'bar-value', text: d.valor + '%' })
    ]));
  });
  wrap.appendChild(bars);

  const real = el('div', { attrs: { style: 'margin-top:22px' } });
  real.appendChild(el('h4', { text: 'Casos reais analisados neste playbook (dado real · Indaiá Chat)' }));
  const statGrid = el('div', { class: 'stat-grid' });
  const porCategoria = {};
  CASOS.forEach(c => { porCategoria[c.categoria] = (porCategoria[c.categoria] || 0) + 1; });
  Object.entries(porCategoria).forEach(([cat, count]) => {
    statGrid.appendChild(el('div', { class: 'stat-card' }, [
      el('div', { class: 'stat-value', text: String(count) }),
      el('div', { class: 'stat-label', text: cat })
    ]));
  });
  real.appendChild(statGrid);
  wrap.appendChild(real);

  wrap.appendChild(el('div', { class: 'callout info', attrs: { style: 'margin-top:18px' }, text: 'Gráficos adicionais previstos para versões futuras: solicitações por mês, retenção por consultor, retenção por unidade, valor financeiro recuperado e estágio (R-01 a R-09) que mais gera retenções.' }));
  return wrap;
}

/* ---------- Árvore de decisão (autocontida, sem depender de IDs fixos) ---------- */
function buildArvoreBlock() {
  const wrap = el('div', { class: 'card bundle-card' });
  wrap.appendChild(el('h3', { text: 'Árvore de Decisão' }));
  wrap.appendChild(el('p', { text: 'Responda às perguntas para chegar à próxima ação recomendada.' }));
  const box = el('div', { class: 'arvore-box' });
  wrap.appendChild(box);
  renderArvoreStep1(box);
  return wrap;
}

function renderArvoreStep1(root) {
  root.innerHTML = '';
  root.appendChild(el('div', { class: 'arvore-pergunta', text: 'Por que o cliente quer cancelar?' }));
  const opcoes = el('div', { class: 'arvore-opcoes' });
  const labels = { financeiro: 'Financeiro', data: 'Data', insatisfacao: 'Insatisfação', concorrencia: 'Concorrência', reducao: 'Redução do evento', pessoal: 'Motivo pessoal', outro: 'Outro' };
  const resultado = el('div', { class: 'arvore-resultado' });
  Object.entries(labels).forEach(([key, label]) => {
    const btn = el('button', { text: label, attrs: { type: 'button' } });
    btn.addEventListener('click', () => renderArvoreStep2(root, resultado, key, btn));
    opcoes.appendChild(btn);
  });
  root.appendChild(opcoes);
  root.appendChild(resultado);
}

function renderArvoreStep2(root, resultado, key, chosenBtn) {
  chosenBtn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('chosen'));
  chosenBtn.classList.add('chosen');
  const node = ARVORE[key];
  resultado.className = 'arvore-resultado show';
  resultado.innerHTML = '';
  resultado.appendChild(el('div', { class: 'arvore-pergunta', text: node.pergunta, attrs: { style: 'font-size:1rem;margin-bottom:10px' } }));
  const opcoes = el('div', { class: 'arvore-opcoes' });
  Object.entries(node.opcoes).forEach(([label, resultObj]) => {
    const btn = el('button', { text: label, attrs: { type: 'button' } });
    btn.addEventListener('click', () => {
      opcoes.querySelectorAll('button').forEach(b => b.classList.remove('chosen'));
      btn.classList.add('chosen');
      let final = resultado.querySelector('.arvore-final');
      if (!final) { final = el('div', { class: 'arvore-final', attrs: { style: 'margin-top:12px' } }); resultado.appendChild(final); }
      final.innerHTML = '<p><strong>Próxima ação recomendada:</strong> ' + resultObj.texto + '</p>';
      if (resultObj.rcodes.length) {
        const chipRow = el('div', { class: 'caso-rcodes' });
        resultObj.rcodes.forEach(rid => {
          const r = RSTEPS.find(x => x.id === rid);
          const chip = el('button', { class: 'rcode-chip', text: r.codigo, attrs: { type: 'button' } });
          chip.addEventListener('click', () => {
            let slot = resultado.querySelector('.arvore-rstep-slot');
            if (!slot) { slot = el('div', { class: 'arvore-rstep-slot', attrs: { style: 'margin-top:10px' } }); resultado.appendChild(slot); }
            slot.innerHTML = '';
            slot.appendChild(buildRStepCard(r));
          });
          chipRow.appendChild(chip);
        });
        final.appendChild(chipRow);
      }
    });
    opcoes.appendChild(btn);
  });
  resultado.appendChild(opcoes);
  const restart = el('button', { class: 'arvore-restart', text: '↺ Recomeçar diagnóstico' });
  restart.addEventListener('click', () => renderArvoreStep1(root));
  resultado.appendChild(restart);
}

/* ==========================================================================
   ÍNDICE DE BUSCA — banco de informações unificado
   Cada entrada tem palavras-chave e uma função de renderização própria.
   A busca filtra por substring nas palavras-chave: só aparece o que bate.
   ========================================================================== */
const SEARCH_INDEX = [];

MOTIVOS.forEach(m => {
  SEARCH_INDEX.push({
    id: 'motivo-' + m.id,
    type: 'Motivo de cancelamento',
    scope: 'cancelamento',
    title: m.titulo,
    keywords: normalize(m.titulo + ' ' + m.desc + ' ' + m.id + ' ' + (m.sinonimos || []).join(' ')),
    render: () => buildMotivoResult(m)
  });
});

PROCEDIMENTOS.forEach(p => {
  SEARCH_INDEX.push({
    id: 'procedimento-' + p.id,
    type: 'Procedimento pós-venda',
    scope: 'data',
    title: p.titulo,
    keywords: normalize(p.titulo + ' ' + p.desc + ' ' + p.id + ' ' + (p.sinonimos || []).join(' ')),
    render: () => buildProcedimentoResult(p)
  });
});

RSTEPS.forEach(r => {
  SEARCH_INDEX.push({
    id: 'rstep-' + r.id,
    type: 'Etapa de retenção',
    scope: 'cancelamento',
    title: r.codigo + ' · ' + r.nome,
    keywords: normalize(r.codigo + ' ' + r.nome + ' ' + (r.sinonimos || []).join(' ')),
    render: () => buildRStepCard(r)
  });
});

CASOS.forEach(c => {
  SEARCH_INDEX.push({
    id: 'caso-' + c.id,
    type: 'Caso real',
    scope: 'cancelamento',
    title: c.nome,
    keywords: normalize(c.nome + ' ' + c.evento + ' ' + c.motivo),
    render: () => buildCasoCard(c)
  });
});

SCRIPTS.forEach(s => {
  SEARCH_INDEX.push({
    id: 'script-' + s.id,
    type: 'Script geral',
    scope: 'cancelamento',
    title: s.titulo,
    keywords: normalize(s.titulo + ' ' + s.texto + ' script mensagem whatsapp'),
    render: () => buildScriptCard(s)
  });
});

SEARCH_INDEX.push({
  id: 'bundle-materiais', type: 'Materiais de Apresentação', scope: 'outros', title: 'Materiais de Apresentação (cardápios digitais)',
  keywords: normalize('materiais cardapio cardapios digital link links apresentacao gastronomia doces open bar drinks casamento 15 anos quinze confeitaria ' +
    MATERIAIS.map(g => g.titulo + ' ' + g.links.map(l => l.label).join(' ')).join(' ')),
  render: buildMateriaisBlock
});
SEARCH_INDEX.push({
  id: 'bundle-escada', type: 'Escada completa', scope: 'outros', title: 'Escada de Liberações (R-01 → R-09)',
  keywords: normalize('escada liberacoes fluxo completo r-01 r-02 r-03 r-04 r-05 r-06 r-07 r-08 r-09 fase concessao'),
  render: buildEscadaCompletaBlock
});
SEARCH_INDEX.push({
  id: 'bundle-matriz', type: 'Matriz', scope: 'outros', title: 'Matriz de Liberações',
  keywords: normalize('matriz liberacoes alcada aprovacao autorizacao consultor supervisor gerente diretoria'),
  render: buildMatrizBlock
});
SEARCH_INDEX.push({
  id: 'bundle-diagnostico', type: 'Diagnóstico', scope: 'outros', title: 'Diagnóstico do Cliente',
  keywords: normalize('diagnostico checklist perguntas antes de argumentar'),
  render: buildDiagnosticoBlock
});
SEARCH_INDEX.push({
  id: 'bundle-naofazer', type: 'Alertas', scope: 'outros', title: 'O que não fazer',
  keywords: normalize('o que nao fazer erros evitar alertas'),
  render: buildNaoFazerBlock
});
SEARCH_INDEX.push({
  id: 'bundle-encerramento', type: 'Encerramento', scope: 'outros', title: 'Encerramento',
  keywords: normalize('encerramento cancelamento oficial registrar formalizar distrato'),
  render: buildEncerramentoBlock
});
SEARCH_INDEX.push({
  id: 'bundle-arvore', type: 'Árvore de decisão', scope: 'outros', title: 'Árvore de Decisão',
  keywords: normalize('arvore de decisao interativo proxima acao'),
  render: buildArvoreBlock
});
SEARCH_INDEX.push({
  id: 'bundle-casos', type: 'Casos Reais', scope: 'outros', title: 'Todos os Casos Reais',
  keywords: normalize('casos reais todos historico indaia chat'),
  render: buildCasosReaisBundle
});
SEARCH_INDEX.push({
  id: 'bundle-indicadores', type: 'Indicadores', scope: 'outros', title: 'Indicadores de Cancelamento',
  keywords: normalize('indicadores dados grafico taxa de retencao demonstrativo painel'),
  render: buildIndicadoresBlock
});

/* ==========================================================================
   BUSCA — página inicial é só isto: input + chips + resultados filtrados
   ========================================================================== */
document.addEventListener('DOMContentLoaded', async () => {
  await loadPrecos();
  registerPrecosInIndex();
  initSearch();
  initBackToTop();
});

function registerPrecosInIndex() {
  PRECOS.forEach(cat => {
    // Nível categoria: só bate ao digitar o nome da própria categoria — mostra a
    // tabela inteira. Os itens de cada categoria entram como entradas separadas
    // abaixo, para que buscar um item específico traga só aquele item.
    SEARCH_INDEX.push({
      id: 'preco-' + cat.id,
      type: 'Categoria de valores',
      scope: 'valores',
      title: cat.titulo,
      keywords: normalize(cat.titulo + ' ' + (cat.desc || '') + ' ' + cat.id + ' ' + (cat.sinonimos || []).join(' ')),
      render: () => buildPrecoCategoriaResult(cat)
    });
    (cat.itens || []).forEach((item, idx) => {
      SEARCH_INDEX.push({
        id: 'preco-item-' + cat.id + '-' + idx,
        type: 'Item de valor',
        scope: 'valores',
        title: item.nome,
        keywords: normalize(item.nome + ' ' + cat.titulo),
        render: () => buildPrecoItemResult(cat, item)
      });
    });
  });
}

const SCOPES = [
  { id: 'cancelamento', label: '🚫 Cancelamento', placeholder: 'Buscar em Cancelamento: financeiro, insatisfação, mudança de data…' },
  { id: 'data', label: '📅 Alteração de Data', placeholder: 'Buscar em Alteração de Data…' },
  { id: 'valores', label: '💰 Tabela de Valores', placeholder: 'Buscar um item de valor: pista de led, menu superior, hora extra…' },
  { id: 'outros', label: '🗂️ Outros Temas', placeholder: 'Buscar em Outros Temas: escada, matriz, casos, indicadores…' }
];

function initSearch() {
  const input = document.getElementById('masterSearch');
  const resultsArea = document.getElementById('searchResults');
  const scopeWrap = document.getElementById('scopeButtons');
  const defaultPlaceholder = input ? input.placeholder : '';
  if (!input || !resultsArea) return;

  let activeScope = null;

  function renderResults(entries) {
    resultsArea.innerHTML = '';
    if (!entries.length) {
      resultsArea.appendChild(el('div', { class: 'no-results', text: 'Nenhum resultado para isso. Tente outro termo ou escolha um tema acima.' }));
      return;
    }
    entries.forEach(entry => {
      const block = el('div', { class: 'result-block' });
      block.appendChild(el('div', { class: 'result-type', text: entry.type }));
      block.appendChild(entry.render());
      resultsArea.appendChild(block);
    });
  }

  function runSearch() {
    const q = input.value;
    if (!q.trim()) {
      resultsArea.innerHTML = '';
      resultsArea.classList.remove('show');
      return;
    }
    resultsArea.classList.add('show');
    const qn = normalize(q);
    const matches = SEARCH_INDEX.filter(e => (!activeScope || e.scope === activeScope) && e.keywords.includes(qn));
    renderResults(matches);
  }

  if (scopeWrap) {
    SCOPES.forEach(s => {
      const btn = el('button', { class: 'scope-chip', text: s.label, attrs: { type: 'button' } });
      btn.addEventListener('click', () => {
        const turningOff = activeScope === s.id;
        activeScope = turningOff ? null : s.id;
        document.querySelectorAll('.scope-chip').forEach(c => c.classList.remove('active'));
        if (!turningOff) btn.classList.add('active');
        input.placeholder = activeScope ? s.placeholder : defaultPlaceholder;
        input.focus();
        runSearch();
      });
      scopeWrap.appendChild(btn);
    });
  }

  input.addEventListener('input', runSearch);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') e.preventDefault(); });
}

function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 500);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
