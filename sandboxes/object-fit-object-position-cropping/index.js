import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./shared/range-slider.css";
import { positionRangeBubble } from "./shared/range-slider.js";
import "./styles.css";

const photo = document.getElementById("photo");
const readout = document.getElementById("readout");
const xRange = document.getElementById("x-range");
const yRange = document.getElementById("y-range");
const xValue = document.getElementById("x-value");
const yValue = document.getElementById("y-value");
const xBubble = document.getElementById("x-bubble");
const yBubble = document.getElementById("y-bubble");

function update() {
  const fit = document.querySelector("input[name='fit']:checked").value;
  const x = xRange.value;
  const y = yRange.value;

  photo.style.setProperty("--fit", fit);
  photo.style.setProperty("--pos-x", `${x}%`);
  photo.style.setProperty("--pos-y", `${y}%`);

  xValue.textContent = `${x}%`;
  yValue.textContent = `${y}%`;
  xBubble.textContent = `${x}%`;
  yBubble.textContent = `${y}%`;
  positionRangeBubble(xRange, xBubble);
  positionRangeBubble(yRange, yBubble);

  readout.textContent = `object-fit: ${fit}; object-position: ${x}% ${y}%;`;
}

document.querySelectorAll("input[name='fit']").forEach((radio) => radio.addEventListener("change", update));
xRange.addEventListener("input", update);
yRange.addEventListener("input", update);

update();
