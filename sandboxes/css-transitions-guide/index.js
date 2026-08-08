import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./styles.css";

const box = document.getElementById("animated-box");
const demoTrack = document.querySelector(".demo-track");
const toggleButton = document.getElementById("toggle-state-btn");
const output = document.getElementById("transition-output");

const durationInput = document.getElementById("duration-input");
const durationUnit = document.getElementById("duration-unit");
const delayInput = document.getElementById("delay-input");
const delayUnit = document.getElementById("delay-unit");

const timingRadios = document.querySelectorAll("input[name='timing-type']");
const timingGroups = document.querySelectorAll(".timing-group");

const presetSelect = document.getElementById("timing-select-preset");

const bx1 = document.getElementById("bezier-x1");
const by1 = document.getElementById("bezier-y1");
const bx2 = document.getElementById("bezier-x2");
const by2 = document.getElementById("bezier-y2");

const stepsCount = document.getElementById("steps-count");
const stepsDirection = document.getElementById("steps-direction");

function getTimingFunction() {
  const type = document.querySelector("input[name='timing-type']:checked").value;

  if (type === "preset") return presetSelect.value;

  if (type === "bezier") {
    // cubic-bezier() is invalid (and silently dropped by the browser) if x1/x2 fall outside
    // [0, 1] — clamp typed values so an out-of-range entry can't break the whole transition.
    const clampX = (v) => Math.min(1, Math.max(0, Number(v)));
    return `cubic-bezier(${clampX(bx1.value)}, ${by1.value}, ${clampX(bx2.value)}, ${by2.value})`;
  }

  if (type === "steps") {
    // steps() is invalid if the count isn't a positive integer (and must be >= 2 for
    // jump-none specifically) — clamp so a typed value can't silently break the transition.
    const minCount = stepsDirection.value === "jump-none" ? 2 : 1;
    const count = Math.max(minCount, Math.round(Number(stepsCount.value)) || minCount);
    return `steps(${count}, ${stepsDirection.value})`;
  }
}

function updateTransition() {
  const dur = durationInput.value + durationUnit.value;
  const del = delayInput.value + delayUnit.value;
  const timing = getTimingFunction();

  // Color isn't part of this — it's a fixed pink-while-moving indicator, not a configurable value.
  box.style.transition = `transform ${dur} ${timing} ${del}`;
  output.textContent = `transition: ${dur} ${timing} ${del}`;
}

/*
  Per-unit min/max/step — ms needs a wider, coarser-stepped range than s, not just the same
  numbers relabeled (0.1s's equivalent range in ms is 100-10000, not 0.1-10).
  */
const UNIT_RANGES = {
  duration: { s: { min: 0.1, max: 10, step: 0.1 }, ms: { min: 100, max: 10000, step: 50 } },
  delay: { s: { min: -10, max: 10, step: 0.1 }, ms: { min: -10000, max: 10000, step: 50 } }
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

  updateTransition();
}

/*
  Measured from the box's untransformed layout (offsetLeft/offsetWidth ignore transforms, so it
  stays correct mid-animation), so the end state always lands exactly at the track's right edge.
*/
function updateTravelDistance() {
  const distance = demoTrack.clientWidth - box.offsetWidth - box.offsetLeft;
  demoTrack.style.setProperty("--travel-distance", `${Math.max(0, distance)}px`);
}

function switchGroup() {
  const type = document.querySelector("input[name='timing-type']:checked").value;

  timingGroups.forEach((g) => g.classList.remove("active-group"));
  document.getElementById(type + "-options").classList.add("active-group");

  updateTransition();
}

function toggleState() {
  box.classList.add("in-transit");
  box.classList.toggle("box-state-one");
  box.classList.toggle("box-state-two");
}

// Pink only while the position transform is actually in flight, either direction.
box.addEventListener("transitionend", (event) => {
  if (event.propertyName === "transform") box.classList.remove("in-transit");
});

durationInput.addEventListener("input", updateTransition);
durationUnit.addEventListener("change", () => handleUnitChange(durationInput, durationUnit, "duration"));
delayInput.addEventListener("input", updateTransition);
delayUnit.addEventListener("change", () => handleUnitChange(delayInput, delayUnit, "delay"));

timingRadios.forEach((r) => r.addEventListener("change", switchGroup));
presetSelect.addEventListener("change", updateTransition);

[bx1, by1, bx2, by2].forEach((inp) => inp.addEventListener("input", updateTransition));
stepsCount.addEventListener("input", updateTransition);
stepsDirection.addEventListener("change", updateTransition);

toggleButton.addEventListener("click", toggleState);

// rAF-throttled: recalculates on viewport/track resize without piling up work mid-drag.
let resizeFrame = null;
window.addEventListener("resize", () => {
  if (resizeFrame != null) return;
  resizeFrame = requestAnimationFrame(() => {
    resizeFrame = null;
    updateTravelDistance();
  });
});

updateTravelDistance();
updateTransition();
switchGroup();
