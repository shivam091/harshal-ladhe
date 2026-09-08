import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./shared/range-slider.css";
import "./styles.css";
import { positionRangeBubble } from "./shared/range-slider.js";

const frame = document.getElementById("frame");
const grid = document.getElementById("grid");
const widthInput = document.getElementById("width-input");
const widthLabel = document.getElementById("width-label");
const widthValue = document.getElementById("width-value");
const fewerCardsToggle = document.getElementById("fewer-cards-toggle");
const readout = document.getElementById("readout");
const cards = Array.from(document.querySelectorAll(".card"));

function getSelectedMode() {
  return document.querySelector("input[name='repeat-mode']:checked").value;
}

function update() {
  const width = widthInput.value;
  const mode = getSelectedMode();
  const fewerCards = fewerCardsToggle.checked;

  frame.style.width = `${width}px`;
  widthLabel.textContent = `${width}px`;
  widthValue.textContent = `${width}px`;
  positionRangeBubble(widthInput, widthValue);

  grid.classList.toggle("mode-auto-fill", mode === "auto-fill");
  cards.forEach((card, i) => card.classList.toggle("hidden-card", fewerCards && i >= 2));

  requestAnimationFrame(() => {
    // Count actual rendered tracks straight from the resolved grid-template-columns.
    const trackCount = getComputedStyle(grid).gridTemplateColumns.split(" ").filter(Boolean).length;

    readout.textContent = [
      `frame width: ${width}px  |  mode: ${mode}  |  cards: ${fewerCards ? 2 : cards.length}`,
      `rendered columns: ${trackCount}`,
      fewerCards
        ? mode === "auto-fit"
          ? "auto-fit collapses the empty tracks, so the 2 cards stretch to fill the row."
          : "auto-fill keeps reserving space for the empty tracks, so the 2 cards stay pinned to their minmax() minimum width."
        : "with enough cards to fill every track, auto-fit and auto-fill render identically.",
    ].join("\n");
  });
}

widthInput.addEventListener("input", update);
fewerCardsToggle.addEventListener("change", update);
document.querySelectorAll("input[name='repeat-mode']").forEach((radio) =>
  radio.addEventListener("change", update)
);

update();
