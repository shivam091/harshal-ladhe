import "./shared/playground.css";
import "./styles.css";

const donutToggle = document.getElementById("donut-toggle");
const orderBtn = document.getElementById("order-btn");
const donutStyle = document.getElementById("donut-style");
const proximityStyle = document.getElementById("proximity-style");
const donutNote = document.getElementById("donut-note");
const orderNote = document.getElementById("order-note");
const cssOutput = document.getElementById("css-output");
const notice = document.getElementById("support-notice");

// Feature check by interface, since CSS.supports() has no at-rule form that covers @scope.
const supportsScope = typeof CSSScopeRule !== "undefined";

// Whether the dark block is written first, which flips source order without touching the DOM.
let darkFirst = false;

// Builds the donut rule as text, so the readout prints exactly what the browser parsed.
function donutCss(limited) {
  const prelude = limited ? "@scope (.card) to (.card-content)" : "@scope (.card)";
  return `${prelude} {
  a {
    color: #818cf8;
    font-weight: 700;
    text-decoration: none;
    background: rgba(129, 140, 248, 0.18);
  }
}`;
}

// Builds the two theme blocks in either order; both have equal specificity, so only proximity can decide.
function proximityCss(reversed) {
  const light = `@scope (.theme-light) {
  a { color: navy; }
}`;
  const dark = `@scope (.theme-dark) {
  a { color: lightskyblue; }
}`;
  return reversed ? `${dark}\n\n${light}` : `${light}\n\n${dark}`;
}

// Reading state from the controls in one place stops the readout and the live demo from disagreeing.
function render() {
  const limited = donutToggle.checked;
  const donut = donutCss(limited);
  const proximity = proximityCss(darkFirst);

  donutStyle.textContent = donut;
  proximityStyle.textContent = proximity;

  donutNote.textContent = limited
    ? "Only the card's own link is styled: the slot is the hole in the donut."
    : "No limit: the rule reaches every link under .card, including the slotted one.";

  orderBtn.textContent = darkFirst ? "Source order: dark block first (click to swap)" : "Source order: light block first (click to swap)";
  orderNote.textContent = darkFirst
    ? "The light block now comes last, but the nested link stays light blue: .theme-dark is the closer scope."
    : "The dark block comes last. Swap them and the nested link stays light blue, because the nearest scope wins.";

  cssOutput.textContent = `${donut}\n\n${proximity}`;
}

donutToggle.addEventListener("change", render);

orderBtn.addEventListener("click", () => {
  darkFirst = !darkFirst;
  render();
});

notice.hidden = supportsScope;
render();
