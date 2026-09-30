import "./shared/playground.css";
import "./styles.css";

const content = document.getElementById("demo-content");
const toggleBtn = document.getElementById("toggle-btn");
const status = document.getElementById("status");

toggleBtn.addEventListener("click", () => {
  const isReset = content.classList.toggle("reset-applied");
  toggleBtn.textContent = isReset ? "Remove reset" : "Apply reset";
  status.textContent = isReset
    ? "Reset: on — box-sizing, margins, line-height, media sizing, form fonts, and text wrapping are all normalized."
    : "Reset: off — showing raw browser defaults.";
});
