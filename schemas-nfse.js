(() => {
  const list = document.getElementById("schemas-list");
  if (!list) return;
  const search = document.getElementById("schemas-search");
  const state = document.getElementById("schemas-uf-filter");
  const clear = document.getElementById("schemas-clear");
  const count = document.getElementById("schemas-count");
  const summary = document.getElementById("schemas-result-summary");
  const empty = document.getElementById("schemas-empty");
  const create = (tag, className = "", text = "") => {
    const node = document.createElement(tag);
    node.className = className;
    node.textContent = text;
    return node;
  };
  const icon = (name) => {
    const node = create("i");
    node.setAttribute("data-lucide", name);
    node.setAttribute("aria-hidden", "true");
    return node;
  };
  const normalize = (text) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").trim();
  const valid = (item) => item && typeof item === "object"
    && typeof item.id === "string" && /^[a-z0-9-]+$/.test(item.id)
    && typeof item.municipio === "string" && item.municipio.trim().length > 0 && item.municipio.length <= 120
    && (item.padrao === undefined || (typeof item.padrao === "string" && item.padrao.length <= 120))
    && typeof item.uf === "string" && /^[A-Z]{2}$/.test(item.uf)
    && typeof item.pasta === "string" && /^[\p{L}\p{N} _-]+$/u.test(item.pasta) && item.pasta.trim().length > 0
    && Number.isSafeInteger(item.quantidadeArquivos) && item.quantidadeArquivos > 0
    && Number.isSafeInteger(item.tamanhoBytes) && item.tamanhoBytes > 0
    && typeof item.sha256 === "string" && /^[A-Fa-f0-9]{64}$/.test(item.sha256);
  const data = window.LP_SCHEMAS_NFSE;
  if (!Array.isArray(data) || !data.every(valid)
    || new Set(data.map((item) => item.id)).size !== data.length
    || new Set(data.map((item) => item.pasta)).size !== data.length) {
    list.replaceChildren();
    count.textContent = "0 municípios";
    summary.textContent = "Não foi possível carregar os schemas NFS-e.";
    empty.hidden = true;
    search.disabled = state.disabled = clear.disabled = true;
    return;
  }
  const records = data.slice().sort((a, b) => a.municipio.localeCompare(b.municipio, "pt-BR") || a.uf.localeCompare(b.uf));
  count.textContent = `${records.length} ${records.length === 1 ? "município" : "municípios"}`;
  state.replaceChildren();
  const allStates = create("option", "", "Todas as UFs");
  allStates.value = "todos";
  state.appendChild(allStates);
  [...new Set(records.map((item) => item.uf))].sort().forEach((uf) => {
    const option = create("option", "", uf);
    option.value = uf;
    state.appendChild(option);
  });
  state.value = "todos";

  function render() {
    const query = normalize(search.value);
    const filtered = records.filter((item) => (state.value === "todos" || item.uf === state.value)
      && normalize(`${item.municipio} ${item.uf} ${item.pasta} ${item.padrao || ""}`).includes(query));
    list.replaceChildren();
    summary.textContent = `${filtered.length} de ${records.length} ${records.length === 1 ? "município" : "municípios"}`;
    empty.hidden = filtered.length !== 0;
    empty.textContent = records.length ? "Nenhum município encontrado." : "Nenhum conjunto de schemas disponível.";
    filtered.forEach((item) => {
      const row = create("li", "schema-row");
      row.id = `schema-${item.id}`;
      const identity = create("div", "schema-identity");
      const label = `${item.municipio}${item.padrao ? ` (${item.padrao})` : ""}`;
      identity.append(icon("folder"), create("h4", "", label), create("span", "badge badge-neutral", item.uf));
      const size = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(item.tamanhoBytes / 1024) + " KiB";
      const quantity = `${item.quantidadeArquivos} ${item.quantidadeArquivos === 1 ? "arquivo" : "arquivos"}`;
      const metadata = create("span", "schema-metadata", `${quantity} · ${size}`);
      const link = create("a", "action-button secondary-action schema-download");
      link.href = `downloads/Schemas/SchemasNFSe/${item.pasta}/SchemasNFSe.zip`;
      link.setAttribute("download", `SchemasNFSe-${item.id}.zip`);
      link.setAttribute("aria-label", `Baixar schemas de ${label}, ${item.uf}, ${quantity}, ${size}`);
      link.append(icon("download"), create("span", "", "Baixar ZIP"));
      row.append(identity, metadata, link);
      list.appendChild(row);
    });
    if (window.lucide) window.lucide.createIcons();
  }
  search.addEventListener("input", render);
  state.addEventListener("change", render);
  clear.addEventListener("click", () => {
    search.value = "";
    state.value = "todos";
    render();
  });
  render();
})();
