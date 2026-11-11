import "./styles.css";

const stage = document.getElementById("stage");
const shape = document.getElementById("shape");
const width = document.getElementById("width");
const readout = document.getElementById("readout");

document.getElementById("support").hidden = CSS.supports("border-shape", "circle(50%)");

function update() {
  // styles.css defines each shape as --shape under a [data-shape] selector, so swapping the attribute swaps both boxes.
  stage.dataset.shape = shape.value;
  stage.style.setProperty("--border-width", `${width.value}px`);
  document.getElementById("width-label").textContent = `${width.value}px`;

  const value = getComputedStyle(stage).getPropertyValue("--shape").trim().replace(/\s+/g, " ");
  readout.textContent = `border-shape: ${value};`;
}

shape.addEventListener("change", update);
width.addEventListener("input", update);
update();
