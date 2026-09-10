import "./shared/playground.css";
import "./shared/range-slider.css";
import "./styles.css";
import { positionRangeBubble } from "./shared/range-slider.js";

const frame = document.getElementById("frame");
const widthInput = document.getElementById("width-input");
const widthLabel = document.getElementById("width-label");
const widthValue = document.getElementById("width-value");
const readout = document.getElementById("readout");

const boxMin = document.getElementById("box-min");
const boxMax = document.getElementById("box-max");
const boxClamp = document.getElementById("box-clamp");

// Rounds a computed CSS length (a px string like "24.5px") to whole pixels for the readout.
function toPx(value) {
  return `${Math.round(parseFloat(value))}px`;
}

function update() {
  const width = widthInput.value;

  frame.style.width = `${width}px`;
  widthLabel.textContent = `${width}px`;
  widthValue.textContent = `${width}px`;
  positionRangeBubble(widthInput, widthValue);

  // Read resolved widths back after layout settles, so the readout matches what actually rendered.
  requestAnimationFrame(() => {
    const minWidth = toPx(getComputedStyle(boxMin).width);
    const maxPadding = toPx(getComputedStyle(boxMax).paddingLeft);
    const clampWidth = toPx(getComputedStyle(boxClamp).width);

    readout.textContent = [
      `frame width: ${width}px`,
      `min(90%, 60ch)        -> ${minWidth}`,
      `max(1rem, 4%) padding -> ${maxPadding}`,
      `clamp(200px, 50%, 500px) -> ${clampWidth}`,
    ].join("\n");
  });
}

widthInput.addEventListener("input", update);
update();
