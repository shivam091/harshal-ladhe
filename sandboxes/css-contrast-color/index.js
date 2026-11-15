import "./shared/playground.css";
import "./styles.css";

// Shorthand for looking an element up by id.
const $ = (id) => document.getElementById(id);
// Whether this browser understands contrast-color(); the demo degrades to a white fallback when it doesn't.
const supported = CSS.supports("color", "contrast-color(red)");

// A mix of light, dark and awkward mid-tone colours, including two where white and black score almost the same.
const SWATCHES = [
  "#6d28d9", "#1d4ed8", "#2563eb", "#3b82f6",
  "#0ea5e9", "#10b981", "#22c55e", "#facc15",
  "#f59e0b", "#ff6600", "#ff0000", "#e11d48",
  "#777777", "#767676", "#808080", "#fde68a"
];

$("support-tip").hidden = supported;

// WCAG 2 relative luminance of an sRGB colour given as 0-255 channels.
function luminance([r, g, b]) {
  const channel = (value) => {
    const c = value / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

// WCAG 2 contrast ratio between two luminances: (lighter + 0.05) / (darker + 0.05), from 1 to 21.
function ratio(l1, l2) {
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

// Splits a #rrggbb string into 0-255 red, green and blue channels.
function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
}

/*
  Reads a computed colour back as 0-255 channels. Browsers usually serialise contrast-color()'s result as
  rgb(255, 255, 255) or rgb(0, 0, 0), but this also accepts the color(srgb 1 1 1) form just in case.
*/
function parseComputed(value) {
  // Plain check instead of `?.`/`??`: Sandpack's bundler doesn't parse them.
  const matches = value.match(/[\d.]+/g);
  const numbers = matches ? matches.map(Number) : [0, 0, 0];
  const scale = value.startsWith("color(") ? 255 : 1;
  return numbers.slice(0, 3).map((n) => n * scale);
}

// Reads the text colour the browser actually resolved for an element and reports it as "white" or "black".
function textColourOf(element) {
  const rgb = parseComputed(getComputedStyle(element).color);
  return luminance(rgb) > 0.5 ? "white" : "black";
}

// Names the WCAG 2 level a contrast ratio reaches for normal-size text.
const verdict = (r) => (r >= 7 ? "AAA" : r >= 4.5 ? "AA" : r >= 3 ? "AA large only" : "fails");

// Applies a background colour to the preview, then rewrites the readout and swatch selection to match.
function update(hex) {
  const value = hex.toLowerCase();
  $("bg-picker").value = value;
  $("bg-hex").value = value;
  $("preview").style.setProperty("--bg", value);

  const bgLum = luminance(hexToRgb(value));
  const vsWhite = ratio(bgLum, 1);
  const vsBlack = ratio(bgLum, 0);
  const wcagPick = vsWhite > vsBlack ? "white" : "black";

  const lines = [
    `background: ${value}  (relative luminance ${bgLum.toFixed(3)})`,
    "",
    `white text: ${vsWhite.toFixed(2)}:1  ${verdict(vsWhite)}`,
    `black text: ${vsBlack.toFixed(2)}:1  ${verdict(vsBlack)}`,
    `WCAG 2 would pick: ${wcagPick}`,
    ""
  ];

  if (supported) {
    const browserPick = textColourOf($("preview"));
    const picked = browserPick === "white" ? vsWhite : vsBlack;
    lines.push(`contrast-color(${value}) returned: ${browserPick}  (${picked.toFixed(2)}:1)`);
    lines.push(
      browserPick === wcagPick
        ? "The browser's choice matches the WCAG 2 ratio."
        : "The browser chose the colour WCAG 2 rates lower: check this one before using it behind small text."
    );
  } else {
    lines.push("contrast-color() isn't supported here, so the preview shows the white fallback.");
  }

  if (Math.abs(vsWhite - vsBlack) < 1) {
    lines.push("", "Mid-tone: white and black are within 1 point of each other, so either choice is a close call.");
  }

  $("readout").textContent = lines.join("\n");
  document.querySelectorAll(".swatch").forEach((swatch) => {
    swatch.setAttribute("aria-pressed", String(swatch.dataset.hex === value));
  });
}

// Renders the swatch grid, then reads each swatch's resolved text colour back to show its ratio.
function buildSwatches() {
  const buttons = SWATCHES.map((hex) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "swatch";
    button.dataset.hex = hex;
    button.style.setProperty("--bg", hex);
    button.innerHTML = `<span class="swatch-hex">${hex}</span><span class="swatch-ratio"></span>`;
    button.addEventListener("click", () => update(hex));
    return button;
  });

  $("swatches").replaceChildren(...buttons);

  // Each swatch's text colour comes from CSS, so its ratio is read back after it has rendered.
  buttons.forEach((button) => {
    const bgLum = luminance(hexToRgb(button.dataset.hex));
    const text = supported ? textColourOf(button) : "white";
    const r = ratio(bgLum, text === "white" ? 1 : 0);
    button.querySelector(".swatch-ratio").textContent = `${text} ${r.toFixed(2)}:1`;
  });
}

$("bg-picker").addEventListener("input", (event) => update(event.target.value));
$("bg-hex").addEventListener("input", (event) => {
  const value = event.target.value.trim();
  if (/^#[0-9a-f]{6}$/i.test(value)) update(value);
});

buildSwatches();
update($("bg-picker").value);
