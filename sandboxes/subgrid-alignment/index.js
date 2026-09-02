import "./styles.css";

const grid = document.getElementById("cards-grid");
const toggleBtn = document.getElementById("toggle-subgrid-btn");

toggleBtn.addEventListener("click", () => {
  const enabled = grid.classList.toggle("subgrid-enabled");
  toggleBtn.textContent = enabled ? "Disable subgrid alignment" : "Enable subgrid alignment";
});
