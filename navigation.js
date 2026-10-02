(() => {
  const tabs = Array.from(document.querySelectorAll("#portal-tabs [role='tab']"));
  const panels = [document.querySelector("#panel-notes"), document.querySelector("#panel-problems")];
  const hashes = ["#notas-tecnicas", "#problemas-no-sistema"];
  const heading = document.querySelector("#portal-heading");
  const subheading = document.querySelector("#portal-subheading");
  const footer = document.querySelector("#portal-footer-context");
  document.querySelector("#tab-notes-count").textContent = String(notasTecnicas.length);

  function activate(index) {
    tabs.forEach((tab, tabIndex) => {
      const selected = tabIndex === index;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      tab.classList.toggle("is-active", selected);
      panels[tabIndex].hidden = !selected;
    });
    heading.textContent = index === 0
      ? "Notas e informes técnicos dos documentos fiscais eletrônicos"
      : "Ocorrências e pareceres técnicos do sistema";
    subheading.textContent = index === 0
      ? "Prazos para implementação nos ambientes de homologação e produção"
      : "Registro de problemas, análise técnica e possíveis soluções";
    footer.textContent = index === 0 ? "Notas e informes técnicos" : "Ocorrências e pareceres técnicos";
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
  window.addEventListener("hashchange", () => activate(window.location.hash === hashes[1] ? 1 : 0));
  activate(window.location.hash === hashes[1] ? 1 : 0);
})();
