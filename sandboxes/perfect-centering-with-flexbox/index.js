import "./shared/playground.css";
import "./styles.css";

const container = document.getElementById("center-container");
const readout = document.getElementById("readout");
const justifyToggle = document.getElementById("justify-toggle");
const alignToggle = document.getElementById("align-toggle");

// Applies the two toggles independently to the live container and refreshes the CSS readout so
// it always mirrors exactly what's rendered, never a guessed/simulated value.
function update() {
  const justify = justifyToggle.checked ? "center" : "flex-start";
  const align = alignToggle.checked ? "center" : "flex-start";

  container.style.justifyContent = justify;
  container.style.alignItems = align;

  readout.textContent = `.center-anything {
  display: flex;
  justify-content: ${justify};
  align-items: ${align};
}`;
}

justifyToggle.addEventListener("change", update);
alignToggle.addEventListener("change", update);

update();
