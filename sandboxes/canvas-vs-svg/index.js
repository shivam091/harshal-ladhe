import "./shared/playground.css";
import "./shared/range-slider.css";
import "./styles.css";
import { updateRangeSlider } from "./shared/range-slider.js";

// Shared logical size both scenes are drawn into — the SVG's viewBox and the canvas's width/height match exactly.
const SCENE_W = 300;
const SCENE_H = 220;

// Circle color palette, cycled by index — keeps both scenes visually identical for the same shape.
const COLORS = ["#818cf8", "#34d399", "#fbbf24", "#f472b6", "#38bdf8"];

const countInput = document.getElementById("count-input");
const countValue = document.getElementById("count-value");
const svgScene = document.getElementById("svg-scene");
const canvasScene = document.getElementById("canvas-scene");
const ctx = canvasScene.getContext("2d");
const svgReadout = document.getElementById("svg-readout");
const canvasReadout = document.getElementById("canvas-readout");
const interactionLog = document.getElementById("interaction-log");

// The scene currently on screen — kept around so the canvas click handler has something to hit-test against.
let currentShapes = [];
let highlightedIndex = -1;

/*
  A tiny seeded PRNG (mulberry32) instead of Math.random(): with a fixed seed, the same call sequence always
  produces the same numbers, so shape #1..#200 look pixel-identical whether the slider reads 200 or 5,000 —
  only regenerated as the count changes. `count`'s draws happen in the same order every time, so growing the
  count only ever appends new shapes after the ones already there.
*/
function createRng(seed) {
  let state = seed;
  return function rng() {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Builds `count` circles with a fixed seed — the "same scene" both the SVG side and the Canvas side draw from.
function generateShapes(count) {
  const rng = createRng(20260906);
  const shapes = [];
  for (let i = 0; i < count; i++) {
    shapes.push({
      i,
      x: 8 + rng() * (SCENE_W - 16),
      y: 8 + rng() * (SCENE_H - 16),
      r: 2 + rng() * 3,
      color: COLORS[i % COLORS.length]
    });
  }
  return shapes;
}

/*
  Rebuilds the SVG scene as real <circle> elements and times how long that takes, including one forced
  layout read (getBoundingClientRect) so the browser can't defer the cost past this measurement — otherwise
  a fast `innerHTML` write can look artificially cheap until something else forces layout later.
*/
function renderSvg(shapes) {
  const t0 = performance.now();

  let markup = "";
  for (const shape of shapes) {
    markup += `<circle cx="${shape.x.toFixed(2)}" cy="${shape.y.toFixed(2)}" r="${shape.r.toFixed(2)}" fill="${shape.color}" data-index="${shape.i}"></circle>`;
  }
  svgScene.innerHTML = markup;
  svgScene.getBoundingClientRect(); // force layout now, not later

  const elapsed = performance.now() - t0;
  const nodeCount = svgScene.childElementCount;

  svgReadout.textContent = `${shapes.length} circles → ${nodeCount} real DOM nodes · render: ${elapsed.toFixed(2)}ms`;
}

// Draws the same shapes onto the canvas bitmap in one loop and times it — no DOM nodes created at any point.
function renderCanvas(shapes) {
  const t0 = performance.now();

  ctx.clearRect(0, 0, SCENE_W, SCENE_H);
  for (const shape of shapes) {
    ctx.beginPath();
    ctx.arc(shape.x, shape.y, shape.r, 0, Math.PI * 2);
    ctx.fillStyle = shape.color;
    ctx.fill();
  }
  drawHighlight();

  const elapsed = performance.now() - t0;
  canvasReadout.textContent = `${shapes.length} circles → 1 DOM node (the <canvas> itself) · render: ${elapsed.toFixed(2)}ms`;
}

// Redraws a ring around the currently hit-tested shape, if any — kept separate so re-renders can reapply it.
function drawHighlight() {
  if (highlightedIndex < 0) return;
  const shape = currentShapes[highlightedIndex];
  if (!shape) return;

  ctx.beginPath();
  ctx.arc(shape.x, shape.y, shape.r + 3, 0, Math.PI * 2);
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

function renderScene() {
  currentShapes = generateShapes(Number(countInput.value));
  highlightedIndex = -1;
  renderSvg(currentShapes);
  renderCanvas(currentShapes);
}

countInput.addEventListener("input", () => {
  updateRangeSlider(countInput, countValue);
  renderScene();
});

/*
  SVG side: one delegated click listener, but the browser has ALREADY done the hit-testing by the time this
  runs — `event.target` just IS the circle the pointer was over. Nothing here computes a distance.
*/
svgScene.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof SVGCircleElement)) {
    interactionLog.textContent = "SVG: clicked empty space between circles — no element there, so no event fired at all.";
    return;
  }

  const index = target.dataset.index;
  interactionLog.textContent = `SVG: clicked circle #${index} directly — event.target already IS the circle. The browser hit-tested it for you; zero geometry math in this handler.`;
});

/*
  Canvas side: a click anywhere on the bitmap fires the same handler, so it manually loops every stored shape
  (topmost/last-drawn first, so overlapping circles resolve the same way the eye reads them) and does the
  distance-vs-radius math itself to decide what, if anything, was "clicked".
*/
canvasScene.addEventListener("click", (event) => {
  const rect = canvasScene.getBoundingClientRect();
  const scaleX = canvasScene.width / rect.width;
  const scaleY = canvasScene.height / rect.height;
  const clickX = (event.clientX - rect.left) * scaleX;
  const clickY = (event.clientY - rect.top) * scaleY;

  let hitIndex = -1;
  for (let i = currentShapes.length - 1; i >= 0; i--) {
    const shape = currentShapes[i];
    const dx = clickX - shape.x;
    const dy = clickY - shape.y;
    if (dx * dx + dy * dy <= shape.r * shape.r) {
      hitIndex = i;
      break;
    }
  }

  highlightedIndex = hitIndex;
  renderCanvas(currentShapes);

  if (hitIndex === -1) {
    interactionLog.textContent = `Canvas: clicked at (${clickX.toFixed(1)}, ${clickY.toFixed(1)}) — looped all ${currentShapes.length} shapes checking dx² + dy² ≤ r², none matched. No element was ever "there" to hit — just pixels.`;
  } else {
    const shape = currentShapes[hitIndex];
    interactionLog.textContent = `Canvas: clicked at (${clickX.toFixed(1)}, ${clickY.toFixed(1)}) — manually matched circle #${hitIndex} at (${shape.x.toFixed(1)}, ${shape.y.toFixed(1)}), r=${shape.r.toFixed(1)}, after checking stored shapes one by one.`;
  }
});

updateRangeSlider(countInput, countValue);
renderScene();
