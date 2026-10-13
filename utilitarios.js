(() => {
  const list = document.getElementById("utilities-list");
  if (!list) return;
  const count = document.getElementById("utilities-count");
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
  const valid = (item) => item && typeof item === "object"
    && ["nome", "versao", "autor", "plataforma", "descricao"].every((key) => typeof item[key] === "string" && item[key].trim())
    && typeof item.id === "string" && /^[a-z0-9-]+$/.test(item.id)
    && /^downloads\/[a-zA-Z0-9._-]+\.zip$/.test(item.arquivo)
    && /^imagens\/utilitarios\/[a-zA-Z0-9._-]+\.png$/.test(item.icone)
    && Number.isSafeInteger(item.tamanhoBytes) && item.tamanhoBytes > 0
    && /^[a-fA-F0-9]{64}$/.test(item.sha256)
    && Array.isArray(item.instrucoes) && item.instrucoes.every((text) => typeof text === "string");
  const utilities = window.LP_UTILITARIOS;
  if (!Array.isArray(utilities) || !utilities.every(valid) || new Set(utilities.map((item) => item.id)).size !== utilities.length) {
    list.replaceChildren(create("p", "utility-empty", "Não foi possível carregar os utilitários."));
    count.textContent = "";
    return;
  }
  list.replaceChildren();
  count.textContent = `${utilities.length} ${utilities.length === 1 ? "utilitário disponível" : "utilitários disponíveis"}`;
  if (!utilities.length) list.appendChild(create("p", "utility-empty", "Nenhum utilitário disponível."));
  utilities.forEach((item) => {
    const card = create("article", "utility-card");
    card.id = `utility-${item.id}`;
    card.setAttribute("aria-labelledby", `${card.id}-title`);
    const header = create("header", "utility-heading");
    const symbol = create("span", "utility-symbol");
    const image = create("img");
    image.src = item.icone;
    image.width = 32;
    image.height = 32;
    image.alt = "";
    symbol.setAttribute("aria-hidden", "true");
    symbol.appendChild(image);
    const heading = create("div", "utility-heading-copy");
    const title = create("h3", "", item.nome);
    title.id = `${card.id}-title`;
    heading.append(title, create("p", "utility-author", `Desenvolvido por ${item.autor}`));
    header.append(symbol, heading);
    card.append(header, create("p", "utility-description", item.descricao));
    const metadata = create("dl", "utility-metadata");
    const size = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(item.tamanhoBytes / 1048576) + " MiB";
    [["Versão", item.versao], ["Plataforma", item.plataforma], ["Tamanho do ZIP", size]].forEach(([label, value]) => {
      const field = create("div");
      field.append(create("dt", "", label), create("dd", "", value));
      metadata.appendChild(field);
    });
    card.appendChild(metadata);
    const actions = create("div", "utility-actions");
    const download = create("a", "action-button primary-action utility-download");
    download.href = item.arquivo;
    download.setAttribute("download", item.arquivo.slice("downloads/".length));
    download.setAttribute("aria-label", `Baixar ${item.nome} ${item.versao} para ${item.plataforma}, ${size}`);
    download.append(icon("download"), create("span", "", "Baixar para Windows"));
    actions.append(download, create("span", "utility-file", item.arquivo.slice("downloads/".length)));
    card.appendChild(actions);
    const instructions = create("div", "utility-instructions");
    const subtitle = create("h4");
    subtitle.append(icon("folder-open"), create("span", "", "Pacote e execução"));
    const steps = create("ul");
    item.instrucoes.forEach((text) => steps.appendChild(create("li", "", text)));
    instructions.append(subtitle, steps);
    card.appendChild(instructions);
    const checksum = create("details", "utility-checksum");
    const summary = create("summary");
    summary.append(icon("fingerprint"), create("span", "", "SHA-256 do arquivo"));
    checksum.append(summary, create("code", "", item.sha256));
    card.appendChild(checksum);
    list.appendChild(card);
  });
  if (window.lucide) window.lucide.createIcons();
})();
