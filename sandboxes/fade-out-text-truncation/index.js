import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./shared/range-slider.css";
import { positionRangeBubble } from "./shared/range-slider.js";
import "./styles.css";

const target = document.getElementById("fade-truncate");
const readout = document.getElementById("readout");
const widthRange = document.getElementById("width-range");
const widthValue = document.getElementById("width-value");
const widthBubble = document.getElementById("width-bubble");

function update() {
  const width = widthRange.value;
  const mode = document.querySelector("input[name='mode']:checked").value;

  target.style.setProperty("--fade-width", `${width}px`);
  target.dataset.mode = mode;

  widthValue.textContent = `${width}px`;
  widthBubble.textContent = `${width}px`;
  positionRangeBubble(widthRange, widthBubble);

  readout.textContent = `--fade-width: ${width}px — mode: ${mode}`;
}

widthRange.addEventListener("input", update);
document.querySelectorAll("input[name='mode']").forEach((radio) =>
  radio.addEventListener("change", update)
);

update();
