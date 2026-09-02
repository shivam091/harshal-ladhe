import "./styles.css";

const slider = document.getElementById("tail");
const output = document.getElementById("tail-output");
const bubble = document.getElementById("bubble");

function applyTailPosition(percent) {
  // The ONE thing JS touches — a custom property read by calc() inside the shape() clip-path
  // itself (see styles.css). A path()-based clip-path couldn't do this: its value is a static SVG
  // path data string, with no way to reference a CSS variable inside it.
  bubble.style.setProperty("--tail", `${percent}%`);
  output.textContent = `${percent}%`;
}

slider.addEventListener("input", () => applyTailPosition(Number(slider.value)));
applyTailPosition(Number(slider.value));
