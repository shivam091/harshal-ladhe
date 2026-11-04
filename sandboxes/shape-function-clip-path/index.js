import "./shared/playground.css";
import "./shared/range-slider.css";
import "./styles.css";
import { updateRangeSlider } from "./shared/range-slider.js";

const $ = (id) => document.getElementById(id);
const stage = $("stage");

// The width the path() bubble's pixel coordinates were drawn for, so the readout can compare against it.
const PATH_WIDTH = 320;

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

// Without support the top bubble shows its polygon() fallback, so the note explains why it looks plainer.
$("support-note").hidden = CSS.supports("clip-path", "shape(from 0 0, line to 100% 0)");

// Describes where the tail is right now, so the readout matches what's on screen while animating too.
function tailStatus(width, tail) {
  if ($("animate-toggle").checked && !reducedMotion.matches) {
    return `shape(): ${width}px wide, tail sweeping between 15% and 85% (@property --tail)`;
  }

  const tip = Math.round((width * tail) / 100);
  return `shape(): ${width}px wide, tail tip at ${tail}% = ${tip}px from the left`;
}

/*
  The outline and its animation are all CSS. The controls only set custom properties and a class
  on the stage, and the shape() bubble reads them inside its own coordinates; the path() bubble can't.
*/
function update() {
  const width = Number($("width-input").value);
  const tail = Number($("tail-input").value);
  const animating = $("animate-toggle").checked && !reducedMotion.matches;

  updateRangeSlider($("width-input"), $("width-value"), (value) => `${value}px`);
  updateRangeSlider($("tail-input"), $("tail-value"), (value) => `${value}%`);

  stage.style.setProperty("--bubble-width", `${width}px`);
  stage.style.setProperty("--tail", `${tail}%`);
  stage.classList.toggle("animate-tail", $("animate-toggle").checked);
  // The animation overrides the slider's value, so the slider is disabled rather than silently ignored.
  $("tail-input").disabled = animating;

  $("readout").textContent =
    `${tailStatus(width, tail)}\n` +
    `path():  outline stays ${PATH_WIDTH}px wide, tail tip stays at 160px`;
}

$("width-input").addEventListener("input", update);
$("tail-input").addEventListener("input", update);
$("animate-toggle").addEventListener("change", update);
reducedMotion.addEventListener("change", update);
update();
