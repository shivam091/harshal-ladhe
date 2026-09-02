import "./styles.css";

const card = document.getElementById("demo-card");
const toggleBtn = document.getElementById("toggle-active-btn");

toggleBtn.addEventListener("click", () => {
  card.classList.toggle("active");
});
