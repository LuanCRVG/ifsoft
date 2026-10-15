(() => {
  const list = document.getElementById("schemas-nfe-list");
  if (!list) return;
  const count = document.getElementById("schemas-nfe-count");
  const feedback = document.getElementById("schemas-nfe-feedback");
  const data = window.LP_SCHEMAS_NFE;
  const valid = (item) => item && typeof item === "object"
    && typeof item.id === "string" && /^[a-z0-9-]+$/.test(item.id)
    && typeof item.nome === "string" && item.nome.trim().length > 0 && item.nome.length <= 120
    && typeof item.pasta === "string" && /^[A-Za-z0-9_-]+$/.test(item.pasta)
    && Number.isSafeInteger(item.quantidadeArquivos) && item.quantidadeArquivos > 0
    && Number.isSafeInteger(item.tamanhoBytes) && item.tamanhoBytes > 0
    && typeof item.sha256 === "string" && /^[A-Fa-f0-9]{64}$/.test(item.sha256);
  if (!Array.isArray(data) || !data.every(valid)
    || new Set(data.map((item) => item.id)).size !== data.length
    || new Set(data.map((item) => item.pasta)).size !== data.length) {
    list.replaceChildren();
    count.textContent = "Indisponível";
    feedback.textContent = "Não foi possível carregar os schemas NF-e.";
    feedback.hidden = false;
    return;
  }
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
  count.textContent = `${data.length} ${data.length === 1 ? "conjunto" : "conjuntos"}`;
  feedback.textContent = "Nenhum conjunto de schemas NF-e disponível.";
  feedback.hidden = data.length !== 0;
  list.replaceChildren();
  data.forEach((item) => {
    const row = create("li", "schema-row");
    row.id = `schema-nfe-${item.id}`;
    const identity = create("div", "schema-identity");
    identity.append(icon("file-code"), create("h4", "", item.nome));
    const quantity = `${item.quantidadeArquivos} ${item.quantidadeArquivos === 1 ? "arquivo" : "arquivos"}`;
    const size = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(item.tamanhoBytes / 1024) + " KiB";
    const metadata = create("span", "schema-metadata", `${quantity} · ${size}`);
    const link = create("a", "action-button secondary-action schema-download");
    link.href = `downloads/Schemas/SchemasNFe/${item.pasta}/SchemasNFe.zip`;
    link.setAttribute("download", `SchemasNFe-${item.id}.zip`);
    link.setAttribute("aria-label", `Baixar schemas NF-e, ${item.nome}, ${quantity}, ${size}`);
    link.append(icon("download"), create("span", "", "Baixar ZIP"));
    row.append(identity, metadata, link);
    list.appendChild(row);
  });
  if (window.lucide) window.lucide.createIcons();
})();
