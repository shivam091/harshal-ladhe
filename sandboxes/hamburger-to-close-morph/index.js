import "./shared/playground.css";
import "./styles.css";

const toggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");
const slowToggle = document.getElementById("slow-toggle");
const singleToggle = document.getElementById("single-toggle");
const readout = document.getElementById("readout");

// aria-expanded is the only state, so the icon, the menu, and screen readers can't drift apart.
function setOpen(open) {
  toggle.setAttribute("aria-expanded", String(open));
  menu.hidden = !open;
  readout.textContent = `aria-expanded="${open}"\n${open ? "Bars slide to the centre, then rotate into the ✕." : "The ✕ un-rotates, then the bars slide apart."}`;
}

toggle.addEventListener("click", () => {
  setOpen(toggle.getAttribute("aria-expanded") !== "true");
});

// Escape closes the menu, as any disclosure should, and hands focus back to the toggle.
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
    setOpen(false);
    toggle.focus();
  }
});

slowToggle.addEventListener("change", () => {
  toggle.style.setProperty("--step", slowToggle.checked ? "600ms" : "150ms");
});

singleToggle.addEventListener("change", () => {
  toggle.classList.toggle("single-step", singleToggle.checked);
});

setOpen(false);
