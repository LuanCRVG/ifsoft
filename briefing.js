(() => {
  const query = (id) => document.getElementById(id);
  const listRoot = query("briefing-content");
  const articleRoot = query("briefing-article");
  if (!listRoot && !articleRoot) return;
  const element = (tag, className = "", text = "") => {
    const node = document.createElement(tag);
    node.className = className;
    if (text) node.textContent = text;
    return node;
  };
  const icon = (name) => {
    const node = element("i");
    node.setAttribute("data-lucide", name);
    node.setAttribute("aria-hidden", "true");
    return node;
  };
  const refreshIcons = () => window.lucide?.createIcons();
  const text = (value, required = true, max = 6000) => {
    if (typeof value !== "string" || value.length > max || (required && !value.trim())) throw new Error("Texto editorial inválido.");
    return value.trim();
  };
  const date = (value) => {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error("Data editorial inválida.");
    const parsed = new Date(`${value}T12:00:00Z`);
    if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) throw new Error("Data editorial inválida.");
    return value;
  };
  const formatDate = (value, long = false) => new Date(`${value}T12:00:00Z`).toLocaleDateString("pt-BR", {
    timeZone: "UTC", day: "2-digit", month: long ? "long" : "2-digit", year: "numeric"
  });
  const normalizeText = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const image = (value) => {
    if (!value || typeof value !== "object") throw new Error("Imagem editorial inválida.");
    const arquivo = text(value.arquivo, true, 300);
    const url = new URL(arquivo, "https://ifsoft.invalid/portal/");
    if (!/^imagens\/briefing\/[a-zA-Z0-9._/-]+\.(png|jpe?g|webp|gif|avif)$/i.test(arquivo)
      || !url.pathname.startsWith("/portal/imagens/briefing/")) throw new Error("Use uma imagem local na pasta imagens/briefing.");
    const { largura, altura } = value;
    if ((largura !== undefined || altura !== undefined)
      && (!Number.isInteger(largura) || !Number.isInteger(altura) || largura < 1 || altura < 1 || largura > 20000 || altura > 20000)) throw new Error("Dimensões da imagem inválidas.");
    return { arquivo, alt: text(value.alt, true, 300), legenda: text(value.legenda, true, 600), largura, altura };
  };
  const images = (value = []) => {
    if (!Array.isArray(value) || value.length > 10) throw new Error("Lista de imagens inválida.");
    return value.map(image);
  };
  function normalizeEditions(data) {
    if (!Array.isArray(data) || data.length > 500) throw new Error("Lista de edições inválida.");
    const editions = data.map((edition) => {
      const editionDate = date(edition.data);
      if (!Array.isArray(edition.noticias) || edition.noticias.length > 100) throw new Error("Lista de notícias inválida.");
      const stories = edition.noticias.map((story) => {
        const id = text(story.id, true, 100);
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) throw new Error("Identificador de notícia inválido.");
        if (!Array.isArray(story.categorias) || story.categorias.length > 10 || !Array.isArray(story.secoes)
          || story.secoes.length > 30 || !Array.isArray(story.fontes) || !story.fontes.length || story.fontes.length > 20) throw new Error("Estrutura da notícia inválida.");
        const published = date(story.dataPublicacao);
        if (published !== editionDate) throw new Error("A publicação deve usar a data da edição.");
        return {
          id, titulo: text(story.titulo, true, 250), resumo: text(story.resumo),
          categorias: [...new Set(story.categorias.map((category) => text(category, true, 60)))],
          dataOriginal: date(story.dataOriginal), dataPublicacao: published,
          publicadoPor: text(story.publicadoPor ?? "", false, 100),
          creditoEditorial: text(story.creditoEditorial), capa: story.capa ? image(story.capa) : null,
          secoes: story.secoes.map((section) => {
            if (!Array.isArray(section.paragrafos) || section.paragrafos.length > 30) throw new Error("Parágrafos inválidos.");
            return { titulo: text(section.titulo, true, 150), paragrafos: section.paragrafos.map((paragraph) => text(paragraph)), imagens: images(section.imagens) };
          }),
          fontes: story.fontes.map((source) => {
            const url = new URL(text(source.url, true, 1500));
            if (url.protocol !== "https:" || url.username || url.password) throw new Error("Fonte inválida.");
            return { titulo: text(source.titulo, true, 200), url: url.href };
          })
        };
      });
      if (new Set(stories.map((story) => story.id)).size !== stories.length) throw new Error("Há notícias duplicadas nesta edição.");
      const featured = text(edition.destaque, false, 100);
      if (featured && !stories.some((story) => story.id === featured)) throw new Error("Destaque não encontrado na edição.");
      return { data: editionDate, destaque: featured, noticias: stories };
    });
    if (new Set(editions.map((edition) => edition.data)).size !== editions.length) throw new Error("Há edições duplicadas.");
    return editions.sort((a, b) => b.data.localeCompare(a.data));
  }
  const storyHref = (edition, story) => `briefing.html?edicao=${encodeURIComponent(edition.data)}&noticia=${encodeURIComponent(story.id)}`;
  const editionHref = (edition) => `index.html?edicao=${encodeURIComponent(edition.data)}#briefing-diario`;
  const link = (href, className, label) => {
    const anchor = element("a", className, label);
    anchor.href = href;
    return anchor;
  };
  const tags = (story) => {
    const row = element("div", "briefing-tags");
    story.categorias.forEach((category) => row.appendChild(element("span", "briefing-tag", category)));
    return row;
  };
  const minutes = (story) => Math.max(1, Math.ceil([story.resumo, ...story.secoes.flatMap((section) => section.paragrafos)].join(" ").split(/\s+/).length / 200));
  const publisher = (story) => {
    const byline = element("p", "briefing-publisher");
    byline.hidden = !story.publicadoPor;
    if (story.publicadoPor) byline.append(element("span", "", "Publicado por: "), element("strong", "", story.publicadoPor));
    return byline;
  };
  let editions;
  try { editions = normalizeEditions(window.IFSOFT_BRIEFING); }
  catch {
    if (listRoot) listRoot.appendChild(element("p", "briefing-empty", "Não foi possível carregar o conteúdo editorial. O arquivo de edições está inválido."));
    if (articleRoot) query("briefing-not-found").hidden = false;
    refreshIcons();
    return;
  }
  const params = new URLSearchParams(window.location.search);

  function storyCard(edition, story, featured) {
    const card = element("article", `briefing-story${featured ? " is-featured" : ""}${story.capa ? " has-cover" : ""}`);
    const href = storyHref(edition, story);
    if (story.capa) {
      const coverLink = link(href, "briefing-cover-link", "");
      const photo = element("img");
      photo.src = story.capa.arquivo;
      photo.alt = story.capa.alt;
      if (story.capa.largura) { photo.width = story.capa.largura; photo.height = story.capa.altura; }
      photo.loading = "lazy";
      photo.decoding = "async";
      photo.addEventListener("error", () => { coverLink.hidden = true; card.classList.toggle("has-cover", false); });
      coverLink.appendChild(photo);
      card.appendChild(coverLink);
    }
    const body = element("div", "briefing-story-body");
    if (featured) body.appendChild(element("p", "briefing-kicker", "DESTAQUE DA EDIÇÃO"));
    body.appendChild(tags(story));
    const title = element("h3");
    title.appendChild(link(href, "briefing-story-title", story.titulo));
    const meta = element("div", "briefing-story-meta");
    meta.append(element("span", "", `Artigo original: ${formatDate(story.dataOriginal)}`), element("span", "", `Nesta edição: ${formatDate(story.dataPublicacao)}`), element("span", "", `Leitura de ${minutes(story)} min`));
    const read = link(href, "action-button primary-action", "Ler notícia completa");
    read.appendChild(icon("arrow-right"));
    body.append(title, element("p", "briefing-story-summary", story.resumo), publisher(story), meta, read);
    card.appendChild(body);
    return card;
  }

  function initializeDiscovery(selectedEdition) {
    const tab = query("tab-briefing");
    const invitation = query("briefing-invitation");
    if (!tab || !invitation) return;
    const latest = editions.find((edition) => edition.noticias.length);
    tab.classList.toggle("has-briefing", Boolean(latest));
    if (!latest || !selectedEdition.noticias.length) return;
    tab.setAttribute("aria-label", `Briefing tecnológico: edição de ${formatDate(selectedEdition.data)}`);
    query("briefing-invitation-date").textContent = `Edição de ${formatDate(selectedEdition.data)} disponível para leitura.`;
    let dismissed = false;
    const update = () => {
      if (tab.getAttribute("aria-selected") === "true") dismissed = true;
      invitation.hidden = dismissed;
    };
    const tabs = Array.from(document.querySelectorAll("#portal-tabs [role='tab']"));
    tabs.forEach((item) => item.addEventListener("click", update));
    window.addEventListener("hashchange", update);
    query("briefing-invitation-open").addEventListener("click", () => { tab.click(); tab.focus({ preventScroll: true }); });
    query("briefing-invitation-close").addEventListener("click", () => {
      dismissed = true;
      update();
      tabs.find((item) => item.getAttribute("aria-selected") === "true")?.focus({ preventScroll: true });
    });
    update();
  }

  function initializeList() {
    const ui = { select: query("briefing-edition-select"), search: query("briefing-search"), categories: query("briefing-categories"), index: query("briefing-edition-index"), archive: query("briefing-archive") };
    if (!editions.length) {
      ui.select.disabled = true;
      query("briefing-edition-date").textContent = "Sem edições publicadas";
      listRoot.appendChild(element("p", "briefing-empty", "Nenhuma edição publicada."));
      return;
    }
    let selected = editions.find((edition) => edition.data === params.get("edicao")) || editions[0];
    let category = "Todas";
    editions.forEach((edition) => {
      const option = element("option", "", formatDate(edition.data, true));
      option.value = edition.data;
      ui.select.appendChild(option);
    });
    ui.select.value = selected.data;
    const ordered = () => [...selected.noticias].sort((a, b) => Number(b.id === selected.destaque) - Number(a.id === selected.destaque));
    function renderStories() {
      const search = normalizeText(ui.search.value.trim());
      const stories = ordered().filter((story) => (category === "Todas" || story.categorias.includes(category))
        && normalizeText([story.titulo, story.resumo, ...story.categorias, ...story.secoes.flatMap((section) => [section.titulo, ...section.paragrafos])].join(" ")).includes(search));
      Array.from(ui.categories.children).forEach((button) => button.setAttribute("aria-pressed", String(button.textContent === category)));
      listRoot.replaceChildren();
      query("briefing-result-summary").textContent = `${stories.length} ${stories.length === 1 ? "notícia" : "notícias"} nesta edição`;
      if (!stories.length) {
        listRoot.appendChild(element("p", "briefing-empty", "Nenhuma notícia encontrada nesta edição."));
      } else {
        const featured = stories.find((story) => story.id === selected.destaque);
        if (featured) listRoot.appendChild(storyCard(selected, featured, true));
        const rest = stories.filter((story) => story !== featured);
        if (rest.length) {
          const section = element("section", "briefing-more");
          if (featured) section.appendChild(element("h3", "briefing-more-title", "Mais leituras"));
          const grid = element("div", "briefing-story-grid");
          rest.forEach((story) => grid.appendChild(storyCard(selected, story, false)));
          section.appendChild(grid);
          listRoot.appendChild(section);
        }
      }
      refreshIcons();
    }
    function renderEdition() {
      query("briefing-edition-date").textContent = formatDate(selected.data, true);
      ui.categories.replaceChildren();
      ["Todas", ...new Set(selected.noticias.flatMap((story) => story.categorias))].forEach((name) => {
        const button = element("button", "briefing-category", name);
        button.type = "button";
        button.addEventListener("click", () => { category = name; renderStories(); });
        ui.categories.appendChild(button);
      });
      ui.index.replaceChildren();
      ordered().forEach((story) => {
        const item = element("li");
        const anchor = link(storyHref(selected, story), "", "");
        anchor.append(element("span", "", story.titulo), icon("chevron-right"));
        item.appendChild(anchor);
        ui.index.appendChild(item);
      });
      ui.archive.replaceChildren();
      editions.forEach((edition) => {
        const item = element("li");
        const anchor = link(editionHref(edition), "briefing-archive-link", "");
        anchor.append(element("span", "", formatDate(edition.data)), element("span", "", `${edition.noticias.length} ${edition.noticias.length === 1 ? "notícia" : "notícias"}`));
        if (edition.data === selected.data) anchor.setAttribute("aria-current", "date");
        item.appendChild(anchor);
        ui.archive.appendChild(item);
      });
      renderStories();
    }
    ui.select.addEventListener("change", () => {
      selected = editions.find((edition) => edition.data === ui.select.value) || editions[0];
      category = "Todas";
      ui.search.value = "";
      const queryParams = new URLSearchParams(window.location.search);
      queryParams.set("edicao", selected.data);
      window.history?.replaceState(null, "", `?${queryParams}#briefing-diario`);
      renderEdition();
    });
    ui.search.addEventListener("input", renderStories);
    query("briefing-clear").addEventListener("click", () => { category = "Todas"; ui.search.value = ""; renderStories(); });
    renderEdition();
    initializeDiscovery(selected);
  }

  function initializeArticle() {
    const edition = editions.find((item) => item.data === params.get("edicao"));
    const story = edition?.noticias.find((item) => item.id === params.get("noticia"));
    if (!story) { query("briefing-not-found").hidden = false; refreshIcons(); return; }
    const back = editionHref(edition);
    ["briefing-back", "briefing-bottom-back"].forEach((id) => { query(id).href = back; });
    document.title = `${story.titulo} | Briefing tecnológico LP`;
    query("briefing-article-edition").textContent = `EDIÇÃO DE ${formatDate(edition.data, true).toUpperCase()}`;
    query("briefing-article-title").textContent = story.titulo;
    query("briefing-article-summary").textContent = story.resumo;
    const byline = publisher(story);
    query("briefing-article-publisher").replaceChildren(...byline.children);
    query("briefing-article-publisher").hidden = byline.hidden;
    query("briefing-article-credit").textContent = story.creditoEditorial;
    query("briefing-article-categories").replaceChildren(...tags(story).children);
    [["Artigo original", formatDate(story.dataOriginal)], ["Publicado no briefing", formatDate(story.dataPublicacao)], ["Tempo de leitura", `${minutes(story)} min`]].forEach(([label, value]) => {
      const item = element("div");
      item.append(element("dt", "", label), element("dd", "", value));
      query("briefing-article-metadata").appendChild(item);
    });
    const gallery = [story.capa, ...story.secoes.flatMap((section) => section.imagens)].filter(Boolean);
    const viewer = { index: 0, trigger: null, request: 0 };
    const dialog = query("briefing-image-viewer");
    function displayImage() {
      const photoData = gallery[viewer.index];
      const request = ++viewer.request;
      query("briefing-image-caption").textContent = photoData.legenda;
      query("briefing-image-counter").textContent = `${viewer.index + 1} / ${gallery.length}`;
      query("briefing-image-original").href = photoData.arquivo;
      query("briefing-image-previous").hidden = gallery.length < 2;
      query("briefing-image-next").hidden = gallery.length < 2;
      query("briefing-image-stage").classList.toggle("single-image", gallery.length < 2);
      const photo = element("img", "problem-expanded-image");
      photo.alt = photoData.alt;
      if (photoData.largura) { photo.width = photoData.largura; photo.height = photoData.altura; }
      photo.decoding = "async";
      photo.hidden = true;
      const message = element("p", "problem-image-message", "Carregando imagem...");
      message.setAttribute("role", "status");
      photo.addEventListener("load", () => { if (request === viewer.request && dialog.open) { photo.hidden = false; message.hidden = true; } });
      photo.addEventListener("error", () => { if (request === viewer.request && dialog.open) { photo.hidden = true; message.hidden = false; message.textContent = "Não foi possível carregar esta imagem."; message.setAttribute("role", "alert"); } });
      query("briefing-image-media").replaceChildren(photo, message);
      photo.src = photoData.arquivo;
    }
    const closeViewer = () => { if (dialog.open) dialog.close(); };
    const changeImage = (step) => { if (dialog.open && gallery.length > 1) { viewer.index = (viewer.index + step + gallery.length) % gallery.length; displayImage(); } };
    function figure(photoData) {
      const frame = element("figure", "briefing-figure");
      const button = element("button", "briefing-image-button");
      button.type = "button";
      button.setAttribute("aria-label", `Ampliar imagem: ${photoData.alt}`);
      button.setAttribute("aria-haspopup", "dialog");
      button.title = "Ampliar imagem";
      const photo = element("img");
      photo.src = photoData.arquivo;
      photo.alt = photoData.alt;
      if (photoData.largura) { photo.width = photoData.largura; photo.height = photoData.altura; }
      photo.loading = "lazy";
      photo.decoding = "async";
      const expand = element("span", "briefing-image-expand");
      expand.setAttribute("aria-hidden", "true");
      expand.appendChild(icon("maximize-2"));
      photo.addEventListener("error", () => {
        if (button.disabled) return;
        photo.hidden = true;
        expand.hidden = true;
        button.disabled = true;
        button.appendChild(element("span", "briefing-image-error", "Imagem indisponível."));
      });
      button.append(photo, expand);
      button.addEventListener("click", () => {
        if (button.disabled) return;
        viewer.index = gallery.indexOf(photoData);
        viewer.trigger = button;
        dialog.showModal();
        document.body.classList.toggle("image-viewer-open", true);
        displayImage();
        query("briefing-image-close").focus();
      });
      frame.append(button, element("figcaption", "", photoData.legenda));
      return frame;
    }
    const body = query("briefing-article-body");
    if (story.capa) body.appendChild(figure(story.capa));
    story.secoes.forEach((section, index) => {
      const part = element("section", "briefing-article-section");
      part.id = `leitura-${index + 1}`;
      part.appendChild(element("h2", "", section.titulo));
      section.paragrafos.forEach((paragraph) => part.appendChild(element("p", "", paragraph)));
      section.imagens.forEach((photo) => part.appendChild(figure(photo)));
      body.appendChild(part);
      const item = element("li");
      item.appendChild(link(`#${part.id}`, "", section.titulo));
      query("briefing-outline").appendChild(item);
    });
    const sourceIndex = element("li");
    sourceIndex.appendChild(link("#briefing-sources-title", "", "Fontes e leitura completa"));
    query("briefing-outline").appendChild(sourceIndex);
    story.fontes.forEach((source) => {
      const item = element("li");
      const anchor = link(source.url, "", source.titulo);
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      anchor.appendChild(icon("external-link"));
      item.appendChild(anchor);
      query("briefing-sources").appendChild(item);
    });
    query("briefing-image-close").addEventListener("click", closeViewer);
    query("briefing-image-previous").addEventListener("click", () => changeImage(-1));
    query("briefing-image-next").addEventListener("click", () => changeImage(1));
    dialog.addEventListener("click", (event) => { if (event.target === dialog) closeViewer(); });
    dialog.addEventListener("close", () => { viewer.request++; document.body.classList.toggle("image-viewer-open", false); if (viewer.trigger?.isConnected) viewer.trigger.focus({ preventScroll: true }); });
    window.addEventListener("keydown", (event) => {
      if (!dialog.open) return;
      if (["ArrowLeft", "ArrowRight", "Escape"].includes(event.key)) event.preventDefault();
      if (event.key === "ArrowLeft") changeImage(-1);
      if (event.key === "ArrowRight") changeImage(1);
      if (event.key === "Escape") closeViewer();
    });
    articleRoot.hidden = false;
    refreshIcons();
  }
  if (listRoot) initializeList();
  if (articleRoot) initializeArticle();
})();
