(() => {
  const MAX_RECORDS = 500;
  const STATUSES = { relatado: "Relatado", analise: "Em análise", correcao: "Em correção", resolvido: "Resolvido" };
  const PRIORITIES = { normal: "Normal", alta: "Alta", urgente: "Urgente" };
  const ENVIRONMENTS = { producao: "Produção", homologacao: "Homologação", ambos: "Ambos", "nao-aplica": "Não se aplica" };
  const MODULES = ["NF-e", "NFC-e", "NFS-e", "MDF-e", "Cadastros", "Financeiro", "Integrações", "Outros"];
  const query = (id) => document.getElementById(id);
  const ui = {
    list: query("problem-list"), detail: query("problem-detail"), workspace: query("problem-workspace"),
    empty: query("problems-empty"), emptyTitle: query("problems-empty-title"), emptyAction: query("problem-empty-action"),
    search: query("problem-search"), status: query("problem-status-filter"), priority: query("problem-priority-filter"),
    module: query("problem-module-filter"), sort: query("problem-sort"), feedback: query("problem-feedback")
  };
  let published = [];
  let publishedReadFailed = false;
  let selectedId = "";

  function today() {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function validDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T12:00:00`);
    return !Number.isNaN(date.getTime()) && date.getFullYear() === Number(value.slice(0, 4))
      && date.getMonth() + 1 === Number(value.slice(5, 7)) && date.getDate() === Number(value.slice(8, 10));
  }

  function textField(record, key, maxLength, label, required = false) {
    const value = record[key] == null ? "" : record[key];
    if (typeof value !== "string" || value.length > maxLength) throw new Error(`${label}: conteúdo inválido ou muito longo.`);
    const text = value.trim();
    if (required && !text) throw new Error(`${label} é obrigatório.`);
    return text;
  }

  function normalizeRecord(record) {
    if (!record || typeof record !== "object" || Array.isArray(record)) throw new Error("Registro de problema inválido.");
    const id = textField(record, "id", 64, "Identificador", true);
    if (!/^[A-Za-z0-9_-]+$/.test(id)) throw new Error("Identificador inválido.");
    const dataRelato = textField(record, "dataRelato", 10, "Data do relato", true);
    const prazo = textField(record, "prazo", 10, "Prazo de correção");
    if (!validDate(dataRelato) || (prazo && !validDate(prazo))) throw new Error("Data do relato ou prazo de correção inválido.");
    const status = record.status || "relatado";
    const prioridade = record.prioridade || "normal";
    const ambiente = record.ambiente || "producao";
    const modulo = record.modulo || "Outros";
    if (!Object.hasOwn(STATUSES, status) || !Object.hasOwn(PRIORITIES, prioridade)
      || !Object.hasOwn(ENVIRONMENTS, ambiente) || !MODULES.includes(modulo)) throw new Error("Status, prioridade, ambiente ou módulo inválido.");
    const now = new Date().toISOString();
    const timestamp = (key, fallback) => {
      const value = record[key] || fallback;
      if (typeof value !== "string" || value.length > 40 || !/^\d{4}-\d{2}-\d{2}T/.test(value) || !validDate(value.slice(0, 10))
        || Number.isNaN(new Date(value).getTime())) throw new Error("Data de atualização inválida.");
      return new Date(value).toISOString();
    };
    const criadoEm = timestamp("criadoEm", now);
    return {
      id, titulo: textField(record, "titulo", 140, "Título", true), modulo,
      versao: textField(record, "versao", 40, "Versão"), status, prioridade, ambiente,
      responsavel: textField(record, "responsavel", 80, "Responsável"), dataRelato, prazo,
      problemaRelatado: textField(record, "problemaRelatado", 6000, "Problema relatado", true),
      parecerTecnico: textField(record, "parecerTecnico", 6000, "Parecer técnico"),
      solucao: textField(record, "solucao", 6000, "Possível solução"),
      passosReproducao: textField(record, "passosReproducao", 4000, "Passos para reproduzir"),
      criadoEm, atualizadoEm: timestamp("atualizadoEm", criadoEm)
    };
  }

  function normalizeRecords(records) {
    if (!Array.isArray(records) || records.length > MAX_RECORDS) throw new Error(`A lista deve conter até ${MAX_RECORDS} problemas.`);
    const result = records.map(normalizeRecord);
    if (new Set(result.map((record) => record.id)).size !== result.length) throw new Error("Há identificadores duplicados no arquivo.");
    return result;
  }

  function feedback(message, error = false) {
    ui.feedback.textContent = message;
    ui.feedback.hidden = false;
    ui.feedback.classList.toggle("is-error", error);
    ui.feedback.setAttribute("role", error ? "alert" : "status");
  }

  function filteredRecords() {
    const search = normalizeText(ui.search.value.trim());
    const rank = { urgente: 0, alta: 1, normal: 2 };
    return published.filter((record) => {
      const matchesStatus = ui.status.value === "todos" || (ui.status.value === "abertos" ? record.status !== "resolvido" : record.status === ui.status.value);
      const matchesPriority = ui.priority.value === "todos" || record.prioridade === ui.priority.value;
      const matchesModule = ui.module.value === "todos" || record.modulo === ui.module.value;
      const searchable = normalizeText([record.id, record.titulo, record.modulo, record.responsavel, record.versao,
        record.problemaRelatado, record.parecerTecnico, record.solucao, record.passosReproducao].join(" "));
      return matchesStatus && matchesPriority && matchesModule && searchable.includes(search);
    }).sort((a, b) => {
      if (ui.sort.value === "titulo") return a.titulo.localeCompare(b.titulo, "pt-BR");
      if (ui.sort.value === "relato") return b.dataRelato.localeCompare(a.dataRelato) || b.atualizadoEm.localeCompare(a.atualizadoEm);
      if (ui.sort.value === "prioridade") return Number(a.status === "resolvido") - Number(b.status === "resolvido")
        || rank[a.prioridade] - rank[b.prioridade] || b.atualizadoEm.localeCompare(a.atualizadoEm);
      return b.atualizadoEm.localeCompare(a.atualizadoEm);
    });
  }

  function clearFilters() {
    ui.search.value = "";
    ui.status.value = "todos";
    ui.priority.value = "todos";
    ui.module.value = "todos";
  }

  function statusBadge(record) {
    return createBadge(STATUSES[record.status], `problem-status-${record.status}`, record.status === "resolvido" ? "circle-check" : null);
  }

  function priorityBadge(record) {
    return createBadge(PRIORITIES[record.prioridade], `problem-priority-${record.prioridade}`, record.prioridade === "urgente" ? "alarm-clock" : null);
  }

  function focusSelection() {
    const target = selectedId ? query(`problem-item-${selectedId}`) : ui.emptyAction;
    if (target) target.focus({ preventScroll: true });
  }

  function renderList(records) {
    ui.list.replaceChildren();
    records.forEach((record) => {
      const button = createElement("button", `problem-item${record.id === selectedId ? " is-selected" : ""}`);
      button.type = "button";
      button.id = `problem-item-${record.id}`;
      button.setAttribute("aria-pressed", String(record.id === selectedId));
      button.setAttribute("aria-controls", "problem-detail");
      const top = createElement("span", "problem-item-top");
      top.append(statusBadge(record), priorityBadge(record));
      const meta = createElement("span", "problem-item-meta");
      meta.append(createElement("span", "problem-item-module", record.modulo), createElement("span", "", formatDate(record.dataRelato)));
      button.append(top, createElement("span", "problem-item-title", record.titulo), meta);
      button.addEventListener("click", () => {
        selectedId = record.id;
        render();
        focusSelection();
        if (window.matchMedia("(max-width: 760px)").matches) ui.detail.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      });
      ui.list.appendChild(button);
    });
  }

  function renderDetail(record) {
    ui.detail.replaceChildren();
    if (!record) return;
    const heading = createElement("div", "problem-detail-heading");
    const title = createElement("div", "problem-detail-title");
    const identification = createElement("div", "problem-identification");
    identification.append(createElement("span", "problem-id", record.id), createBadge("Publicado", "badge-neutral"));
    const badges = createElement("div", "problem-detail-status");
    badges.append(statusBadge(record), priorityBadge(record));
    title.append(identification, createElement("h3", "", record.titulo), badges);
    heading.appendChild(title);
    const info = createElement("dl", "problem-info-grid");
    const updated = new Date(record.atualizadoEm).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    [["Módulo / versão", `${record.modulo}${record.versao ? ` · ${record.versao}` : ""}`], ["Ambiente", ENVIRONMENTS[record.ambiente]],
      ["Responsável", record.responsavel || "Não definido"], ["Data do relato", formatDate(record.dataRelato)],
      ["Prazo de correção", record.prazo ? formatDate(record.prazo) : "Não definido"], ["Última atualização", updated]].forEach(([label, value]) => {
      const item = createElement("div");
      const detail = createElement("dd", "", value);
      if (label === "Prazo de correção" && record.prazo && record.prazo < today() && record.status !== "resolvido") {
        detail.className = "deadline-overdue";
        detail.textContent += " · Vencido";
      }
      item.append(createElement("dt", "", label), detail);
      info.appendChild(item);
    });
    ui.detail.append(heading, info);
    [["PROBLEMA RELATADO", record.problemaRelatado, "circle-alert", "reported-narrative"],
      ["PARECER TÉCNICO", record.parecerTecnico, "clipboard-check", "technical-narrative"],
      ["POSSÍVEL SOLUÇÃO", record.solucao, "wrench", "solution-narrative"],
      ["PASSOS PARA REPRODUZIR", record.passosReproducao, "list-checks", ""]].forEach(([label, content, icon, variant]) => {
      const section = createElement("section", `problem-narrative ${variant}`);
      const sectionTitle = createElement("h4");
      sectionTitle.append(createIcon(icon), createElement("span", "", label));
      section.append(sectionTitle, createElement("p", content ? "" : "narrative-empty", content || "Ainda não registrado."));
      ui.detail.appendChild(section);
    });
  }

  function render() {
    const all = published;
    const records = filteredRecords();
    const counts = { abertos: all.filter((item) => item.status !== "resolvido").length, analise: all.filter((item) => item.status === "analise").length,
      urgentes: all.filter((item) => item.prioridade === "urgente" && item.status !== "resolvido").length, resolvidos: all.filter((item) => item.status === "resolvido").length };
    query("problems-open-count").textContent = String(counts.abertos);
    query("problems-analysis-count").textContent = String(counts.analise);
    query("problems-urgent-count").textContent = String(counts.urgentes);
    query("problems-resolved-count").textContent = String(counts.resolvidos);
    query("tab-problems-count").textContent = String(all.length);
    query("problem-result-summary").textContent = `${records.length} ocorrência${records.length === 1 ? "" : "s"} · ${all.length} no total`;
    document.querySelectorAll("[data-problem-view]").forEach((button) => {
      const view = button.dataset.problemView;
      const active = !ui.search.value && ui.module.value === "todos" && (view === "urgentes"
        ? ui.status.value === "abertos" && ui.priority.value === "urgente"
        : ui.priority.value === "todos" && ui.status.value === (view === "resolvidos" ? "resolvido" : view));
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    if (!records.some((record) => record.id === selectedId)) selectedId = records[0] ? records[0].id : "";
    ui.workspace.hidden = records.length === 0;
    ui.empty.hidden = records.length !== 0;
    ui.emptyTitle.textContent = publishedReadFailed ? "Não foi possível carregar os problemas"
      : all.length ? "Nenhum problema encontrado" : "Nenhum problema registrado";
    ui.emptyAction.hidden = all.length === 0;
    renderList(records);
    renderDetail(records.find((record) => record.id === selectedId));
    renderIcons();
  }

  function initialize() {
    MODULES.forEach((module) => {
      const option = createElement("option", "", module);
      option.value = module;
      ui.module.appendChild(option);
    });
    try { published = normalizeRecords(window.IFSOFT_PROBLEMAS ?? []); }
    catch {
      publishedReadFailed = true;
      feedback("O arquivo de problemas publicados está inválido.", true);
    }
    ui.search.addEventListener("input", render);
    [ui.status, ui.priority, ui.module, ui.sort].forEach((element) => element.addEventListener("change", render));
    const resetView = () => { clearFilters(); render(); };
    query("problem-clear-filters").addEventListener("click", resetView);
    ui.emptyAction.addEventListener("click", resetView);
    document.querySelectorAll("[data-problem-view]").forEach((button) => button.addEventListener("click", () => {
      clearFilters();
      const view = button.dataset.problemView;
      ui.status.value = view === "resolvidos" ? "resolvido" : view === "urgentes" ? "abertos" : view;
      if (view === "urgentes") ui.priority.value = "urgente";
      render();
    }));
    render();
  }

  initialize();
})();
