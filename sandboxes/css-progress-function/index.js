import "./styles.css";

const slider = document.getElementById("width");
const widthLabel = document.getElementById("width-label");
const stage = document.getElementById("stage");
const card = document.getElementById("card");
const readout = document.getElementById("readout");

const supported = CSS.supports("width", "calc(progress(1px, 0px, 2px) * 1px)");
document.getElementById("support").hidden = supported;

function update() {
  const rem = Number(slider.value);
  stage.style.inlineSize = `${rem}rem`;
  widthLabel.textContent = `${rem}rem`;

  // --p is registered as a <number> in styles.css, so the computed value is the result of progress(), not its text.
  const p = Number.parseFloat(getComputedStyle(card).getPropertyValue("--p"));
  readout.textContent = supported ? `progress(100cqi, 14rem, 30rem) = ${p.toFixed(2)}` : "progress() not supported";
}

slider.addEventListener("input", update);
update();
