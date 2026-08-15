import "./shared/playground.css";
import "./shared/range-slider.css";
import "./styles.css";
import { positionRangeBubble } from "./shared/range-slider.js";

const grid = document.getElementById("grid-preview");
const output = document.getElementById("grid-output");

const columnsInput = document.getElementById("columns-input");
const rowHeightInput = document.getElementById("row-height-input");
const gapInput = document.getElementById("gap-input");
const itemCountInput = document.getElementById("item-count-input");

const columnsValue = document.getElementById("columns-value");
const rowHeightValue = document.getElementById("row-height-value");
const gapValue = document.getElementById("gap-value");
const itemCountValue = document.getElementById("item-count-value");

// Rebuilds the numbered item boxes to match the current item count, reusing existing ones so items don't re-render (and re-animate) on every slider tick.
function renderItems(count) {
  const current = grid.children.length;

  if (count > current) {
    for (let i = current; i < count; i++) {
      const item = document.createElement("div");
      item.className = "grid-item";
      item.textContent = `Item ${i + 1}`;
      grid.appendChild(item);
    }
  } else if (count < current) {
    for (let i = current; i > count; i--) {
      grid.removeChild(grid.lastElementChild);
    }
  }
}

function updateGrid() {
  const columns = Number(columnsInput.value);
  const rowHeight = Number(rowHeightInput.value);
  const gap = Number(gapInput.value);
  const itemCount = Number(itemCountInput.value);

  columnsValue.textContent = columns;
  rowHeightValue.textContent = `${rowHeight}px`;
  gapValue.textContent = `${gap}px`;
  itemCountValue.textContent = itemCount;

  positionRangeBubble(columnsInput, columnsValue);
  positionRangeBubble(rowHeightInput, rowHeightValue);
  positionRangeBubble(gapInput, gapValue);
  positionRangeBubble(itemCountInput, itemCountValue);

  grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  grid.style.gridAutoRows = `${rowHeight}px`;
  grid.style.gap = `${gap}px`;

  renderItems(itemCount);

  output.textContent = `grid-template-columns: repeat(${columns}, 1fr);
grid-auto-rows: ${rowHeight}px;
gap: ${gap}px;
`;
}

[columnsInput, rowHeightInput, gapInput, itemCountInput].forEach((input) =>
  input.addEventListener("input", updateGrid)
);

updateGrid();
