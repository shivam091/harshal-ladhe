import "./shared/playground.css";
import "./styles.css";

const dialog = document.getElementById("demo-dialog");
const popover = document.getElementById("demo-popover");
const output = document.getElementById("playground-output");

const openDialogBtn = document.getElementById("open-dialog-btn");
const closeDialogBtn = document.getElementById("close-dialog-btn");
const dialogDiscreteToggle = document.getElementById("dialog-discrete-toggle");
const popoverDiscreteToggle = document.getElementById("popover-discrete-toggle");

let dialogOpen = false;
let popoverOpen = false;

function updateOutput() {
  output.textContent = `Dialog ${dialogOpen ? "open" : "closed"} · Popover ${popoverOpen ? "open" : "closed"}`;
}

/*
  .no-discrete is the whole demo. In styles.css it does two things at once: it swaps the
  `transition` shorthand for one with no `display`/`overlay allow-discrete` entries at all
  (so the dialog/popover's own native display toggling just snaps instantly, same as it always
  did before this pattern existed), and it stops the paired @starting-style block from matching
  (its selector is scoped to `:not(.no-discrete)`), so opacity/transform lose their "before" value
  too and pop straight to the final state on the next open. One class, both halves of the pattern,
  no fighting the dialog/popover's own native open/close mechanics directly.
*/
function applyDialogDiscreteClass() {
  dialog.classList.toggle("no-discrete", !dialogDiscreteToggle.checked);
}

function applyPopoverDiscreteClass() {
  popover.classList.toggle("no-discrete", !popoverDiscreteToggle.checked);
}

openDialogBtn.addEventListener("click", () => {
  dialog.showModal();
  dialogOpen = true;
  updateOutput();
});

closeDialogBtn.addEventListener("click", () => dialog.close());

// Fires on .close(), the built-in "Close" button's form-free .close() call above, and native
// Esc-to-dismiss alike — one listener covers every way the dialog can end up closed.
dialog.addEventListener("close", () => {
  dialogOpen = false;
  updateOutput();
});

// ToggleEvent — fires for every way a popover can open or close (popovertarget, Esc,
// light-dismiss via an outside click, or the imperative show/hide/toggle methods).
popover.addEventListener("toggle", (event) => {
  popoverOpen = event.newState === "open";
  updateOutput();
});

dialogDiscreteToggle.addEventListener("change", applyDialogDiscreteClass);
popoverDiscreteToggle.addEventListener("change", applyPopoverDiscreteClass);

applyDialogDiscreteClass();
applyPopoverDiscreteClass();
updateOutput();
