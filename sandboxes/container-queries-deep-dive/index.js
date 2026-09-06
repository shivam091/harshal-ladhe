import "./shared/playground.css";
import "./shared/tabs.css";
import "./shared/segmented-control.css";
import "./shared/range-slider.css";
import "./styles.css";
import { initTabs } from "./shared/tabs.js";
import { updateRangeSlider } from "./shared/range-slider.js";

initTabs("#mode-switch .tab");

/* ---------- Size Queries ---------- */

const sizeContainer = document.getElementById("size-container");
const sizeCardTitle = document.getElementById("size-card-title");
const sizeOutput = document.getElementById("size-output");
const sizeWidthInput = document.getElementById("size-width-input");
const sizeBreakpointInput = document.getElementById("size-breakpoint-input");
const sizeFontInput = document.getElementById("size-font-input");
const sizeWidthValue = document.getElementById("size-width-value");
const sizeBreakpointValue = document.getElementById("size-breakpoint-value");
const sizeFontValue = document.getElementById("size-font-value");

/*
  The @container breakpoint can't be set as an inline style (it's an at-rule, not a property), so
  it's rewritten into its own <style> tag whenever the breakpoint slider moves — same trick as the
  named-container panel below.
*/
const sizeDynamicStyle = document.createElement("style");
document.head.appendChild(sizeDynamicStyle);

function updateSizeDemo() {
  const width = Number(sizeWidthInput.value);
  const breakpoint = Number(sizeBreakpointInput.value);
  const font = Number(sizeFontInput.value);

  updateRangeSlider(sizeWidthInput, sizeWidthValue, (v) => `${v}px`);
  updateRangeSlider(sizeBreakpointInput, sizeBreakpointValue, (v) => `${v}px`);
  updateRangeSlider(sizeFontInput, sizeFontValue, (v) => `${v}cqi`);

  sizeContainer.style.width = `${width}px`;
  sizeCardTitle.style.fontSize = `${font}cqi`;

  sizeDynamicStyle.textContent = `
@container (min-width: ${breakpoint}px) {
  .size-card {
    grid-template-areas: "title meta" "body body";
    grid-template-columns: 2fr 1fr;
  }
}`;

  sizeOutput.textContent = `.size-container {
  container-type: inline-size;
}

.size-card-title {
  font-size: ${font}cqi;
}

@container (min-width: ${breakpoint}px) {
  .size-card {
    grid-template-columns: 2fr 1fr;
  }
}`;
}

[sizeWidthInput, sizeBreakpointInput, sizeFontInput].forEach((input) =>
  input.addEventListener("input", updateSizeDemo)
);

updateSizeDemo();

/* ---------- Named Containers ---------- */

const outerContainer = document.getElementById("outer-container");
const innerContainer = document.getElementById("inner-container");
const namedOutput = document.getElementById("named-output");
const outerWidthInput = document.getElementById("outer-width-input");
const innerWidthInput = document.getElementById("inner-width-input");
const outerWidthValue = document.getElementById("outer-width-value");
const innerWidthValue = document.getElementById("inner-width-value");
const targetRadios = document.querySelectorAll("input[name='named-target']");

// Fixed on purpose — the demo's whole point is that this rule never changes, only the container NAME it targets does.
const NAMED_BREAKPOINT = 400;

const namedDynamicStyle = document.createElement("style");
document.head.appendChild(namedDynamicStyle);

function updateNamedDemo() {
  const target = document.querySelector("input[name='named-target']:checked").value;
  const outerWidth = Number(outerWidthInput.value);
  const innerWidth = Number(innerWidthInput.value);

  updateRangeSlider(outerWidthInput, outerWidthValue, (v) => `${v}px`);
  updateRangeSlider(innerWidthInput, innerWidthValue, (v) => `${v}px`);

  outerContainer.style.width = `${outerWidth}px`;
  innerContainer.style.width = `${innerWidth}px`;

  namedDynamicStyle.textContent = `
@container ${target} (min-width: ${NAMED_BREAKPOINT}px) {
  .named-card {
    grid-template-columns: 1fr 1fr;
  }
}`;

  namedOutput.textContent = `.outer-container { container-name: layout-grid; container-type: inline-size; }
.inner-container { container-name: component-wrapper; container-type: inline-size; }

@container ${target} (min-width: ${NAMED_BREAKPOINT}px) {
  .named-card {
    grid-template-columns: 1fr 1fr;
  }
}`;
}

[outerWidthInput, innerWidthInput].forEach((input) => input.addEventListener("input", updateNamedDemo));
targetRadios.forEach((radio) => radio.addEventListener("change", updateNamedDemo));

updateNamedDemo();

/* ---------- Style Queries ---------- */

const styleContainer = document.getElementById("style-container");
const styleOutput = document.getElementById("style-output");
const themeRadios = document.querySelectorAll("input[name='theme']");

function updateStyleDemo() {
  const theme = document.querySelector("input[name='theme']:checked").value;

  styleContainer.style.setProperty("--theme", theme);

  styleOutput.textContent = `.style-container {
  container-type: inline-size;
  --theme: ${theme};
}

@container style(--theme: dark) {
  .style-card {
    background: #121212;
    color: #fff;
    border-color: #333;
  }
}

/* current --theme value: "${theme}" → rule ${theme === "dark" ? "MATCHES" : "does not match"} */`;
}

themeRadios.forEach((radio) => radio.addEventListener("change", updateStyleDemo));

updateStyleDemo();
