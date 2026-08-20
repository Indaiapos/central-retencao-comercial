/* ==========================================================================
   Central de Retenção Comercial — Indaiá Eventos
   Todo o conteúdo vive nos objetos abaixo. Para atualizar o portal,
   edite estes dados — o HTML é montado automaticamente a partir deles.
   Ver README.md para instruções de edição.
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
    ]
  },
  {
    id: 'r02', codigo: 'R-02', nome: 'Cortesias', fase: 'I',
    intensidade: 1, label: 'Leve',
    desc: 'Encantar com um benefício desejado, preservando o vínculo com a experiência.',
    acoes: ['Oferecer a cortesia que o cliente deseja, limitada a 40% do contrato.'],
    alerta: 'Acima de 40% — conversar com a gestão.'
  },
  {
    id: 'r03', codigo: 'R-03', nome: 'Redução Contratual', fase: 'I',
    intensidade: 2, label: 'Moderada',
    desc: 'Enxugar o escopo do contrato retirando o atrito das penalidades.',
    acoes: [
      'Isentar a multa da redução contratual.',
      'Permitir isenção superior a 20% do contrato.'
    ]
  },
  {
    id: 'r04', codigo: 'R-04', nome: 'Congelamento de Parcelas', fase: 'II',
    intensidade: 2, label: 'Moderada',
    desc: 'Pausar os pagamentos por um período proporcional ao tempo até o evento.',
    prazos: [
      { rotulo: 'Longo prazo · acima de 2 anos', valor: '4 meses' },
      { rotulo: 'Médio prazo · de 1 a 2 anos', valor: '3 meses' },
      { rotulo: 'Curto prazo · menos de 1 ano', valor: '2 meses' }
    ]
  },
  {
    id: 'r05', codigo: 'R-05', nome: 'Alteração de Data', fase: 'II',
    intensidade: 3, label: 'Moderada',
    desc: 'Remarcar o evento com taxa proporcional — ou isenta — conforme a antecedência.',
    prazos: [
      { rotulo: 'Curto prazo', valor: 'taxa mín. 20%' },
      { rotulo: 'Longo prazo', valor: 'isenção mínima' }
    ],
    alerta: 'Desconto maior na taxa — conversar com a gestão.'
  },
  {
    id: 'r06', codigo: 'R-06', nome: 'Liberação de Data', fase: 'II',
    intensidade: 3, label: 'Moderada',
    desc: 'Soltar a data reservada e sustentar o vínculo por pagamentos mensais.',
    acoes: [
      'Aplicável a cliente com evento superior a 1 ano.',
      'Liberar a data e combinar pagamentos mensais das parcelas.',
      'Em seguida, negociar a troca de data.'
    ]
  },
  {
    id: 'r07', codigo: 'R-07', nome: 'Promissória', fase: 'III',
    intensidade: 4, label: 'Alta',
    desc: 'Encerrar honrando o compromisso financeiro em um plano estruturado no tempo.',
    acoes: [
      'Valor já pago do contrato deve ser superior a 30% do total.',
      'Até o saldo final, quitar 70% do valor total do contrato.',
      'Os 30% restantes em até 4 meses após a realização do evento.'
    ]
  },
  {
    id: 'r08', codigo: 'R-08', nome: 'Multa de Cancelamento', fase: 'III',
    intensidade: 4, label: 'Alta',
    desc: 'Encerrar o contrato aplicando a penalidade proporcional à antecedência.',
    prazos: [
      { rotulo: 'Curto prazo', valor: 'multa mín. 40%' },
      { rotulo: 'Longo prazo', valor: 'multa mín. 25%' }
    ],
    alerta: 'Desconto maior na multa — conversar com a gestão.'
  },
  {
    id: 'r09', codigo: 'R-09', nome: 'Negociar a Multa & Manter o Evento Ativo', fase: 'III',
    intensidade: 5, label: 'Máxima',
    desc: 'Transformar a penalidade em ponte: manter o evento vivo até a decisão final do cliente.',
    acoes: [
      'Após acordo sobre a multa, oferecer — a evento superior a 2 anos — manter o evento ativo.',
      'Cliente segue pagando as parcelas até atingir o percentual negociado.',
      'Ao atingir, o cliente decide: manter o evento ou cancelar.'
    ]
  }
];

const FASES = {
  'I': 'Fase I · Ajuste & Permanência',
  'II': 'Fase II · Reestruturação & Tempo',
  'III': 'Fase III · Encerramento Negociado'
};

/* Mapa didático Etapa 0-5 -> códigos R, para orientar quem está começando. */
const ETAPAS = [
  { num: 0, titulo: 'Diagnóstico', r: 'Nenhuma concessão — apenas entender o motivo real.' },
  { num: 1, titulo: 'Solução sem concessão', r: 'Base para R-01 e R-02' },
  { num: 2, titulo: '1ª alternativa comercial', r: 'R-03 e R-04' },
  { num: 3, titulo: 'Retenção Supervisão', r: 'R-05 e R-06 — necessita autorização' },
  { num: 4, titulo: 'Retenção Gerencial', r: 'R-07 e R-08 — não apresentar antes da liberação' },
  { num: 5, titulo: 'Encerramento', r: 'R-09 quando aplicável, depois registro oficial' }
];

/* -------------------------------------------------------------------------
   2. MOTIVOS DE CANCELAMENTO
   casoRealId liga o motivo a um card em CASOS (ver seção 4). Deixe null
   quando ainda não houver caso real registrado — não inventar exemplo.
   ------------------------------------------------------------------------- */
const MOTIVOS = [
  {
    id: 'financeiro', icone: '💰', titulo: 'Financeiro',
    desc: 'Dificuldade de pagamento, redução de renda, desemprego ou orçamento comprometido.',
    comoIdentificar: ['Cliente menciona valor, parcela, renda ou desemprego antes de qualquer outro assunto.'],
    perguntas: [
      'O principal motivo hoje seria realmente financeiro?',
      'A dificuldade está relacionada ao valor total ou ao valor das parcelas?',
      'Se conseguíssemos reorganizar a condição de pagamento, isso ajudaria?',
      'Existe algum valor mensal que ficaria mais confortável?',
      'Existe algum serviço que poderíamos revisar antes de considerar o cancelamento?'
    ],
    objetivo: 'Entender se existe uma dificuldade temporária de fluxo de caixa ou uma impossibilidade definitiva de manter o contrato.',
    argumentos: [
      'Antes de cancelar todo o planejamento já realizado, vale verificar possibilidades de reorganização.',
      'Explorar alteração de vencimentos, extensão de pagamento, revisão de serviços adicionais, redução de escopo, créditos e condições comerciais autorizadas.',
      'Nunca iniciar diretamente oferecendo desconto.'
    ],
    alternativas: ['R-01 · Redução das Parcelas', 'R-04 · Congelamento de Parcelas', 'R-03 · Redução Contratual', 'R-05 · Alteração de Data, quando aplicável'],
    erros: ['Oferecer desconto na multa antes de entender se o aperto é temporário.', 'Ignorar se o problema é no valor total ou nas parcelas — a solução é diferente para cada caso.'],
    estagio: 'Etapa 1-2 · iniciar por R-01/R-04 antes de discutir R-08.',
    casoRealId: 'gabriela'
  },
  {
    id: 'mudanca-planos', icone: '🔄', titulo: 'Mudança de planos',
    desc: 'Cliente decidiu alterar completamente o evento ou não pretende mais realizá-lo.',
    comoIdentificar: ['Fala em "não vamos mais fazer" em vez de "vamos adiar/reduzir".'],
    perguntas: ['O evento em si deixou de existir ou só o formato mudou?', 'Existe alguma versão menor ou diferente do evento que ainda faria sentido?'],
    objetivo: 'Distinguir cancelamento definitivo de uma simples mudança de formato que o contrato ainda pode acomodar.',
    argumentos: ['Explorar se uma redução contratual (R-03) resolve antes de tratar como cancelamento total.'],
    alternativas: ['R-03 · Redução Contratual', 'R-06 · Liberação de Data (mantendo vínculo)'],
    erros: ['Tratar como cancelamento definitivo sem checar se algum formato menor resolveria.'],
    estagio: 'Etapa 1-2.',
    casoRealId: null
  },
  {
    id: 'mudanca-data', icone: '📅', titulo: 'Mudança de data',
    desc: 'O evento continuará acontecendo, mas a data originalmente contratada não atende mais.',
    comoIdentificar: ['Cliente fala em remarcar, adiar ou antecipar, não em cancelar.'],
    perguntas: ['Existe uma nova data já em mente?', 'O motivo da mudança é pontual (conflito de agenda) ou estrutural (financeiro, família)?'],
    objetivo: 'Resolver via remarcação antes de qualquer discussão de cancelamento.',
    argumentos: ['Apresentar R-05 como solução direta: taxa proporcional à antecedência, podendo ser isenta em longo prazo.'],
    alternativas: ['R-05 · Alteração de Data', 'R-06 · Liberação de Data, se o evento for superior a 1 ano'],
    erros: ['Tratar pedido de remarcação como pedido de cancelamento.'],
    estagio: 'Etapa 2-3 · R-05 pode precisar de alinhamento com a gestão se o desconto na taxa for maior que o padrão.',
    casoRealId: null
  },
  {
    id: 'reducao-convidados', icone: '👥', titulo: 'Redução de convidados',
    desc: 'O cliente percebe que o evento será menor e acredita que o contrato deixou de fazer sentido.',
    comoIdentificar: ['Cliente menciona lista de convidados encolhendo, não motivo financeiro ou pessoal.'],
    perguntas: ['O novo número de convidados ainda cabe no pacote atual?', 'O que motivou a redução — foi uma escolha ou uma limitação?'],
    objetivo: 'Mostrar que redução de convidados não precisa significar cancelamento — o contrato pode ser ajustado.',
    argumentos: ['Apresentar redução contratual (R-03) como caminho natural antes de cogitar cancelamento.'],
    alternativas: ['R-03 · Redução Contratual'],
    erros: ['Assumir que menos convidados significa que o cliente quer cancelar — geralmente quer ajustar.'],
    estagio: 'Etapa 1-2.',
    casoRealId: null
  },
  {
    id: 'insatisfacao-atendimento', icone: '💬', titulo: 'Insatisfação com atendimento',
    desc: 'Cliente relata problemas de comunicação, demora, atendimento ou experiência durante a jornada.',
    comoIdentificar: ['Cliente reclama de ter sido "enganado", de falta de aviso, de trocas de atendente ou de não ter sido informado sobre alguma cobrança.'],
    perguntas: ['O que especificamente aconteceu e quando?', 'Isso já foi reportado antes?', 'O que resolveria essa situação além do cancelamento?'],
    objetivo: 'Priorizar escuta genuína e reparo antes de qualquer argumentação comercial — a confiança precisa ser reconstruída primeiro.',
    argumentos: [
      'Reconhecer o problema sem minimizar.',
      'Explicar com transparência total qualquer cobrança ou condição que gerou a sensação de surpresa.',
      'Avaliar uma cortesia (R-02) como reparação antes de discutir multa.'
    ],
    alternativas: ['R-02 · Cortesias', 'R-03 · Redução Contratual'],
    erros: ['Discutir com o cliente ou minimizar o problema relatado.', 'Pular direto para negociar a multa de cancelamento sem tentar reparar a insatisfação primeiro.'],
    estagio: 'Etapa 1 · resolver na base antes de qualquer escalonamento.',
    casoRealId: 'eduarda'
  },
  {
    id: 'insatisfacao-servico', icone: '🏛️', titulo: 'Insatisfação com serviço ou estrutura',
    desc: 'Cliente demonstra insegurança relacionada ao espaço, serviços, fornecedores ou estrutura contratada.',
    comoIdentificar: ['Reclama do espaço, cardápio, fornecedor ou de alguma entrega específica do contrato.'],
    perguntas: ['O que especificamente não atendeu à expectativa?', 'Existe uma alternativa dentro da nossa estrutura que resolveria?'],
    objetivo: 'Verificar se um ajuste de escopo resolve antes de tratar como cancelamento.',
    argumentos: ['Apresentar alternativas de espaço, fornecedor ou serviço equivalentes antes de discutir saída do contrato.'],
    alternativas: ['R-03 · Redução Contratual', 'R-02 · Cortesias, como reparação pontual'],
    erros: ['Ignorar a reclamação técnica e ir direto para a negociação financeira.'],
    estagio: 'Etapa 1-2.',
    casoRealId: null
  },
  {
    id: 'concorrencia', icone: '⚖️', titulo: 'Comparação com concorrência',
    desc: 'Cliente encontrou uma proposta aparentemente mais barata ou diferente em outra empresa.',
    comoIdentificar: ['Cliente cita outro fornecedor ou menciona "encontramos algo mais em conta".'],
    perguntas: ['O que mais chamou sua atenção na outra proposta?', 'Foi principalmente o valor?', 'Existe algum serviço diferente?', 'A estrutura é equivalente?', 'O que vocês consideram indispensável para o evento?'],
    objetivo: 'Mostrar valor antes de discutir preço, sem nunca falar mal do concorrente.',
    argumentos: ['Comparar estrutura, serviços, segurança contratual, equipe, operação, experiência, entregas incluídas e possíveis custos extras da outra proposta.'],
    alternativas: ['R-02 · Cortesias, se fizer sentido reforçar valor percebido'],
    erros: ['Falar mal do concorrente.', 'Entrar direto em queda de preço sem antes reforçar diferenciais.'],
    estagio: 'Etapa 1.',
    casoRealId: null
  },
  {
    id: 'separacao', icone: '💔', titulo: 'Separação do casal',
    desc: 'Cancelamento relacionado ao término do relacionamento.',
    comoIdentificar: ['Um ou ambos os contratantes comunicam o fim do relacionamento.'],
    perguntas: ['Existe decisão conjunta sobre o encerramento?', 'Como preferem que a comunicação e o registro sejam feitos, considerando os dois nomes no contrato?'],
    objetivo: 'Conduzir com máxima sensibilidade — não é um momento para argumentação comercial.',
    argumentos: ['Não insistir em retenção. Focar em explicar o processo com respeito e clareza.'],
    alternativas: ['R-07 · Promissória, se fizer sentido financeiramente', 'R-08 · Multa de Cancelamento'],
    erros: ['Tentar reter emocionalmente ou fazer perguntas invasivas sobre o relacionamento.'],
    estagio: 'Etapa 4-5 · normalmente segue direto para encerramento.',
    casoRealId: null
  },
  {
    id: 'familiar', icone: '🏠', titulo: 'Problemas familiares ou pessoais',
    desc: 'Questões familiares ou situações particulares que impactam a realização do evento.',
    comoIdentificar: ['Cliente menciona doença, luto ou situação pessoal delicada.'],
    perguntas: ['A situação é temporária ou muda definitivamente os planos?', 'Existe uma data futura em que faria mais sentido retomar?'],
    objetivo: 'Acolher primeiro, negociar depois — com muita sensibilidade.',
    argumentos: ['Se temporário, priorizar congelamento (R-04) ou alteração de data (R-05) antes de falar em cancelamento.', 'Se definitivo, conduzir o encerramento com empatia, buscando a isenção de multa quando cabível.'],
    alternativas: ['R-04 · Congelamento de Parcelas', 'R-05 · Alteração de Data', 'R-08 · Multa de Cancelamento, com isenção quando aplicável'],
    erros: ['Insistir comercialmente diante de um motivo de saúde ou luto.', 'Pular etapas leves e ir direto para a negociação de multa sem tentar acolher com alternativas de tempo.'],
    estagio: 'Etapa 2 antes da Etapa 4 — não pular direto para a multa.',
    casoRealId: 'fabiola'
  },
  {
    id: 'mudanca-cidade', icone: '🧳', titulo: 'Mudança de cidade',
    desc: 'Cliente mudou ou pretende mudar de cidade e considera inviável manter o evento.',
    comoIdentificar: ['Cliente menciona mudança de endereço, emprego em outra cidade ou dificuldade logística para os convidados.'],
    perguntas: ['A mudança é definitiva?', 'Faria sentido transferir o evento para uma unidade Indaiá mais próxima da nova cidade?'],
    objetivo: 'Verificar se a rede de unidades resolve antes de tratar como cancelamento.',
    argumentos: ['Apresentar unidades Indaiá na nova região, se existir, como alternativa à saída do contrato.'],
    alternativas: ['R-06 · Liberação de Data, mantendo vínculo por pagamentos mensais', 'R-05 · Alteração de Data'],
    erros: ['Não considerar transferência de unidade antes de tratar como perda do cliente.'],
    estagio: 'Etapa 2-3.',
    casoRealId: null
  },
  {
    id: 'outro', icone: '❓', titulo: 'Outro motivo',
    desc: 'Motivo que não se encaixa nas categorias acima — usar o diagnóstico geral.',
    comoIdentificar: ['Nenhum dos padrões acima se aplica claramente.'],
    perguntas: ['Se conseguíssemos resolver este ponto, você teria interesse em permanecer conosco?'],
    objetivo: 'Diagnosticar com calma antes de classificar — não forçar o motivo em uma categoria errada.',
    argumentos: ['Usar o checklist de diagnóstico geral antes de qualquer proposta.'],
    alternativas: ['Definido conforme o diagnóstico revelar.'],
    erros: ['Avançar para uma liberação comercial sem entender o motivo real.'],
    estagio: 'Etapa 0 · sempre começar pelo diagnóstico.',
    casoRealId: 'diego'
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

/* ==========================================================================
   RENDER
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  renderOverviewStats();
  renderMotivos();
  renderDiagnostico();
  renderEscada();
  renderMatriz();
  renderCasos();
  renderScripts();
  initArvore();
  renderIndicadores();
  initNav();
  initSearch();
  initBackToTop();
});

function el(tag, opts = {}, children = []) {
  const node = document.createElement(tag);
  if (opts.class) node.className = opts.class;
  if (opts.html !== undefined) node.innerHTML = opts.html;
  if (opts.text !== undefined) node.textContent = opts.text;
  if (opts.attrs) Object.entries(opts.attrs).forEach(([k, v]) => node.setAttribute(k, v));
  children.forEach(c => c && node.appendChild(c));
  return node;
}

/* ---------- Overview ---------- */
function renderOverviewStats() {
  const real = document.getElementById('realCounts');
  if (!real) return;
  const porCategoria = {};
  CASOS.forEach(c => { porCategoria[c.categoria] = (porCategoria[c.categoria] || 0) + 1; });
  real.innerHTML = '';
  Object.entries(porCategoria).forEach(([cat, count]) => {
    real.appendChild(el('div', { class: 'stat-card' }, [
      el('div', { class: 'stat-value', text: String(count) }),
      el('div', { class: 'stat-label', text: cat })
    ]));
  });
}

/* ---------- Motivos ---------- */
function renderMotivos() {
  const grid = document.getElementById('motivosGrid');
  if (!grid) return;
  MOTIVOS.forEach(m => {
    const caso = CASOS.find(c => c.id === m.casoRealId);
    const details = el('details', { class: 'card motivo-card', attrs: { id: 'motivo-' + m.id, 'data-search': (m.titulo + ' ' + m.desc).toLowerCase() } });
    const summary = el('summary', {}, [
      el('span', { class: 'm-icon', text: m.icone }),
      el('span', { class: 'm-title', text: m.titulo }),
      el('span', { class: 'm-desc', text: m.desc }),
      el('span', { class: 'm-caret', text: '▾' })
    ]);
    details.appendChild(summary);

    const body = el('div', { class: 'motivo-body' });
    body.appendChild(sectionBlock('Como identificar', m.comoIdentificar));
    body.appendChild(sectionBlock('Perguntas para diagnóstico', m.perguntas));
    body.appendChild(labelPara('Objetivo da argumentação', m.objetivo));
    body.appendChild(sectionBlock('Argumentação recomendada', m.argumentos));
    body.appendChild(sectionBlock('Alternativas / liberações aplicáveis', m.alternativas));
    body.appendChild(sectionBlock('Erros a evitar', m.erros));
    body.appendChild(labelPara('Estágio de liberação recomendado', m.estagio));

    if (caso) {
      const link = el('a', { class: 'm-linkcase', text: '→ Ver caso real: ' + caso.nome, attrs: { href: '#caso-' + caso.id } });
      body.appendChild(link);
    } else {
      body.appendChild(el('p', { class: 'm-nocase', text: 'Nenhum caso real registrado ainda para este motivo no Indaiá Chat.' }));
    }
    details.appendChild(body);
    grid.appendChild(details);
  });
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

/* ---------- Diagnóstico ---------- */
function renderDiagnostico() {
  const list = document.getElementById('diagnosticoChecklist');
  if (!list) return;
  DIAGNOSTICO_CHECKLIST.forEach(item => list.appendChild(el('li', { text: item })));
}

/* ---------- Escada / Etapas ---------- */
function renderEscada() {
  const mapWrap = document.getElementById('etapasMap');
  if (mapWrap) {
    ETAPAS.forEach(e => {
      mapWrap.appendChild(el('div', { class: 'etapa-mini' }, [
        el('div', { class: 'e-num', text: 'Etapa ' + e.num }),
        el('div', { class: 'e-title', text: e.titulo }),
        el('div', { class: 'e-r', text: e.r })
      ]));
    });
  }

  const list = document.getElementById('escadaList');
  if (!list) return;
  let currentFase = null;
  RSTEPS.forEach(r => {
    if (r.fase !== currentFase) {
      currentFase = r.fase;
      list.appendChild(el('div', { class: 'fase-label', text: FASES[currentFase] }));
    }
    const card = el('div', { class: 'rcard', attrs: { id: 'step-' + r.id, 'data-search': (r.codigo + ' ' + r.nome + ' ' + r.desc).toLowerCase() } });
    card.appendChild(el('div', { class: 'r-num', text: r.codigo.replace('R-', '') }));

    const right = el('div');
    const head = el('div', { class: 'r-head' }, [
      el('span', { class: 'r-code', text: r.codigo + ' · ' + r.nome }),
      el('span', { class: 'r-dots', text: '●'.repeat(r.intensidade) + '○'.repeat(5 - r.intensidade) }),
      el('span', { class: 'r-intensidade', text: r.label })
    ]);
    right.appendChild(head);
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
    if (r.alerta) {
      right.appendChild(el('span', { class: 'r-alert', text: '⚠ ' + r.alerta }));
    }
    card.appendChild(right);
    list.appendChild(card);
  });
}

/* ---------- Matriz ---------- */
function renderMatriz() {
  const body = document.getElementById('matrizBody');
  if (!body) return;
  MATRIZ.forEach(row => {
    const tr = el('tr');
    tr.appendChild(el('td', { html: '<b>' + row.codigo + '</b> · ' + row.nome }));
    tr.appendChild(el('td', { text: row.fase }));
    tr.appendChild(el('td', { text: row.intensidade }));
    const obsTd = el('td');
    const isFlag = row.observacao.indexOf('conversar com a gestão') !== -1;
    obsTd.appendChild(el('span', { class: isFlag ? 'badge-flag' : 'badge-definir', text: isFlag ? row.observacao : 'A DEFINIR' }));
    if (!isFlag) {
      obsTd.appendChild(el('div', { html: row.observacao, attrs: { style: 'margin-top:6px;font-size:.78rem;color:var(--ink-faint)' } }));
    }
    tr.appendChild(obsTd);
    body.appendChild(tr);
  });
}

/* ---------- Casos reais ---------- */
const STATUS_LABEL = { cancelado: 'Cancelado', andamento: 'Em andamento', disputa: 'Disputa pós-cancelamento' };
const STATUS_CLASS = { cancelado: 'status-cancelado', andamento: 'status-andamento', disputa: 'status-disputa' };

function renderCasos() {
  const grid = document.getElementById('casosGrid');
  if (!grid) return;
  CASOS.forEach(c => {
    const card = el('div', { class: 'card caso-card', attrs: { id: 'caso-' + c.id, 'data-search': (c.nome + ' ' + c.categoria + ' ' + c.motivo).toLowerCase() } });
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
      const h4 = el('h4', { text: 'Liberações usadas' });
      const chipRow = el('div', { class: 'caso-rcodes' });
      c.rcodes.forEach(rid => {
        const r = RSTEPS.find(x => x.id === rid);
        const chip = el('button', { class: 'rcode-chip', text: r.codigo, attrs: { type: 'button', 'data-jump': 'step-' + rid } });
        chipRow.appendChild(chip);
      });
      card.appendChild(h4);
      card.appendChild(chipRow);
    }

    card.appendChild(el('div', { class: 'caso-tatica', html: '<b>Leitura tática:</b> ' + c.tatica }));
    grid.appendChild(card);
  });

  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-jump]');
    if (!btn) return;
    jumpToAndHighlight(btn.getAttribute('data-jump'));
  });
}

function jumpToAndHighlight(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  target.classList.add('highlight');
  setTimeout(() => target.classList.remove('highlight'), 2200);
}

/* ---------- Scripts de atendimento ---------- */
const SCRIPTS = [
  {
    id: 'primeiro-contato', titulo: 'Primeiro contato', tom: 'Acolhedor + investigativo + comercial',
    texto: 'Entendi. Antes de seguirmos com o processo de cancelamento, queria entender um pouco melhor o que levou vocês a essa decisão. Dependendo do motivo, talvez exista alguma alternativa que possamos analisar juntos antes de encerrarmos o contrato.'
  },
  {
    id: 'financeiro-script', titulo: 'Cliente diz que o motivo é financeiro', tom: 'Consultivo',
    texto: 'Imagino que essa decisão não seja fácil depois de todo o planejamento até aqui. Antes de pensarmos em cancelar, me conta: a dificuldade está mais no valor das parcelas ou no valor total do contrato? Dependendo da resposta, talvez consigamos reorganizar as condições de pagamento sem precisar chegar ao cancelamento.'
  },
  {
    id: 'concorrencia-script', titulo: 'Cliente diz que encontrou outro local', tom: 'Comparativo, sem atacar o concorrente',
    texto: 'Que bom que vocês estão pesquisando com cuidado, isso mostra o quanto esse dia é importante. Pode me contar o que mais chamou atenção na outra proposta? Assim consigo te mostrar com clareza o que está incluso aqui e o que normalmente pega os casais de surpresa em propostas mais baratas.'
  },
  {
    id: 'reducao-script', titulo: 'Cliente quer reduzir o evento', tom: 'Adequação de projeto',
    texto: 'Faz total sentido ajustar o evento para o novo número de convidados. Antes de pensarmos em cancelar, deixa eu entender quantas pessoas vocês estão projetando agora — muito provavelmente conseguimos adequar o contrato ao novo tamanho, sem precisar encerrar tudo.'
  },
  {
    id: 'insatisfacao-script', titulo: 'Cliente está insatisfeito', tom: 'Escuta antes de qualquer argumento comercial',
    texto: 'Sinto muito que isso tenha acontecido, e quero entender exatamente o que houve para conseguir resolver da forma certa. Pode me contar com calma o que aconteceu? Antes de falar em cancelamento, quero ver o que está ao meu alcance para reparar isso com vocês.'
  },
  {
    id: 'nao-negociar-script', titulo: 'Cliente não quer negociar', tom: 'Respeitoso, sem insistência excessiva',
    texto: 'Entendo perfeitamente, e respeito totalmente a decisão de vocês. Vou te explicar com clareza como funciona o processo de cancelamento a partir daqui, e fico à disposição para qualquer dúvida durante o caminho.'
  }
];

function renderScripts() {
  const list = document.getElementById('scriptsList');
  if (!list) return;
  SCRIPTS.forEach(s => {
    const card = el('div', { class: 'card script-card', attrs: { id: 'script-' + s.id, 'data-search': (s.titulo + ' ' + s.texto).toLowerCase() } });
    card.appendChild(el('h3', { text: s.titulo }));
    card.appendChild(el('div', { class: 's-tom', text: 'Tom: ' + s.tom }));
    card.appendChild(el('div', { class: 'whats-bubble', text: s.texto }));
    list.appendChild(card);
  });
}

/* ---------- Árvore de decisão ---------- */
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

function initArvore() {
  const root = document.getElementById('arvoreRoot');
  if (!root) return;
  renderArvoreStep1();
}

function renderArvoreStep1() {
  const root = document.getElementById('arvoreRoot');
  root.innerHTML = '';
  root.appendChild(el('div', { class: 'arvore-pergunta', text: 'Por que o cliente quer cancelar?' }));
  const opcoes = el('div', { class: 'arvore-opcoes' });
  const labels = { financeiro: 'Financeiro', data: 'Data', insatisfacao: 'Insatisfação', concorrencia: 'Concorrência', reducao: 'Redução do evento', pessoal: 'Motivo pessoal', outro: 'Outro' };
  Object.entries(labels).forEach(([key, label]) => {
    const btn = el('button', { text: label, attrs: { type: 'button' } });
    btn.addEventListener('click', () => renderArvoreStep2(key, btn));
    opcoes.appendChild(btn);
  });
  root.appendChild(opcoes);
  root.appendChild(el('div', { class: 'arvore-resultado', attrs: { id: 'arvoreResultado' } }));
}

function renderArvoreStep2(key, chosenBtn) {
  chosenBtn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('chosen'));
  chosenBtn.classList.add('chosen');
  const node = ARVORE[key];
  const resultado = document.getElementById('arvoreResultado');
  resultado.className = 'arvore-resultado show';
  resultado.innerHTML = '';
  resultado.appendChild(el('div', { class: 'arvore-pergunta', text: node.pergunta, attrs: { style: 'font-size:1rem;margin-bottom:10px' } }));
  const opcoes = el('div', { class: 'arvore-opcoes' });
  Object.entries(node.opcoes).forEach(([label, resultObj]) => {
    const btn = el('button', { text: label, attrs: { type: 'button' } });
    btn.addEventListener('click', () => {
      opcoes.querySelectorAll('button').forEach(b => b.classList.remove('chosen'));
      btn.classList.add('chosen');
      let final = document.getElementById('arvoreFinal');
      if (!final) {
        final = el('div', { attrs: { id: 'arvoreFinal', style: 'margin-top:12px' } });
        resultado.appendChild(final);
      }
      final.innerHTML = '<p><strong>Próxima ação recomendada:</strong> ' + resultObj.texto + '</p>';
      if (resultObj.rcodes.length) {
        const chipRow = el('div', { class: 'caso-rcodes' });
        resultObj.rcodes.forEach(rid => {
          const r = RSTEPS.find(x => x.id === rid);
          const chip = el('button', { class: 'rcode-chip', text: r.codigo, attrs: { type: 'button', 'data-jump': 'step-' + rid } });
          chip.addEventListener('click', () => jumpToAndHighlight('step-' + rid));
          chipRow.appendChild(chip);
        });
        final.appendChild(chipRow);
      }
    });
    opcoes.appendChild(btn);
  });
  resultado.appendChild(opcoes);
  const restart = el('button', { class: 'arvore-restart', text: '↺ Recomeçar diagnóstico' });
  restart.addEventListener('click', renderArvoreStep1);
  resultado.appendChild(restart);
}

/* ---------- Indicadores (demonstrativos) ---------- */
const INDICADORES_DEMO = [
  { label: 'Financeiro', valor: 38 },
  { label: 'Insatisfação com atendimento', valor: 19 },
  { label: 'Mudança de planos', valor: 14 },
  { label: 'Redução de convidados', valor: 9 },
  { label: 'Problemas familiares/pessoais', valor: 8 },
  { label: 'Concorrência', valor: 6 },
  { label: 'Outros', valor: 6 }
];

function renderIndicadores() {
  const wrap = document.getElementById('indicDemo');
  if (!wrap) return;
  const max = Math.max(...INDICADORES_DEMO.map(d => d.valor));
  INDICADORES_DEMO.forEach(d => {
    wrap.appendChild(el('div', { class: 'bar-row' }, [
      el('div', { class: 'bar-label', text: d.label }),
      el('div', { class: 'bar-track' }, [el('div', { class: 'bar-fill', attrs: { style: 'width:' + (d.valor / max * 100) + '%' } })]),
      el('div', { class: 'bar-value', text: d.valor + '%' })
    ]));
  });
}

/* ==========================================================================
   NAVEGAÇÃO, SCROLLSPY, MENU MOBILE, BUSCA, BACK TO TOP
   ========================================================================== */
function initNav() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('sideNav');
  const overlay = document.getElementById('navOverlay');

  function closeNav() { nav.classList.remove('open'); overlay.classList.remove('show'); }
  if (toggle) toggle.addEventListener('click', () => { nav.classList.toggle('open'); overlay.classList.toggle('show'); });
  if (overlay) overlay.addEventListener('click', closeNav);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

  const links = Array.from(nav.querySelectorAll('a'));
  const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = '#' + entry.target.id;
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === id));
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));
}

function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 500);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function initSearch() {
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  if (!input || !results) return;

  function buildIndex() {
    const nodes = document.querySelectorAll('[data-search]');
    return Array.from(nodes).map(n => ({
      id: n.id,
      text: n.getAttribute('data-search'),
      title: n.querySelector('.m-title, h3, .caso-nome, .r-code')?.textContent || n.id,
      section: n.closest('section')?.id || ''
    }));
  }

  const SECTION_LABEL = {
    motivos: 'Motivo de cancelamento', escada: 'Etapa de retenção', casos: 'Caso real', scripts: 'Script de atendimento'
  };

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { results.hidden = true; results.innerHTML = ''; return; }
    const index = buildIndex();
    const matches = index.filter(item => item.text.includes(q)).slice(0, 12);
    results.innerHTML = '';
    if (!matches.length) {
      results.appendChild(el('div', { class: 'sr-empty', text: 'Nenhum resultado para "' + input.value + '".' }));
    } else {
      matches.forEach(m => {
        const a = el('a', { attrs: { href: '#' + m.id } }, [
          el('div', { class: 'sr-tag', text: SECTION_LABEL[m.section] || m.section }),
          el('div', { class: 'sr-title', text: m.title })
        ]);
        a.addEventListener('click', (ev) => {
          ev.preventDefault();
          results.hidden = true;
          input.value = '';
          jumpToAndHighlight(m.id);
        });
        results.appendChild(a);
      });
    }
    results.hidden = false;
  });

  document.addEventListener('click', (e) => {
    if (!results.contains(e.target) && e.target !== input) results.hidden = true;
  });
}
