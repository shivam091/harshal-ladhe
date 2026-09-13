import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./styles.css";

const toolbar = document.getElementById("toolbar");
const readout = document.getElementById("readout");

function update() {
  const position = document.querySelector("input[name='position']:checked").value;
  toolbar.dataset.tooltipPosition = position;
  readout.textContent = `content: attr(data-tooltip) — tooltip-position: ${position}`;
}

document.querySelectorAll("input[name='position']").forEach((radio) =>
  radio.addEventListener("change", update)
);

update();
