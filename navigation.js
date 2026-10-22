(() => {
  const tabs = Array.from(document.querySelectorAll("#portal-tabs [role='tab']"));
  const tabList = document.querySelector("#portal-tabs");
  const problemTab = document.querySelector("#tab-problems");
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));
  const hashes = ["#notas-tecnicas", "#problemas-no-sistema", "#briefing-diario", "#download-de-utilitarios"];
  const heading = document.querySelector("#portal-heading");
  const subheading = document.querySelector("#portal-subheading");
  const footer = document.querySelector("#portal-footer-context");
  const headerLabel = document.querySelector("#portal-header-label");
  const headings = [
    ["Notas e informes técnicos dos documentos fiscais eletrônicos", "Prazos para implementação nos ambientes de homologação e produção", "Notas e informes técnicos", "Documentos fiscais eletrônicos"],
    ["Ocorrências e pareceres técnicos do sistema", "Registro de problemas, análise técnica e possíveis soluções", "Ocorrências e pareceres técnicos", "Acompanhamento técnico"],
    ["Notícias de tecnologia e desenvolvimento", "Conteúdo selecionado por Luan Paranhos", "Briefing tecnológico · Notícias e fontes", "Tecnologia e desenvolvimento"],
    ["Utilitários para suporte e manutenção", "Programas desenvolvidos por Luan Paranhos", "Download de Utilitários", "Programas e ferramentas"]
  ];
  document.querySelector("#tab-notes-count").textContent = String(notasTecnicas.length);

  function activate(index) {
    tabs.forEach((tab, tabIndex) => {
      const selected = tabIndex === index;
      tab.hidden = tab === problemTab && !selected;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      tab.classList.toggle("is-active", selected);
      panels[tabIndex].hidden = !selected;
    });
    tabList.classList.toggle("has-problems-tab", !problemTab.hidden);
    const [title, description, context, label] = headings[index];
    heading.textContent = title;
    subheading.textContent = description;
    footer.textContent = context;
    if (headerLabel) headerLabel.textContent = label;
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      activate(index);
      if (window.location.hash !== hashes[index]) window.location.hash = hashes[index];
    });
    tab.addEventListener("keydown", (event) => {
      const visibleTabs = tabs.filter((item) => !item.hidden);
      const visibleIndex = visibleTabs.indexOf(tab);
      let next;
      if (event.key === "ArrowRight") next = (visibleIndex + 1) % visibleTabs.length;
      if (event.key === "ArrowLeft") next = (visibleIndex + visibleTabs.length - 1) % visibleTabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = visibleTabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      visibleTabs[next].click();
      visibleTabs[next].focus();
    });
  });
  document.querySelector("#footer-problems-link")?.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    problemTab.click();
    problemTab.focus();
  });
  const activeIndex = () => Math.max(0, hashes.indexOf(window.location.hash));
  window.addEventListener("hashchange", () => activate(activeIndex()));
  activate(activeIndex());
})();
