import "./styles.css";

const stage = document.getElementById("stage");
const showPlainBtn = document.getElementById("show-plain-btn");
const showAnimatedBtn = document.getElementById("show-animated-btn");

function showToast(className, text) {
  const toast = document.createElement("div");
  toast.className = `toast ${className}`;
  toast.textContent = text;
  stage.appendChild(toast);

  setTimeout(() => toast.remove(), 2200);
}

showPlainBtn.addEventListener("click", () => {
  showToast("toast-plain", "Popped in instantly — no transition plays on first paint");
});

showAnimatedBtn.addEventListener("click", () => {
  showToast("toast-animated", "Faded and slid in via @starting-style");
});
