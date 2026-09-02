import "./styles.css";

const slider = document.getElementById("width-slider");
const wrapper = document.getElementById("container-wrapper");
const valueLabel = document.getElementById("width-value");

slider.addEventListener("input", () => {
  wrapper.style.width = `${slider.value}px`;
  valueLabel.textContent = `${slider.value}px`;
});
