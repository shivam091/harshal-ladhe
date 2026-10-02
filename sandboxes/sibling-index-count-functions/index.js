import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./styles.css";

const list = document.getElementById("list");
const readout = document.getElementById("readout");
const replayButton = document.getElementById("replay");
const addButton = document.getElementById("add");
const removeButton = document.getElementById("remove");
const radios = document.querySelectorAll("input[name='mode']");

// Bounds keep the list short enough to watch, and never empty.
const MIN_ITEMS = 1;
const MAX_ITEMS = 12;

// Mirrors styles.css so the readout shows the rule that's actually in effect.
const DELAYS = {
  step: "calc((sibling-index() - 1) * 80ms)",
  total: "calc((sibling-index() - 1) / sibling-count() * 600ms)"
};

// Without support every item animates at once, so say so rather than let the demo look broken.
const supportsSiblingIndex = CSS.supports("z-index", "sibling-index()");

// Restarting the animation is the only timing-related job JS has; every delay still comes from CSS.
function replay() {
  list.classList.remove("run");
  requestAnimationFrame(() => requestAnimationFrame(() => list.classList.add("run")));
}

// Keeps the readout and button states in step with the list's mode and length.
function describe() {
  const count = list.children.length;
  const support = supportsSiblingIndex
    ? "sibling-index() supported: yes, so each item waits for its own delay."
    : "sibling-index() supported: no, so every item falls back to a 0ms delay and animates at once.";

  readout.textContent = `.item { animation-delay: ${DELAYS[list.dataset.mode]}; }\n\n${count} item(s), so sibling-count() = ${count}\n${support}`;
  addButton.disabled = count >= MAX_ITEMS;
  removeButton.disabled = count <= MIN_ITEMS;
}

addButton.addEventListener("click", () => {
  const item = document.createElement("li");
  item.className = "item";
  item.textContent = `Item ${list.children.length + 1}`;
  list.append(item);
  describe();
  replay();
});

removeButton.addEventListener("click", () => {
  list.lastElementChild.remove();
  describe();
  replay();
});

replayButton.addEventListener("click", replay);

for (const radio of radios) {
  radio.addEventListener("change", () => {
    list.dataset.mode = radio.value;
    describe();
    replay();
  });
}

describe();
replay();
