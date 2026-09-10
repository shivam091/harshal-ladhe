import "./shared/playground.css";
import "./styles.css";

const phone = document.getElementById("phone");
const toggleBtn = document.getElementById("toggle-btn");
const insetCode = document.getElementById("inset-code");

toggleBtn.addEventListener("click", () => {
  const isSafe = phone.classList.toggle("safe");
  toggleBtn.textContent = isSafe ? "Remove safe-area padding" : "Apply safe-area padding";
  insetCode.textContent = isSafe
    ? "padding: env(safe-area-inset-top) 1rem env(safe-area-inset-bottom);"
    : "padding: 0px 1rem 0px;";
});
