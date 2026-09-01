import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./shared/range-slider.css";
import "./styles.css";
import { positionRangeBubble } from "./shared/range-slider.js";
import { initSegmentedControl } from "./shared/segmented-control.js";

// Playground mode switcher (Gradient Types / Layering / Animated Demos) — each panel manages its
// own controls independently, so switching just needs to refresh whichever panel just appeared.
initSegmentedControl("#mode-switch .segment", (mode) => {
  if (mode === "types") updateGradient();
  if (mode === "layering") updateGlass();
  if (mode === "animated") updateAnimSpeed();
});

/* ----------------------------- Gradient Types panel ----------------------------- */

const preview = document.getElementById("gradient-preview");
const output = document.getElementById("gradient-output");

const typeGroups = document.querySelectorAll(".type-group");

const angleInput = document.getElementById("angle-input");
const angleValue = document.getElementById("angle-value");
const angleLabel = document.getElementById("angle-label");

const shapeSelect = document.getElementById("shape-select");
const radialPositionSelect = document.getElementById("radial-position-select");

const fromAngleInput = document.getElementById("from-angle-input");
const fromAngleValue = document.getElementById("from-angle-value");
const fromAngleLabel = document.getElementById("from-angle-label");
const conicPositionSelect = document.getElementById("conic-position-select");

const repeatShapeSelect = document.getElementById("repeat-shape-select");
const repeatAngleField = document.getElementById("repeat-angle-field");
const repeatAngleInput = document.getElementById("repeat-angle-input");
const repeatAngleValue = document.getElementById("repeat-angle-value");
const repeatAngleLabel = document.getElementById("repeat-angle-label");
const repeatWidthInput = document.getElementById("repeat-width-input");
const repeatWidthValue = document.getElementById("repeat-width-value");
const repeatWidthLabel = document.getElementById("repeat-width-label");

const colorStart = document.getElementById("color-start");
const colorStartLabel = document.getElementById("color-start-label");
const colorMid = document.getElementById("color-mid");
const colorMidField = document.getElementById("color-mid-field");
const colorEnd = document.getElementById("color-end");
const colorEndLabel = document.getElementById("color-end-label");

const midpointField = document.getElementById("midpoint-field");
const midpointTip = document.getElementById("midpoint-tip");
const midpointInput = document.getElementById("midpoint-input");
const midpointValue = document.getElementById("midpoint-value");
const midpointLabel = document.getElementById("midpoint-label");

const oklchToggle = document.getElementById("oklch-toggle");

// Reads the currently checked gradient-type radio ("linear" | "radial" | "conic" | "repeating").
function getSelectedType() {
  return document.querySelector("input[name='gradient-type']:checked").value;
}

// Shows the color-stop controls that make sense for the selected type: repeating gradients use
// two hard-edged stripe colors, so the midpoint color/slider (only meaningful for a smooth blend)
// are hidden instead of just ignored.
function updateColorStopVisibility() {
  const isRepeating = getSelectedType() === "repeating";

  colorMidField.hidden = isRepeating;
  midpointField.hidden = isRepeating;
  midpointTip.hidden = isRepeating;
  colorStartLabel.textContent = isRepeating ? "Stripe A" : "Start (0%)";
  colorEndLabel.textContent = isRepeating ? "Stripe B" : "End (100%)";

  repeatAngleField.hidden = repeatShapeSelect.value !== "linear";
}

// Shows the option group matching the selected type and hides the other two.
function switchGroup() {
  const type = getSelectedType();
  typeGroups.forEach((group) => group.classList.remove("active-group"));
  document.getElementById(`${type}-options`).classList.add("active-group");
  updateColorStopVisibility();
  updateGradient();
}

// Builds the shared "<start> 0%, <mid> <midpoint>%, <end> 100%" color-stop list linear/radial/conic use.
function buildBlendedStops() {
  return `${colorStart.value} 0%, ${colorMid.value} ${midpointInput.value}%, ${colorEnd.value} 100%`;
}

// Builds a hard-edged "<a> 0, <a> W, <b> W, <b> 2W" stop list — the repeat unit repeating gradients tile.
function buildStripeStops() {
  const width = Number(repeatWidthInput.value);
  return `${colorStart.value} 0, ${colorStart.value} ${width}px, ${colorEnd.value} ${width}px, ${colorEnd.value} ${width * 2}px`;
}

// Assembles the full gradient() function call for the selected type, stops, and interpolation method.
function buildGradient() {
  const type = getSelectedType();
  const interpolation = oklchToggle.checked ? "in oklch " : "";

  if (type === "linear") {
    return `linear-gradient(${interpolation}${angleInput.value}deg, ${buildBlendedStops()})`;
  }

  if (type === "radial") {
    return `radial-gradient(${interpolation}${shapeSelect.value} at ${radialPositionSelect.value}, ${buildBlendedStops()})`;
  }

  if (type === "conic") {
    return `conic-gradient(${interpolation}from ${fromAngleInput.value}deg at ${conicPositionSelect.value}, ${buildBlendedStops()})`;
  }

  const stripes = buildStripeStops();
  if (repeatShapeSelect.value === "linear") {
    return `repeating-linear-gradient(${interpolation}${repeatAngleInput.value}deg, ${stripes})`;
  }
  return `repeating-radial-gradient(${interpolation}circle at center, ${stripes})`;
}

function updateGradient() {
  angleValue.textContent = `${angleInput.value}deg`;
  angleLabel.textContent = `${angleInput.value}deg`;
  positionRangeBubble(angleInput, angleValue);

  fromAngleValue.textContent = `${fromAngleInput.value}deg`;
  fromAngleLabel.textContent = `${fromAngleInput.value}deg`;
  positionRangeBubble(fromAngleInput, fromAngleValue);

  repeatAngleValue.textContent = `${repeatAngleInput.value}deg`;
  repeatAngleLabel.textContent = `${repeatAngleInput.value}deg`;
  positionRangeBubble(repeatAngleInput, repeatAngleValue);

  repeatWidthValue.textContent = `${repeatWidthInput.value}px`;
  repeatWidthLabel.textContent = `${repeatWidthInput.value}px`;
  positionRangeBubble(repeatWidthInput, repeatWidthValue);

  midpointValue.textContent = `${midpointInput.value}%`;
  midpointLabel.textContent = `${midpointInput.value}%`;
  positionRangeBubble(midpointInput, midpointValue);

  const gradient = buildGradient();
  preview.style.background = gradient;
  output.textContent = `background: ${gradient};`;
}

document.querySelectorAll("input[name='gradient-type']").forEach((radio) =>
  radio.addEventListener("change", switchGroup)
);

[angleInput, fromAngleInput, repeatAngleInput, repeatWidthInput, midpointInput].forEach((input) =>
  input.addEventListener("input", updateGradient)
);

[shapeSelect, radialPositionSelect, conicPositionSelect].forEach((select) =>
  select.addEventListener("change", updateGradient)
);

repeatShapeSelect.addEventListener("change", () => {
  updateColorStopVisibility();
  updateGradient();
});

[colorStart, colorMid, colorEnd].forEach((input) =>
  input.addEventListener("input", updateGradient)
);

oklchToggle.addEventListener("change", updateGradient);

updateColorStopVisibility();
updateGradient();

/* ----------------------------- Layering panel ----------------------------- */

const glassCard = document.getElementById("glass-card");
const glassOutput = document.getElementById("glass-output");

const layerSheenToggle = document.getElementById("layer-sheen-toggle");
const layerGlowToggle = document.getElementById("layer-glow-toggle");
const glowColor = document.getElementById("glow-color");

const blurInput = document.getElementById("blur-input");
const blurValue = document.getElementById("blur-value");
const blurLabel = document.getElementById("blur-label");

const opacityInput = document.getElementById("opacity-input");
const opacityValue = document.getElementById("opacity-value");
const opacityLabel = document.getElementById("opacity-label");

// The card's own base color, always present underneath whichever gradient layers are checked —
// same role as the "backdrop" square in the layering diagram above.
const GLASS_BASE_COLOR = "#1a1a2e";

// Converts a "#rrggbb" color input value into its [r, g, b] components for building an rgba() stop.
function hexToRgb(hex) {
  const value = parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function updateGlass() {
  blurLabel.textContent = `${blurInput.value}px`;
  positionRangeBubble(blurInput, blurValue);

  opacityLabel.textContent = `${opacityInput.value}%`;
  positionRangeBubble(opacityInput, opacityValue);

  const intensity = Number(opacityInput.value) / 100;
  const layers = [];

  // ① Light reflection — listed first, so it renders on top of ② when both are checked.
  if (layerSheenToggle.checked) {
    layers.push(`linear-gradient(120deg, rgba(255, 255, 255, ${(0.3 * intensity).toFixed(2)}), rgba(255, 255, 255, ${(0.05 * intensity).toFixed(2)}))`);
  }

  // ② Color glow.
  if (layerGlowToggle.checked) {
    const [r, g, b] = hexToRgb(glowColor.value);
    layers.push(`radial-gradient(at 50% 0%, rgba(${r}, ${g}, ${b}, ${(0.55 * intensity).toFixed(2)}) 0%, transparent 60%)`);
  }

  const backgroundImage = layers.length ? layers.join(", ") : "none";
  const blur = `blur(${blurInput.value}px)`;

  glassCard.style.backgroundColor = GLASS_BASE_COLOR;
  glassCard.style.backgroundImage = backgroundImage;
  glassCard.style.backdropFilter = blur;
  glassCard.style.webkitBackdropFilter = blur;

  const lines = [`background-color: ${GLASS_BASE_COLOR};`];
  if (backgroundImage !== "none") lines.push(`background-image: ${backgroundImage};`);
  lines.push(`backdrop-filter: ${blur};`);
  glassOutput.textContent = lines.join("\n");
}

[layerSheenToggle, layerGlowToggle, glowColor, blurInput, opacityInput].forEach((input) =>
  input.addEventListener("input", updateGlass)
);

updateGlass();

/* ----------------------------- Animated Demos panel ----------------------------- */

const animDemoArea = document.querySelector(".anim-demo-area");
const liquidEl = document.getElementById("liquid-flow-el");
const beamEl = document.getElementById("border-beam-el");
const sweepEl = document.getElementById("sweep-loader-el");
const animEls = { liquid: liquidEl, beam: beamEl, sweep: sweepEl };

const speedInput = document.getElementById("speed-input");
const speedValue = document.getElementById("speed-value");
const speedLabel = document.getElementById("speed-label");

const reducedMotionToggle = document.getElementById("reduced-motion-toggle");
const animTip = document.getElementById("anim-tip");

const ANIM_TIPS = {
  liquid: "Only background-position is animating here — background-size: 600% 600% makes the gradient big enough that panning it looks like flowing liquid.",
  beam: "The card itself never spins — a much larger, mostly-transparent conic-gradient rotates behind it via transform: rotate(), so only the bright slice appears to travel around the edge.",
  sweep: "A radial-gradient mask punches the center out of a solid conic-gradient disc, turning it into a ring before the spin animation ever runs."
};

function getSelectedAnim() {
  return document.querySelector("input[name='anim-demo']:checked").value;
}

function updateAnimSpeed() {
  const duration = `${speedInput.value}s`;
  speedLabel.textContent = duration;
  positionRangeBubble(speedInput, speedValue);

  liquidEl.style.animationDuration = duration;
  beamEl.style.setProperty("--beam-duration", duration);
  sweepEl.style.setProperty("--sweep-duration", duration);
}

function switchAnim() {
  const anim = getSelectedAnim();
  Object.entries(animEls).forEach(([key, el]) => el.classList.toggle("active-anim", key === anim));
  animTip.textContent = ANIM_TIPS[anim];
  updateAnimSpeed();
}

document.querySelectorAll("input[name='anim-demo']").forEach((radio) =>
  radio.addEventListener("change", switchAnim)
);

speedInput.addEventListener("input", updateAnimSpeed);

reducedMotionToggle.addEventListener("change", () => {
  animDemoArea.classList.toggle("reduced-motion", reducedMotionToggle.checked);
});

switchAnim();
