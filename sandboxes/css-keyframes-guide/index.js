import "./shared/playground.css";
import "./styles.css";

const box = document.getElementById("animated-box");
const playPauseButton = document.getElementById("play-pause-btn");
const restartButton = document.getElementById("restart-btn");

const durationInput = document.getElementById("duration-input");
const durationUnit = document.getElementById("duration-unit");
const delayInput = document.getElementById("delay-input");
const delayUnit = document.getElementById("delay-unit");
const timingSelect = document.getElementById("timing-select");
const iterationSelect = document.getElementById("iteration-select");
const directionSelect = document.getElementById("direction-select");
const fillModeSelect = document.getElementById("fill-mode-select");

let isPaused = false;

function buildAnimation() {
  const dur = durationInput.value + durationUnit.value;
  const del = delayInput.value + delayUnit.value;
  const timing = timingSelect.value;
  const iterations = iterationSelect.value;
  const direction = directionSelect.value;
  const fillMode = fillModeSelect.value;
  const playState = isPaused ? "paused" : "running";

  return `travel ${dur} ${timing} ${del} ${iterations} ${direction} ${fillMode} ${playState}`;
}

function applyAnimation() {
  box.style.animation = buildAnimation();
}

function restartAnimation() {
  box.style.animation = "none";
  // Force a reflow so the browser forgets the previous run before re-applying it.
  void box.offsetWidth;
  applyAnimation();
}

function togglePlayState() {
  isPaused = !isPaused;
  playPauseButton.textContent = isPaused ? "Play" : "Pause";
  applyAnimation();
}

/*
  Per-unit min/max/step — ms needs a wider, coarser-stepped range than s, not just the same
  numbers relabeled (0.1s's equivalent range in ms is 100-10000, not 0.1-10).
*/
const UNIT_RANGES = {
  duration: { s: { min: 0.2, max: 6, step: 0.1 }, ms: { min: 200, max: 6000, step: 50 } },
  delay: { s: { min: -3, max: 3, step: 0.1 }, ms: { min: -3000, max: 3000, step: 50 } }
};

// Converts the input's current value into the newly selected unit and re-ranges min/max/step to match.
function handleUnitChange(input, unitSelect, kind) {
  const range = UNIT_RANGES[kind][unitSelect.value];
  const factor = unitSelect.value === "ms" ? 1000 : 1 / 1000;
  const converted = Number(input.value) * factor;
  const rounded = factor === 1000 ? Math.round(converted) : Math.round(converted * 100) / 100;

  input.min = range.min;
  input.max = range.max;
  input.step = range.step;
  input.value = Math.min(range.max, Math.max(range.min, rounded));

  applyAnimation();
}

[durationInput, delayInput].forEach((input) => input.addEventListener("input", applyAnimation));
durationUnit.addEventListener("change", () => handleUnitChange(durationInput, durationUnit, "duration"));
delayUnit.addEventListener("change", () => handleUnitChange(delayInput, delayUnit, "delay"));
[timingSelect, iterationSelect, directionSelect, fillModeSelect].forEach((select) =>
  select.addEventListener("change", restartAnimation)
);

playPauseButton.addEventListener("click", togglePlayState);
restartButton.addEventListener("click", restartAnimation);

applyAnimation();
