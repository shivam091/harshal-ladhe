import "./shared/playground.css";
import "./styles.css";

const FRAME_WIDTH = 120;
const FRAME_HEIGHT = 160;

const sprite = document.getElementById("sprite");
const sheetCanvas = document.getElementById("sheet-canvas");
const playButton = document.getElementById("play-btn");

const frameCountInput = document.getElementById("frame-count");
const jumpTermSelect = document.getElementById("jump-term");
const durationInput = document.getElementById("duration-input");
const durationUnit = document.getElementById("duration-unit");

const frameReadout = document.getElementById("frame-readout");
const frameTotal = document.getElementById("frame-total");

let styleTag = document.getElementById("dynamic-keyframes");
if (!styleTag) {
  styleTag = document.createElement("style");
  styleTag.id = "dynamic-keyframes";
  document.head.appendChild(styleTag);
}

let readoutTimer = null;
let playing = true;

// ms needs a wider, coarser-stepped range than s, not just the same numbers relabeled.
const DURATION_RANGES = {
  s: { min: 0.3, max: 3, step: 0.1 },
  ms: { min: 300, max: 3000, step: 50 }
};

function getDurationMs() {
  const value = Number(durationInput.value);
  return durationUnit.value === "ms" ? value : value * 1000;
}

// Frames are drawn procedurally so the demo needs no image asset and works for any frame count.
function drawFrame(ctx, index, total) {
  const x0 = index * FRAME_WIDTH;
  const phase = (index / total) * Math.PI * 2;
  const cx = x0 + FRAME_WIDTH / 2;
  const bodyCy = FRAME_HEIGHT * 0.42;
  const bob = Math.sin(phase * 2) * 3;

  ctx.save();
  ctx.translate(0, bob);

  // Legs (drawn first so the body overlaps their tops).
  const legLength = 46;
  const hipY = bodyCy + 28;
  ctx.strokeStyle = "#166534";
  ctx.lineWidth = 8;
  ctx.lineCap = "round";
  [0, Math.PI].forEach((offset) => {
    const swing = Math.sin(phase + offset) * 0.5;
    const footX = cx + Math.sin(swing) * 22;
    const footY = hipY + Math.cos(swing) * legLength;
    ctx.beginPath();
    ctx.moveTo(cx, hipY);
    ctx.lineTo(footX, footY);
    ctx.stroke();
  });

  // Antennae.
  ctx.strokeStyle = "#166534";
  ctx.lineWidth = 3;
  [-1, 1].forEach((side) => {
    const tipX = cx + side * 16;
    const tipY = bodyCy - 46;
    ctx.beginPath();
    ctx.moveTo(cx + side * 8, bodyCy - 26);
    ctx.lineTo(tipX, tipY);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(tipX, tipY, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#4ade80";
    ctx.fill();
  });

  // Body.
  ctx.beginPath();
  ctx.ellipse(cx, bodyCy, 26, 30, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#4ade80";
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#166534";
  ctx.stroke();

  // Eyes.
  [-10, 10].forEach((dx) => {
    ctx.beginPath();
    ctx.arc(cx + dx, bodyCy - 6, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx + dx, bodyCy - 6, 2.4, 0, Math.PI * 2);
    ctx.fillStyle = "#0f172a";
    ctx.fill();
  });

  ctx.restore();
}

function buildSheet(frameCount) {
  sheetCanvas.width = FRAME_WIDTH * frameCount;
  sheetCanvas.height = FRAME_HEIGHT;
  const ctx = sheetCanvas.getContext("2d");
  ctx.clearRect(0, 0, sheetCanvas.width, sheetCanvas.height);

  for (let i = 0; i < frameCount; i++) {
    drawFrame(ctx, i, frameCount);
  }

  const dataUrl = sheetCanvas.toDataURL("image/png");
  sprite.style.width = `${FRAME_WIDTH}px`;
  sprite.style.height = `${FRAME_HEIGHT}px`;
  sprite.style.backgroundImage = `url(${dataUrl})`;
  sprite.style.backgroundSize = `${FRAME_WIDTH * frameCount}px ${FRAME_HEIGHT}px`;
}

function buildAnimation() {
  const frameCount = Number(frameCountInput.value);
  const jumpTerm = jumpTermSelect.value;
  const durationCss = durationInput.value + durationUnit.value;
  const durationMs = getDurationMs();

  buildSheet(frameCount);

  styleTag.textContent = `
    @keyframes walk-cycle {
      to { background-position: -${FRAME_WIDTH * frameCount}px 0; }
    }
  `;

  frameTotal.textContent = String(frameCount);
  sprite.style.animation = `walk-cycle ${durationCss} steps(${frameCount}, ${jumpTerm}) infinite`;
  sprite.style.animationPlayState = playing ? "running" : "paused";

  clearInterval(readoutTimer);
  frameReadout.textContent = formatFrame(0, frameCount, jumpTerm);
  if (playing) {
    let interval = 0;
    const intervalMs = durationMs / frameCount;
    readoutTimer = setInterval(() => {
      interval = (interval + 1) % frameCount;
      frameReadout.textContent = formatFrame(interval, frameCount, jumpTerm);
    }, intervalMs);
  }
}

/*
  `start` shifts every interval one frame ahead, so its last interval lands on -N×width — one past
  the sheet — and the readout should admit that blank flash rather than claim a frame is showing.
*/
function formatFrame(interval, frameCount, jumpTerm) {
  const frame = jumpTerm === "start" ? interval + 2 : interval + 1;
  return frame > frameCount ? "— (blank)" : String(frame);
}

function restart() {
  sprite.style.animation = "none";
  void sprite.offsetWidth;
  buildAnimation();
}

[frameCountInput, jumpTermSelect, durationInput].forEach((control) => {
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

playButton.addEventListener("click", () => {
  playing = !playing;
  playButton.textContent = playing ? "Pause" : "Play";
  restart();
});

restart();
