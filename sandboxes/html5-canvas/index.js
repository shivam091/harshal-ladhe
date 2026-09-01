import "./shared/playground.css";
import "./shared/range-slider.css";
import "./styles.css";
import { positionRangeBubble } from "./shared/range-slider.js";

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

// Resizes the canvas' backing store to match its CSS size at the device pixel ratio, so drawing stays sharp on retina displays.
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
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

function tick(now) {
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

window.addEventListener("resize", () => {
  resizeCanvas();
});

resizeCanvas();
updateCountLabels();
updateMouseRadiusLabels();
spawnParticles(Number(countInput.value));
requestAnimationFrame(tick);
