(() => {
  const calendar = new Intl.DateTimeFormat("en", {
    timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit"
  });
  const parse = (value) => {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const date = new Date(`${value}T00:00:00Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value ? date : null;
  };
  const today = () => {
    const parts = Object.fromEntries(calendar.formatToParts(new Date()).map(({ type, value }) => [type, value]));
    return Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day));
  };
  const render = (node, currentDay) => {
    const value = node.getAttribute("data-schema-date");
    const date = parse(value);
    if (!date) {
      node.textContent = "Últ. atualização: não informada";
      return;
    }
    // Compare calendar dates, not elapsed hours, to avoid daylight-saving offsets.
    const days = Math.round((currentDay - date.getTime()) / 86400000);
    const age = days === 0 ? "hoje"
      : days > 0 ? `há ${days} ${days === 1 ? "dia" : "dias"}`
        : `em ${-days} ${days === -1 ? "dia" : "dias"}`;
    node.textContent = "Últ. atualização: ";
    const time = document.createElement("time");
    time.setAttribute("datetime", value);
    time.textContent = value.split("-").reverse().join("/");
    const relative = document.createElement("span");
    relative.className = "schema-age";
    relative.textContent = ` · ${age}`;
    node.append(time, relative);
  };
  const create = (value) => {
    const node = document.createElement("p");
    node.className = "schema-updated";
    node.setAttribute("data-schema-date", typeof value === "string" ? value : "");
    render(node, today());
    return node;
  };
  const refresh = () => {
    const currentDay = today();
    document.querySelectorAll(".schema-updated").forEach((node) => render(node, currentDay));
  };
  window.LP_SCHEMA_DATES = Object.freeze({ create, refresh });
  window.addEventListener("focus", refresh);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) refresh(); });
  if (typeof window.setInterval === "function") window.setInterval(refresh, 60000);
})();
