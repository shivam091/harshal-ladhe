import "./styles.css";

const stage = document.getElementById("stage");
const countSlider = document.getElementById("count-slider");
const countValue = document.getElementById("count-value");
const rotationSlider = document.getElementById("rotation-slider");
const rotationValue = document.getElementById("rotation-value");

function renderDots(count) {
  stage.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const dot = document.createElement("div");
    dot.className = "dot";
    // Only the index and total are set from JS — every x/y position below is CSS trig math.
    dot.style.setProperty("--i", String(i));
    dot.textContent = String(i + 1);
    stage.appendChild(dot);
  }
}

countSlider.addEventListener("input", () => {
  const count = Number(countSlider.value);
  countValue.textContent = String(count);
  stage.style.setProperty("--total", String(count));
  renderDots(count);
});

rotationSlider.addEventListener("input", () => {
  rotationValue.textContent = `${rotationSlider.value}°`;
  stage.style.setProperty("--rotation", `${rotationSlider.value}deg`);
});

renderDots(Number(countSlider.value));
