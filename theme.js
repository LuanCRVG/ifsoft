(() => {
  "use strict";
  const storageKey = "ifsoft.tema.v1";
  const root = document.documentElement;
  let theme = "light";
  try { if (window.localStorage.getItem(storageKey) === "dark") theme = "dark"; }
  catch { /* The toggle still works when browser storage is unavailable. */ }

  function apply(next, remember = false) {
    theme = next === "dark" ? "dark" : "light";
    root.setAttribute("data-theme", theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#171b22" : "#1c2b40");
    const toggle = document.getElementById("theme-toggle");
    if (toggle) {
      const label = theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro";
      toggle.setAttribute("aria-label", label);
      toggle.setAttribute("title", label);
      toggle.setAttribute("aria-pressed", String(theme === "dark"));
    }
    if (remember) {
      try { window.localStorage.setItem(storageKey, theme); }
      catch { /* Keep the selected theme for this page even without persistence. */ }
    }
  }

  apply(theme);
  function initialize() {
    const toggle = document.getElementById("theme-toggle");
    if (!toggle) return;
    apply(theme);
    toggle.hidden = false;
    toggle.addEventListener("click", () => apply(theme === "dark" ? "light" : "dark", true));
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
  window.addEventListener("storage", (event) => {
    if (event.key === storageKey || event.key === null) apply(event.newValue);
  });
})();
