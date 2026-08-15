import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./shared/range-slider.css";
import "./styles.css";
import { updateRangeSlider } from "./shared/range-slider.js";

const containerFrame = document.getElementById("container-frame");
const grid = document.getElementById("grid-preview");
const output = document.getElementById("grid-output");

const modeRadios = document.querySelectorAll("input[name='mode']");
const minInput = document.getElementById("min-input");
const cardCountInput = document.getElementById("card-count-input");
const containerWidthInput = document.getElementById("container-width-input");

const minTrackValue = document.getElementById("min-track-value");
const cardCountValue = document.getElementById("card-count-value");
const containerWidthValue = document.getElementById("container-width-value");

const cqContainer = document.getElementById("cq-container");
const cqOutput = document.getElementById("cq-output");
// Created here (rather than a static <style> tag in index.html) so it's guaranteed to exist regardless of how the sandbox bundler handles <head> markup.
const cqDynamicStyle = document.createElement("style");
document.head.appendChild(cqDynamicStyle);
const cqWidthInput = document.getElementById("cq-width-input");
const cqBreakpointInput = document.getElementById("cq-breakpoint-input");
const cqWidthValue = document.getElementById("cq-width-value");
const cqBreakpointValue = document.getElementById("cq-breakpoint-value");

/*
  Rebuilds the numbered card boxes to match the current count, reusing existing ones
  so cards don't re-render on every slider tick.
*/
function renderCards(count) {
  const current = grid.children.length;

  if (count > current) {
    for (let i = current; i < count; i++) {
      const card = document.createElement("div");
      card.className = "grid-card";
      card.textContent = `Card ${i + 1}`;
      grid.appendChild(card);
    }
  } else if (count < current) {
    for (let i = current; i > count; i--) {
      grid.removeChild(grid.lastElementChild);
    }
  }
}

function updateGrid() {
  const mode = document.querySelector("input[name='mode']:checked").value;
  const min = Number(minInput.value);
  const cardCount = Number(cardCountInput.value);
  const containerWidth = Number(containerWidthInput.value);

  updateRangeSlider(minInput, minTrackValue, (v) => `${v}px`);
  updateRangeSlider(cardCountInput, cardCountValue);
  updateRangeSlider(containerWidthInput, containerWidthValue, (v) => `${v}px`);

  containerFrame.style.width = `${containerWidth}px`;
  grid.style.gridTemplateColumns = `repeat(${mode}, minmax(${min}px, 1fr))`;

  renderCards(cardCount);

  output.textContent = `grid-template-columns: repeat(${mode}, minmax(${min}px, 1fr));`;
}

modeRadios.forEach((radio) => radio.addEventListener("change", updateGrid));
[minInput, cardCountInput, containerWidthInput].forEach((input) =>
  input.addEventListener("input", updateGrid)
);

updateGrid();

/*
  The @container breakpoint can't be set as an inline style (it's an at-rule, not a property), so
  the whole rule is rewritten into a dedicated <style> tag whenever the breakpoint slider moves.
  container-type: inline-size on #cq-container (set in styles.css) makes it the query context that
  rule resolves against — .cq-card reflows based on that element's own width, not the viewport.
*/
function updateContainerQuery() {
  const width = Number(cqWidthInput.value);
  const breakpoint = Number(cqBreakpointInput.value);

  updateRangeSlider(cqWidthInput, cqWidthValue, (v) => `${v}px`);
  updateRangeSlider(cqBreakpointInput, cqBreakpointValue, (v) => `${v}px`);

  cqContainer.style.width = `${width}px`;

  cqDynamicStyle.textContent = `
@container (min-width: ${breakpoint}px) {
  .cq-card {
    grid-template-areas: "title meta" "content content";
    grid-template-columns: 2fr 1fr;
  }
}`;

  cqOutput.textContent = `.cq-container {
  container-type: inline-size;
}

@container (min-width: ${breakpoint}px) {
  .cq-card {
    grid-template-columns: 2fr 1fr;
  }
}`;
}

[cqWidthInput, cqBreakpointInput].forEach((input) =>
  input.addEventListener("input", updateContainerQuery)
);

updateContainerQuery();
