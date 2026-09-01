import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./shared/range-slider.css";
import "./styles.css";
import { positionRangeBubble } from "./shared/range-slider.js";

const preview = document.getElementById("hero-preview");
const output = document.getElementById("overlay-output");

const angleField = document.getElementById("angle-field");
const angleInput = document.getElementById("angle-input");
const angleValue = document.getElementById("angle-value");
const angleLabel = document.getElementById("angle-label");

const color1Input = document.getElementById("color-1");
const opacity1Input = document.getElementById("opacity-1-input");
const opacity1Value = document.getElementById("opacity-1-value");
const opacity1Label = document.getElementById("opacity-1-label");

const color2Input = document.getElementById("color-2");
const opacity2Input = document.getElementById("opacity-2-input");
const opacity2Value = document.getElementById("opacity-2-value");
const opacity2Label = document.getElementById("opacity-2-label");

const blendSelect = document.getElementById("blend-select");

// Stand-in "photo" layer shared by every pattern — a colorful gradient, so the demo needs no image asset.
const PHOTO_LAYER = "linear-gradient(135deg, #fbbf24, #ef4444, #7c3aed)";

// Patterns whose gradient actually uses an angle, vs. ones (flat/radial/split) that don't.
const ANGLE_PATTERNS = new Set(["fade", "diagonal"]);

// Converts a "#rrggbb" color input value plus a 0-100 opacity into an "rgba(r, g, b, a)" string.
function toRgba(hex, opacityPercent) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${(opacityPercent / 100).toFixed(2)})`;
}

// Reads the currently checked overlay-pattern radio.
function getSelectedPattern() {
  return document.querySelector("input[name='overlay-pattern']:checked").value;
}

// Builds the overlay gradient layer for the selected pattern, using the current color/opacity/angle controls.
function buildOverlay() {
  const pattern = getSelectedPattern();
  const c1 = toRgba(color1Input.value, opacity1Input.value);
  const c2 = toRgba(color2Input.value, opacity2Input.value);
  const angle = angleInput.value;

  switch (pattern) {
    case "flat":
      return `linear-gradient(${c1}, ${c1})`;
    case "fade":
      return `linear-gradient(${angle}deg, ${c1}, rgba(0, 0, 0, 0))`;
    case "diagonal":
      return `linear-gradient(${angle}deg, ${c1}, ${c2})`;
    case "radial":
      return `radial-gradient(circle at center, ${c2}, ${c1})`;
    case "split":
      return `linear-gradient(to right, ${c1} 50%, transparent 50%)`;
    default:
      return `linear-gradient(${c1}, ${c1})`;
  }
}

function updateOverlay() {
  const pattern = getSelectedPattern();
  angleField.hidden = !ANGLE_PATTERNS.has(pattern);

  angleValue.textContent = `${angleInput.value}deg`;
  angleLabel.textContent = `${angleInput.value}deg`;
  positionRangeBubble(angleInput, angleValue);

  opacity1Value.textContent = `${opacity1Input.value}%`;
  opacity1Label.textContent = `${opacity1Input.value}%`;
  positionRangeBubble(opacity1Input, opacity1Value);

  opacity2Value.textContent = `${opacity2Input.value}%`;
  opacity2Label.textContent = `${opacity2Input.value}%`;
  positionRangeBubble(opacity2Input, opacity2Value);

  const overlay = buildOverlay();
  const blendMode = blendSelect.value;

  preview.style.backgroundImage = `${overlay}, ${PHOTO_LAYER}`;
  preview.style.backgroundBlendMode = blendMode;

  output.textContent =
    `background-image:\n` +
    `  ${overlay},\n` +
    `  url('hero.jpg');\n` +
    `background-blend-mode: ${blendMode};`;
}

document.querySelectorAll("input[name='overlay-pattern']").forEach((radio) =>
  radio.addEventListener("change", updateOverlay)
);

[angleInput, opacity1Input, opacity2Input].forEach((input) =>
  input.addEventListener("input", updateOverlay)
);

[color1Input, color2Input, blendSelect].forEach((input) =>
  input.addEventListener("input", updateOverlay)
);

updateOverlay();
