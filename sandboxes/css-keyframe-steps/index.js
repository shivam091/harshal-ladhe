import "./shared/playground.css";
import "./styles.css";

const demoArea = document.querySelector(".demo-area");
const hybridBox = document.getElementById("hybrid-box");
const smoothBox = document.getElementById("smooth-box");
const replayButton = document.getElementById("replay-btn");

const stepsCountInput = document.getElementById("steps-count");
const durationInput = document.getElementById("duration-input");
const durationUnit = document.getElementById("duration-unit");

let styleTag = document.getElementById("dynamic-keyframes");
if (!styleTag) {
  styleTag = document.createElement("style");
  styleTag.id = "dynamic-keyframes";
  document.head.appendChild(styleTag);
}

// ms needs a wider, coarser-stepped range than s, not just the same numbers relabeled.
const DURATION_RANGES = {
  s: { min: 1, max: 6, step: 0.5 },
  ms: { min: 1000, max: 6000, step: 100 }
};

/*
  Measured rather than a fixed px/media-query guess so the boxes land exactly on the track's right
  edge at any width. offsetLeft/offsetWidth ignore transforms, so it stays correct mid-animation;
  the fixed 64px label column keeps both tracks the same width, so one measurement covers both.
*/
function updateTravelDistance() {
  const track = hybridBox.parentElement;
  const distance = track.clientWidth - hybridBox.offsetWidth - hybridBox.offsetLeft * 2;
  demoArea.style.setProperty("--travel-distance", `${Math.max(0, distance)}px`);
}

function buildAnimations() {
  const steps = Number(stepsCountInput.value);
  const duration = durationInput.value + durationUnit.value;

  // A keyframe's timing function governs only the segment leaving it, so 50%→100% steps while 0%→50% keeps `ease`.
  styleTag.textContent = `
    @keyframes hybrid-move {
      0% { transform: translateX(0); }
      50% {
        transform: translateX(calc(var(--travel-distance, 260px) / 2));
        animation-timing-function: steps(${steps}, end);
      }
      100% { transform: translateX(var(--travel-distance, 260px)); }
    }

    @keyframes smooth-move {
      from { transform: translateX(0); }
      to { transform: translateX(var(--travel-distance, 260px)); }
    }
  `;

  hybridBox.style.animation = `hybrid-move ${duration} ease forwards`;
  smoothBox.style.animation = `smooth-move ${duration} ease forwards`;
}

function restart() {
  [hybridBox, smoothBox].forEach((el) => {
    el.style.animation = "none";
  });

  // Force a reflow so the browser forgets the previous run before re-applying it.
  void hybridBox.offsetWidth;

  buildAnimations();
}

[stepsCountInput, durationInput].forEach((control) => {
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
