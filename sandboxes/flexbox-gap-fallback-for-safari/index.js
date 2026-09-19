import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./styles.css";

const flexRow = document.getElementById("flex-row");
const readout = document.getElementById("readout");
const envRadios = document.querySelectorAll("input[name='env']");

// NOTE: this is a SIMULATION, not real feature detection. A real page would use the
// `@supports (gap: 1rem)` check from the post above and let the browser decide which rule
// applies. There is no way to actually turn off a real browser's native `gap` support from
// here, so instead we manually flip a class on the flex row to switch between the two CSS
// code paths (real `gap` vs. the `* + *` margin fallback) so both can be compared side by side.
function applyEnvironment(env) {
  const isLegacy = env === "legacy";

  flexRow.classList.toggle("flex-row--simulated-legacy", isLegacy);

  readout.textContent = isLegacy
    ? "gap: 1rem is NOT applying (simulated). Spacing is coming from: .flex-row > * + * { margin-inline-start: 1rem; }"
    : "gap: 1rem IS applying. The margin-inline-start fallback is zeroed out by the (simulated) @supports block.";
}

function handleChange(event) {
  applyEnvironment(event.target.value);
}

envRadios.forEach((radio) => radio.addEventListener("change", handleChange));

applyEnvironment(document.querySelector("input[name='env']:checked").value);
