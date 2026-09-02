import "./styles.css";

const picker = document.getElementById("theme-picker");

picker.addEventListener("input", () => {
  document.documentElement.style.setProperty("--theme-accent", picker.value);
});
