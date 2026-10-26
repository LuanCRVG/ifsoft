(() => {
  "use strict";
  const topics = Array.isArray(window.LP_PRIORIDADES) ? window.LP_PRIORIDADES : [];
  const statuses = {
    verificar: { titulo: "A verificar", icone: "circle-help" },
    adequacao: { titulo: "Em adequação", icone: "wrench" },
    concluido: { titulo: "Concluído", icone: "circle-check" }
  };
  const element = (tag, className = "", text = "") => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };
  const icon = (name) => {
    const node = element("i");
    node.setAttribute("data-lucide", name);
    node.setAttribute("aria-hidden", "true");
    return node;
  };
  const date = (iso) => iso ? iso.split("-").reverse().join("/") : "Não definido";
  function status(item) {
    const key = Object.hasOwn(statuses, item.status) ? item.status : "verificar";
    const node = element("span", `priority-state priority-state-${key}`, statuses[key].titulo);
    node.setAttribute("aria-label", `Situação no nosso sistema: ${statuses[key].titulo}`);
    return node;
  }
  function link(label, href, external = false) {
    const node = element("a", "", label);
    node.href = href;
    if (external) { node.target = "_blank"; node.rel = "noopener noreferrer"; }
    return node;
  }
  function dates(rows, className) {
    const list = element("dl", className);
    rows.forEach((row) => {
      const item = element("div");
      const value = element("dd");
      const time = element("time", "", date(row.data));
      time.setAttribute("datetime", row.data);
      value.append(time);
      item.append(element("dt", "", row.rotulo), value);
      if (row.detalhe) item.append(element("p", "priority-date-detail", row.detalhe));
      list.append(item);
    });
    return list;
  }
  const cards = document.getElementById("emitter-priority-cards");
  if (cards) {
    topics.forEach((item) => {
      const card = element("article", `emitter-priority priority-${item.cor}`);
      const headingId = `priority-${item.id}-title`;
      card.setAttribute("aria-labelledby", headingId);
      const top = element("div", "priority-card-top");
      const attention = element("span", "priority-attention");
      const symbol = element("span", "priority-symbol"); symbol.append(icon(item.icone));
      attention.append(symbol, element("span", "priority-label", item.destaque));
      top.append(attention, status(item));
      const title = element("h3", "", item.titulo); title.id = headingId;
      const copy = element("div", "priority-card-copy");
      if (item.contexto) copy.append(element("p", "priority-context", item.contexto));
      copy.append(element("p", "priority-card-summary", item.resumo));
      card.append(top, title, copy);
      if (item.notaCurta) card.append(element("p", "priority-card-note", item.notaCurta));
      if (item.datasCard?.length) card.append(dates(item.datasCard, "priority-card-dates"));
      const action = link("Ver orientação", `nota.html?prioridade=${encodeURIComponent(item.id)}`);
      action.className = "priority-read";
      action.setAttribute("aria-label", `Ver orientação: ${item.titulo}`);
      action.append(icon("arrow-right"));
      card.append(action);
      card.addEventListener("click", (event) => {
        if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        if (event.target.closest("a, button") || window.getSelection()?.toString()) return;
        action.click();
      });
      cards.append(card);
    });
    if (topics.length) document.getElementById("emitter-priorities").hidden = false;
  }

  const params = new URLSearchParams(window.location.search);
  const guide = document.getElementById("priority-detail");
  if (guide && params.has("prioridade")) {
    const item = topics.find((topic) => topic.id === params.get("prioridade"));
    if (!item) {
      document.getElementById("note-not-found").hidden = false;
      document.querySelector("#note-not-found h1").textContent = "Orientação não encontrada";
      document.querySelector("#note-not-found p").textContent = "Escolha um assunto no quadro Prioridades do emissor.";
      document.title = "Orientação não encontrada | LP";
    } else {
      document.title = `${item.titulo} | LP`;
      document.getElementById("priority-detail-title").textContent = item.titulo;
      document.getElementById("priority-detail-summary").textContent = item.resumo;
      const state = document.getElementById("priority-detail-status");
      state.append(element("span", "", "Situação no nosso sistema"), status(item));
      document.getElementById("priority-detail-who").textContent = item.quem;
      const actions = document.getElementById("priority-detail-actions");
      item.acoes.forEach((text) => actions.append(element("li", "", text)));
      document.getElementById("priority-detail-dates").append(dates(item.prazos, "priority-guide-dates"));
      document.getElementById("priority-detail-date-note").textContent = item.observacaoPrazo;
      document.getElementById("priority-detail-extra-title").textContent = item.complemento.titulo;
      document.getElementById("priority-detail-extra-text").textContent = item.complemento.texto;
      document.getElementById("priority-detail-done").textContent = item.conclusao;
      const related = document.getElementById("priority-detail-notes");
      item.notas.forEach((note) => {
        const li = element("li");
        li.append(link(note.titulo, `nota.html?id=${encodeURIComponent(note.id)}`)); related.append(li);
      });
      document.getElementById("priority-detail-related").hidden = !item.notas.length;
      const sources = document.getElementById("priority-detail-sources");
      item.fontes.forEach((source) => {
        const li = element("li"); li.append(link(source.titulo, source.url, true)); sources.append(li);
      });
      document.getElementById("priority-detail-reviewed").textContent = `Orientação revisada em ${date(item.revisadoEm)}. O andamento é atualizado pela equipe.`;
      guide.hidden = false;
    }
  }
  window.lucide?.createIcons();
})();
