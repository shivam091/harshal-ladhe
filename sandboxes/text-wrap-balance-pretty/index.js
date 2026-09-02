import "./styles.css";

const slider = document.getElementById("width-slider");
const valueLabel = document.getElementById("width-value");
const targets = [
  document.getElementById("headline-default"),
  document.getElementById("headline-balance"),
  document.getElementById("paragraph-default"),
  document.getElementById("paragraph-pretty")
];

slider.addEventListener("input", () => {
  const width = `${slider.value}px`;
  valueLabel.textContent = width;
  targets.forEach((el) => {
    el.style.width = width;
  });
});
