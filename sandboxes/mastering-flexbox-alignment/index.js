import "./shared/playground.css";
import "./shared/range-slider.css";
import "./shared/segmented-control.css";
import "./styles.css";
import { updateRangeSlider } from "./shared/range-slider.js";

const container = document.getElementById("flex-preview");
const output = document.getElementById("flex-output");
const items = Array.from(container.querySelectorAll(".flex-item"));

const directionRadios = document.querySelectorAll("input[name='flex-direction']");
const wrapRadios = document.querySelectorAll("input[name='flex-wrap']");
const justifyContentSelect = document.getElementById("justify-content-select");
const alignItemsSelect = document.getElementById("align-items-select");
const alignContentSelect = document.getElementById("align-content-select");
const gapInput = document.getElementById("gap-input");
const gapValue = document.getElementById("gap-value");

const itemSelect = document.getElementById("item-select");
const alignSelfSelect = document.getElementById("align-self-select");

// Per-item align-self state, one entry per item (index 0 = Item 1) — "auto" means "no override, defer to align-items".
const itemOverrides = items.map(() => "auto");

// Writes every item's stored align-self override onto its actual inline style.
function applyOverrides() {
  items.forEach((item, index) => {
    const value = itemOverrides[index];
    item.style.alignSelf = value === "auto" ? "" : value;
  });
}

// Outlines whichever item the "Per-Item Override" select currently targets, independent of that item's align-self value.
function updateSelectedHighlight() {
  const selectedIndex = Number(itemSelect.value) - 1;
  items.forEach((item, index) => {
    item.classList.toggle("flex-item--selected", index === selectedIndex);
  });
}

// Reads every control, applies the resulting styles to the preview container, and rewrites the readout to match.
function render() {
  const direction = document.querySelector("input[name='flex-direction']:checked").value;
  const wrap = document.querySelector("input[name='flex-wrap']:checked").value;
  const justifyContent = justifyContentSelect.value;
  const alignItems = alignItemsSelect.value;
  const alignContent = alignContentSelect.value;
  const gap = Number(gapInput.value);

  updateRangeSlider(gapInput, gapValue, (v) => `${v}px`);

  container.style.flexDirection = direction;
  container.style.flexWrap = wrap;
  container.style.justifyContent = justifyContent;
  container.style.alignItems = alignItems;
  container.style.alignContent = alignContent;
  container.style.gap = `${gap}px`;

  const selectedIndex = Number(itemSelect.value);
  const selfValue = itemOverrides[selectedIndex - 1];

  const containerDeclarations = [
    "display: flex;",
    `flex-direction: ${direction};`,
    `flex-wrap: ${wrap};`,
    `justify-content: ${justifyContent};`,
    `align-items: ${alignItems};`,
    `align-content: ${alignContent};`,
    `gap: ${gap}px;`,
  ];

  // Only printed once the selected item actually has a non-auto override, so the readout doesn't imply a rule that isn't really set.
  const itemBlock = selfValue !== "auto"
    ? `\n\n.item-${selectedIndex} {\n  align-self: ${selfValue};\n}`
    : "";

  output.textContent = `.flex-container {\n  ${containerDeclarations.join("\n  ")}\n}${itemBlock}`;
}

[...directionRadios, ...wrapRadios].forEach((radio) => radio.addEventListener("change", render));
[justifyContentSelect, alignItemsSelect, alignContentSelect].forEach((select) =>
  select.addEventListener("change", render)
);
gapInput.addEventListener("input", render);

itemSelect.addEventListener("change", () => {
  alignSelfSelect.value = itemOverrides[Number(itemSelect.value) - 1];
  updateSelectedHighlight();
  render();
});

alignSelfSelect.addEventListener("change", () => {
  itemOverrides[Number(itemSelect.value) - 1] = alignSelfSelect.value;
  applyOverrides();
  render();
});

updateSelectedHighlight();
applyOverrides();
render();
