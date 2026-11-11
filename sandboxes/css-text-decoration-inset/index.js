import "./styles.css";

const sample = document.getElementById("sample");
const start = document.getElementById("start");
const end = document.getElementById("end");
const wavy = document.getElementById("wavy");
const readout = document.getElementById("readout");

document.getElementById("support").hidden = CSS.supports("text-decoration-inset", "1px");

function update() {
  const value = `${start.value}em ${end.value}em`;
  sample.style.setProperty("text-decoration-inset", value);
  sample.classList.toggle("wavy", wavy.checked);

  document.getElementById("start-label").textContent = `${start.value}em`;
  document.getElementById("end-label").textContent = `${end.value}em`;
  readout.textContent = `text-decoration-inset: ${value};`;
}

for (const input of [start, end, wavy]) {
  input.addEventListener("input", update);
}

// Keep the demo links from jumping to the top of the page.
document.querySelector(".nav").addEventListener("click", (event) => event.preventDefault());

update();
