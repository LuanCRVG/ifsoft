// Edite somente o conteúdo abaixo para manter os três assuntos do quadro.
// status: "verificar" | "adequacao" | "concluido". O prazo não altera esse status.
window.LP_PRIORIDADES = [
  {
    id: "rio-ibscbs",
    titulo: "IBS/CBS nas NFS-e do Rio",
    destaque: "Atualizar agora",
    cor: "urgente",
    icone: "circle-alert",
    status: "verificar",
    contexto: "Regime normal · Serviço 14.01.01",
    resumo: "Atualizar e configurar os clientes para enviar IBS/CBS.",
    notaCurta: "Simples Nacional: orientação separada.",
    datasCard: [],
    revisadoEm: "2026-10-26",
    quem: "Clientes do município do Rio de Janeiro que emitem pelo padrão nacional, no regime normal, para a prestação comum do serviço 14.01.01. Clientes do Simples Nacional devem ser tratados separadamente.",
    acoes: [
      "Atualizar e configurar os clientes do Rio de Janeiro que ainda não enviam IBS/CBS. A ausência dessas informações ocorre porque a atualização/configuração ainda não foi realizada nesses clientes.",
      "Revisar enquadramento, classificação, base e valores com a contabilidade; comparar o XML enviado com o XML autorizado. A emissão de Duque de Caxias pode servir de referência técnica, sem presumir tributação idêntica.",
      "Habilitar o envio das informações devidas no leiaute atualmente aceito em produção. A mudança de leiaute de dezembro é uma entrega separada."
    ],
    prazos: [
      { rotulo: "Marco do cenário informado", data: "2026-10-01", detalhe: "Prestação comum do subitem 14.01, no regime normal, fora das exceções do comunicado oficial." }
    ],
    observacaoPrazo: "O sistema nacional pode autorizar a NFS-e sem IBS/CBS até 31/12/2026. Isso não comprova dispensa do preenchimento quando já devido. Regularização de notas anteriores deve seguir a orientação fiscal aplicável.",
    complemento: {
      titulo: "E os clientes do Simples Nacional?",
      texto: "Não aplicar automaticamente a configuração do regime normal. Preparar o tratamento de 2027 conforme a opção de recolhimento dentro do Simples ou pelo regime regular e as especificações aplicáveis. A atualização do leiaute não significa que todos devem destacar os mesmos campos."
    },
    conclusao: "Confirmar que os clientes abrangidos foram atualizados e configurados, validando uma emissão com as informações e os cálculos de IBS/CBS corretos no XML autorizado.",
    notas: [],
    fontes: [
      { titulo: "CGNFS-e — prazos para destaque de IBS/CBS", url: "https://www.gov.br/nfse/pt-br/noticias/cgnfs-e-orienta-sobre-os-prazos-para%20destaque-de-ibs-cbs-nas-notas-fiscais-de-servico/" },
      { titulo: "Ato Conjunto RFB/CGIBS 4/2026", url: "https://www.cgibs.gov.br/upload/arquivos/202607/31091735-20260730-16h30-ato-conjunto-rfb-cgibs-na-c2-ba-4-260731-090909.pdf" }
    ]
  },
  {
    id: "nfse-leiaute",
    titulo: "Novo leiaute da NFS-e",
    destaque: "Preparar",
    cor: "nfse",
    icone: "file-text",
    status: "verificar",
    contexto: "",
    resumo: "Preparar e testar emissão e leitura.",
    notaCurta: "",
    datasCard: [{ rotulo: "Produção", data: "2026-12-01" }],
    revisadoEm: "2026-10-26",
    quem: "Empresas que utilizam a NFS-e de padrão nacional nos cenários alcançados pela atualização, incluindo os clientes do Rio e de Duque de Caxias acompanhados pela equipe.",
    acoes: [
      "Preparar o sistema e o ACBrNFSeX para a primeira etapa da NT 009. Conferir a organização dos campos tributários e os ajustes de base quando utilizados.",
      "Testar emissão, leitura, consulta e cancelamento no ambiente de homologação, mantendo a emissão atual de produção funcionando.",
      "Conferir o suporte efetivamente disponibilizado pelo ACBr antes da distribuição. Atualizar somente os schemas não comprova que a geração do XML esteja preparada."
    ],
    prazos: [
      { rotulo: "Testes da primeira etapa", data: "2026-10-20", detalhe: "Release 1 disponível em produção restrita." },
      { rotulo: "Produção", data: "2026-12-01", detalhe: "Até 30/11/2026, a produção permanece no leiaute da NT 004 v2.0." }
    ],
    observacaoPrazo: "O comunicado trata de uma implantação gradual. Notas de ajuste e eventos específicos da RTC terão cronograma próprio, ainda a divulgar.",
    complemento: {
      titulo: "Leiaute e tributação são decisões diferentes",
      texto: "A atualização deve respeitar o ambiente e o contrato aceito pelo serviço nacional. O preenchimento de IBS/CBS depende também do regime e da operação de cada empresa; não deve ser ligado indiscriminadamente para todos os clientes."
    },
    conclusao: "Comprovar a emissão e a leitura no leiaute de testes e a continuidade da produção atual. Validar os cenários utilizados antes da mudança de produção.",
    notas: [{ id: "nt-se-cgnfse-009-v1-01", titulo: "NT 009 v1.01 — observações completas" }],
    fontes: [
      { titulo: "CGNFS-e — release 1 e cronograma da NT 009", url: "https://www.gov.br/nfse/pt-br/noticias/cgnfs-e-informa-disponibilizadas-no-ambiente-de-testes-o-release-1-das-evolucoes-da-nota-tecnica-009" },
      { titulo: "NFS-e — documentação de homologação", url: "https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/producao-restrita" }
    ]
  },
  {
    id: "nfe-leiaute",
    titulo: "Mudanças da NF-e",
    destaque: "Preparar",
    cor: "nfe",
    icone: "settings",
    status: "verificar",
    contexto: "",
    resumo: "XML e DANFE têm entregas diferentes.",
    notaCurta: "",
    datasCard: [
      { rotulo: "XML · NT 2026.008", data: "2026-11-16" },
      { rotulo: "DANFE · NF-e", data: "2026-12-01" }
    ],
    revisadoEm: "2026-10-26",
    quem: "NF-e e NFC-e nas alterações de XML da NT 2026.008; NF-e modelo 55 na atualização de impressão/PDF do DANFE. São duas entregas distintas.",
    acoes: [
      "XML: preparar os novos valores líquidos e a totalização nas operações em que forem utilizados, respeitando precisão e regras condicionais. A disponibilização do leiaute não exige todos os campos novos em toda nota.",
      "DANFE: atualizar o relatório utilizado pelo sistema e conferir os campos IBS/CBS/IS na impressão e no PDF, a partir do XML autorizado.",
      "Preservar o preenchimento de IBS/CBS já realizado pelos clientes do regime normal. Tratar o Simples Nacional separadamente, conforme suas regras e a opção tributária aplicável."
    ],
    prazos: [
      { rotulo: "Homologação do XML", data: "2026-10-26", detalhe: "Alterações gerais da NT 2026.008, conforme adiamento oficial." },
      { rotulo: "Produção do XML", data: "2026-11-16", detalhe: "Não transforma campos opcionais ou regras futuras em obrigação universal." },
      { rotulo: "Novo DANFE", data: "2026-12-01", detalhe: "NT 2026.010: leiaute do documento auxiliar da NF-e modelo 55." }
    ],
    observacaoPrazo: "A exigência específica NB01-30, relativa a pagamento antecipado nas condições da NT 2026.008, tem homologação em 01/02/2027 e produção em 01/03/2027. Não antecipar essa regra para novembro.",
    complemento: {
      titulo: "Como agrupar a atualização",
      texto: "Uma versão preparada pode reunir as duas entregas já testadas, com seleção por empresa, operação e ambiente. O relatório novo não substitui a adequação do XML, e o componente atualizado não define os dados e cálculos de cada cliente."
    },
    conclusao: "Validar os cenários de XML utilizados e comparar o DANFE/PDF com o XML autorizado. Confirmar o suporte da revisão e do motor de relatório efetivamente usados.",
    notas: [
      { id: "nt-2026-008-v1-00", titulo: "NT 2026.008 — XML e valores líquidos" },
      { id: "nt-2026-010-v1-00", titulo: "NT 2026.010 — novo DANFE" }
    ],
    fontes: [
      { titulo: "ENCAT/SVRS — adiamento para 26/10 e 16/11", url: "https://dfe-portal.svrs.rs.gov.br/DFE/Avisos/3008" },
      { titulo: "NT 2026.008 v1.00 — PDF", url: "documentos/nt-2026-008-v1.00-rtc-valor-liquido-produto.pdf" },
      { titulo: "NT 2026.010 v1.00 — PDF", url: "documentos/nt-2026-010-v1.00-danfe-rtc.pdf" }
    ]
  }
];
