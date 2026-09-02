import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./shared/range-slider.css";
import "./styles.css";
import { positionRangeBubble } from "./shared/range-slider.js";

const demo = document.getElementById("gradient-demo");
const output = document.getElementById("gradient-text-output");

const angleInput = document.getElementById("angle-input");
const angleValue = document.getElementById("angle-value");
const angleLabel = document.getElementById("angle-label");

const color1Input = document.getElementById("color-1");
const color2Input = document.getElementById("color-2");

const strokeWidthField = document.getElementById("stroke-width-field");
const strokeWidthInput = document.getElementById("stroke-width-input");
const strokeWidthValue = document.getElementById("stroke-width-value");
const strokeWidthLabel = document.getElementById("stroke-width-label");

const multilineToggle = document.getElementById("multiline-toggle");
const wrapfixToggle = document.getElementById("wrapfix-toggle");

const SHORT_TEXT = "Gradient Text";
const LONG_TEXT = "Gradient Text That Wraps Across Several Lines";

// Reads the currently checked text-style radio.
function getSelectedStyle() {
  return document.querySelector("input[name='text-style']:checked").value;
}

function updateDemo() {
  const style = getSelectedStyle();
  const angle = angleInput.value;
  const color1 = color1Input.value;
  const color2 = color2Input.value;
  const strokeWidth = strokeWidthInput.value;
  const multiline = multilineToggle.checked;
  const wrapFix = wrapfixToggle.checked;

  strokeWidthField.hidden = style !== "stroke";

  angleValue.textContent = `${angle}deg`;
  angleLabel.textContent = `${angle}deg`;
  positionRangeBubble(angleInput, angleValue);

  strokeWidthValue.textContent = `${strokeWidth}px`;
  strokeWidthLabel.textContent = `${strokeWidth}px`;
  positionRangeBubble(strokeWidthInput, strokeWidthValue);

  demo.classList.toggle("mode-linear", style === "linear");
  demo.classList.toggle("mode-animated", style === "animated");
  demo.classList.toggle("mode-stroke", style === "stroke");
  demo.classList.toggle("wrap-fix", wrapFix);

  demo.style.setProperty("--gradient-angle", `${angle}deg`);
  demo.style.setProperty("--gradient-start", color1);
  demo.style.setProperty("--gradient-end", color2);
  demo.style.setProperty("--stroke-width", `${strokeWidth}px`);

  demo.textContent = multiline ? LONG_TEXT : SHORT_TEXT;

  output.textContent = buildCssOutput(style, angle, color1, color2, strokeWidth, wrapFix);
}

function buildCssOutput(style, angle, color1, color2, strokeWidth, wrapFix) {
  const lines = [".gradient-text {"];

  if (style === "stroke") {
    lines.push(`  background: linear-gradient(${angle}deg, ${color1}, ${color2});`);
    lines.push(`  -webkit-text-stroke: ${strokeWidth}px transparent;`);
    lines.push("  -webkit-background-clip: text;");
    lines.push("  background-clip: text;");
    lines.push("  -webkit-text-fill-color: transparent;");
    lines.push("  color: transparent;");
  } else {
    lines.push(`  color: ${color1}; /* fallback */`);
    if (style === "animated") {
      lines.push(`  background: linear-gradient(${angle}deg, ${color1}, ${color2}, ${color1});`);
      lines.push("  background-size: 200% auto;");
    } else {
      lines.push(`  background: linear-gradient(${angle}deg, ${color1}, ${color2});`);
    }
    lines.push("  -webkit-background-clip: text;");
    lines.push("  background-clip: text;");
    lines.push("  -webkit-text-fill-color: transparent;");
    if (style === "animated") {
      lines.push("  animation: shine 3s linear infinite;");
    }
  }

  lines.push("}");

  if (style === "animated") {
    lines.push("", "@keyframes shine {", "  to {", "    background-position: 200% center;", "  }", "}");
  }

  if (wrapFix) {
    lines.push(
      "",
      ".gradient-text {",
      "  display: inline;",
      "  -webkit-box-decoration-break: clone;",
      "  box-decoration-break: clone;",
      "}"
    );
  }

  return lines.join("\n");
}

document.querySelectorAll("input[name='text-style']").forEach((radio) =>
  radio.addEventListener("change", updateDemo)
);

[angleInput, strokeWidthInput].forEach((input) => input.addEventListener("input", updateDemo));

[color1Input, color2Input, multilineToggle, wrapfixToggle].forEach((input) =>
  input.addEventListener("input", updateDemo)
);

updateDemo();
