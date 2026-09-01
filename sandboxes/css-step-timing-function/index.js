import "./shared/playground.css";
import "./styles.css";

const smoothBox = document.getElementById("smooth-box");
const steppedBox = document.getElementById("stepped-box");
const typewriter = document.getElementById("typewriter");
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

function buildAnimations() {
  const dur = durationInput.value + durationUnit.value;
  const count = stepsCountInput.value;
  const jumpTerm = jumpTermSelect.value;

  smoothBox.style.animation = `travel ${dur} linear`;
  steppedBox.style.animation = `travel ${dur} steps(${count}, ${jumpTerm})`;

  const charCount = typewriter.dataset.text.length;
  typewriter.style.setProperty("--chars", charCount);
  typewriter.style.animation = `reveal ${dur} steps(${charCount}, end)`;
}

function restart() {
  [smoothBox, steppedBox, typewriter].forEach((el) => {
    el.style.animation = "none";
  });

  // Force a reflow so the browser forgets the previous run before re-applying it.
  void smoothBox.offsetWidth;

  buildAnimations();
}

typewriter.dataset.text = typewriter.textContent;

[stepsCountInput, jumpTermSelect, durationInput].forEach((control) => {
  control.addEventListener("input", restart);
  control.addEventListener("change", restart);
});

// Converts the input's current value into the newly selected unit and re-ranges min/max/step to match.
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

restart();
