import "./styles.css";

const panel = document.getElementById("panel");
const toggleBtn = document.getElementById("toggle-btn");

toggleBtn.addEventListener("click", () => {
  const isDark = panel.classList.toggle("force-dark");
  toggleBtn.textContent = isDark ? "Force light scheme" : "Force dark scheme";
});
