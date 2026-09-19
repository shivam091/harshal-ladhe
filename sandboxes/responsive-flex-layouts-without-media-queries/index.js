import "./shared/playground.css";
import "./shared/range-slider.css";
import "./styles.css";
import { updateRangeSlider } from "./shared/range-slider.js";

const containerFrame = document.getElementById("container-frame");
const flexPreview = document.getElementById("flex-preview");
const cssOutput = document.getElementById("css-output");
const statsOutput = document.getElementById("stats-output");

const containerWidthInput = document.getElementById("container-width-input");
const basisInput = document.getElementById("basis-input");
const itemCountInput = document.getElementById("item-count-input");
const gapInput = document.getElementById("gap-input");
const minWidthToggle = document.getElementById("min-width-toggle");

const containerWidthValue = document.getElementById("container-width-value");
const basisValue = document.getElementById("basis-value");
const itemCountValue = document.getElementById("item-count-value");
const gapValue = document.getElementById("gap-value");

/*
  Rebuilds the numbered item boxes to match the current count, reusing existing ones so items
  don't get torn down and re-created (and lose any transition state) on every slider tick.
*/
function renderItems(count) {
  const current = flexPreview.children.length;

  if (count > current) {
    for (let i = current; i < count; i++) {
      const item = document.createElement("div");
      item.className = "flex-item";
      item.textContent = `Item ${i + 1}`;
      flexPreview.appendChild(item);
    }
  } else if (count < current) {
    for (let i = current; i > count; i--) {
      flexPreview.removeChild(flexPreview.lastElementChild);
    }
  }
}

/*
  Reads back real layout geometry (offsetTop/getBoundingClientRect) rather than re-deriving the
  flex-wrap line-breaking math in JS — the browser's own layout is the ground truth for "how many
  items fit on a row" and "how wide did the first item actually render," including every edge
  case (rounding, the min-width floor, growth filling leftover space) this playground is meant to
  demonstrate.
*/
function measureFirstRow() {
  const items = Array.from(flexPreview.children);
  if (items.length === 0) return { perRow: 0, firstWidth: 0 };

  const firstTop = items[0].offsetTop;
  const perRow = items.filter((item) => Math.abs(item.offsetTop - firstTop) < 1).length;
  const firstWidth = Math.round(items[0].getBoundingClientRect().width);

  return { perRow, firstWidth };
}

function update() {
  const containerWidth = Number(containerWidthInput.value);
  const basis = Number(basisInput.value);
  const itemCount = Number(itemCountInput.value);
  const gap = Number(gapInput.value);
  const enforceMinWidth = minWidthToggle.checked;

  updateRangeSlider(containerWidthInput, containerWidthValue, (v) => `${v}px`);
  updateRangeSlider(basisInput, basisValue, (v) => `${v}px`);
  updateRangeSlider(itemCountInput, itemCountValue);
  updateRangeSlider(gapInput, gapValue, (v) => `${v}px`);

  // The container itself is the "narrowing viewport" — driven entirely from the slider, never CSS resize.
  containerFrame.style.width = `${containerWidth}px`;

  renderItems(itemCount);

  flexPreview.style.gap = `${gap}px`;
  Array.from(flexPreview.children).forEach((item) => {
    item.style.flex = `1 1 ${basis}px`;
    item.style.minWidth = enforceMinWidth ? `${basis}px` : "0";
  });

  const { perRow, firstWidth } = measureFirstRow();
  const rowNoun = perRow === 1 ? "item" : "items";
  const shrinkNote =
    !enforceMinWidth && firstWidth < basis
      ? ` — shrunk ${basis - firstWidth}px below its flex-basis, no floor to stop it.`
      : enforceMinWidth && firstWidth >= basis && containerWidth < basis
        ? ` — held at its min-width floor and overflowing the ${containerWidth}px container.`
        : ".";
  statsOutput.textContent = `${perRow} ${rowNoun} fit in the first row at ${containerWidth}px. First item renders at ${firstWidth}px (flex-basis is ${basis}px)${shrinkNote}`;

  cssOutput.textContent = `.flex-container {
  display: flex;
  flex-wrap: wrap;
  gap: ${gap}px;
}

.flex-item {
  flex: 1 1 ${basis}px;
  min-width: ${enforceMinWidth ? `${basis}px` : "0"};${enforceMinWidth ? " /* floor: won't shrink past this */" : " /* no floor: can shrink to nothing */"}
}`;
}

[containerWidthInput, basisInput, itemCountInput, gapInput, minWidthToggle].forEach((input) =>
  input.addEventListener("input", update)
);

update();
