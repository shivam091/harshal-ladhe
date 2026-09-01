import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./shared/range-slider.css";
import "./styles.css";
import { positionRangeBubble } from "./shared/range-slider.js";

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

const colorStart = document.getElementById("color-start");
const colorMid = document.getElementById("color-mid");
const colorEnd = document.getElementById("color-end");

const midpointInput = document.getElementById("midpoint-input");
const midpointValue = document.getElementById("midpoint-value");
const midpointLabel = document.getElementById("midpoint-label");

const oklchToggle = document.getElementById("oklch-toggle");

// Reads the currently checked gradient-type radio ("linear" | "radial" | "conic").
function getSelectedType() {
  return document.querySelector("input[name='gradient-type']:checked").value;
}

// Shows the option group matching the selected type and hides the other two.
function switchGroup() {
  const type = getSelectedType();
  typeGroups.forEach((group) => group.classList.remove("active-group"));
  document.getElementById(`${type}-options`).classList.add("active-group");
  updateGradient();
}

// Builds the shared "<start> 0%, <mid> <midpoint>%, <end> 100%" color-stop list every gradient type uses.
function buildStops() {
  return `${colorStart.value} 0%, ${colorMid.value} ${midpointInput.value}%, ${colorEnd.value} 100%`;
}

// Assembles the full gradient() function call for the selected type, stops, and interpolation method.
function buildGradient() {
  const type = getSelectedType();
  const interpolation = oklchToggle.checked ? "in oklch " : "";
  const stops = buildStops();

  if (type === "linear") {
    return `linear-gradient(${interpolation}${angleInput.value}deg, ${stops})`;
  }

  if (type === "radial") {
    return `radial-gradient(${interpolation}${shapeSelect.value} at ${radialPositionSelect.value}, ${stops})`;
  }

  return `conic-gradient(${interpolation}from ${fromAngleInput.value}deg at ${conicPositionSelect.value}, ${stops})`;
}

function updateGradient() {
  angleValue.textContent = `${angleInput.value}deg`;
  angleLabel.textContent = `${angleInput.value}deg`;
  positionRangeBubble(angleInput, angleValue);

  fromAngleValue.textContent = `${fromAngleInput.value}deg`;
  fromAngleLabel.textContent = `${fromAngleInput.value}deg`;
  positionRangeBubble(fromAngleInput, fromAngleValue);

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

[angleInput, fromAngleInput, midpointInput].forEach((input) =>
  input.addEventListener("input", updateGradient)
);

[shapeSelect, radialPositionSelect, conicPositionSelect].forEach((select) =>
  select.addEventListener("change", updateGradient)
);

[colorStart, colorMid, colorEnd].forEach((input) =>
  input.addEventListener("input", updateGradient)
);

oklchToggle.addEventListener("change", updateGradient);

updateGradient();
