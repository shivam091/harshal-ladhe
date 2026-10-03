import "./shared/playground.css";
import "./styles.css";

const marquees = document.querySelectorAll(".marquee");
const durationSelect = document.getElementById("duration");
const fadeToggle = document.getElementById("fade-toggle");
const readout = document.getElementById("readout");

// The marquee runs on CSS alone; these options only feed it custom properties so the effect of each is visible.
function update() {
  for (const marquee of marquees) {
    marquee.style.setProperty("--duration", durationSelect.value);
    marquee.classList.toggle("marquee--no-fade", !fadeToggle.checked);
  }
  readout.textContent = `.marquee { --duration: ${durationSelect.value}; }\n.marquee__track { animation: marquee var(--duration) linear infinite; }\nEdge fade: ${fadeToggle.checked ? "on" : "off"}`;
}

durationSelect.addEventListener("change", update);
fadeToggle.addEventListener("change", update);

update();
