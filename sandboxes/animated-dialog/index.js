import "./shared/playground.css";
import "./styles.css";

const dialog = document.getElementById("dialog");
const openButton = document.getElementById("open-btn");
const discreteToggle = document.getElementById("discrete-toggle");
const overlayToggle = document.getElementById("overlay-toggle");
const slowToggle = document.getElementById("slow-toggle");
const readout = document.getElementById("readout");

// showModal() rather than show(), because only a modal dialog joins the top layer and gets a ::backdrop.
openButton.addEventListener("click", () => dialog.showModal());

// closedby="any" isn't supported everywhere yet, so a click on the backdrop closes the dialog as a fallback.
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

// The readout echoes what each option changes, so the effect of removing a value is easy to connect to the code.
function update() {
  const duration = slowToggle.checked ? "1.2s" : "250ms";
  document.documentElement.style.setProperty("--duration", duration);
  document.documentElement.classList.toggle("no-discrete", !discreteToggle.checked);
  document.documentElement.classList.toggle("no-overlay", !overlayToggle.checked);

  const parts = [`opacity ${duration}`, `scale ${duration}`];
  if (discreteToggle.checked) parts.push(`display ${duration} allow-discrete`);
  if (overlayToggle.checked) parts.push(`overlay ${duration} allow-discrete`);
  readout.textContent = `.dialog {\n  transition:\n    ${parts.join(",\n    ")};\n}`;
}

discreteToggle.addEventListener("change", update);
overlayToggle.addEventListener("change", update);
slowToggle.addEventListener("change", update);

update();
