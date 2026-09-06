import "./shared/playground.css";
import "./shared/tabs.css";
import "./shared/range-slider.css";
import "./styles.css";
import { updateRangeSlider } from "./shared/range-slider.js";
import { initTabs } from "./shared/tabs.js";

/*
  No external image requests anywhere in this sandbox — both demo "photos" below are inline SVG built as
  plain strings and turned into `data:image/svg+xml,...` URIs at runtime. That keeps the whole playground
  self-contained (no CDN, no picsum.photos, nothing to fetch) while still giving object-fit something with a
  clearly non-square intrinsic aspect ratio to crop.
*/

// Wide 800x450 (16:9) landscape scene — sky, sun, distant hills, and a field. Used for the "Landscape
// photo" box and, styled as a video frame, for the mock "video" box below it.
const LANDSCAPE_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#7dd3fc" />
        <stop offset="100%" stop-color="#e0f2fe" />
      </linearGradient>
      <linearGradient id="field" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#4ade80" />
        <stop offset="100%" stop-color="#16a34a" />
      </linearGradient>
    </defs>
    <rect width="800" height="450" fill="url(#sky)" />
    <circle cx="620" cy="110" r="55" fill="#fbbf24" />
    <ellipse cx="180" cy="90" rx="60" ry="22" fill="#ffffff" opacity="0.85" />
    <ellipse cx="260" cy="70" rx="45" ry="18" fill="#ffffff" opacity="0.7" />
    <polygon points="0,300 180,175 340,300" fill="#94a3b8" />
    <polygon points="220,300 420,150 620,300" fill="#64748b" />
    <polygon points="520,300 680,190 800,300" fill="#94a3b8" />
    <rect y="300" width="800" height="150" fill="url(#field)" />
    <path d="M0,360 C 150,330 250,390 400,355 S 650,320 800,365 L800,450 L0,450 Z" fill="#166534" opacity="0.4" />
    <path d="M60,395 l14,-10 l14,10 M500,410 l14,-10 l14,10" stroke="#f8fafc" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
`;

// Tall 450x800 (9:16) portrait scene — a dusk sky, sea, and a lighthouse on a pier. Deliberately the
// opposite orientation of the landscape scene, so the same box crops it very differently.
const PORTRAIT_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 800">
    <defs>
      <linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#818cf8" />
        <stop offset="60%" stop-color="#f9a8d4" />
        <stop offset="100%" stop-color="#fca5a5" />
      </linearGradient>
      <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0ea5e9" />
        <stop offset="100%" stop-color="#0369a1" />
      </linearGradient>
    </defs>
    <rect width="450" height="800" fill="url(#dusk)" />
    <circle cx="150" cy="150" r="46" fill="#fef3c7" opacity="0.9" />
    <rect y="560" width="450" height="240" fill="url(#sea)" />
    <path d="M225,760 L225,300 L245,300 L245,760 Z" fill="#f8fafc" />
    <polygon points="205,300 265,300 235,240" fill="#dc2626" />
    <circle cx="235" cy="270" r="10" fill="#fef08a" />
    <rect x="210" y="330" width="50" height="16" fill="#dc2626" />
    <rect x="210" y="400" width="50" height="16" fill="#dc2626" />
    <path d="M0,650 L450,610 L450,650 L0,690 Z" fill="#78350f" opacity="0.85" />
  </svg>
`;

function toDataUri(svgMarkup) {
  return `data:image/svg+xml,${encodeURIComponent(svgMarkup.trim())}`;
}

document.getElementById("landscape-img").src = toDataUri(LANDSCAPE_SVG);
document.getElementById("portrait-img").src = toDataUri(PORTRAIT_SVG);
// The mock "video" box below reuses the same landscape photo as its single frame — see the note next to
// it in the markup for why this is a styled <img>, not a real <video> element.
document.getElementById("video-mock-img").src = toDataUri(LANDSCAPE_SVG);

initTabs("#mode-switch .tab");

/* ----------------------------- Fit & Position panel ----------------------------- */

const mediaImgs = [
  document.getElementById("landscape-img"),
  document.getElementById("portrait-img"),
  document.getElementById("video-mock-img")
];
const mediaBoxes = [
  document.getElementById("landscape-box"),
  document.getElementById("portrait-box"),
  document.getElementById("video-mock-box")
];

const output = document.getElementById("fit-output");

const fitSelect = document.getElementById("fit-select");

const posXInput = document.getElementById("pos-x-input");
const posXValue = document.getElementById("pos-x-value");
const posYInput = document.getElementById("pos-y-input");
const posYValue = document.getElementById("pos-y-value");
const posPresetSelect = document.getElementById("pos-preset-select");

const ratioSelect = document.getElementById("ratio-select");
const widthInput = document.getElementById("width-input");
const widthValue = document.getElementById("width-value");
const heightField = document.getElementById("height-field");
const heightInput = document.getElementById("height-input");
const heightValue = document.getElementById("height-value");

// Presets mirror the ones in the ObjectPositionDiagram illustration above this playground in the post.
const POSITION_PRESETS = {
  center: [50, 50],
  "top left": [0, 0],
  "top right": [100, 0],
  "bottom left": [0, 100],
  "bottom right": [100, 100]
};

function applyPositionPreset() {
  const preset = posPresetSelect.value;
  if (preset === "custom") return;

  const [x, y] = POSITION_PRESETS[preset];
  posXInput.value = String(x);
  posYInput.value = String(y);
}

function updateBoxDimensions() {
  const useAutoHeight = ratioSelect.value === "auto";
  heightField.hidden = !useAutoHeight;

  mediaBoxes.forEach((box) => {
    box.style.inlineSize = `${widthInput.value}%`;
    if (useAutoHeight) {
      box.style.aspectRatio = "auto";
      box.style.blockSize = `${heightInput.value}px`;
    } else {
      box.style.aspectRatio = ratioSelect.value.replace("-", " / ");
      box.style.blockSize = "auto";
    }
  });
}

function updateFit() {
  updateRangeSlider(posXInput, posXValue, (v) => `${v}%`);
  updateRangeSlider(posYInput, posYValue, (v) => `${v}%`);
  updateRangeSlider(widthInput, widthValue, (v) => `${v}%`);
  updateRangeSlider(heightInput, heightValue, (v) => `${v}px`);

  updateBoxDimensions();

  const fit = fitSelect.value;
  const position = `${posXInput.value}% ${posYInput.value}%`;

  mediaImgs.forEach((img) => {
    img.style.objectFit = fit;
    img.style.objectPosition = position;
  });

  const ratioLine =
    ratioSelect.value === "auto"
      ? `block-size: ${heightInput.value}px;`
      : `aspect-ratio: ${ratioSelect.value.replace("-", " / ")};`;

  output.textContent = [
    ".media-box {",
    `  inline-size: ${widthInput.value}%;`,
    `  ${ratioLine}`,
    "}",
    "",
    ".media-box img, .media-box video {",
    `  object-fit: ${fit};`,
    `  object-position: ${position};`,
    "}"
  ].join("\n");
}

fitSelect.addEventListener("change", updateFit);

[posXInput, posYInput].forEach((input) =>
  input.addEventListener("input", () => {
    posPresetSelect.value = "custom";
    updateFit();
  })
);

posPresetSelect.addEventListener("change", () => {
  applyPositionPreset();
  updateFit();
});

[ratioSelect, widthInput, heightInput].forEach((input) =>
  input.addEventListener("input", updateFit)
);

updateFit();

/* ----------------------------- CLS Demo panel ----------------------------- */

const clsReloadBtn = document.getElementById("cls-reload-btn");
const clsUnreservedSlot = document.getElementById("cls-unreserved-slot");
const clsReservedSlot = document.getElementById("cls-reserved-slot");
const clsStatus = document.getElementById("cls-status");

const CLS_PHOTO_URI = toDataUri(LANDSCAPE_SVG);
const CLS_LOAD_DELAY_MS = 900;

// Simulates a slow image download: both slots start empty, then the photo "arrives" after a short delay.
// The unreserved slot has no height until then, so its sibling paragraph gets pushed down when the photo
// appears — the reserved slot already carved out its aspect-ratio: 16 / 9 space, so nothing moves.
function runClsDemo() {
  clsReloadBtn.disabled = true;
  clsStatus.textContent = "Loading photo…";

  clsUnreservedSlot.replaceChildren();
  clsUnreservedSlot.classList.remove("cls-slot--loaded");
  clsReservedSlot.replaceChildren();
  clsReservedSlot.classList.remove("cls-slot--loaded");

  window.setTimeout(() => {
    [clsUnreservedSlot, clsReservedSlot].forEach((slot) => {
      const img = document.createElement("img");
      img.src = CLS_PHOTO_URI;
      img.alt = "";
      img.style.objectFit = "cover";
      slot.appendChild(img);
      slot.classList.add("cls-slot--loaded");
    });
    clsStatus.textContent = "Loaded — watch which paragraph just moved.";
    clsReloadBtn.disabled = false;
  }, CLS_LOAD_DELAY_MS);
}

clsReloadBtn.addEventListener("click", runClsDemo);
