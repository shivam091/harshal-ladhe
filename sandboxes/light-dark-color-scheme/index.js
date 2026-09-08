import "./shared/playground.css";
import "./styles.css";

const panel = document.getElementById("override-panel");
const toggleBtn = document.getElementById("toggle-btn");
const codeLabel = document.getElementById("override-code");

toggleBtn.addEventListener("click", () => {
  const isDark = panel.classList.toggle("force-dark");
  toggleBtn.textContent = isDark ? "Force light scheme" : "Force dark scheme";
  codeLabel.textContent = isDark ? "color-scheme: dark;" : "color-scheme: light;";
});
