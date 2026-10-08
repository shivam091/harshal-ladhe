import "./shared/playground.css";
import "./styles.css";

const picker = document.getElementById("theme-picker");
const readout = document.getElementById("readout");
const switchSupport = document.getElementById("switch-support");

// There's no HTML attribute for the indeterminate state — it can only be set from script.
document.querySelectorAll("[data-indeterminate]").forEach((checkbox) => {
  checkbox.indeterminate = true;
});

// Browsers that don't know the switch attribute still render a working checkbox, so the row says which one you're seeing.
switchSupport.textContent = "switch" in HTMLInputElement.prototype
  ? "rendered as a native switch"
  : "this browser shows a plain checkbox";

// The only thing JS changes is one custom property; which parts of each control take the colour is the browser's decision.
function update() {
  document.documentElement.style.setProperty("--theme-accent", picker.value);
  readout.textContent = `.themed {\n  accent-color: ${picker.value};\n}`;
}

picker.addEventListener("input", update);
update();
