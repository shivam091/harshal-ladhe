import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./styles.css";

const $ = (id) => document.getElementById(id);
const cards = $("cards");
const flowOptions = $("flow-options");

// Only the values that mean something for the chosen container type are offered.
const FLOWS = {
  flex: ["normal", "flex-visual", "flex-flow"],
  placed: ["normal", "grid-rows", "grid-columns", "grid-order"],
  ordered: ["normal", "grid-rows", "grid-columns", "grid-order"]
};

// What each value does, shown under the options so the trail has an explanation to check against.
const TIPS = {
  normal: "normal — Tab follows the HTML: 1, 2, 3, 4, 5, whatever the layout looks like.",
  "flex-visual": "flex-visual — Tab follows the items as you see them, reading left to right.",
  "flex-flow": "flex-flow — Tab follows the flex flow from main-start. With row-reverse, main-start is on the right, so this matches the HTML order.",
  "grid-rows": "grid-rows — Tab follows the visual grid row by row, left to right within each row.",
  "grid-columns": "grid-columns — Tab follows the visual grid column by column, top to bottom within each column.",
  "grid-order": "grid-order — Tab follows the order property, ignoring where items were placed with grid-area."
};

// The layout's own CSS for the readout, so the generated snippet is complete.
const LAYOUT_CSS = {
  flex: "display: flex;\n  flex-direction: row-reverse;",
  placed: "display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  /* items placed with grid-area */",
  ordered: "display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  /* items reordered with order */"
};

// Without support the trail always reads 1–5, so the note says why rather than letting the demo look broken.
$("support-note").hidden = CSS.supports("reading-flow", "grid-rows");

let trail = [];

function resetTrail() {
  trail = [];
  $("trail").textContent = 'Focus trail: press Tab from "Start here".';
}

// Rebuilds the reading-flow options for the chosen layout, keeping the current value when it still applies.
function renderOptions(layout, current) {
  const values = FLOWS[layout];
  const selected = values.includes(current) ? current : values[0];
  flowOptions.replaceChildren(
    ...values.map((value) => {
      const label = document.createElement("label");
      label.className = "segment";
      label.innerHTML = `<input type="radio" name="flow" value="${value}"${value === selected ? " checked" : ""}><span>${value}</span>`;
      return label;
    })
  );
  return selected;
}

function update() {
  const layout = document.querySelector("input[name='layout']:checked").value;
  const current = document.querySelector("input[name='flow']:checked")?.value ?? "normal";
  const flow = renderOptions(layout, current);

  cards.dataset.layout = layout;
  cards.style.readingFlow = flow;
  $("flow-tip").textContent = TIPS[flow];
  $("readout").textContent = `.cards {\n  ${LAYOUT_CSS[layout]}\n  reading-flow: ${flow};\n}`;
  resetTrail();
}

// Records focus as it actually moves, so the trail shows the browser's real Tab order rather than a prediction.
cards.addEventListener("focusin", (event) => {
  const card = event.target.closest(".card");
  if (!card) return;
  trail.push(card.dataset.n);
  $("trail").textContent = `Focus trail: ${trail.join(" → ")}`;
});

$("start-button").addEventListener("focus", resetTrail);
document.querySelectorAll("input[name='layout']").forEach((radio) => radio.addEventListener("change", update));
flowOptions.addEventListener("change", update);
update();
