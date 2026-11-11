import "./styles.css";

const fields = document.getElementById("fields");
const customBlink = document.getElementById("custom-blink");
const readout = document.getElementById("readout");

document.getElementById("support").hidden = CSS.supports("caret-shape", "block");

function update() {
  const shape = document.querySelector('input[name="shape"]:checked').value;

  // caret-shape is inherited, so setting it on the wrapper reaches both fields.
  fields.style.setProperty("caret-shape", shape);
  fields.classList.toggle("custom-blink", customBlink.checked);

  readout.textContent = customBlink.checked
    ? `caret-shape: ${shape}; caret-animation: manual;`
    : `caret-shape: ${shape};`;

  fields.querySelector("input").focus();
}

for (const input of document.querySelectorAll('input[name="shape"], #custom-blink')) {
  input.addEventListener("change", update);
}

update();
