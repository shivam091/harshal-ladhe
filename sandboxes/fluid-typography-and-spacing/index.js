import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./shared/range-slider.css";
import "./styles.css";
import { positionRangeBubble } from "./shared/range-slider.js";

const frame = document.getElementById("viewport-frame");
const card = document.getElementById("fluid-card");
const widthInput = document.getElementById("width-input");
const widthLabel = document.getElementById("width-label");
const widthValue = document.getElementById("width-value");
const readout = document.getElementById("fluid-readout");

// Reads the currently checked scaling-mode radio ("fluid" or "stepped").
function getSelectedMode() {
  return document.querySelector("input[name='scale-mode']:checked").value;
}

// Rounds a computed CSS length (a px string like "24.5px") to whole pixels for the readout.
function toPx(value) {
  return `${Math.round(parseFloat(value))}px`;
}

function update() {
  const width = widthInput.value;
  const stepped = getSelectedMode() === "stepped";

  frame.style.width = `${width}px`;
  card.classList.toggle("stepped", stepped);

  widthLabel.textContent = `${width}px`;
  widthValue.textContent = `${width}px`;
  positionRangeBubble(widthInput, widthValue);

  // Read the resolved sizes back AFTER the container-query/clamp() layout has settled, so the
  // readout always shows what actually rendered rather than a value computed in JS.
  requestAnimationFrame(() => {
    const heading = card.querySelector(".fluid-heading");
    const body = card.querySelector(".fluid-body");
    const chips = card.querySelector(".fluid-chips");
    const headingSize = toPx(getComputedStyle(heading).fontSize);
    const bodySize = toPx(getComputedStyle(body).fontSize);
    const cardPadding = toPx(getComputedStyle(card).paddingLeft);
    const chipGap = toPx(getComputedStyle(chips).gap);

    readout.textContent = [
      `mode: ${stepped ? "stepped breakpoints" : "fluid clamp()"}  |  frame width: ${width}px`,
      `heading font-size: ${headingSize}`,
      `body font-size:    ${bodySize}`,
      `card padding:      ${cardPadding}`,
      `chip gap:          ${chipGap}`,
    ].join("\n");
  });
}

widthInput.addEventListener("input", update);
document.querySelectorAll("input[name='scale-mode']").forEach((radio) =>
  radio.addEventListener("change", update)
);

update();
