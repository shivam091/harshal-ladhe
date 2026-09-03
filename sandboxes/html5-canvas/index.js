import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./shared/range-slider.css";
import "./styles.css";
import { positionRangeBubble } from "./shared/range-slider.js";
import { initSegmentedControl } from "./shared/segmented-control.js";

// Canvas mode switcher (2D Particles vs. 3D Canvas). Scoped to #canvas-mode-switch specifically
// because the 3D panel below has its own, unrelated segmented control for picking a shape.
let currentMode = "2d";

initSegmentedControl("#canvas-mode-switch .segment", (mode) => {
  currentMode = mode;
  // A canvas inside a hidden panel reports zero size until its panel is actually displayed, so
  // whichever one just became visible needs to be resized now.
  if (mode === "2d") resizeCanvas();
  else resize3DCanvas();
});

/* ----------------------------- 2D particle scene ----------------------------- */

const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");
const fpsReadout = document.getElementById("fps-readout");

const countInput = document.getElementById("count-input");
const countLabel = document.getElementById("count-label");
const countValue = document.getElementById("count-value");

const mouseRadiusInput = document.getElementById("mouse-radius-input");
const mouseRadiusLabel = document.getElementById("mouse-radius-label");
const mouseRadiusValue = document.getElementById("mouse-radius-value");

const collisionsToggle = document.getElementById("collisions-toggle");
const attractToggle = document.getElementById("attract-toggle");
const resetBtn = document.getElementById("reset-btn");

const COLORS = ["#818cf8", "#22d3ee", "#f472b6", "#facc15", "#4ade80"];

let width = 0;
let height = 0;
let particles = [];
const mouse = { x: -9999, y: -9999, active: false };

// Resizes the canvas' backing store to match its CSS size at the device pixel ratio, so drawing
// stays sharp on retina displays. Bails out while the panel is hidden (rect collapses to zero),
// leaving width/height at their last known value instead of zeroing everything out.
function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;

  const dpr = window.devicePixelRatio || 1;
  width = rect.width;
  height = rect.height;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

class Particle {
  constructor() {
    this.radius = 3 + Math.random() * 4;
    this.x = this.radius + Math.random() * (width - this.radius * 2);
    this.y = this.radius + Math.random() * (height - this.radius * 2);
    this.vx = (Math.random() - 0.5) * 1.6;
    this.vy = (Math.random() - 0.5) * 1.6;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  // Pushes (or pulls) the particle based on distance from the mouse, then integrates velocity and bounces off the canvas walls.
  update(mouseRadius, attract) {
    if (mouse.active) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.hypot(dx, dy) || 1;

      if (dist < mouseRadius) {
        const force = ((mouseRadius - dist) / mouseRadius) * 0.6;
        const sign = attract ? -1 : 1;
        this.vx += (dx / dist) * force * sign;
        this.vy += (dy / dist) * force * sign;
      }
    }

    // A light drag keeps mouse-driven bursts of speed from accumulating forever.
    this.vx *= 0.98;
    this.vy *= 0.98;

    this.x += this.vx;
    this.y += this.vy;

    if (this.x - this.radius < 0) {
      this.x = this.radius;
      this.vx *= -1;
    } else if (this.x + this.radius > width) {
      this.x = width - this.radius;
      this.vx *= -1;
    }

    if (this.y - this.radius < 0) {
      this.y = this.radius;
      this.vy *= -1;
    } else if (this.y + this.radius > height) {
      this.y = height - this.radius;
      this.vy *= -1;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

// Rebuilds the particle array at the current slider count, replacing whatever was there before.
function spawnParticles(count) {
  particles = Array.from({ length: count }, () => new Particle());
}

/*
  Checks every particle pair for a circle overlap and, on contact, swaps their velocity
  components along the line between centers (equal-mass elastic collision) then pushes them
  apart so they don't stay stuck inside each other on the next frame.
*/
function resolveCollisions() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i];
      const b = particles[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.hypot(dx, dy);
      const minDist = a.radius + b.radius;
      if (dist === 0 || dist >= minDist) continue;

      const nx = dx / dist;
      const ny = dy / dist;

      const overlap = minDist - dist;
      a.x -= (nx * overlap) / 2;
      a.y -= (ny * overlap) / 2;
      b.x += (nx * overlap) / 2;
      b.y += (ny * overlap) / 2;

      const relVx = b.vx - a.vx;
      const relVy = b.vy - a.vy;
      const speedAlongNormal = relVx * nx + relVy * ny;
      if (speedAlongNormal > 0) continue;

      a.vx += speedAlongNormal * nx;
      a.vy += speedAlongNormal * ny;
      b.vx -= speedAlongNormal * nx;
      b.vy -= speedAlongNormal * ny;
    }
  }
}

function drawMouseRadius(mouseRadius) {
  if (!mouse.active) return;
  ctx.beginPath();
  ctx.arc(mouse.x, mouse.y, mouseRadius, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(129, 140, 248, 0.35)";
  ctx.lineWidth = 1;
  ctx.stroke();
}

let lastFrameTime = performance.now();
let fpsAccumulator = 0;
let fpsFrames = 0;

// Drives the particle scene. Skips the actual physics/draw work (but keeps scheduling frames)
// whenever the 2D panel isn't the active mode, so switching to 3D doesn't burn CPU on a hidden canvas.
function tick(now) {
  if (currentMode !== "2d") {
    requestAnimationFrame(tick);
    return;
  }

  const delta = now - lastFrameTime;
  lastFrameTime = now;
  fpsAccumulator += delta;
  fpsFrames += 1;
  if (fpsAccumulator >= 500) {
    fpsReadout.textContent = `${Math.round((fpsFrames * 1000) / fpsAccumulator)} fps`;
    fpsAccumulator = 0;
    fpsFrames = 0;
  }

  const mouseRadius = Number(mouseRadiusInput.value);
  const attract = attractToggle.checked;

  ctx.clearRect(0, 0, width, height);

  for (const particle of particles) particle.update(mouseRadius, attract);
  if (collisionsToggle.checked) resolveCollisions();
  for (const particle of particles) particle.draw();
  drawMouseRadius(mouseRadius);

  requestAnimationFrame(tick);
}

function updateCountLabels() {
  countLabel.textContent = countInput.value;
  countValue.textContent = countInput.value;
  positionRangeBubble(countInput, countValue);
}

function updateMouseRadiusLabels() {
  mouseRadiusLabel.textContent = `${mouseRadiusInput.value}px`;
  mouseRadiusValue.textContent = `${mouseRadiusInput.value}px`;
  positionRangeBubble(mouseRadiusInput, mouseRadiusValue);
}

canvas.addEventListener("pointermove", (event) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = event.clientX - rect.left;
  mouse.y = event.clientY - rect.top;
  mouse.active = true;
});

canvas.addEventListener("pointerleave", () => {
  mouse.active = false;
});

countInput.addEventListener("input", () => {
  updateCountLabels();
  spawnParticles(Number(countInput.value));
});

mouseRadiusInput.addEventListener("input", updateMouseRadiusLabels);

resetBtn.addEventListener("click", () => spawnParticles(Number(countInput.value)));

resizeCanvas();
updateCountLabels();
updateMouseRadiusLabels();
spawnParticles(Number(countInput.value));
requestAnimationFrame(tick);

/* -------------------------------- 3D shape scene -------------------------------- */

const UNIT = 90; // pixels per model unit at the origin plane, before perspective scaling

const canvas3d = document.getElementById("scene-3d");
const ctx3d = canvas3d.getContext("2d");
const fpsReadout3d = document.getElementById("fps-readout-3d");

const shapeInputs = document.querySelectorAll('input[name="shape-type"]');
const rotationSpeedInput = document.getElementById("rotation-speed-input");
const rotationSpeedLabel = document.getElementById("rotation-speed-label");
const rotationSpeedValue = document.getElementById("rotation-speed-value");
const fovInput = document.getElementById("fov-input");
const fovLabel = document.getElementById("fov-label");
const fovValue = document.getElementById("fov-value");
const wireframeToggle = document.getElementById("wireframe-toggle");
const reset3dBtn = document.getElementById("reset-3d-btn");

let width3d = 0;
let height3d = 0;
let currentShapeName = "cube";
let rotationX = -0.4;
let rotationY = 0.6;
let isDragging3d = false;
let lastPointerX = 0;
let lastPointerY = 0;

// Rotates a point around the X axis by the given angle (radians), returning a new point.
function rotateX(point, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return { x: point.x, y: point.y * cos - point.z * sin, z: point.y * sin + point.z * cos };
}

// Rotates a point around the Y axis by the given angle (radians), returning a new point.
function rotateY(point, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return { x: point.x * cos + point.z * sin, y: point.y, z: -point.x * sin + point.z * cos };
}

// Normalizes a 3D vector to unit length (falls back to the zero vector if it has none).
function normalize(v) {
  const length = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / length, y: v.y / length, z: v.z / length };
}

// Subtracts vector b from vector a.
function subtract(a, b) {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

// Returns the cross product of two vectors.
function cross(a, b) {
  return { x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x };
}

const LIGHT_DIR = normalize({ x: -0.5, y: -0.7, z: -0.6 });

/*
  The octahedron's 8 triangular faces are every combination of one +/-X vertex, one +/-Y vertex
  and one +/-Z vertex, so it's generated here instead of hand-listed like the cube and pyramid.
*/
function buildOctahedron() {
  const vertices = [
    { x: 1, y: 0, z: 0 },
    { x: -1, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: 0, y: -1, z: 0 },
    { x: 0, y: 0, z: 1 },
    { x: 0, y: 0, z: -1 },
  ];
  const colors = ["#818cf8", "#22d3ee", "#f472b6", "#facc15", "#4ade80", "#a78bfa", "#fb923c", "#f87171"];
  const faces = [];
  let colorIndex = 0;
  for (const xi of [0, 1]) {
    for (const yi of [2, 3]) {
      for (const zi of [4, 5]) {
        faces.push({ indices: [xi, yi, zi], color: colors[colorIndex] });
        colorIndex += 1;
      }
    }
  }
  return { vertices, faces };
}

// The three selectable solids. Each face lists its vertex indices in winding order plus a base hex
// color; wireframe edges are derived from these faces below, so there's only one source of truth
// per shape instead of a separately hand-maintained edge list.
const SHAPES = {
  cube: {
    vertices: [
      { x: -1, y: -1, z: -1 },
      { x: 1, y: -1, z: -1 },
      { x: 1, y: 1, z: -1 },
      { x: -1, y: 1, z: -1 },
      { x: -1, y: -1, z: 1 },
      { x: 1, y: -1, z: 1 },
      { x: 1, y: 1, z: 1 },
      { x: -1, y: 1, z: 1 },
    ],
    faces: [
      { indices: [0, 1, 2, 3], color: "#818cf8" },
      { indices: [5, 4, 7, 6], color: "#22d3ee" },
      { indices: [4, 0, 3, 7], color: "#f472b6" },
      { indices: [1, 5, 6, 2], color: "#facc15" },
      { indices: [4, 5, 1, 0], color: "#4ade80" },
      { indices: [3, 2, 6, 7], color: "#a78bfa" },
    ],
  },
  pyramid: {
    vertices: [
      { x: -1, y: 0.6, z: -1 },
      { x: 1, y: 0.6, z: -1 },
      { x: 1, y: 0.6, z: 1 },
      { x: -1, y: 0.6, z: 1 },
      { x: 0, y: -1.2, z: 0 },
    ],
    faces: [
      { indices: [0, 1, 2, 3], color: "#818cf8" },
      { indices: [0, 1, 4], color: "#22d3ee" },
      { indices: [1, 2, 4], color: "#f472b6" },
      { indices: [2, 3, 4], color: "#facc15" },
      { indices: [3, 0, 4], color: "#4ade80" },
    ],
  },
  octahedron: buildOctahedron(),
};

// Collects every unique edge implied by a shape's faces (as vertex-index pairs), so wireframe mode
// doesn't need its own hand-maintained edge list alongside the face list.
function getEdges(shape) {
  const seen = new Set();
  const edges = [];
  for (const face of shape.faces) {
    const { indices } = face;
    for (let i = 0; i < indices.length; i++) {
      const a = indices[i];
      const b = indices[(i + 1) % indices.length];
      const key = a < b ? `${a}-${b}` : `${b}-${a}`;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push([a, b]);
      }
    }
  }
  return edges;
}

// Parses a "#rrggbb" color and scales its channels by `factor` (floored at 0.25 so faces never go
// fully black) to fake flat shading without a real lighting pipeline.
function shadeColor(hex, factor) {
  const value = Math.max(0.25, Math.min(1, factor));
  const r = Math.round(parseInt(hex.slice(1, 3), 16) * value);
  const g = Math.round(parseInt(hex.slice(3, 5), 16) * value);
  const b = Math.round(parseInt(hex.slice(5, 7), 16) * value);
  return `rgb(${r}, ${g}, ${b})`;
}

// Rotates every vertex of the current shape by the live rotationX/rotationY angles.
function getRotatedVertices() {
  const shape = SHAPES[currentShapeName];
  return shape.vertices.map((vertex) => rotateY(rotateX(vertex, rotationX), rotationY));
}

/*
  Projects a rotated 3D point onto the canvas with a simple weak-perspective camera: the closer
  `perspective` (the camera's distance from the origin) is to zero, the more a point's distance
  along z shrinks or grows its apparent size — the same falloff a real camera lens produces.
*/
function project(point, perspective) {
  const scale = perspective / (perspective + point.z * UNIT);
  return { x: width3d / 2 + point.x * UNIT * scale, y: height3d / 2 + point.y * UNIT * scale };
}

// Draws the current shape as either a flat-shaded solid (painter's algorithm: faces sorted
// back-to-front by average depth) or a pure wireframe, depending on the wireframe toggle.
function drawShape() {
  const shape = SHAPES[currentShapeName];
  const perspective = Number(fovInput.value);
  const rotated = getRotatedVertices();
  const projected = rotated.map((point) => project(point, perspective));

  ctx3d.clearRect(0, 0, width3d, height3d);

  if (wireframeToggle.checked) {
    ctx3d.strokeStyle = "#818cf8";
    ctx3d.lineWidth = 1.5;
    for (const [a, b] of getEdges(shape)) {
      ctx3d.beginPath();
      ctx3d.moveTo(projected[a].x, projected[a].y);
      ctx3d.lineTo(projected[b].x, projected[b].y);
      ctx3d.stroke();
    }
    return;
  }

  const facesByDepth = shape.faces
    .map((face) => {
      const depths = face.indices.map((i) => rotated[i].z);
      const avgDepth = depths.reduce((sum, depth) => sum + depth, 0) / depths.length;
      return { face, avgDepth };
    })
    .sort((a, b) => b.avgDepth - a.avgDepth);

  for (const { face } of facesByDepth) {
    const [i0, i1, i2] = face.indices;
    const normal = normalize(cross(subtract(rotated[i1], rotated[i0]), subtract(rotated[i2], rotated[i0])));
    const brightness = Math.abs(normal.x * LIGHT_DIR.x + normal.y * LIGHT_DIR.y + normal.z * LIGHT_DIR.z);

    ctx3d.beginPath();
    face.indices.forEach((index, position) => {
      const point = projected[index];
      if (position === 0) ctx3d.moveTo(point.x, point.y);
      else ctx3d.lineTo(point.x, point.y);
    });
    ctx3d.closePath();
    ctx3d.fillStyle = shadeColor(face.color, brightness);
    ctx3d.fill();
    ctx3d.strokeStyle = "rgba(15, 18, 32, 0.4)";
    ctx3d.lineWidth = 1;
    ctx3d.stroke();
  }
}

// Resizes the 3D canvas' backing store the same way resizeCanvas() does for the 2D one, bailing
// out while its panel is hidden so width3d/height3d hold onto their last real value instead.
function resize3DCanvas() {
  const rect = canvas3d.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;

  const dpr = window.devicePixelRatio || 1;
  width3d = rect.width;
  height3d = rect.height;

  canvas3d.width = width3d * dpr;
  canvas3d.height = height3d * dpr;
  ctx3d.setTransform(dpr, 0, 0, dpr, 0, 0);
}

let lastFrameTime3d = performance.now();
let fpsAccumulator3d = 0;
let fpsFrames3d = 0;

// Drives the 3D scene: advances auto-rotation (unless the user is actively dragging), redraws the
// shape, and reports FPS — but only while the 3D panel is the active mode, so it doesn't burn CPU
// on a hidden canvas while the particle demo is showing.
function tick3D(now) {
  if (currentMode !== "3d") {
    requestAnimationFrame(tick3D);
    return;
  }

  const delta = now - lastFrameTime3d;
  lastFrameTime3d = now;
  fpsAccumulator3d += delta;
  fpsFrames3d += 1;
  if (fpsAccumulator3d >= 500) {
    fpsReadout3d.textContent = `${Math.round((fpsFrames3d * 1000) / fpsAccumulator3d)} fps`;
    fpsAccumulator3d = 0;
    fpsFrames3d = 0;
  }

  if (!isDragging3d) {
    rotationY += (Number(rotationSpeedInput.value) * delta) / 1000;
  }

  drawShape();
  requestAnimationFrame(tick3D);
}

function updateRotationSpeedLabels() {
  const text = `${Number(rotationSpeedInput.value).toFixed(1)}x`;
  rotationSpeedLabel.textContent = text;
  rotationSpeedValue.textContent = text;
  positionRangeBubble(rotationSpeedInput, rotationSpeedValue);
}

function updateFovLabels() {
  fovLabel.textContent = fovInput.value;
  fovValue.textContent = fovInput.value;
  positionRangeBubble(fovInput, fovValue);
}

canvas3d.addEventListener("pointerdown", (event) => {
  isDragging3d = true;
  lastPointerX = event.clientX;
  lastPointerY = event.clientY;
  canvas3d.setPointerCapture(event.pointerId);
});

canvas3d.addEventListener("pointermove", (event) => {
  if (!isDragging3d) return;
  rotationY += (event.clientX - lastPointerX) * 0.01;
  rotationX += (event.clientY - lastPointerY) * 0.01;
  lastPointerX = event.clientX;
  lastPointerY = event.clientY;
});

canvas3d.addEventListener("pointerup", (event) => {
  isDragging3d = false;
  canvas3d.releasePointerCapture(event.pointerId);
});

canvas3d.addEventListener("pointerleave", () => {
  isDragging3d = false;
});

shapeInputs.forEach((input) => {
  input.addEventListener("change", () => {
    currentShapeName = input.value;
  });
});

rotationSpeedInput.addEventListener("input", updateRotationSpeedLabels);
fovInput.addEventListener("input", updateFovLabels);

reset3dBtn.addEventListener("click", () => {
  rotationX = -0.4;
  rotationY = 0.6;
});

window.addEventListener("resize", () => {
  resizeCanvas();
  resize3DCanvas();
});

updateRotationSpeedLabels();
updateFovLabels();
resize3DCanvas();
requestAnimationFrame(tick3D);
