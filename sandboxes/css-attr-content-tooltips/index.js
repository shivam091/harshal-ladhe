import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./styles.css";

const toolbar = document.getElementById("toolbar");
const clipToggle = document.getElementById("clip-toggle");
const readout = document.getElementById("readout");

const checked = (name) => document.querySelector(`input[name='${name}']:checked`).value;

// JS only sets three attributes on the toolbar; the tooltip text, placement and reveal are all CSS.
function update() {
  const source = checked("source");
  const position = checked("position");
  const edge = position === "top" ? "bottom" : "top";

  toolbar.dataset.tooltipSource = source;
  toolbar.dataset.tooltipPosition = position;
  toolbar.toggleAttribute("data-clipped", clipToggle.checked);

  const clipped = clipToggle.checked ? "\n\n.toolbar {\n  overflow: hidden; /* clips every tooltip at its edge */\n}" : "";
  readout.textContent = `.icon-btn::after {\n  content: attr(${source});\n  ${edge}: calc(100% + 0.625rem);\n}${clipped}`;
}

document.querySelectorAll("input[name='source'], input[name='position']").forEach((radio) =>
  radio.addEventListener("change", update)
);
clipToggle.addEventListener("change", update);

update();
