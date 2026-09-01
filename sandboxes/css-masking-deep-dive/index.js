import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./shared/range-slider.css";
import "./styles.css";
import { positionRangeBubble } from "./shared/range-slider.js";

const preview = document.getElementById("mask-preview");
const output = document.getElementById("mask-output");

const shapeGroups = document.querySelectorAll(".type-group");

const angleInput = document.getElementById("angle-input");
const angleValue = document.getElementById("angle-value");
const angleLabel = document.getElementById("angle-label");

const fadeStopInput = document.getElementById("fade-stop-input");
const fadeStopValue = document.getElementById("fade-stop-value");
const fadeStopLabel = document.getElementById("fade-stop-label");

const positionSelect = document.getElementById("position-select");
const sizeSelect = document.getElementById("size-select");

const modeTip = document.getElementById("mode-tip");
const repeatSelect = document.getElementById("repeat-select");
const maskSizeSelect = document.getElementById("mask-size-select");

// One-line explanation shown under the mode toggle, matching what the generated gradient stops actually do.
const MODE_TIPS = {
  alpha: "Alpha mode's source fades from opaque black to fully transparent — it reads the source's opacity.",
  luminance: "Luminance mode's source fades from opaque white to opaque black — it reads the source's brightness."
};

// Reads the currently checked mask-shape radio ("fade" | "spotlight").
function getSelectedShape() {
  return document.querySelector("input[name='mask-shape']:checked").value;
}

// Reads the currently checked mask-mode radio ("alpha" | "luminance").
function getSelectedMode() {
  return document.querySelector("input[name='mask-mode']:checked").value;
}

// Shows the option group matching the selected shape and hides the other one.
function switchGroup() {
  const shape = getSelectedShape();
  shapeGroups.forEach((group) => group.classList.remove("active-group"));
  document.getElementById(`${shape}-options`).classList.add("active-group");
  updateMask();
}

// Builds the "<start> 0%, <end> <stop>%" color-stop list, using colors appropriate to the active mask-mode.
function buildStops(mode, fadeStop) {
  return mode === "alpha" ? `black 0%, transparent ${fadeStop}%` : `white 0%, black ${fadeStop}%`;
}

// Assembles the full mask-image gradient for the selected shape, mode, and (for spotlight) size keyword.
function buildMaskImage() {
  const shape = getSelectedShape();
  const mode = getSelectedMode();

  if (shape === "fade") {
    return `linear-gradient(${angleInput.value}deg, ${buildStops(mode, fadeStopInput.value)})`;
  }

  return `radial-gradient(circle ${sizeSelect.value} at ${positionSelect.value}, ${buildStops(mode, 100)})`;
}

function updateMask() {
  angleValue.textContent = `${angleInput.value}deg`;
  angleLabel.textContent = `${angleInput.value}deg`;
  positionRangeBubble(angleInput, angleValue);

  fadeStopValue.textContent = `${fadeStopInput.value}%`;
  fadeStopLabel.textContent = `${fadeStopInput.value}%`;
  positionRangeBubble(fadeStopInput, fadeStopValue);

  const mode = getSelectedMode();
  const maskImage = buildMaskImage();
  const repeat = repeatSelect.value;
  const size = maskSizeSelect.value;

  preview.style.maskImage = maskImage;
  preview.style.webkitMaskImage = maskImage;
  preview.style.maskMode = mode;
  preview.style.maskRepeat = repeat;
  preview.style.webkitMaskRepeat = repeat;
  preview.style.maskSize = size;
  preview.style.webkitMaskSize = size;

  modeTip.textContent = MODE_TIPS[mode];

  output.textContent =
    `-webkit-mask-image: ${maskImage};\n` +
    `mask-image: ${maskImage};\n` +
    `mask-mode: ${mode};\n` +
    `mask-repeat: ${repeat};\n` +
    `mask-size: ${size};`;
}

document.querySelectorAll("input[name='mask-shape']").forEach((radio) =>
  radio.addEventListener("change", switchGroup)
);

document.querySelectorAll("input[name='mask-mode']").forEach((radio) =>
  radio.addEventListener("change", updateMask)
);

[angleInput, fadeStopInput].forEach((input) =>
  input.addEventListener("input", updateMask)
);

[positionSelect, sizeSelect, repeatSelect, maskSizeSelect].forEach((select) =>
  select.addEventListener("change", updateMask)
);

updateMask();
