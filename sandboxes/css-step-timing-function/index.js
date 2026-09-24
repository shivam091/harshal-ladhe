import "./shared/playground.css";
import "./styles.css";

const demoArea = document.querySelector(".demo-area");
const smoothBox = document.getElementById("smooth-box");
const steppedBox = document.getElementById("stepped-box");
const replayButton = document.getElementById("replay-btn");

const stepsCountInput = document.getElementById("steps-count");
const jumpTermSelect = document.getElementById("jump-term");
const durationInput = document.getElementById("duration-input");
const durationUnit = document.getElementById("duration-unit");

// ms needs a wider, coarser-stepped range than s, not just the same numbers relabeled.
const DURATION_RANGES = {
  s: { min: 0.5, max: 6, step: 0.5 },
  ms: { min: 500, max: 6000, step: 100 }
};

/*
  Measured rather than a fixed px/media-query guess so the boxes land exactly on the track's right
  edge at any width. offsetLeft/offsetWidth ignore transforms, so it stays correct mid-animation;
  the fixed 64px label column keeps both tracks the same width, so one measurement covers both.
*/
function updateTravelDistance() {
  const track = steppedBox.parentElement;
  const distance = track.clientWidth - steppedBox.offsetWidth - steppedBox.offsetLeft * 2;
  demoArea.style.setProperty("--travel-distance", `${Math.max(0, distance)}px`);
}

// steps(1, jump-none) is invalid CSS (the whole declaration is dropped), so jump-none needs a floor of 2 steps.
function syncStepsMin() {
  const min = jumpTermSelect.value === "jump-none" ? 2 : 1;
  stepsCountInput.min = min;
  if (Number(stepsCountInput.value) < min) stepsCountInput.value = min;
}

function buildAnimations() {
  syncStepsMin();

  const dur = durationInput.value + durationUnit.value;
  const count = stepsCountInput.value;
  const jumpTerm = jumpTermSelect.value;

  smoothBox.style.animation = `travel ${dur} linear`;
  steppedBox.style.animation = `travel ${dur} steps(${count}, ${jumpTerm})`;
}

function restart() {
  [smoothBox, steppedBox].forEach((el) => {
    el.style.animation = "none";
  });

  // Force a reflow so the browser forgets the previous run before re-applying it.
  void smoothBox.offsetWidth;

  buildAnimations();
}

[stepsCountInput, jumpTermSelect, durationInput].forEach((control) => {
  control.addEventListener("input", restart);
  control.addEventListener("change", restart);
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

  restart();
});

replayButton.addEventListener("click", restart);

// rAF-throttled so a resize drag remeasures at most once per frame instead of on every event.
let resizeFrame = null;
window.addEventListener("resize", () => {
  if (resizeFrame != null) return;
  resizeFrame = requestAnimationFrame(() => {
    resizeFrame = null;
    updateTravelDistance();
  });
});

updateTravelDistance();
restart();
