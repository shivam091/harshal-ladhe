import "./styles.css";

const slider = document.getElementById("unit");
const output = document.getElementById("unit-output");

function applyUnit(px) {
  const rem = (px / 64).toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
  document.documentElement.style.setProperty("--unit", `${px / 64}rem`);
  output.textContent = `${rem}rem`;
}

slider.addEventListener("input", () => applyUnit(Number(slider.value)));
applyUnit(Number(slider.value));
