import "./styles.css";

const picker = document.getElementById("brand-picker");

picker.addEventListener("input", () => {
  document.documentElement.style.setProperty("--brand", picker.value);
});
