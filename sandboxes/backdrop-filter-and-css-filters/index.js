import "./shared/playground.css";
import "./shared/tabs.css";
import "./shared/segmented-control.css";
import "./shared/range-slider.css";
import "./styles.css";
import { updateRangeSlider } from "./shared/range-slider.js";
import { initTabs } from "./shared/tabs.js";

/*
  Self-contained demo "photo" — a schematic mountain landscape built entirely from inline SVG shapes,
  with real light/dark contrast: a bright sky and sun near the top, dark mountain silhouettes in the
  middle, and a near-black foreground at the bottom. No external image request anywhere; every tab
  that needs a photo (Filters, Duotone) uses this same encoded string as its src/background-image.
  Real luminance variation (not a flat color) is what makes the Duotone tab's remap actually visible.
*/
const PHOTO_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#bfe3ff" />
        <stop offset="55%" stop-color="#eaf6ff" />
        <stop offset="100%" stop-color="#fef3d7" />
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#sky)" />
    <circle cx="300" cy="86" r="40" fill="#fffaf0" />
    <polygon points="0,300 0,190 90,90 160,190 230,110 330,190 400,170 400,300" fill="#5b6478" />
    <polygon points="0,300 0,230 120,170 260,230 400,200 400,300" fill="#232838" />
    <rect x="0" y="256" width="400" height="44" fill="#0c0f14" />
  </svg>
`.trim();

const PHOTO_DATA_URI = `data:image/svg+xml,${encodeURIComponent(PHOTO_SVG)}`;

document.getElementById("filters-photo").src = PHOTO_DATA_URI;
document.getElementById("duotone-svg-layer").src = PHOTO_DATA_URI;

// Playground mode switcher (Filters / Glassmorphism / Duotone) — each panel manages its own controls
// independently, so switching just needs to refresh whichever panel just appeared.
initTabs("#mode-switch .tab", (mode) => {
  if (mode === "filters") updateFilters();
  if (mode === "glass") updateGlass();
  if (mode === "duotone") updateDuotone();
});

/* ----------------------------- Filters panel ----------------------------- */

const filtersPhoto = document.getElementById("filters-photo");
const filtersOutput = document.getElementById("filters-output");

const blurInput = document.getElementById("blur-input");
const blurValue = document.getElementById("blur-value");
const brightnessInput = document.getElementById("brightness-input");
const brightnessValue = document.getElementById("brightness-value");
const contrastInput = document.getElementById("contrast-input");
const contrastValue = document.getElementById("contrast-value");
const saturateInput = document.getElementById("saturate-input");
const saturateValue = document.getElementById("saturate-value");
const hueRotateInput = document.getElementById("hue-rotate-input");
const hueRotateValue = document.getElementById("hue-rotate-value");
const grayscaleInput = document.getElementById("grayscale-input");
const grayscaleValue = document.getElementById("grayscale-value");
const sepiaInput = document.getElementById("sepia-input");
const sepiaValue = document.getElementById("sepia-value");
const invertInput = document.getElementById("invert-input");
const invertValue = document.getElementById("invert-value");

const filtersResetBtn = document.getElementById("filters-reset-btn");

/*
  Fixed left-to-right order the chained filter functions render in — CSS applies filter() functions
  in exactly this written order, each one processing the previous function's output, so this array's
  order IS the actual order the browser composites the filter in.
*/
function buildFilterChain() {
  return [
    `blur(${blurInput.value}px)`,
    `brightness(${brightnessInput.value}%)`,
    `contrast(${contrastInput.value}%)`,
    `saturate(${saturateInput.value}%)`,
    `hue-rotate(${hueRotateInput.value}deg)`,
    `grayscale(${grayscaleInput.value}%)`,
    `sepia(${sepiaInput.value}%)`,
    `invert(${invertInput.value}%)`
  ].join(" ");
}

function updateFilters() {
  updateRangeSlider(blurInput, blurValue, (v) => `${v}px`);
  updateRangeSlider(brightnessInput, brightnessValue, (v) => `${v}%`);
  updateRangeSlider(contrastInput, contrastValue, (v) => `${v}%`);
  updateRangeSlider(saturateInput, saturateValue, (v) => `${v}%`);
  updateRangeSlider(hueRotateInput, hueRotateValue, (v) => `${v}deg`);
  updateRangeSlider(grayscaleInput, grayscaleValue, (v) => `${v}%`);
  updateRangeSlider(sepiaInput, sepiaValue, (v) => `${v}%`);
  updateRangeSlider(invertInput, invertValue, (v) => `${v}%`);

  const chain = buildFilterChain();
  filtersPhoto.style.filter = chain;
  filtersOutput.textContent = `filter: ${chain};`;
}

[blurInput, brightnessInput, contrastInput, saturateInput, hueRotateInput, grayscaleInput, sepiaInput, invertInput].forEach((input) =>
  input.addEventListener("input", updateFilters)
);

filtersResetBtn.addEventListener("click", () => {
  blurInput.value = 0;
  brightnessInput.value = 100;
  contrastInput.value = 100;
  saturateInput.value = 100;
  hueRotateInput.value = 0;
  grayscaleInput.value = 0;
  sepiaInput.value = 0;
  invertInput.value = 0;
  updateFilters();
});

updateFilters();

/* ----------------------------- Glassmorphism panel ----------------------------- */

const glassCard = document.getElementById("glass-card");
const glassOutput = document.getElementById("glass-output");

const glassBlurInput = document.getElementById("glass-blur-input");
const glassBlurValue = document.getElementById("glass-blur-value");
const glassSaturateInput = document.getElementById("glass-saturate-input");
const glassSaturateValue = document.getElementById("glass-saturate-value");
const glassAlphaInput = document.getElementById("glass-alpha-input");
const glassAlphaValue = document.getElementById("glass-alpha-value");
const glassBorderToggle = document.getElementById("glass-border-toggle");

function updateGlass() {
  updateRangeSlider(glassBlurInput, glassBlurValue, (v) => `${v}px`);
  updateRangeSlider(glassSaturateInput, glassSaturateValue, (v) => `${v}%`);
  updateRangeSlider(glassAlphaInput, glassAlphaValue, (v) => `${v}%`);

  const alpha = (Number(glassAlphaInput.value) / 100).toFixed(2);
  const backgroundColor = `rgba(255, 255, 255, ${alpha})`;
  const backdropFilter = `blur(${glassBlurInput.value}px) saturate(${glassSaturateInput.value}%)`;
  const border = glassBorderToggle.checked ? "1px solid rgba(255, 255, 255, 0.4)" : "none";

  glassCard.style.backgroundColor = backgroundColor;
  glassCard.style.backdropFilter = backdropFilter;
  glassCard.style.webkitBackdropFilter = backdropFilter;
  glassCard.style.border = border;

  const lines = [
    `background-color: ${backgroundColor};`,
    `backdrop-filter: ${backdropFilter};`,
    `-webkit-backdrop-filter: ${backdropFilter}; /* still required for full Safari support */`
  ];
  if (glassBorderToggle.checked) lines.push(`border: ${border};`);
  glassOutput.textContent = lines.join("\n");
}

[glassBlurInput, glassSaturateInput, glassAlphaInput, glassBorderToggle].forEach((input) =>
  input.addEventListener("input", updateGlass)
);

updateGlass();

/* ----------------------------- Duotone panel ----------------------------- */

const duotoneCssLayer = document.getElementById("duotone-css-layer");
const duotoneSvgLayer = document.getElementById("duotone-svg-layer");
const duotoneOutput = document.getElementById("duotone-output");
const duotoneTip = document.getElementById("duotone-tip");

const duotoneShadowInput = document.getElementById("duotone-shadow-input");
const duotoneHighlightInput = document.getElementById("duotone-highlight-input");

const duotoneFuncR = document.getElementById("duotone-func-r");
const duotoneFuncG = document.getElementById("duotone-func-g");
const duotoneFuncB = document.getElementById("duotone-func-b");

const DUOTONE_TIPS = {
  css: "A grayscale-then-tinted gradient, blended with background-blend-mode: color — cheap and simple, but only as convincing as the match between the gradient's direction and the photo's own lighting.",
  svg: "feColorMatrix collapses the photo to per-pixel luminance, then feComponentTransfer remaps every channel through a 2-stop table from the shadow color to the highlight color — exact, regardless of where the light falls in the photo."
};

function getSelectedTechnique() {
  return document.querySelector("input[name='duotone-technique']:checked").value;
}

// Converts a "#rrggbb" color input value into 0-1 normalized [r, g, b] channels for an
// <feFuncR>/<feFuncG>/<feFuncB> table entry.
function hexToUnitRgb(hex) {
  const value = parseInt(hex.slice(1), 16);
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255].map((c) => c.toFixed(3));
}

function updateDuotone() {
  const technique = getSelectedTechnique();
  const shadow = duotoneShadowInput.value;
  const highlight = duotoneHighlightInput.value;

  duotoneCssLayer.classList.toggle("duotone-layer--active", technique === "css");
  duotoneSvgLayer.classList.toggle("duotone-layer--active", technique === "svg");
  duotoneTip.textContent = DUOTONE_TIPS[technique];

  // CSS approximation: the gradient (listed first, so it paints on top) supplies hue + saturation,
  // background-blend-mode: color pulls luminance from the photo (listed second, underneath) — see
  // the post for the full SetLum(source, Lum(backdrop)) reasoning behind why "color" is the right
  // blend mode here, not "luminosity".
  duotoneCssLayer.style.backgroundImage = `linear-gradient(to bottom, ${highlight}, ${shadow}), url("${PHOTO_DATA_URI}")`;
  duotoneCssLayer.style.backgroundBlendMode = "color";

  // Real SVG filter: rewrite the shared <filter>'s feComponentTransfer table values live, then point
  // the image at it via filter: url(#id) — exact per-channel remap, no spatial approximation at all.
  const [shadowR, shadowG, shadowB] = hexToUnitRgb(shadow);
  const [highlightR, highlightG, highlightB] = hexToUnitRgb(highlight);
  duotoneFuncR.setAttribute("tableValues", `${shadowR} ${highlightR}`);
  duotoneFuncG.setAttribute("tableValues", `${shadowG} ${highlightG}`);
  duotoneFuncB.setAttribute("tableValues", `${shadowB} ${highlightB}`);
  duotoneSvgLayer.style.filter = "url(#duotone-svg-filter)";

  if (technique === "css") {
    duotoneOutput.textContent = [
      `background-image:`,
      `  linear-gradient(to bottom, ${highlight}, ${shadow}),`,
      `  url("photo.svg");`,
      `background-blend-mode: color;`
    ].join("\n");
  } else {
    duotoneOutput.textContent = [
      `/* Grayscale (luminance-weighted) */`,
      `<feColorMatrix type="matrix" values="`,
      `  0.2126 0.7152 0.0722 0 0`,
      `  0.2126 0.7152 0.0722 0 0`,
      `  0.2126 0.7152 0.0722 0 0`,
      `  0      0      0      1 0" />`,
      ``,
      `/* Remap 0 -> shadow, 1 -> highlight, per channel */`,
      `<feFuncR type="table" tableValues="${shadowR} ${highlightR}" />`,
      `<feFuncG type="table" tableValues="${shadowG} ${highlightG}" />`,
      `<feFuncB type="table" tableValues="${shadowB} ${highlightB}" />`,
      ``,
      `img { filter: url(#duotone-svg-filter); }`
    ].join("\n");
  }
}

document.querySelectorAll("input[name='duotone-technique']").forEach((radio) =>
  radio.addEventListener("change", updateDuotone)
);
[duotoneShadowInput, duotoneHighlightInput].forEach((input) => input.addEventListener("input", updateDuotone));

updateDuotone();
