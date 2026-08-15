import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./shared/range-slider.css";
import "./styles.css";
import { updateRangeSlider } from "./shared/range-slider.js";
import { initSegmentedControl } from "./shared/segmented-control.js";

const grid = document.getElementById("grid-preview");
const output = document.getElementById("grid-output");

const justifyItemsSelect = document.getElementById("justify-items-select");
const alignItemsSelect = document.getElementById("align-items-select");
const placeItemsSelect = document.getElementById("place-items-select");

const columnSpanInput = document.getElementById("column-span-input");
const rowSpanInput = document.getElementById("row-span-input");
const justifySelfSelect = document.getElementById("justify-self-select");
const alignSelfSelect = document.getElementById("align-self-select");
const placeSelfSelect = document.getElementById("place-self-select");

const itemCountInput = document.getElementById("item-count-input");
const autoFlowSelect = document.getElementById("auto-flow-select");
const autoTrackInput = document.getElementById("auto-track-input");

const columnSpanValue = document.getElementById("column-span-value");
const rowSpanValue = document.getElementById("row-span-value");
const itemCountValue = document.getElementById("item-count-value");
const autoTrackLabel = document.getElementById("auto-track-label");
const autoTrackValue = document.getElementById("auto-track-value");

/*
  The first 9 items always fill the explicit 3x3 grid (grid-template-columns/rows in
  styles.css). Item 5 (index 4) is the "hero" — the only one with explicit
  placement/span/self-alignment. Anything past the 9th is left auto-placed, so raising
  the item count above 9 spills into browser-generated implicit tracks.
*/
const EXPLICIT_ITEM_COUNT = 9;
const HERO_INDEX = 4;

const ITEMS_VALUES = ["stretch", "start", "center", "end"];
/*
  justify-self/align-self can also fall back to the container's value — "(inherit)" in the longhand
  selects maps to the real CSS keyword "auto" here, since that's what the shorthand actually needs.
*/
const SELF_VALUES = ["auto", "stretch", "start", "center", "end"];

// Fills a <select> with every "<align> <justify>" combination from `values` — the full place-items/place-self value space.
function populateShorthandSelect(select, values) {
  values.forEach((align) => {
    values.forEach((justify) => {
      const option = document.createElement("option");
      option.value = `${align} ${justify}`;
      option.textContent = `${align} ${justify}`;
      select.appendChild(option);
    });
  });
}

populateShorthandSelect(placeItemsSelect, ITEMS_VALUES);
populateShorthandSelect(placeSelfSelect, SELF_VALUES);

/*
  Rebuilds the numbered item boxes to match the current count, reusing existing ones so items don't re-render (and lose the
  hero's identity) on every slider tick.
*/
function renderItems(count) {
  const current = grid.children.length;

  if (count > current) {
    for (let i = current; i < count; i++) {
      const item = document.createElement("div");
      item.className = "grid-item";
      if (i === HERO_INDEX) item.classList.add("hero-item");
      if (i >= EXPLICIT_ITEM_COUNT) item.classList.add("implicit-item");
      item.textContent = `${i + 1}`;
      grid.appendChild(item);
    }
  } else if (count < current) {
    for (let i = current; i > count; i--) {
      grid.removeChild(grid.lastElementChild);
    }
  }
}

// Applies a "<align> <justify>" shorthand value back onto the two longhand selects it was picked from.
function applyShorthand(value, alignSelect, justifySelect, emptyToken) {
  const [align, justify] = value.split(" ");
  alignSelect.value = align === emptyToken ? "" : align;
  justifySelect.value = justify === emptyToken ? "" : justify;
}

function updateGrid() {
  const justifyItems = justifyItemsSelect.value;
  const alignItems = alignItemsSelect.value;

  const columnSpan = Number(columnSpanInput.value);
  const rowSpan = Number(rowSpanInput.value);
  const justifySelf = justifySelfSelect.value;
  const alignSelf = alignSelfSelect.value;

  const itemCount = Number(itemCountInput.value);
  const autoFlow = autoFlowSelect.value;
  const autoTrackSize = Number(autoTrackInput.value);

  // Longhand selects are the source of truth — keep the shorthand selects in sync with whatever they currently say.
  placeItemsSelect.value = `${alignItems} ${justifyItems}`;
  placeSelfSelect.value = `${alignSelf || "auto"} ${justifySelf || "auto"}`;

  updateRangeSlider(columnSpanInput, columnSpanValue);
  updateRangeSlider(rowSpanInput, rowSpanValue);
  updateRangeSlider(itemCountInput, itemCountValue);

  /*
    autoTrackLabel shows a property name that depends on autoFlow, not autoTrackInput's own value —
    unrelated to the slider's live value, so it's set independently of updateRangeSlider.
  */
  autoTrackLabel.textContent = autoFlow === "column" ? "grid-auto-columns" : "grid-auto-rows";
  updateRangeSlider(autoTrackInput, autoTrackValue, (v) => `${v}px`);

  grid.style.justifyItems = justifyItems;
  grid.style.alignItems = alignItems;
  grid.style.gridAutoFlow = autoFlow;
  // Clear whichever auto-track property isn't active so switching flow direction doesn't leave a stale value behind.
  grid.style.gridAutoRows = autoFlow === "row" ? `${autoTrackSize}px` : "";
  grid.style.gridAutoColumns = autoFlow === "column" ? `${autoTrackSize}px` : "";

  renderItems(itemCount);

  const heroItem = grid.children[HERO_INDEX];
  // Anchored at the true center (line 2) so it grows outward instead of colliding with items 1-4 at small spans.
  heroItem.style.gridColumn = `2 / span ${columnSpan}`;
  heroItem.style.gridRow = `2 / span ${rowSpan}`;
  heroItem.style.justifySelf = justifySelf || "";
  heroItem.style.alignSelf = alignSelf || "";

  const autoTrackRule = autoFlow === "column"
    ? `grid-auto-columns: ${autoTrackSize}px;`
    : `grid-auto-rows: ${autoTrackSize}px;`;

  /*
    Every declaration is collected then filtered, so a property with no value (e.g. justify-self left at
    "(inherit)") drops out cleanly instead of leaving a blank line in the readout.
  */
  const gridDeclarations = [
    `justify-items: ${justifyItems};`,
    `align-items: ${alignItems};`,
    `grid-auto-flow: ${autoFlow};`,
    autoTrackRule,
  ].filter(Boolean);

  const heroDeclarations = [
    `grid-column: 2 / span ${columnSpan};`,
    `grid-row: 2 / span ${rowSpan};`,
    justifySelf && `justify-self: ${justifySelf};`,
    alignSelf && `align-self: ${alignSelf};`,
  ].filter(Boolean);

  output.textContent = `.grid {
  ${gridDeclarations.join("\n  ")}
}

.hero {
  ${heroDeclarations.join("\n  ")}
}`;
}

placeItemsSelect.addEventListener("change", () => {
  applyShorthand(placeItemsSelect.value, alignItemsSelect, justifyItemsSelect, null);
  updateGrid();
});

placeSelfSelect.addEventListener("change", () => {
  applyShorthand(placeSelfSelect.value, alignSelfSelect, justifySelfSelect, "auto");
  updateGrid();
});

[justifyItemsSelect, alignItemsSelect, justifySelfSelect, alignSelfSelect, autoFlowSelect].forEach((el) =>
  el.addEventListener("change", updateGrid)
);
[columnSpanInput, rowSpanInput, itemCountInput, autoTrackInput].forEach((el) =>
  el.addEventListener("input", updateGrid)
);

updateGrid();

// Demo mode switcher (Alignment & Spanning vs. Template Areas)
initSegmentedControl(".segment");

// Template Areas demo

const areasPreview = document.getElementById("areas-preview");
const areasOutput = document.getElementById("areas-output");
const areasPresetSelect = document.getElementById("areas-preset-select");
const areasGapInput = document.getElementById("areas-gap-input");
const areasGapValue = document.getElementById("areas-gap-value");

// Each preset is the row-by-row area grid (mirrors how grid-template-areas reads: one array per row) plus its column tracks.
const AREA_PRESETS = {
  "holy-grail": {
    rows: [
      ["header", "header", "header"],
      ["sidebar", "main", "main"],
      ["footer", "footer", "footer"]
    ],
    columns: "1fr 2fr 2fr"
  },
  dashboard: {
    rows: [
      ["header", "header"],
      ["sidebar", "main"],
      ["sidebar", "widgets"]
    ],
    columns: "1fr 3fr"
  },
  "sidebar-right": {
    rows: [
      ["header", "header"],
      ["main", "sidebar"],
      ["footer", "footer"]
    ],
    columns: "3fr 1fr"
  }
};

// Formats a preset's rows the way a real stylesheet would: one quoted row per line.
function formatAreasDeclaration(rows) {
  return rows.map((row) => `"${row.join(" ")}"`).join("\n    ");
}

// The preset's unique region names, in first-appearance order — drives which colored blocks get rendered.
function uniqueRegions(rows) {
  const seen = [];
  rows.flat().forEach((name) => {
    if (!seen.includes(name)) seen.push(name);
  });
  return seen;
}

function updateAreas() {
  const preset = AREA_PRESETS[areasPresetSelect.value];
  const gap = Number(areasGapInput.value);

  updateRangeSlider(areasGapInput, areasGapValue, (v) => `${v}px`);

  // Inline style takes the same value shape the CSS property does: quoted rows, space-separated.
  areasPreview.style.gridTemplateAreas = preset.rows.map((row) => `"${row.join(" ")}"`).join(" ");
  areasPreview.style.gridTemplateColumns = preset.columns;
  areasPreview.style.gap = `${gap}px`;

  const regions = uniqueRegions(preset.rows);

  // Rebuilt from scratch each time — the region *set* changes between presets, not just their positions.
  areasPreview.innerHTML = "";
  regions.forEach((name) => {
    const region = document.createElement("div");
    region.className = `area-region area-${name}`;
    region.style.gridArea = name;
    region.textContent = name;
    areasPreview.appendChild(region);
  });

  const regionRules = regions.map((name) => `.${name} {\n  grid-area: ${name};\n}`).join("\n\n");

  areasOutput.textContent = `.grid {
  grid-template-areas:
    ${formatAreasDeclaration(preset.rows)};
  grid-template-columns: ${preset.columns};
  gap: ${gap}px;
}

${regionRules}`;
}

areasPresetSelect.addEventListener("change", updateAreas);
areasGapInput.addEventListener("input", updateAreas);

updateAreas();
