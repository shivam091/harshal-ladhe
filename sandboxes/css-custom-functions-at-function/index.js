import "./shared/playground.css";
import "./shared/range-slider.css";
import "./styles.css";
import { updateRangeSlider } from "./shared/range-slider.js";

const $ = (id) => document.getElementById(id);
const cards = [...document.querySelectorAll(".card")];

// Computed lengths come back in px; dividing by the root font size shows them in the rem the function works in.
const toRem = (px) => `${parseFloat(px) / parseFloat(getComputedStyle(document.documentElement).fontSize)}rem`;

/*
  The readout reads each card's computed styles rather than repeating the maths in JavaScript, so it shows what the
  browser actually resolved --space() to on that card, including the second card's local --unit override.
*/
function update() {
  document.documentElement.style.setProperty("--unit", `${$("unit-input").value}rem`);
  $("second-card").classList.toggle("is-compact", $("compact-toggle").checked);
  updateRangeSlider($("unit-input"), $("unit-value"), (value) => `${value}rem`);

  $("readout").textContent = cards
    .map((card, index) => {
      const style = getComputedStyle(card);
      const chips = getComputedStyle(card.querySelector(".chips"));
      const unit = style.getPropertyValue("--unit").trim();
      return `Card ${index + 1} (--unit: ${unit})\n  padding: ${toRem(style.paddingTop)}  chip gap: ${toRem(chips.columnGap)}`;
    })
    .join("\n\n");
}

$("unit-input").addEventListener("input", update);
$("compact-toggle").addEventListener("change", update);
update();
