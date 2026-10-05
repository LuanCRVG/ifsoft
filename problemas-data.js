// Edite esta lista e publique o arquivo no GitHub para atualizar os problemas.
window.IFSOFT_PROBLEMAS = [
  {
    id: "PRB-20261005-001",
    titulo: "Devolução de NF-e com as tags da reforma",
    modulo: "NF-e",
    versao: "",
    status: "analise",
    prioridade: "urgente",
    ambiente: "nao-aplica",
    responsavel: "",
    dataRelato: "2026-10-05",
    prazo: "",
    problemaRelatado: "Devolução de NF-e Reforma Tributária.",
    parecerTecnico: "Quando o campo \"Reforma Tributária\" está marcado na configuração da NF-e, o sistema exige o preenchimento dos campos da reforma em toda NF-e, inclusive nas devoluções cuja nota original não possui esses campos.",
    solucao: "Com a opção de Reforma Tributária marcada, o sistema deve consultar o XML da NF-e original e utilizar os campos da reforma presentes nele no preenchimento da devolução, seguindo uma lógica semelhante à utilizada para ICMS, IPI e demais tributos. Se o XML original não contiver esses campos, o sistema deve ignorá-los; se contiver, deve utilizar os dados originais na devolução.\n\nCenário futuro considerado no relato: quando todas as NF-e forem obrigadas a destacar as tags da reforma, esse preenchimento deixará de ser opcional. A expectativa é que as notas originais passem a conter esses campos e que o sistema continue utilizando o conteúdo do XML original na devolução.",
    passosReproducao: "",
    criadoEm: "2026-10-05T15:03:29.000Z",
    atualizadoEm: "2026-10-05T15:03:29.000Z"
  }
];
