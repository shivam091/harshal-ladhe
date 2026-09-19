import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./shared/range-slider.css";
import "./styles.css";
import { updateRangeSlider } from "./shared/range-slider.js";

const containerFrame = document.getElementById("container-frame");
const layoutPreview = document.getElementById("layout-preview");
const output = document.getElementById("layout-output");

const modeRadios = document.querySelectorAll("input[name='mode']");
const containerWidthInput = document.getElementById("container-width-input");
const minItemInput = document.getElementById("min-item-input");

const containerWidthValue = document.getElementById("container-width-value");
const minItemValue = document.getElementById("min-item-value");

/*
  Reads the checked mode radio ("flex" or "grid"), the container width, and the shared min-card-width
  slider, then applies all three to the live preview and rewrites the readout to show the CSS that
  produces whatever is currently on screen. The min-card-width value drives both modes at once — it
  becomes the flex-basis in Flex mode and the minmax() floor in Grid mode — so switching modes with the
  slider untouched keeps the wrap breakpoint identical, making the row-alignment difference the only
  thing that visibly changes.
*/
function updateLayout() {
  const mode = document.querySelector("input[name='mode']:checked").value;
  const containerWidth = Number(containerWidthInput.value);
  const minItem = Number(minItemInput.value);

  updateRangeSlider(containerWidthInput, containerWidthValue, (v) => `${v}px`);
  updateRangeSlider(minItemInput, minItemValue, (v) => `${v}px`);

  containerFrame.style.width = `${containerWidth}px`;
  layoutPreview.style.setProperty("--min-item", `${minItem}px`);
  layoutPreview.classList.toggle("mode-flex", mode === "flex");
  layoutPreview.classList.toggle("mode-grid", mode === "grid");

  output.textContent =
    mode === "flex"
      ? `.layout-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.layout-card {
  flex: 1 1 ${minItem}px;
}

/* Each wrapped row sizes its own height independently — rows don't align to each other. */`
      : `.layout-preview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(${minItem}px, 1fr));
  grid-auto-rows: 1fr;
  align-items: stretch;
  gap: 1rem;
}

/* Rows are real tracks — every row (wrapped or not) is forced to the same height. */`;
}

modeRadios.forEach((radio) => radio.addEventListener("change", updateLayout));
[containerWidthInput, minItemInput].forEach((input) =>
  input.addEventListener("input", updateLayout)
);

updateLayout();
