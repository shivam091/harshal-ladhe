import "./shared/playground.css";
import "./styles.css";

const fill = document.getElementById("fill");
const gridLines = document.getElementById("grid-lines");
const loadButton = document.getElementById("load-btn");

const stepsCountInput = document.getElementById("steps-count");
const jumpTermSelect = document.getElementById("jump-term");
const durationInput = document.getElementById("duration-input");
const durationUnit = document.getElementById("duration-unit");

const chunkReadout = document.getElementById("chunk-readout");
const chunkTotal = document.getElementById("chunk-total");
const percentReadout = document.getElementById("percent-readout");

let filled = false;
let readoutFrame = null;

// ms needs a wider, coarser-stepped range than s, not just the same numbers relabeled.
const DURATION_RANGES = {
  s: { min: 0.5, max: 5, step: 0.5 },
  ms: { min: 500, max: 5000, step: 100 }
};

// jump-none drops the jumps at both ends and jump-both adds one at each, so the chunk count isn't always n.
function getJumpCount(steps, jumpTerm) {
  if (jumpTerm === "jump-none") return steps - 1;
  if (jumpTerm === "jump-both") return steps + 1;
  return steps;
}

function renderGridLines(count) {
  gridLines.innerHTML = "";
  for (let i = 1; i < count; i++) {
    const line = document.createElement("span");
    line.className = "grid-line";
    line.style.left = `${(i / count) * 100}%`;
    gridLines.appendChild(line);
  }
}

function applyTransition() {
  const steps = Number(stepsCountInput.value);
  const jumpTerm = jumpTermSelect.value;
  const durationCss = durationInput.value + durationUnit.value;

  const jumps = getJumpCount(steps, jumpTerm);

  fill.style.transition = `width ${durationCss} steps(${steps}, ${jumpTerm})`;
  chunkTotal.textContent = String(jumps);
  renderGridLines(jumps);
}

// Read back from the fill's rendered width rather than predicted with timers, so it can't drift from what the jump term actually shows.
function syncReadout() {
  const jumps = getJumpCount(Number(stepsCountInput.value), jumpTermSelect.value);
  const ratio = fill.getBoundingClientRect().width / fill.parentElement.clientWidth;

  chunkReadout.textContent = String(Math.round(ratio * jumps));
  percentReadout.textContent = `${Math.round(ratio * 100)}%`;

  readoutFrame = filled && ratio < 1 ? requestAnimationFrame(syncReadout) : null;
}

// A reset mid-fill must stop sampling, or the loop would overwrite the zeroed readout on its next frame.
function stopReadout() {
  cancelAnimationFrame(readoutFrame);
  readoutFrame = null;
}

function reset() {
  stopReadout();
  filled = false;
  fill.style.transition = "none";
  fill.style.width = "0%";
  chunkReadout.textContent = "0";
  percentReadout.textContent = "0%";
  loadButton.textContent = "Start Loading";

  // Force a reflow so the next transition doesn't inherit "none".
  void fill.offsetWidth;
  applyTransition();
}

function startLoading() {
  filled = true;
  loadButton.textContent = "Reset";
  fill.style.width = "100%";
  readoutFrame = requestAnimationFrame(syncReadout);
}

loadButton.addEventListener("click", () => {
  if (filled) {
    reset();
  } else {
    startLoading();
  }
});

[stepsCountInput, jumpTermSelect, durationInput].forEach((control) => {
  control.addEventListener("input", reset);
  control.addEventListener("change", reset);
});

// Keep the same real duration across a unit switch — 3 s should become 3000 ms, not be reread as 3 ms.
durationUnit.addEventListener("change", () => {
  const range = DURATION_RANGES[durationUnit.value];
  const factor = durationUnit.value === "ms" ? 1000 : 1 / 1000;
  const converted = Number(durationInput.value) * factor;
  const rounded = factor === 1000 ? Math.round(converted) : Math.round(converted * 100) / 100;

  durationInput.min = range.min;
  durationInput.max = range.max;
  durationInput.step = range.step;
  durationInput.value = Math.min(range.max, Math.max(range.min, rounded));

  reset();
});

reset();
