import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./shared/range-slider.css";
import "./styles.css";
import { updateRangeSlider } from "./shared/range-slider.js";

const $ = (id) => document.getElementById(id);
const stage = $("stage");
const button = $("anchor-button");
const tooltip = $("tooltip");

// Without support the tooltip sits in a corner, so the note says so rather than letting the demo look broken.
$("support-note").hidden = CSS.supports("anchor-name", "--a");

// Only used to describe where the browser put the tooltip — the placement itself is entirely CSS.
function describePlacement() {
  const a = button.getBoundingClientRect();
  const t = tooltip.getBoundingClientRect();
  const vertical = t.bottom <= a.top + 1 ? "above" : t.top >= a.bottom - 1 ? "below" : "level with";
  const horizontal = t.right <= a.left + 1 ? "left of" : t.left >= a.right - 1 ? "right of" : "over";
  if (vertical === "level with") return `${horizontal} the anchor`;
  if (horizontal === "over") return `${vertical} the anchor`;
  return `${vertical} and ${horizontal} the anchor`;
}

function update() {
  const area = document.querySelector("input[name='area']:checked").value;
  const fallbacks = document.querySelector("input[name='fallbacks']:checked").value;

  // The only things JS changes: where the button sits, and two custom properties the tooltip reads.
  stage.style.setProperty("--x", `${$("x-input").value}%`);
  stage.style.setProperty("--y", `${$("y-input").value}%`);
  tooltip.style.setProperty("--area", area);
  tooltip.style.setProperty("--fallbacks", fallbacks);

  updateRangeSlider($("x-input"), $("x-value"), (value) => `${value}%`);
  updateRangeSlider($("y-input"), $("y-value"), (value) => `${value}%`);

  $("tip").textContent = fallbacks === "none"
    ? "With no fallbacks, the tooltip stays where position-area puts it, even when that's partly outside the stage. Drag the button to an edge to see it get cut off."
    : "Drag the button towards an edge. When the tooltip would overflow the stage, the browser tries each fallback in order and uses the first that fits.";

  // Placement is read after layout, so the readout reflects the fallback the browser actually chose.
  requestAnimationFrame(() => {
    $("readout").textContent = [
      ".tooltip {",
      "  position-anchor: --trigger;",
      `  position-area: ${area};`,
      `  position-try-fallbacks: ${fallbacks};`,
      "}",
      "",
      `Placed: ${describePlacement()}`
    ].join("\n");
  });
}

document.querySelectorAll("input").forEach((input) => input.addEventListener("input", update));
update();
