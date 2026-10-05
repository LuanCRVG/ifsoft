const PRAZO_URGENTE_DIAS = 30;
const DOCUMENTOS_FISCAIS = ["NF-e", "NFC-e", "NFS-e", "MDF-e"];

const notasTecnicas = [
  {
    id: "nt-2026-010-v1-00",
    descricao: "NT 2026.010 v1.00 - DANFE Reforma Tributária",
    resumo: "Novo leiaute do DANFE com os campos de IBS, CBS e IS. Revisar impressão, PDF e campos opcionais.",
    tipo: "Nota técnica · NF-e modelo 55",
    documento: "NF-e",
    uf: "Todos",
    observacoes: [
      "Adequar a impressão e o PDF do DANFE da NF-e (modelo 55) ao leiaute da Reforma Tributária, com produção em 01/12/2026.",
      "Cronograma: a NT não informa data para testes/homologação. Prioridade urgente definida pela IFSOFT para antecipar a implementação.",
      "Emitente: imprimir o CRT (C21). Reservar o campo de regime de apuração IBS/CBS, sem preenchê-lo até a publicação da tag/ID em NT futura.",
      "Itens: incluir cClassTrib (UB14), base IBS/CBS vBC (UB16), alíquotas e valores de IBS UF, IBS Município e CBS, além do IS. Para a base do IS, usar vBCIS (UB05), conforme o PDF.",
      "Alíquotas: se gRed estiver informado, inclusive nas hipóteses de compra governamental, imprimir pAliqEfet de IBS UF (UB28), IBS Município (UB47) e CBS (UB66). Sem gRed, usar pIBSUF, pIBSMun e pCBS. O IS permanece com pIS (UB06).",
      "Totais: acrescentar o bloco Total do IBS/CBS/IS após Total do ICMS/IPI, incluindo valores de CBS, IBS UF/município, IS e monofásicos/retenções quando aplicáveis.",
      "Campos facultativos: respeitar a existência e a aplicabilidade dos dados no XML. Não inventar informações para canhoto, duplicatas, FCP/DIFAL, monofásicos, ISSQN ou transporte.",
      "QR Code: a NT prevê espaço no DANFE, mas a extensão para retrato/paisagem e as regras de formação/validação do Grupo ZX dependem de alteração específica em outra NT. Exibir conforme os dados e regras aplicáveis.",
      "Validação recomendada: conferir impressão e PDF em A4, com retrato como referência principal e paisagem como alternativa; testar muitos itens, textos longos e dados opcionais ausentes.",
      "ACBr: o tópico de 01/10/2026 informa a criação da tarefa ACBR-9948 para implementar o novo DANFE. Acompanhar a conclusão e a versão do componente/relatório utilizada; a postagem não confirma entrega pronta."
    ],
    link: "documentos/nt-2026-010-v1.00-danfe-rtc.pdf",
    linkAcbr: "https://www.projetoacbr.com.br/forum/topic/95131-publicado-leiaute-do-danfe-com-os-campos-da-reforma-tribut%C3%A1ria/",
    vigente: true,
    urgente: true,
    dataAnalise: "2026-10-01",
    prazoHomologacao: "",
    prazoProducao: "2026-12-01"
  },
  {
    id: "nt-2026-008-v1-00",
    descricao: "NT 2026.008 v1.00 - Valor Líquido do Produto",
    resumo: "Novos campos de valor líquido na NF-e/NFC-e, com atenção à totalização e ao pagamento antecipado.",
    tipo: "Nota técnica · NF-e/NFC-e modelos 55/65",
    documento: ["NF-e", "NFC-e"],
    uf: "Todos",
    observacoes: [
      "Adequar o XML e a valorização de NF-e/NFC-e aos novos campos de valor líquido. Alterações gerais: homologação em 05/10/2026 e produção em 03/11/2026.",
      "Novos campos: vUnComLiq (I11b), vProdLiq (I11c), vICMSPrevisto no grupo ICMSPrevistoPagtoAntecip (NB01/NB02) e vProdLiqTot (W01a). Preservar a precisão de até 10 casas decimais do valor unitário líquido.",
      "Validações: em nota normal, vProdLiq deve corresponder a vUnComLiq × qCom, com tolerância de ±0,01 (I11c-20/1279). Se um item informar vProdLiq, informar vProdLiqTot e conferir a soma dos itens (W01a-10/1282 e W01a-20/1283).",
      "Obrigatoriedade futura: a sequência dos valores líquidos e a regra I11c-10 (rejeição 1278, ausência de vProdLiq) estão sinalizadas como implementação futura. Distinguir essa obrigatoriedade das validações dos campos já informados.",
      "Totais e transição: revisar vProd, vItem e vNFTot para evitar duplicar IBS/CBS/IS. O leiaute indica esses tributos em vProd a partir de 2027, exceto nas importações; as regras VB01-10/20 permanecem sinalizadas como implementação futura.",
      "Pagamento antecipado: o grupo ICMSPrevistoPagtoAntecip é restrito à NF-e modelo 55 com tpNFDebito=06 ou tpOperGov=4. É indevido na NFC-e e fora dessas hipóteses (NB01-10/20, rejeição 1280). Informar vICMSPrevisto=0 quando não houver ICMS devido no fornecimento futuro.",
      "Prazo específico NB01-30: a exigência do grupo de ICMS previsto nas hipóteses de pagamento antecipado tem homologação em 01/02/2027 e produção em 01/03/2027. A rejeição correta no PDF é 1281; o resumo do ACBr apresenta 1280 para essa regra.",
      "Regras alteradas/removidas: revisar a exceção de B25-80 para pagamento antecipado e retirar a validação UB16-10 (rejeição 1104), conforme a NT. A remoção da regra não substitui a definição correta da base dos tributos.",
      "ACBr: a postagem de 01/10/2026 informa a tarefa ACBr-9950 para adequação das soluções. Acompanhar a entrega e os schemas/componentes usados pelo sistema; a publicação não confirma implementação concluída.",
      "Testes recomendados: valores unitários com alta precisão, limites da tolerância de 0,01, total líquido com vários itens, NFC-e sem grupo NB e NF-e de pagamento antecipado com ICMS previsto positivo ou zero."
    ],
    link: "documentos/nt-2026-008-v1.00-rtc-valor-liquido-produto.pdf",
    linkAcbr: "https://www.projetoacbr.com.br/forum/topic/95140-publicada-nota-t%C3%A9cnica-criando-novos-campos-de-valoriza%C3%A7%C3%A3o-para-maior-transpar%C3%AAncia-na-nota-fiscal/",
    vigente: true,
    urgente: false,
    dataAnalise: "2026-10-01",
    prazoHomologacao: "2026-10-05",
    prazoProducao: "2026-11-03"
  },
  {
    id: "nt-conjunta-2025-001-v1-00",
    descricao: "NT Conjunta 2025.001 v1.00 - CNPJ Alfanumérico",
    resumo: "CNPJ passa a aceitar letras. Revisar cadastros, XML, chaves de acesso, validações e documentos auxiliares.",
    tipo: "Nota técnica conjunta · CNPJ Alfa",
    documento: ["NF-e", "NFC-e", "MDF-e"],
    uf: "Todos",
    observacoes: [
      "URGENTE: produção prevista no PDF em 06/07/2026, com prazo já vencido. Prioridade manual solicitada pela IFSOFT; revisar a adequação de cadastros, XML, chaves de acesso e impressão imediatamente.",
      "Cronograma da NT enviada: homologação em 06/04/2026 e produção em 06/07/2026. São os prazos registrados nesta nota; não confundir com a implantação dos sistemas da Receita Federal em 27/07/2026 e o primeiro CNPJ alfanumérico em 31/07/2026.",
      "Escopo: entre os documentos da IFSOFT, esta NT conjunta abrange NF-e, NFC-e e MDF-e. NFS-e não consta do escopo; verificar as regras do padrão nacional ou do provedor municipal, sem atribuir automaticamente os prazos desta NT à NFS-e.",
      "Cadastros e banco de dados: manter CNPJ como texto de 14 posições, com letras maiúsculas e números nas primeiras 12 e dois DVs numéricos no final. Preservar zeros à esquerda; remover apenas a máscara, nunca as letras. Revisar clientes, fornecedores, emitentes, APIs, importações e integrações.",
      "Schemas e validações: adequar todos os campos CNPJ, eventos e serviços ao padrão [A-Z0-9]{12}[0-9]{2}. Para NF-e/NFC-e, conferir também a NT 2026.004 v1.01 e os schemas complementares; esse complemento indica homologação em 15/06/2026. Apenas aceitar no XSD não comprova validação/autorização correta.",
      "Dígitos verificadores do CNPJ: manter módulo 11, convertendo cada caractere por ASCII menos 48 (A=17, B=18 etc.). Garantir compatibilidade com CNPJs numéricos existentes, que continuam válidos e não devem ser renumerados.",
      "Chave de acesso: continua com 44 posições; o trecho do CNPJ admite letras nas primeiras 12 posições. Revisar geração, armazenamento, consultas e referências. No DV, aplicar ASCII menos 48 por caractere nos 43 caracteres sem o DV, conforme o Anexo II, sem expandir letras em vários dígitos.",
      "Eventos e serviços: conferir autorização, cancelamento, inutilização quando aplicável, distribuição, consultas, documentos referenciados e controle de duplicidade pela chave natural (UF, CNPJ, série e número). Validadores antigos que aceitam apenas números podem impedir emissão ou recepção.",
      "Código de barras: adaptar documentos auxiliares à combinação CODE-128C/CODE-128A e testar a leitura da chave alfanumérica completa. O PDF tem divergências: o texto cita código 100, mas a tabela usa CODE A=101, CODE C=99 e START C=105; não copiar esses trechos contraditórios sem conferir a biblioteca e as especificações vigentes.",
      "Impressão e PDF: validar dimensões, margens de silêncio e leitura por scanner. A NT menciona largura mínima de 11,5 cm e altura de 0,8 cm; a combinação alfanumérica aumenta a quantidade de barras e não pode ser comprimida a ponto de perder legibilidade.",
      "Letras vedadas: a v1.00 menciona I, O, U, Q e F como uma solicitação ainda a confirmar. Não transformar essa observação provisória em bloqueio definitivo sem consultar a definição oficial vigente; a restrição, se confirmada, também afeta a chave de acesso.",
      "Testes recomendados: CNPJ numérico antigo e alfanumérico válido, zeros à esquerda, DVs incorretos, máscara e normalização de letras, emitente/destinatário distintos, chaves referenciadas, emissão e recepção de XML, eventos e leitura do código de barras. O exemplo didático do PDF é 12.ABC.345/01DE-35."
    ],
    link: "documentos/nt-2025-001-v1.00-cnpj-alfanumerico.pdf",
    linkAcbr: "",
    vigente: true,
    urgente: true,
    dataAnalise: "2026-10-02",
    prazoHomologacao: "2026-04-06",
    prazoProducao: "2026-07-06"
  },
  {
    id: "nt-se-cgnfse-009-v1-01",
    descricao: "NT SE/CGNFS-e 009 v1.01 - NFS-e Padrão Nacional / RTC",
    resumo: "Atualização do leiaute da NFS-e nacional para a RTC; cronograma de implantação ainda não informado.",
    tipo: "Nota técnica · NFS-e padrão nacional",
    documento: "NFS-e",
    uf: "Todos",
    observacoes: [
      "Cronograma ainda não publicado: a NT não informa datas de homologação ou produção. Os prazos serão divulgados no portal da NFS-e. Cadastro sem urgência, conforme definição da IFSOFT.",
      "Escopo: atualização do leiaute da NFS-e de padrão nacional e da DPS para a Reforma Tributária do Consumo. A identificação segue a capa e o conteúdo da NT 009 v1.01; não confundir com a NT 010 da NFS-e Via.",
      "CST/cClassTrib: os campos passam para IBSCBS/valores/trib, antes de gIBSCBS. O detalhamento tributário, inclusive vBC na NFS-e, depende do indicador ind_gIBSCBS da tabela CST/cClassTrib. Não preencher esses dados quando o indicador não exigir; a NT destaca CST 400, 410 e 820.",
      "Estrutura do XML: indDest e o grupo dest passam para a raiz infDPS, após toma. Revisar a ordem dos elementos e os mapeamentos de emissão e leitura; indFinal é reinserido para identificar uso ou consumo pessoal.",
      "CNPJ alfanumérico: todos os campos CNPJ passam de numérico para caractere. Preservar letras e zeros à esquerda em cadastros, XML, integrações e validações; não converter CNPJ para número.",
      "Ajustes de base: vDedRed e gReeRepRes são unificados em vAjusteBC. Revisar os tipos de ajuste, os documentos referenciados e os campos calculados vCalcAjusteBCISSQN, vCalcAjusteBCIBSCBS e vCalcAjusteBCLocImoveis, evitando deduções duplicadas e respeitando a repercussão por tributo no Anexo VI.",
      "Notas de ajuste: conferir finNFSe (0 regular, 1 crédito, 2 débito), tpNFSeCredito/tpNFSeDebito e gIBSCBSAjuste. Usar a planilha NFS-e_AJUSTE_LEIAUTE; regras tachadas ainda estão em evolução e não devem ser tratadas como validações definitivas.",
      "Simples Nacional: incluir opSimpNac=4 (optante pendente), regApIBSCBSSN e cAtvSN. Conferir as condições recíprocas de cAtvSN, vReceitaBrutaSN, gTribSN e a segregação de receita interna/externa pelo indicador tpRBSN da classificação tributária.",
      "Endereços e ISSQN: validar o município IBGE do tomador/adquirente e do destinatário contra os cadastros CPF/CNPJ. Para o subitem 17.05, observar a exceção do destinatário com a mesma raiz CNPJ ou o mesmo CPF, inclusive a alteração de endereço admitida pela NT; fora dessas hipóteses, considerar o tomador.",
      "Comércio exterior: acrescentar nFatura, vFatura e nContCambio, renomear nDI/nRE para nDUIMP/nDUE e validar tpMoeda pela tabela do Banco Central. O fim do domínio Desconhecido no compartilhamento municipal ao ADN em 01/01/2027 é uma regra específica, não o prazo geral de implantação desta NT.",
      "Ajuste no comércio exterior: vAjusteBCIBSCBSComExt admite valor positivo ou negativo e altera apenas a base IBS/CBS, sem alterar vServ. Atualizar a fórmula de vBC e respeitar a transição prevista para dedução de PIS/COFINS até 2026.",
      "Eventos e imóveis: conferir cMun em atvEvento nos subitens 12.13 e 17.10, com o grupo obrigatório para 17.10. Revisar gLocacao, gUnidImob e copropriedade; gLocBensMoveis passa a bensMoveis, com até 1.000 registros.",
      "Condomínios: novo código 99.05.01, grupo condominios com cobranças/descontos e exigência do grupo imovel. Conferir a composição de vServ, vDescIncond e vDescCond; a NT prevê essas operações nos emissores públicos nacionais.",
      "Pagamentos e calculadora: gPgtoVinc permite vincular até 99 transações conhecidas na emissão. verCalcIBSCBS é gerado pela Sefin Nacional (ambGer=2), não é campo a ser exigido de notas municipais próprias posteriormente compartilhadas com o ADN.",
      "Anexos: na consulta de 05/10/2026, o portal oficial lista Anexo VI v1.04.01 e Anexo VII v1.03.00. O PDF e o resumo do ACBr citam Anexo VII v1.02.01; conferir os arquivos oficiais atualizados antes de implementar. Portal: https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/rtc .",
      "ACBr: o tópico informa a criação da tarefa ACBr-9969 para adequar o ACBrNFSeX. Acompanhar a entrega, os schemas e a versão do componente; a criação da tarefa não confirma implementação concluída."
    ],
    link: "documentos/nt-009-v1.01-nfse-nacional-rtc.pdf",
    linkAcbr: "https://www.projetoacbr.com.br/forum/topic/95165-publicada-nota-t%C3%A9cnica-atualizando-o-leiaute-da-nfs-e-no-padr%C3%A3o-nacional/",
    vigente: true,
    urgente: false,
    dataAnalise: "2026-10-05",
    prazoHomologacao: "",
    prazoProducao: ""
  }
];

const state = {
  busca: "",
  documento: "todos",
  vigente: "todos",
  urgencia: "todos",
  ordenacao: "analise-desc"
};

const elements = {
  searchInput: document.querySelector("#search-input"),
  documentFilter: document.querySelector("#document-filter"),
  vigenteFilter: document.querySelector("#vigente-filter"),
  urgenciaFilter: document.querySelector("#urgencia-filter"),
  totalFilter: document.querySelector("#total-filter"),
  vigentesFilter: document.querySelector("#vigentes-filter"),
  urgentesFilter: document.querySelector("#urgentes-filter"),
  sortSelect: document.querySelector("#sort-select"),
  clearFilters: document.querySelector("#clear-filters"),
  tableBody: document.querySelector("#notes-table-body"),
  cards: document.querySelector("#notes-cards"),
  emptyState: document.querySelector("#empty-state"),
  resultSummary: document.querySelector("#result-summary"),
  totalCount: document.querySelector("#total-count"),
  vigenteCount: document.querySelector("#vigente-count"),
  urgenteCount: document.querySelector("#urgente-count"),
  visibleCount: document.querySelector("#visible-count"),
  activeView: document.querySelector("#active-view"),
  todayLabel: document.querySelector("#today-label"),
  emptyClear: document.querySelector("#empty-clear"),
  nextHomologacao: document.querySelector("#next-homologacao"),
  nextProducao: document.querySelector("#next-producao")
};

function getNoteDocuments(note) {
  return Array.isArray(note.documento) ? note.documento : [note.documento];
}

function normalizeText(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function formatDate(dateString) {
  if (!dateString) {
    return "--";
  }

  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

function toDate(dateString) {
  return new Date(`${dateString}T00:00:00`);
}

function getDaysUntil(dateString) {
  if (!dateString) return null;
  const target = toDate(dateString);
  if (Number.isNaN(target.getTime())) return null;
  const today = new Date();
  // Compare calendar days in UTC to avoid daylight-saving offsets.
  const targetDay = Date.UTC(target.getFullYear(), target.getMonth(), target.getDate());
  const todayDay = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((targetDay - todayDay) / 86400000);
}

function isUrgent(note) {
  if (note.urgente === true) return true;
  const days = getDaysUntil(note.prazoProducao);
  return note.vigente && days !== null && days >= 0 && days <= PRAZO_URGENTE_DIAS;
}

function compareDates(a, b, descending = false) {
  const first = a ? toDate(a).getTime() : NaN;
  const second = b ? toDate(b).getTime() : NaN;
  if (Number.isNaN(first)) return Number.isNaN(second) ? 0 : 1;
  if (Number.isNaN(second)) return -1;
  return descending ? second - first : first - second;
}

function getDeadlineStatus(dateString) {
  const diffDays = getDaysUntil(dateString);
  if (diffDays === null) {
    return { label: "Sem data", className: "badge-info" };
  }

  if (diffDays < 0) {
    return { label: "Vencido", className: "badge-danger" };
  }

  if (diffDays === 0) {
    return { label: "Hoje", className: "badge-warning" };
  }

  if (diffDays <= PRAZO_URGENTE_DIAS) {
    return { label: `Em ${diffDays} dia${diffDays === 1 ? "" : "s"}`, className: "badge-warning" };
  }

  return { label: "Programado", className: "badge-info" };
}

function createElement(tagName, className, text) {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (text !== undefined) {
    element.textContent = text;
  }

  return element;
}

function createIcon(name) {
  const icon = createElement("i");
  icon.setAttribute("data-lucide", name);
  icon.setAttribute("aria-hidden", "true");
  return icon;
}

function renderIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function createBadge(label, className, iconName) {
  const badge = createElement("span", `badge ${className}`);
  if (iconName) badge.appendChild(createIcon(iconName));
  badge.appendChild(createElement("span", "", label));
  return badge;
}

function createUrgencyBadge(note) {
  const urgent = isUrgent(note);
  const badge = createBadge(urgent ? "Urgente" : "Rotina", urgent ? "badge-danger" : "badge-neutral", urgent ? "alarm-clock" : null);
  if (urgent) {
    badge.title = note.urgente === true
      ? "Prioridade marcada manualmente pela equipe"
      : `Prazo de produção nos próximos ${PRAZO_URGENTE_DIAS} dias`;
  }
  return badge;
}

function getNoteId(note) {
  return note.id || note.descricao;
}

function getNoteSummary(note) {
  return note.resumo || note.observacoes[0] || "Nenhuma observação cadastrada.";
}

function createNoteTitleLink(note) {
  const link = createElement("a", "note-title-link");
  link.href = `nota.html?id=${encodeURIComponent(getNoteId(note))}`;
  link.setAttribute("aria-label", `${note.descricao}: ler observações completas`);
  const cue = createElement("span", "note-read-link");
  cue.append(createElement("span", "", "Leia aqui"), createIcon("arrow-right"));
  link.append(createElement("span", "note-title", note.descricao), cue);
  return link;
}

function bindNoteContainer(container, titleLink) {
  container.classList.toggle("note-clickable", true);
  container.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    if (event.target.closest("a, button, input, select, textarea, summary, [role='button'], [contenteditable]")) return;
    if (window.getSelection()?.toString()) return;
    titleLink.click();
  });
}

function createLink(note) {
  const sources = [
    { href: note.link, label: "Abrir NT", icon: "file-text" },
    { href: note.linkAcbr, label: "ACBr", icon: "external-link" }
  ].filter((source) => source.href);
  if (!sources.length) {
    return createElement("span", "link-muted", "Sem link");
  }

  const links = createElement("div", "document-links");
  sources.forEach((source) => {
    const link = createElement("a", "link-button");
    link.append(createIcon(source.icon), createElement("span", "", source.label));
    link.setAttribute("aria-label", `${source.label}: ${note.descricao}`);
    link.href = source.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    links.appendChild(link);
  });
  return links;
}

function createDeadline(dateString, production = false) {
  const status = getDeadlineStatus(dateString);
  const wrapper = createElement("div", production ? "deadline production-deadline" : "deadline");
  wrapper.appendChild(createElement("span", "date-text", formatDate(dateString)));
  wrapper.appendChild(createBadge(status.label, status.className));
  return wrapper;
}

function noteMatchesSearch(note) {
  const searchable = [
    note.descricao,
    getNoteSummary(note),
    getNoteDocuments(note).join("/"),
    note.uf,
    note.vigente ? "sim vigente" : "nao não",
    isUrgent(note) ? "urgente" : "rotina",
    formatDate(note.dataAnalise),
    formatDate(note.prazoHomologacao),
    formatDate(note.prazoProducao),
    ...note.observacoes
  ].join(" ");

  return normalizeText(searchable).includes(normalizeText(state.busca));
}

function getFilteredNotes() {
  return notasTecnicas
    .filter((note) => {
      const matchesDocument = state.documento === "todos" || getNoteDocuments(note).includes(state.documento);
      const matchesVigente =
        state.vigente === "todos" ||
        (state.vigente === "sim" && note.vigente) ||
        (state.vigente === "nao" && !note.vigente);
      const matchesUrgencia =
        state.urgencia === "todos" ||
        (state.urgencia === "urgentes" && isUrgent(note)) ||
        (state.urgencia === "rotina" && !isUrgent(note));

      return matchesDocument && matchesVigente && matchesUrgencia && noteMatchesSearch(note);
    })
    .sort((a, b) => {
      if (state.urgencia === "urgentes") {
        return compareDates(a.prazoProducao, b.prazoProducao) || a.descricao.localeCompare(b.descricao, "pt-BR");
      }
      if (state.ordenacao === "descricao-asc") {
        return a.descricao.localeCompare(b.descricao, "pt-BR");
      }

      if (state.ordenacao === "producao-asc") {
        return compareDates(a.prazoProducao, b.prazoProducao);
      }

      if (state.ordenacao === "homologacao-asc") {
        return compareDates(a.prazoHomologacao, b.prazoHomologacao);
      }

      return compareDates(a.dataAnalise, b.dataAnalise, true);
    });
}

function renderTable(notes) {
  elements.tableBody.replaceChildren();

  notes.forEach((note) => {
    const row = document.createElement("tr");
    row.classList.toggle("urgent-row", isUrgent(note));
    const cells = [
      createElement("td"),
      createElement("td"),
      createElement("td"),
      createElement("td"),
      createElement("td"),
      createElement("td"),
      createElement("td", "date-text", formatDate(note.dataAnalise)),
      createElement("td"),
      createElement("td")
    ];
    const titleLink = createNoteTitleLink(note);
    cells[0].appendChild(titleLink);
    cells[0].appendChild(createElement("span", "note-type", note.tipo || "Nota técnica / Informe técnico"));
    cells[1].append(...getNoteDocuments(note).map((documento) => createElement("span", "document-name", documento)), createElement("span", "document-uf", `UF: ${note.uf}`));
    cells[2].appendChild(createUrgencyBadge(note));
    cells[3].appendChild(createBadge(note.vigente ? "Sim" : "Não", note.vigente ? "badge-success" : "badge-neutral", note.vigente ? "circle-check" : null));
    cells[4].appendChild(createDeadline(note.prazoHomologacao));
    cells[5].appendChild(createDeadline(note.prazoProducao, true));
    cells[7].appendChild(createElement("p", "note-summary", getNoteSummary(note)));
    cells[8].appendChild(createLink(note));
    cells.forEach((cell) => row.appendChild(cell));
    bindNoteContainer(row, titleLink);
    elements.tableBody.appendChild(row);
  });
}

function addInfoItem(card, label, content) {
  const item = createElement("div", "info-item");
  item.appendChild(createElement("span", "", label));

  if (content instanceof HTMLElement) {
    item.appendChild(content);
  } else {
    item.appendChild(createElement("p", "", content));
  }

  card.appendChild(item);
}

function renderCards(notes) {
  elements.cards.replaceChildren();

  notes.forEach((note) => {
    const card = createElement("article", isUrgent(note) ? "note-card is-urgent" : "note-card");
    const title = createElement("h3");
    const titleLink = createNoteTitleLink(note);
    title.appendChild(titleLink);
    const topline = createElement("div", "card-topline");
    const meta = createElement("div", "card-meta");
    const infoGrid = createElement("div", "card-deadlines");
    topline.append(createElement("span", "card-document", `${getNoteDocuments(note).join("/")} · UF: ${note.uf}`), createUrgencyBadge(note));
    meta.appendChild(createBadge(note.vigente ? "Vigente" : "Não vigente", note.vigente ? "badge-success" : "badge-neutral"));
    card.appendChild(topline);
    card.appendChild(title);
    card.appendChild(meta);
    addInfoItem(infoGrid, "Prazo homologação", createDeadline(note.prazoHomologacao));
    addInfoItem(infoGrid, "Prazo produção", createDeadline(note.prazoProducao, true));
    card.appendChild(infoGrid);
    const observations = createElement("div", "card-observations");
    addInfoItem(observations, "Observação", createElement("p", "note-summary", getNoteSummary(note)));
    card.appendChild(observations);
    const bottom = createElement("div", "card-bottom");
    bottom.append(createElement("span", "card-analysis", `Analisada em ${formatDate(note.dataAnalise)}`), createLink(note));
    card.appendChild(bottom);
    bindNoteContainer(card, titleLink);
    elements.cards.appendChild(card);
  });
}

function getNextDate(notes, fieldName) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const futureDates = notes
    .map((note) => note[fieldName])
    .filter(Boolean)
    .map(toDate)
    .filter((date) => date >= today)
    .sort((a, b) => a - b);

  if (!futureDates.length) {
    return "--";
  }

  const next = futureDates[0];
  return next.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

function updateSummary(notes) {
  elements.totalCount.textContent = String(notasTecnicas.length);
  elements.vigenteCount.textContent = String(notasTecnicas.filter((note) => note.vigente).length);
  elements.urgenteCount.textContent = String(notasTecnicas.filter(isUrgent).length);
  elements.visibleCount.textContent = String(notes.length);
  const activeNotes = notasTecnicas.filter((note) => note.vigente);
  elements.nextHomologacao.textContent = getNextDate(activeNotes, "prazoHomologacao");
  elements.nextProducao.textContent = getNextDate(activeNotes, "prazoProducao");
  elements.resultSummary.textContent = `${notes.length} registro${notes.length === 1 ? "" : "s"} encontrado${notes.length === 1 ? "" : "s"}`;
  elements.emptyState.hidden = notes.length > 0;
  elements.todayLabel.textContent = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  const isUrgentView = state.urgencia === "urgentes";
  elements.activeView.textContent = isUrgentView ? "Urgentes · Produção: mais próxima primeiro" : state.vigente === "sim" ? "Notas vigentes" : "Todos os registros";
  elements.activeView.classList.toggle("is-urgent", isUrgentView);
  const activeButtons = [
    [elements.totalFilter, state.urgencia === "todos" && state.vigente === "todos" && state.documento === "todos" && !state.busca],
    [elements.vigentesFilter, state.vigente === "sim" && !isUrgentView],
    [elements.urgentesFilter, isUrgentView]
  ];
  activeButtons.forEach(([button, active]) => {
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  elements.sortSelect.disabled = isUrgentView;
}

function render() {
  const notes = getFilteredNotes();
  renderTable(notes);
  renderCards(notes);
  updateSummary(notes);
  renderIcons();
}

function resetFilters() {
  state.busca = "";
  state.documento = "todos";
  state.vigente = "todos";
  state.urgencia = "todos";
  state.ordenacao = "analise-desc";
  elements.searchInput.value = "";
  elements.documentFilter.value = "todos";
  elements.vigenteFilter.value = "todos";
  elements.urgenciaFilter.value = "todos";
  elements.sortSelect.value = "analise-desc";
}

function setupDocumentFilter() {
  DOCUMENTOS_FISCAIS.forEach((documento) => {
    const option = document.createElement("option");
    option.value = documento;
    option.textContent = documento;
    elements.documentFilter.appendChild(option);
  });
}

function bindEvents() {
  elements.searchInput.addEventListener("input", (event) => {
    state.busca = event.target.value;
    render();
  });

  elements.documentFilter.addEventListener("change", (event) => {
    state.documento = event.target.value;
    render();
  });

  elements.vigenteFilter.addEventListener("change", (event) => {
    state.vigente = event.target.value;
    render();
  });

  elements.sortSelect.addEventListener("change", (event) => {
    state.ordenacao = event.target.value;
    render();
  });

  elements.urgenciaFilter.addEventListener("change", (event) => {
    state.urgencia = event.target.value;
    if (state.urgencia === "urgentes") {
      state.ordenacao = "producao-asc";
      elements.sortSelect.value = "producao-asc";
    }
    render();
  });

  elements.totalFilter.addEventListener("click", () => { resetFilters(); render(); });
  elements.vigentesFilter.addEventListener("click", () => {
    resetFilters();
    state.vigente = "sim";
    elements.vigenteFilter.value = "sim";
    render();
  });
  elements.urgentesFilter.addEventListener("click", () => {
    resetFilters();
    state.urgencia = "urgentes";
    state.ordenacao = "producao-asc";
    elements.urgenciaFilter.value = "urgentes";
    elements.sortSelect.value = "producao-asc";
    render();
  });
  elements.emptyClear.addEventListener("click", () => { resetFilters(); render(); });

  elements.clearFilters.addEventListener("click", () => {
    resetFilters();
    render();
  });
}

// The detail page shares the same records and helpers, without starting the list.
if (elements.tableBody) {
  setupDocumentFilter();
  bindEvents();
  render();
}
