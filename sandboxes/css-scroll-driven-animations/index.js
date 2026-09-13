import "./shared/playground.css";
import "./shared/tabs.css";
import "./shared/range-slider.css";
import "./styles.css";
import { positionRangeBubble } from "./shared/range-slider.js";
import { initTabs } from "./shared/tabs.js";

const rangeNameSelect = document.getElementById("range-name-select");
const rangeEndInput = document.getElementById("range-end-input");
const rangeEndValue = document.getElementById("range-end-value");
const rangeReadout = document.getElementById("range-readout");
const revealCards = document.querySelectorAll(".reveal-card");

// Every reveal card shares one animation-range, driven by the range-name select + end-offset slider.
function updateRange() {
  const rangeName = rangeNameSelect.value;
  const endOffset = Number(rangeEndInput.value);
  const range = `entry 0% ${rangeName} ${endOffset}%`;

  rangeEndValue.textContent = `${endOffset}%`;
  rangeReadout.textContent = range;
  positionRangeBubble(rangeEndInput, rangeEndValue);

  revealCards.forEach((card) => {
    card.style.animationRange = range;
  });
}

rangeNameSelect.addEventListener("change", updateRange);
rangeEndInput.addEventListener("input", updateRange);

updateRange();

// Demo switcher (scroll() progress bar vs. view() reveal)
initTabs(".tab");

/*
  Scroll-driven animations (animation-timeline: scroll()/view()) are Chromium-only as of this
  writing — Firefox and Safari silently ignore the timeline, so the animation never plays and
  both demos would otherwise sit stuck at their `from` keyframe (an invisible progress bar, cards
  frozen at opacity: 0). Detect support and fall back to a static, legible state instead.
*/
if (!CSS.supports("animation-timeline", "scroll()")) {
  document.querySelector(".playground").classList.add("no-timeline-support");
  document.getElementById("support-warning").hidden = false;
}
