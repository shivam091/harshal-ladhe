import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./styles.css";

const panel = document.getElementById("scroll-panel");
const readout = document.getElementById("readout");

// Filler rows just to make the panel tall enough to actually scroll.
for (let i = 1; i <= 24; i++) {
  const li = document.createElement("li");
  li.textContent = `Row ${i}`;
  panel.appendChild(li);
}

const THUMB_COLORS = {
  indigo: "#818cf8",
  teal: "#2dd4bf",
  rose: "#fb7185",
};

function update() {
  const color = document.querySelector("input[name='color']:checked").value;
  const width = document.querySelector("input[name='width']:checked").value;

  panel.style.setProperty("--thumb-color", THUMB_COLORS[color]);
  panel.style.scrollbarWidth = width;

  readout.textContent = `scrollbar-color: ${THUMB_COLORS[color]} transparent; scrollbar-width: ${width};`;
}

document.querySelectorAll("input[name='color']").forEach((radio) => radio.addEventListener("change", update));
document.querySelectorAll("input[name='width']").forEach((radio) => radio.addEventListener("change", update));

update();
