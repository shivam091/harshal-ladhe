import "./shared/playground.css";
import "./shared/range-slider.css";
import "./styles.css";
import { positionRangeBubble } from "./shared/range-slider.js";

const frame = document.getElementById("frame");
const widthInput = document.getElementById("width-input");
const widthLabel = document.getElementById("width-label");
const widthValue = document.getElementById("width-value");
const readout = document.getElementById("readout");
const ratioBox = document.querySelector(".ratio-box");
const fixedBox = document.querySelector(".fixed-box");

function toPx(value) {
  return `${Math.round(parseFloat(value))}px`;
}

function update() {
  const width = widthInput.value;

  frame.style.width = `${width}px`;
  widthLabel.textContent = `${width}px`;
  widthValue.textContent = `${width}px`;
  positionRangeBubble(widthInput, widthValue);

  requestAnimationFrame(() => {
    readout.textContent = [
      `frame width: ${width}px`,
      `aspect-ratio box -> ${toPx(getComputedStyle(ratioBox).height)} tall (always 16:9, image never distorts)`,
      `fixed-height box -> ${toPx(getComputedStyle(fixedBox).height)} tall (constant, image stretches to fill it)`,
    ].join("\n");
  });
}

widthInput.addEventListener("input", update);
update();
