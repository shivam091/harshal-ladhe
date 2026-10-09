import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./shared/range-slider.css";
import "./styles.css";
import { updateRangeSlider } from "./shared/range-slider.js";

const $ = (id) => document.getElementById(id);
const board = $("board");
const supported = CSS.supports("display", "grid-lanes");

// Without support the grid-lanes option shows multi-column layout, so the note explains the stand-in.
$("support-note").hidden = supported;

const TIPS = {
  "grid-lanes": "Each card goes into whichever lane is currently shortest, so the columns stay level and the numbers still read roughly left to right, top to bottom.",
  grid: "A regular grid lines cards up in rows. Every row is as tall as its tallest card, leaving gaps under the shorter ones.",
  columns: "Multi-column layout packs tightly, but fills each column top to bottom first — so the numbers run down the page instead of across it."
};

function update() {
  const layout = document.querySelector("input[name='layout']:checked").value;
  const min = `${$("min-input").value}rem`;
  const tolerance = `${$("tolerance-input").value}rem`;
  const span = $("span-toggle").checked;

  // The only things JS changes: one attribute, one class and two custom properties. Placement is all CSS.
  board.dataset.layout = layout;
  board.style.setProperty("--min", min);
  board.style.setProperty("--tolerance", tolerance);
  board.classList.toggle("board--span", span);

  updateRangeSlider($("min-input"), $("min-value"), (value) => `${value}rem`);
  updateRangeSlider($("tolerance-input"), $("tolerance-value"), (value) => `${value}rem`);

  $("tip").textContent = TIPS[layout];

  const rules = {
    "grid-lanes": [
      "display: grid-lanes;",
      `grid-template-columns: repeat(auto-fill, minmax(${min}, 1fr));`,
      `flow-tolerance: ${tolerance};`
    ],
    grid: ["display: grid;", `grid-template-columns: repeat(auto-fill, minmax(${min}, 1fr));`],
    columns: [`columns: ${min};`]
  }[layout];

  $("readout").textContent = [
    ".board {",
    ...rules.map((rule) => `  ${rule}`),
    "}",
    ...(span && layout !== "columns" ? ["", ".card--featured {", "  grid-column: span 2;", "}"] : []),
    ...(layout === "grid-lanes" && !supported ? ["", "Not supported here: showing multi-column layout instead."] : [])
  ].join("\n");
}

document.querySelectorAll("input").forEach((input) => input.addEventListener("input", update));
update();
