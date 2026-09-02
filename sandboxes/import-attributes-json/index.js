import "./styles.css";

// A static import, resolved at module-load time, with the `type: "json"` import attribute telling
// the runtime exactly how to interpret the file — no fetch() + res.json(), no bundler-specific
// `import config from "./config.json"` special-casing.
import config from "./config.json" with { type: "json" };

console.log("loaded config module:", config);

const list = document.getElementById("config");
for (const [key, value] of Object.entries(config)) {
  const dt = document.createElement("dt");
  dt.textContent = key;
  const dd = document.createElement("dd");
  dd.textContent = Array.isArray(value) ? value.join(", ") : String(value);
  list.append(dt, dd);
}
