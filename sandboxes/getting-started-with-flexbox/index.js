import "./shared/playground.css";
import "./shared/range-slider.css";
import "./shared/segmented-control.css";
import "./styles.css";
import { updateRangeSlider } from "./shared/range-slider.js";

const container = document.getElementById("flex-preview");
const output = document.getElementById("flex-output");

const directionRadios = document.querySelectorAll("input[name='flex-direction']");
const wrapSelect = document.getElementById("flex-wrap-select");
const justifyContentSelect = document.getElementById("justify-content-select");
const alignItemsSelect = document.getElementById("align-items-select");
const gapInput = document.getElementById("gap-input");
const itemCountInput = document.getElementById("item-count-input");

const gapValue = document.getElementById("gap-value");
const itemCountValue = document.getElementById("item-count-value");

// Rebuilds the numbered item boxes to match the current item count, reusing existing ones so items don't re-render on every slider tick.
function renderItems(count) {
  const current = container.children.length;

  if (count > current) {
    for (let i = current; i < count; i++) {
      const item = document.createElement("div");
      item.className = "flex-item";
      item.textContent = `Item ${i + 1}`;
      container.appendChild(item);
    }
  } else if (count < current) {
    for (let i = current; i > count; i--) {
      container.removeChild(container.lastElementChild);
    }
  }
}

function updateFlex() {
  const direction = document.querySelector("input[name='flex-direction']:checked").value;
  const wrap = wrapSelect.value;
  const justifyContent = justifyContentSelect.value;
  const alignItems = alignItemsSelect.value;
  const gap = Number(gapInput.value);
  const itemCount = Number(itemCountInput.value);

  updateRangeSlider(gapInput, gapValue, (v) => `${v}px`);
  updateRangeSlider(itemCountInput, itemCountValue);

  container.style.flexDirection = direction;
  container.style.flexWrap = wrap;
  container.style.justifyContent = justifyContent;
  container.style.alignItems = alignItems;
  container.style.gap = `${gap}px`;

  renderItems(itemCount);

  output.textContent = `display: flex;
flex-direction: ${direction};
flex-wrap: ${wrap};
justify-content: ${justifyContent};
align-items: ${alignItems};
gap: ${gap}px;
`;
}

directionRadios.forEach((radio) => radio.addEventListener("change", updateFlex));
[wrapSelect, justifyContentSelect, alignItemsSelect].forEach((select) =>
  select.addEventListener("change", updateFlex)
);
[gapInput, itemCountInput].forEach((input) => input.addEventListener("input", updateFlex));

updateFlex();
