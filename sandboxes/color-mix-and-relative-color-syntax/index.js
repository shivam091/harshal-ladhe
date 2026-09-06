import "./shared/playground.css";
import "./shared/tabs.css";
import "./shared/segmented-control.css";
import "./shared/range-slider.css";
import "./styles.css";
import { updateRangeSlider } from "./shared/range-slider.js";
import { initTabs } from "./shared/tabs.js";

/*
  Every preview in this sandbox is the browser's OWN computed `color-mix()` / relative-color-syntax
  output — set directly as a CSS string on an element's `background`, never re-implemented in JS. That
  keeps the demo honest: whatever a visitor sees here is exactly what shipping that CSS would produce,
  in whichever browser is running it (a browser without support just shows nothing for that background,
  same as it would in production without an @supports fallback).
*/

// Playground mode switcher (Color Mix / Relative Color) — each panel refreshes itself when it appears.
initTabs("#mode-switch .tab", (mode) => {
  if (mode === "mix") updateMix();
  if (mode === "relative") updateRelative();
});

/* ----------------------------- Color Mix panel ----------------------------- */

const mixPreview = document.getElementById("mix-preview");
const mixOutput = document.getElementById("mix-output");

const mixColorA = document.getElementById("mix-color-a");
const mixColorB = document.getElementById("mix-color-b");

const mixPercentInput = document.getElementById("mix-percent-input");
const mixPercentValue = document.getElementById("mix-percent-value");

const hueMethodField = document.getElementById("hue-method-field");
const hueMethodSelect = document.getElementById("hue-method-select");

const mixTip = document.getElementById("mix-tip");

// srgb / srgb-linear / lab / oklab are rectangular — no hue channel, so a hue method is meaningless there.
// hsl / hwb / lch / oklch are polar — mixing two of them needs to know which way around the wheel to go.
const POLAR_SPACES = new Set(["hsl", "hwb", "lch", "oklch"]);

function getSelectedSpace() {
  return document.querySelector("input[name='mix-space']:checked").value;
}

function updateMix() {
  updateRangeSlider(mixPercentInput, mixPercentValue, (v) => `${v}%`);

  const space = getSelectedSpace();
  const isPolar = POLAR_SPACES.has(space);
  hueMethodField.hidden = !isPolar;

  const hueMethod = isPolar ? ` ${hueMethodSelect.value}` : "";
  const percent = mixPercentInput.value;

  const css = `color-mix(in ${space}${hueMethod}, ${mixColorA.value}, ${mixColorB.value} ${percent}%)`;

  mixPreview.style.background = css;
  mixOutput.textContent = `background: ${css};`;

  mixTip.textContent = space === "srgb"
    ? "Try blue → yellow at 50%: srgb interpolation collapses to an exact mid-gray — the \"gray dead zone\"."
    : "Switch back to srgb on the same two colors to see the 50% mark collapse into an exact mid-gray.";
}

[mixColorA, mixColorB, mixPercentInput].forEach((input) => input.addEventListener("input", updateMix));
document.querySelectorAll("input[name='mix-space']").forEach((radio) => radio.addEventListener("change", updateMix));
hueMethodSelect.addEventListener("change", updateMix);

updateMix();

/* ----------------------------- Relative Color panel ----------------------------- */

const relativeBasePreview = document.getElementById("relative-base-preview");
const relativeDerivedPreview = document.getElementById("relative-derived-preview");
const relativeOutput = document.getElementById("relative-output");

const relativeBaseColor = document.getElementById("relative-base-color");
const relativeFunctionSelect = document.getElementById("relative-function-select");

const lFormulaLabel = document.getElementById("l-formula-label");
const lScaleInput = document.getElementById("l-scale-input");
const lScaleValue = document.getElementById("l-scale-value");

const cScaleField = document.getElementById("c-scale-field");
const cScaleInput = document.getElementById("c-scale-input");
const cScaleValue = document.getElementById("c-scale-value");

const sScaleField = document.getElementById("s-scale-field");
const sScaleInput = document.getElementById("s-scale-input");
const sScaleValue = document.getElementById("s-scale-value");

const hShiftInput = document.getElementById("h-shift-input");
const hShiftValue = document.getElementById("h-shift-value");

const alphaInput = document.getElementById("alpha-input");
const alphaValue = document.getElementById("alpha-value");

// Formats a slider's ×-scale value to 2 decimals, e.g. "1.00×" — shared by the L/C/S scale bubbles.
function formatScale(value) {
  return `${Number(value).toFixed(2)}×`;
}

function updateRelative() {
  updateRangeSlider(lScaleInput, lScaleValue, formatScale);
  updateRangeSlider(cScaleInput, cScaleValue, formatScale);
  updateRangeSlider(sScaleInput, sScaleValue, formatScale);
  updateRangeSlider(hShiftInput, hShiftValue, (v) => `${v}deg`);
  updateRangeSlider(alphaInput, alphaValue, (v) => `${v}%`);

  const fn = relativeFunctionSelect.value; // "oklch" | "hsl"
  const isOklch = fn === "oklch";

  cScaleField.hidden = !isOklch;
  sScaleField.hidden = isOklch;
  lFormulaLabel.textContent = "calc(l * X)";

  const base = relativeBaseColor.value;
  const lFormula = `calc(l * ${lScaleInput.value})`;
  const hFormula = Number(hShiftInput.value) === 0 ? "h" : `calc(h + ${hShiftInput.value})`;
  const alphaFraction = (Number(alphaInput.value) / 100).toFixed(2);

  // oklch()'s channel order is L C H; hsl()'s is H S L — same two sliders (lightness/hue), different order.
  const css = isOklch
    ? `oklch(from ${base} ${lFormula} calc(c * ${cScaleInput.value}) ${hFormula} / ${alphaFraction})`
    : `hsl(from ${base} ${hFormula} calc(s * ${sScaleInput.value}) ${lFormula} / ${alphaFraction})`;

  relativeBasePreview.style.background = base;
  relativeDerivedPreview.style.background = css;
  relativeOutput.textContent = `background: ${css};`;
}

[relativeBaseColor, lScaleInput, cScaleInput, sScaleInput, hShiftInput, alphaInput].forEach((input) =>
  input.addEventListener("input", updateRelative)
);
relativeFunctionSelect.addEventListener("change", updateRelative);

updateRelative();
