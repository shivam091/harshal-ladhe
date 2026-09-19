import "./shared/playground.css";
import "./styles.css";

const toggle = document.getElementById("mode-toggle");
const boxVi = document.getElementById("box-vi");
const boxVb = document.getElementById("box-vb");
const readout = document.getElementById("readout");

function update() {
  const isVertical = document.documentElement.classList.contains("vertical-mode");
  toggle.textContent = isVertical ? "Switch to horizontal-tb" : "Switch to vertical-rl";

  const viPx = Math.round(boxVi.getBoundingClientRect().width);
  const vbPx = Math.round(boxVb.getBoundingClientRect().height);

  readout.textContent = [
    `root writing-mode: ${isVertical ? "vertical-rl" : "horizontal-tb"}`,
    `20vi -> tracks viewport ${isVertical ? "HEIGHT" : "WIDTH"}   (${viPx}px)`,
    `20vb -> tracks viewport ${isVertical ? "WIDTH" : "HEIGHT"}   (${vbPx}px)`,
  ].join("\n");
}

toggle.addEventListener("click", () => {
  document.documentElement.classList.toggle("vertical-mode");
  update();
});

window.addEventListener("resize", update);

update();
