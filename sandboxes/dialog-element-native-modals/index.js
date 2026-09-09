import "./shared/playground.css";
import "./styles.css";

const dialog = document.getElementById("my-dialog");
const modeText = document.getElementById("mode-text");
const log = document.getElementById("log");

document.getElementById("open-modal").addEventListener("click", () => {
  modeText.innerHTML = "This dialog was opened with <code>showModal()</code>: it blocks the rest of the page, traps Tab inside itself, and dims everything behind it.";
  dialog.showModal();
});

document.getElementById("open-nonmodal").addEventListener("click", () => {
  modeText.innerHTML = "This dialog was opened with <code>show()</code>: the rest of the page stays fully interactive — try clicking or tabbing right past it.";
  dialog.show();
});

// method="dialog" closes the <dialog> and sets its returnValue to whichever button's `value`
// submitted the form — no click handler needed to read which action the user chose.
dialog.addEventListener("close", () => {
  log.textContent = `Closed with returnValue: "${dialog.returnValue || "(none — closed via Esc/outside click)"}"`;
});
