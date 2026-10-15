(() => {
  const list = document.getElementById("schemas-mdfe-list");
  if (!list) return;
  const count = document.getElementById("schemas-mdfe-count");
  const error = document.getElementById("schemas-mdfe-error");
  const data = window.LP_SCHEMAS_MDFE;
  if (!data || !Number.isSafeInteger(data.quantidadeArquivos) || data.quantidadeArquivos <= 0
    || !Number.isSafeInteger(data.tamanhoBytes) || data.tamanhoBytes <= 0
    || typeof data.sha256 !== "string" || !/^[A-Fa-f0-9]{64}$/.test(data.sha256)) {
    list.replaceChildren();
    count.textContent = "Indisponível";
    error.hidden = false;
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
  const quantity = `${data.quantidadeArquivos} ${data.quantidadeArquivos === 1 ? "arquivo" : "arquivos"}`;
  const size = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(data.tamanhoBytes / 1024) + " KiB";
  count.textContent = quantity;
  error.hidden = true;
  const row = create("li", "schema-row");
  const identity = create("div", "schema-identity");
  identity.append(icon("file-code"), create("h4", "", "Conjunto completo MDF-e"));
  const metadata = create("span", "schema-metadata", `${quantity} · ${size}`);
  const link = create("a", "action-button secondary-action schema-download");
  link.href = "downloads/Schemas/SchemasMDFe/SchemasMDFe.zip";
  link.setAttribute("download", "SchemasMDFe.zip");
  link.setAttribute("aria-label", `Baixar schemas MDF-e, ${quantity}, ${size}`);
  link.append(icon("download"), create("span", "", "Baixar ZIP"));
  row.append(identity, metadata, link);
  list.replaceChildren(row);
  if (window.lucide) window.lucide.createIcons();
})();
