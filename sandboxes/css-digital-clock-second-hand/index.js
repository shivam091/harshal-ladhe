import "./shared/playground.css";
import "./styles.css";

const secondHand = document.getElementById("second-hand");
const modeSelect = document.getElementById("mode-select");
const stepsCountInput = document.getElementById("steps-count");
const durationInput = document.getElementById("duration-input");
const durationUnit = document.getElementById("duration-unit");
const replayButton = document.getElementById("replay-btn");
const stepReadout = document.getElementById("step-readout");
const stepTotal = document.getElementById("step-total");

let tickTimer = null;

// ms needs a wider, coarser-stepped range than s, not just the same numbers relabeled.
const DURATION_RANGES = {
  s: { min: 3, max: 60, step: 1 },
  ms: { min: 3000, max: 60000, step: 500 }
};

function getDurationMs() {
  const value = Number(durationInput.value);
  return durationUnit.value === "ms" ? value : value * 1000;
}

function buildAnimation() {
  const durationCss = durationInput.value + durationUnit.value;
  const durationMs = getDurationMs();
  const steps = Number(stepsCountInput.value);
  const mode = modeSelect.value;

  stepTotal.textContent = mode === "steps" ? steps : "∞";
  stepReadout.textContent = "0";

  secondHand.style.animation =
    mode === "steps"
      ? `rotate-hand ${durationCss} steps(${steps}, end) infinite`
      : `rotate-hand ${durationCss} linear infinite`;

  clearInterval(tickTimer);
  if (mode === "steps") {
    const intervalMs = durationMs / steps;
    const startTime = performance.now();

    // Derived from elapsed wall-clock time, not accumulated, so setInterval drift can't desync the readout from the hand.
    tickTimer = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const count = Math.floor(elapsed / intervalMs) % steps;
      stepReadout.textContent = count === 0 ? String(steps) : String(count);
    }, intervalMs);
  }
}

function restart() {
  clearInterval(tickTimer);
  secondHand.style.animation = "none";

  // Force a reflow so the browser forgets the previous run before re-applying it.
  void secondHand.offsetWidth;

  buildAnimation();
}

// Keep the same real duration across a unit switch — 3 s should become 3000 ms, not be reread as 3 ms.
function handleDurationUnitChange() {
  const range = DURATION_RANGES[durationUnit.value];
  const factor = durationUnit.value === "ms" ? 1000 : 1 / 1000;
  const converted = Number(durationInput.value) * factor;
  const rounded = factor === 1000 ? Math.round(converted) : Math.round(converted * 100) / 100;

  durationInput.min = range.min;
  durationInput.max = range.max;
  durationInput.step = range.step;
  durationInput.value = Math.min(range.max, Math.max(range.min, rounded));

  restart();
}

[modeSelect, stepsCountInput, durationInput].forEach((control) => {
  control.addEventListener("input", restart);
  control.addEventListener("change", restart);
});

durationUnit.addEventListener("change", handleDurationUnitChange);
replayButton.addEventListener("click", restart);

restart();
