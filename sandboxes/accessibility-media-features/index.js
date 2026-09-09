import "./shared/playground.css";
import "./styles.css";

const readout = document.getElementById("readout");

const QUERIES = {
  "reduced motion": window.matchMedia("(prefers-reduced-motion: reduce)"),
  "more contrast": window.matchMedia("(prefers-contrast: more)"),
  "forced colors": window.matchMedia("(forced-colors: active)"),
};

// Reads every query's CURRENT match state — matchMedia's own "change" event fires the moment any
// of them flips, whether from a real OS setting or a DevTools Rendering-panel emulation toggle.
function update() {
  const lines = Object.entries(QUERIES).map(([name, query]) => `${name}: ${query.matches ? "ON" : "off"}`);
  readout.textContent = lines.join("\n");
}

Object.values(QUERIES).forEach((query) => query.addEventListener("change", update));
update();
