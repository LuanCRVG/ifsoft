(() => {
  const tabs = Array.from(document.querySelectorAll("#portal-tabs [role='tab']"));
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));
  const hashes = ["#notas-tecnicas", "#problemas-no-sistema", "#briefing-diario"];
  const heading = document.querySelector("#portal-heading");
  const subheading = document.querySelector("#portal-subheading");
  const footer = document.querySelector("#portal-footer-context");
  const headerLabel = document.querySelector("#portal-header-label");
  const headings = [
    ["Notas e informes técnicos dos documentos fiscais eletrônicos", "Prazos para implementação nos ambientes de homologação e produção", "Notas e informes técnicos", "Documentos fiscais eletrônicos"],
    ["Ocorrências e pareceres técnicos do sistema", "Registro de problemas, análise técnica e possíveis soluções", "Ocorrências e pareceres técnicos", "Acompanhamento técnico"],
    ["Tecnologia, Delphi e ideias para o nosso projeto", "Seleção editorial da equipe IFSOFT", "Briefing diário · Editorial da equipe", "Tecnologia e desenvolvimento"]
  ];
  document.querySelector("#tab-notes-count").textContent = String(notasTecnicas.length);

  function activate(index) {
    tabs.forEach((tab, tabIndex) => {
      const selected = tabIndex === index;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      tab.classList.toggle("is-active", selected);
      panels[tabIndex].hidden = !selected;
    });
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
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      tabs[next].click();
      tabs[next].focus();
    });
  });
  const activeIndex = () => Math.max(0, hashes.indexOf(window.location.hash));
  window.addEventListener("hashchange", () => activate(activeIndex()));
  activate(activeIndex());
})();
