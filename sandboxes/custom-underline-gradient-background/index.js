import "./shared/playground.css";
import "./shared/range-slider.css";
import { positionRangeBubble } from "./shared/range-slider.js";
import "./styles.css";

const demoArea = document.querySelector(".demo-area");
const readout = document.getElementById("readout");
const thicknessRange = document.getElementById("thickness-range");
const gapRange = document.getElementById("gap-range");
const thicknessValue = document.getElementById("thickness-value");
const gapValue = document.getElementById("gap-value");
const thicknessBubble = document.getElementById("thickness-bubble");
const gapBubble = document.getElementById("gap-bubble");

function update() {
  const thickness = thicknessRange.value;
  const gap = gapRange.value;

  demoArea.style.setProperty("--underline-thickness", `${thickness}px`);
  demoArea.style.setProperty("--underline-gap", `${gap}px`);

  thicknessValue.textContent = `${thickness}px`;
  gapValue.textContent = `${gap}px`;
  thicknessBubble.textContent = `${thickness}px`;
  gapBubble.textContent = `${gap}px`;
  positionRangeBubble(thicknessRange, thicknessBubble);
  positionRangeBubble(gapRange, gapBubble);

  readout.textContent = `--underline-thickness: ${thickness}px — --underline-gap: ${gap}px`;
}

thicknessRange.addEventListener("input", update);
gapRange.addEventListener("input", update);

update();
