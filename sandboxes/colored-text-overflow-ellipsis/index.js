import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./styles.css";

const dots = document.getElementById("dots");
const readout = document.getElementById("readout");

function update() {
  const color = document.querySelector("input[name='color']:checked").value;
  dots.dataset.color = color;
  readout.textContent = `.dots { color: ${color === "accent" ? "var(--accent)" : "inherit"} }`;
}

document.querySelectorAll("input[name='color']").forEach((radio) =>
  radio.addEventListener("change", update)
);

update();
