import "./shared/playground.css";
import "./shared/tabs.css";
import "./shared/segmented-control.css";
import "./shared/range-slider.css";
import "./styles.css";
import { initTabs } from "./shared/tabs.js";
import { updateRangeSlider } from "./shared/range-slider.js";

const $ = (id) => document.getElementById(id);
const card = $("shape-card");

// Without support every corner is plainly rounded, so the note says so rather than letting the demo look broken.
$("support-note").hidden = CSS.supports("corner-shape", "squircle");

// The only things JS changes are two custom properties and one attribute; the shapes themselves are all CSS.
function update() {
  const keyword = document.querySelector("input[name='shape']:checked").value;
  const curvature = Number($("curvature-input").value);
  const shape = keyword === "superellipse" ? `superellipse(${curvature})` : keyword;
  const radius = `${$("radius-input").value}px`;
  const animate = $("animate-toggle").checked;

  card.style.setProperty("--shape", shape);
  card.style.setProperty("--radius", radius);
  card.toggleAttribute("data-animate", animate);
  $("curvature-field").hidden = keyword !== "superellipse";

  updateRangeSlider($("curvature-input"), $("curvature-value"));
  updateRangeSlider($("radius-input"), $("radius-value"), (value) => `${value}px`);

  $("readout").textContent = animate
    ? `.card {\n  border-radius: ${radius};\n  corner-shape: scoop;\n  transition: corner-shape 0.6s ease;\n}\n\n.card:hover {\n  corner-shape: ${shape};\n}`
    : `.card {\n  border-radius: ${radius};\n  corner-shape: ${shape};\n}`;
}

initTabs("#demo-switch .tab");
document.querySelectorAll("input[name='shape']").forEach((radio) => radio.addEventListener("change", update));
["curvature-input", "radius-input"].forEach((id) => $(id).addEventListener("input", update));
$("animate-toggle").addEventListener("change", update);
update();
