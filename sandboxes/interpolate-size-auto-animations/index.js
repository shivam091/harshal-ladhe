import "./shared/playground.css";
import "./shared/range-slider.css";
import "./styles.css";
import { updateRangeSlider } from "./shared/range-slider.js";

const $ = (id) => document.getElementById(id);
const accordion = $("accordion");
const panels = [...accordion.querySelectorAll("details")];

const supported = CSS.supports("interpolate-size", "allow-keywords") && CSS.supports("selector(::details-content)");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

// Why the panels animate or snap right now, so the readout matches what's on screen.
function behaviour(duration) {
  if (!supported) return "snaps: not supported in this browser";
  if (reducedMotion.matches) return "snaps: reduced motion is on";
  if (!$("keywords-toggle").checked) return "snaps: interpolate-size is off";
  return `animates between 0 and auto over ${duration}ms`;
}

/*
  The accordion itself needs no JavaScript: <details name="faq"> makes it exclusive and styles.css animates it. This
  script only applies the controls and reports what the browser is doing.
*/
function update() {
  const duration = $("duration-input").value;
  updateRangeSlider($("duration-input"), $("duration-value"), (value) => `${value}ms`);

  accordion.style.setProperty("--duration", `${duration}ms`);
  accordion.classList.toggle("animate-keywords", $("keywords-toggle").checked);

  const open = panels.find((panel) => panel.open);
  // The inner .panel-body isn't animated, so its height is the auto height the panel opens to.
  const panel = open
    ? `Open: "${open.querySelector("summary").textContent}" (content ${open.querySelector(".panel-body").offsetHeight}px tall)`
    : "Open: none";

  $("readout").textContent = `${panel}\nblock-size ${behaviour(duration)}`;
}

$("duration-input").addEventListener("input", update);
$("keywords-toggle").addEventListener("change", update);
reducedMotion.addEventListener("change", update);
// toggle doesn't bubble, so each panel gets its own listener.
panels.forEach((panel) => panel.addEventListener("toggle", update));
update();
