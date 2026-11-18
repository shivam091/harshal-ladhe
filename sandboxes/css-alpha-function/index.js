import "./shared/playground.css";
import "./styles.css";

// Shorthand for looking an element up by id.
const $ = (id) => document.getElementById(id);
// Feature-detected rather than assumed, because a rejected colour is dropped silently and would look like a bug in the demo.
const supported = CSS.supports("color", "alpha(from red / calc(alpha * 0.5))");
// Checked separately so the readout can say "not supported" instead of showing a blank swatch.
const rgbFromSupported = CSS.supports("color", "rgb(from red r g b / 50%)");

$("support-tip").hidden = supported;

// The computed value is the only evidence a declaration was accepted, since a rejected one falls back without any error.
function resolved(selector) {
  return getComputedStyle(document.querySelector(selector)).backgroundColor;
}

// The picker only produces sRGB hex, so it is switched off for presets, where its value would be ignored and mislead.
function currentOrigin() {
  const choice = $("origin").value;
  $("colour-picker").disabled = choice !== "picker";
  return choice === "picker" ? $("colour-picker").value : choice;
}

// Keeps the CSS variables and the readout in step, so the numbers always describe what is on screen.
function update() {
  const origin = currentOrigin();
  const alpha = Number($("alpha-slider").value);

  $("alpha-value").textContent = `${alpha}%`;
  $("stage").style.setProperty("--c", origin);
  $("stage").style.setProperty("--a", `${alpha}%`);
  // calc(alpha * n) needs a plain number, whereas the other swatches take the percentage.
  $("stage").style.setProperty("--k", String(alpha / 100));

  const lines = [
    `--c: ${origin}`,
    `--a: ${alpha}%   --k: ${alpha / 100}`,
    "",
    `alpha() set:     ${supported ? resolved(".sample-alpha") : "not supported, using the color-mix() fallback"}`,
    `alpha() scaled:  ${supported ? resolved(".sample-scale") : "not supported, using the color-mix() fallback"}`,
    `color-mix():     ${resolved(".sample-mix")}`,
    `rgb(from):       ${rgbFromSupported ? resolved(".sample-rgb") : "not supported"}`
  ];

  $("readout").textContent = lines.join("\n");
}

$("origin").addEventListener("change", update);
$("colour-picker").addEventListener("input", update);
$("alpha-slider").addEventListener("input", update);

update();
