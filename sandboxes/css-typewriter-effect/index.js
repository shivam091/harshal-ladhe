import "./shared/playground.css";
import "./styles.css";

const typewriter = document.getElementById("typewriter");
const replayButton = document.getElementById("replay-btn");
const stepsReadout = document.getElementById("steps-readout");

const phraseSelect = document.getElementById("phrase-select");
const durationInput = document.getElementById("duration-input");
const durationUnit = document.getElementById("duration-unit");
const cursorToggle = document.getElementById("cursor-toggle");

// ms needs a wider, coarser-stepped range than s, not just the same numbers relabeled.
const DURATION_RANGES = {
  s: { min: 0.5, max: 8, step: 0.5 },
  ms: { min: 500, max: 8000, step: 100 }
};

function buildAnimation() {
  const phrase = phraseSelect.value;
  const dur = durationInput.value + durationUnit.value;
  const charCount = phrase.length;

  typewriter.textContent = phrase;
  typewriter.style.setProperty("--chars", charCount);

  const reveal = `reveal ${dur} steps(${charCount}, end) forwards`;
  const blink = "blink-caret 0.75s step-end infinite";
  typewriter.style.animation = cursorToggle.checked ? `${reveal}, ${blink}` : reveal;

  stepsReadout.textContent = charCount;
}

function restart() {
  typewriter.style.animation = "none";

  // Force a reflow so the browser forgets the previous run before re-applying it.
  void typewriter.offsetWidth;

  buildAnimation();
}

[phraseSelect, durationInput, cursorToggle].forEach((control) => {
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

restart();
