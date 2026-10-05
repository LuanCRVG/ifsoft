(() => {
  const query = (id) => document.getElementById(id);
  const id = new URLSearchParams(window.location.search).get("id");
  const note = notasTecnicas.find((item) => getNoteId(item) === id);
  if (!note) {
    query("note-not-found").hidden = false;
    document.title = "Nota técnica não encontrada | IFSOFT Sistemas";
    renderIcons();
    return;
  }

  document.title = `${note.descricao} | IFSOFT Sistemas`;
  query("note-detail-kind").textContent = note.tipo || "Nota técnica / Informe técnico";
  query("note-detail-title").textContent = note.descricao;
  query("note-detail-summary").textContent = getNoteSummary(note);
  query("note-detail-status").append(createUrgencyBadge(note), createBadge(note.vigente ? "Vigente" : "Não vigente", note.vigente ? "badge-success" : "badge-neutral"));
  query("note-detail-sources").appendChild(createLink(note));

  const metadata = [
    ["Documento fiscal", getNoteDocuments(note).join(" / ")],
    ["UF", note.uf],
    ["Data analisada", formatDate(note.dataAnalise)],
    ["Homologação", createDeadline(note.prazoHomologacao)],
    ["Produção", createDeadline(note.prazoProducao, true)]
  ];
  metadata.forEach(([label, value]) => {
    const item = createElement("div");
    const content = createElement("dd");
    if (value instanceof HTMLElement) content.appendChild(value);
    else content.textContent = value;
    item.append(createElement("dt", "", label), content);
    query("note-detail-metadata").appendChild(item);
  });

  const observations = note.observacoes || [];
  query("note-observations-count").textContent = `${observations.length} ${observations.length === 1 ? "observação" : "observações"}`;
  if (!observations.length) {
    query("note-outline").hidden = true;
    query("note-observations-list").appendChild(createElement("p", "note-summary", "Nenhuma observação cadastrada."));
  }
  observations.forEach((text, index) => {
    const separator = text.indexOf(":");
    const title = separator > 0 && separator <= 55
      ? text.slice(0, separator)
      : index === 0 ? "Visão geral" : `Observação ${index + 1}`;
    const section = createElement("section", "note-observation");
    section.id = `observacao-${index + 1}`;
    section.setAttribute("aria-labelledby", `${section.id}-title`);
    const heading = createElement("h3", "", title);
    heading.id = `${section.id}-title`;
    section.append(heading, createElement("p", "", text));
    query("note-observations-list").appendChild(section);

    const item = createElement("li");
    const link = createElement("a");
    link.href = `#${section.id}`;
    link.append(createElement("span", "", String(index + 1).padStart(2, "0")), createElement("span", "", title));
    item.appendChild(link);
    query("note-outline-list").appendChild(item);
  });
  query("note-detail").hidden = false;
  renderIcons();
})();
