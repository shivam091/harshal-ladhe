import "./shared/playground.css";
import "./shared/tabs.css";
import "./shared/segmented-control.css";
import "./shared/range-slider.css";
import "./styles.css";
import { initTabs } from "./shared/tabs.js";
import { updateRangeSlider } from "./shared/range-slider.js";

const $ = (id) => document.getElementById(id);

// Animate: one attribute flips both rings' angles; only the registered one has a type to interpolate.
function updateAnimate() {
  const spun = $("rings").hasAttribute("data-spun");
  const angle = spun ? "300deg" : "0deg";

  $("spin-btn").textContent = spun ? "Rotate both back to 0deg" : "Rotate both to 300deg";
  $("animate-readout").textContent =
    `@property --ring-angle {\n  syntax: "<angle>";\n  inherits: false;\n  initial-value: 0deg;\n}\n\n` +
    `.ring--typed { --ring-angle: ${angle}; }  /* sweeps round */\n` +
    `.ring--plain { --plain-angle: ${angle}; } /* jumps */`;
}

// Count: JS sets one integer; the ring's fill and its number both come from it, and both animate.
function updateCount() {
  const value = $("progress-input").value;
  const ring = $("progress-ring");

  ring.style.setProperty("--progress", value);
  ring.setAttribute("aria-label", `${value}% complete`);
  updateRangeSlider($("progress-input"), $("progress-value"));

  $("count-readout").textContent =
    `.progress-ring {\n  --progress: ${value};\n  counter-reset: progress var(--progress);\n` +
    `  background: conic-gradient(var(--fill) calc(var(--progress) * 1%), var(--track) 0);\n` +
    `  transition: --progress 0.8s ease-out;\n}`;
}

// Type-check: the value is applied by plain CSS rules keyed on data-value, so the browser's own parsing decides.
const verdicts = {
  "tomato": "Both accept it: tomato is a valid <color>, and an unregistered property accepts anything.",
  "#34d399": "Both accept it, and the registered swatch transitions to it, because it knows both values are colours.",
  "12px": "12px isn't a <color>, so the registered property falls back to its initial-value, #818cf8 — not to tomato. The unregistered one accepts it, and background: var(--plain-accent) becomes invalid — so no colour at all.",
  "banana": "Not a colour either. The registered property computes to #818cf8 again; the unregistered one stores the text, and breaks the background that reads it."
};

function updateValidate() {
  const value = document.querySelector("input[name='accent']:checked").value;
  $("swatches").dataset.value = value;
  $("validate-tip").textContent = verdicts[value];
  $("validate-readout").textContent =
    `@property --typed-accent {\n  syntax: "<color>";\n  inherits: false;\n  initial-value: #818cf8;\n}\n\n` +
    `.swatch--typed { --typed-accent: ${value}; } /* registered as <color> */\n` +
    `.swatch--plain { --plain-accent: ${value}; } /* unregistered */`;
}

initTabs("#demo-switch .tab");

$("spin-btn").addEventListener("click", () => {
  $("rings").toggleAttribute("data-spun");
  updateAnimate();
});
$("progress-input").addEventListener("input", updateCount);
document.querySelectorAll("input[name='accent']").forEach((radio) => radio.addEventListener("change", updateValidate));

updateAnimate();
updateCount();
updateValidate();
