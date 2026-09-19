import "./shared/playground.css";
import "./shared/range-slider.css";
import "./styles.css";
import { updateRangeSlider } from "./shared/range-slider.js";

const preview = document.getElementById("flex-preview");
const output = document.getElementById("flex-output");

const containerWidthInput = document.getElementById("container-width-input");
const containerWidthValue = document.getElementById("container-width-value");

// One config entry per item — bundles its DOM refs together so the render loop can treat
// A/B/C uniformly instead of repeating the same three-input wiring three times over.
const items = ["a", "b", "c"].map((id) => ({
  id,
  el: document.getElementById(`item-${id}`),
  widthLabel: document.getElementById(`item-${id}-width`),
  basisInput: document.getElementById(`${id}-basis-input`),
  basisBubble: document.getElementById(`${id}-basis-value`),
  growInput: document.getElementById(`${id}-grow-input`),
  growBubble: document.getElementById(`${id}-grow-value`),
  shrinkInput: document.getElementById(`${id}-shrink-input`),
  shrinkBubble: document.getElementById(`${id}-shrink-value`),
}));

// Applies every control's current value as REAL flex-basis/grow/shrink (and container width)
// CSS, then reads back the resulting layout from the DOM — the browser's own flexbox engine
// does 100% of the sizing math here, nothing is pre-computed in JS.
function render() {
  const containerWidth = Number(containerWidthInput.value);
  updateRangeSlider(containerWidthInput, containerWidthValue, (v) => `${v}px`);
  preview.style.width = `${containerWidth}px`;

  let basisSum = 0;

  items.forEach((item) => {
    const basis = Number(item.basisInput.value);
    const grow = Number(item.growInput.value);
    const shrink = Number(item.shrinkInput.value);

    updateRangeSlider(item.basisInput, item.basisBubble, (v) => `${v}px`);
    updateRangeSlider(item.growInput, item.growBubble);
    updateRangeSlider(item.shrinkInput, item.shrinkBubble);

    // The actual CSS the browser will lay out with — this is the only place sizing is decided.
    item.el.style.flex = `${grow} ${shrink} ${basis}px`;

    basisSum += basis;
  });

  // Layout is synchronous, so by this point the browser has already resolved every item's
  // main size — getBoundingClientRect() below reads the REAL computed result, not a guess.
  const measured = items.map((item) => {
    const width = item.el.getBoundingClientRect().width;
    const rounded = Math.round(width);
    item.widthLabel.textContent = `${rounded}px`;
    return { id: item.id, width: rounded };
  });

  const freeSpace = containerWidth - basisSum;
  const freeSpaceLabel =
    freeSpace > 0
      ? `+${freeSpace}px free (flex-grow distributes this)`
      : freeSpace < 0
        ? `${freeSpace}px (flex-shrink removes this, weighted by shrink × basis)`
        : `0px (hypothetical size already matches the container)`;

  output.textContent = items
    .map((item, i) => {
      const basis = Number(item.basisInput.value);
      const grow = Number(item.growInput.value);
      const shrink = Number(item.shrinkInput.value);
      return `Item ${item.id.toUpperCase()}  flex: ${grow} ${shrink} ${basis}px  →  ${measured[i].width}px (measured)`;
    })
    .join("\n") +
    `\n\ncontainer width: ${containerWidth}px
sum of flex-basis: ${basisSum}px
free space: ${freeSpaceLabel}`;
}

[
  containerWidthInput,
  ...items.flatMap((item) => [item.basisInput, item.growInput, item.shrinkInput]),
].forEach((input) => input.addEventListener("input", render));

render();
