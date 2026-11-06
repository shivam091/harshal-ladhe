import "./shared/playground.css";
import "./styles.css";

const demoArea = document.getElementById("demo-area");
const toastStack = document.getElementById("toast-stack");
const cardGrid = document.getElementById("card-grid");
const output = document.getElementById("playground-output");

const startingStyleToggle = document.getElementById("starting-style-toggle");
const addToastBtn = document.getElementById("add-toast-btn");
const addCardBtn = document.getElementById("add-card-btn");
const clearBtn = document.getElementById("clear-btn");

const TOAST_MESSAGES = [
  "Changes saved.",
  "New message received.",
  "File uploaded successfully.",
  "Connection restored.",
  "Item added to your cart.",
  "Profile updated."
];

const CARD_TITLES = [
  "Sunset Ridge",
  "Blue Harbor",
  "Maple Grove",
  "Silver Creek",
  "Northgate",
  "Fern Hollow",
  "Copper Hill",
  "Willow Bend"
];

let toastCount = 0;
let cardCount = 0;

function updateOutput() {
  output.textContent = `${toastCount} toast${toastCount === 1 ? "" : "s"} · ${cardCount} card${cardCount === 1 ? "" : "s"}`;
}

/*
  This checkbox is the whole point of the demo: .starting-style-enabled is the class the
  @starting-style selectors in styles.css require to match (see the .toast / .card rules).
  With it present, a freshly-inserted .toast or .card gets an explicit "before" value to
  transition from. With it absent, @starting-style simply never matches the new element, so
  there's nothing to transition from — the very first style computed for that element IS its
  final style, and it just appears instantly. No per-item class juggling needed in JS at all.
*/
function applyStartingStyleClass() {
  demoArea.classList.toggle("starting-style-enabled", startingStyleToggle.checked);
}

function addToast() {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.textContent = TOAST_MESSAGES[Math.floor(Math.random() * TOAST_MESSAGES.length)];

  // Newest toast on top — each insertion gets its own independent @starting-style treatment;
  // toasts already in the stack are untouched, since they already had their first style computed.
  toastStack.prepend(toast);
  toastCount++;
  updateOutput();
}

function addCard() {
  const card = document.createElement("div");
  card.className = "card";
  const title = CARD_TITLES[Math.floor(Math.random() * CARD_TITLES.length)];
  card.innerHTML = `<div class="card-thumb" aria-hidden="true"></div><div class="card-title">${title}</div>`;

  cardGrid.appendChild(card);
  cardCount++;
  updateOutput();
}

function clearAll() {
  toastStack.replaceChildren();
  cardGrid.replaceChildren();
  toastCount = 0;
  cardCount = 0;
  updateOutput();
}

startingStyleToggle.addEventListener("change", applyStartingStyleClass);
addToastBtn.addEventListener("click", addToast);
addCardBtn.addEventListener("click", addCard);
clearBtn.addEventListener("click", clearAll);

applyStartingStyleClass();
updateOutput();
