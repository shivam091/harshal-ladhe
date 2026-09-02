import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./shared/range-slider.css";
import "./styles.css";
import { positionRangeBubble } from "./shared/range-slider.js";

const card = document.getElementById("gradient-border-card");
const output = document.getElementById("border-output");

const angleFieldLabel = document.getElementById("angle-field-label");
const angleInput = document.getElementById("angle-input");
const angleValue = document.getElementById("angle-value");
const angleLabel = document.getElementById("angle-label");

const thicknessInput = document.getElementById("thickness-input");
const thicknessValue = document.getElementById("thickness-value");
const thicknessLabel = document.getElementById("thickness-label");

const color1Input = document.getElementById("color-1");
const color2Input = document.getElementById("color-2");

const animateToggle = document.getElementById("animate-toggle");

// Reads the currently checked border-type radio.
function getSelectedType() {
  return document.querySelector("input[name='border-type']:checked").value;
}

function updateCard() {
  const type = getSelectedType();
  const angle = angleInput.value;
  const thickness = thicknessInput.value;
  const color1 = color1Input.value;
  const color2 = color2Input.value;
  const animate = animateToggle.checked;

  angleFieldLabel.firstChild.textContent = type === "conic" ? "From angle " : "Direction ";
  angleValue.textContent = `${angle}deg`;
  angleLabel.textContent = `${angle}deg`;
  positionRangeBubble(angleInput, angleValue);

  thicknessValue.textContent = `${thickness}px`;
  thicknessLabel.textContent = `${thickness}px`;
  positionRangeBubble(thicknessInput, thicknessValue);

  card.classList.toggle("type-conic", type === "conic");
  card.classList.toggle("animate", animate);

  card.style.setProperty("--border-size", `${thickness}px`);
  card.style.setProperty("--border-angle", `${angle}deg`);
  card.style.setProperty("--border-start", color1);
  card.style.setProperty("--border-end", color2);

  output.textContent = buildCssOutput(type, angle, thickness, color1, color2, animate);
}

function buildCssOutput(type, angle, thickness, color1, color2, animate) {
  const gradient =
    type === "conic"
      ? `conic-gradient(from ${angle}deg, ${color1}, ${color2}, ${color1})`
      : `linear-gradient(${angle}deg, ${color1}, ${color2})`;

  const lines = [
    ".gradient-border {",
    `  border: ${thickness}px solid transparent;`,
    "  border-radius: 16px;",
    "  background:",
    "    linear-gradient(#fff, #fff) padding-box,",
    `    ${gradient} border-box;`
  ];

  if (animate) {
    lines.push("  background-size: 300% 300%;", "  animation: border-flow 6s linear infinite;");
  }

  lines.push("}");

  if (animate) {
    lines.push(
      "",
      "@keyframes border-flow {",
      "  0% {",
      "    background-position: 0% 50%;",
      "  }",
      "",
      "  50% {",
      "    background-position: 100% 50%;",
      "  }",
      "",
      "  100% {",
      "    background-position: 0% 50%;",
      "  }",
      "}"
    );
  }

  return lines.join("\n");
}

document.querySelectorAll("input[name='border-type']").forEach((radio) =>
  radio.addEventListener("change", updateCard)
);

[angleInput, thicknessInput].forEach((input) => input.addEventListener("input", updateCard));

[color1Input, color2Input, animateToggle].forEach((input) =>
  input.addEventListener("input", updateCard)
);

updateCard();
