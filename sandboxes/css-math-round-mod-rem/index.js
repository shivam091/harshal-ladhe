import "./shared/playground.css";
import "./shared/range-slider.css";
import "./styles.css";
import { positionRangeBubble } from "./shared/range-slider.js";

const roundInput = document.getElementById("round-input");
const roundLabel = document.getElementById("round-label");
const roundValue = document.getElementById("round-value");
const roundBlock = document.getElementById("round-block");
const roundRawMarker = document.getElementById("round-raw-marker");

const modInput = document.getElementById("mod-input");
const modLabel = document.getElementById("mod-label");
const modValue = document.getElementById("mod-value");
const modNeedle = document.getElementById("mod-needle");
const remNeedle = document.getElementById("rem-needle");
const modReadout = document.getElementById("mod-readout");

const readout = document.getElementById("readout");

// round()'s result is set as a real CSS width via a custom property, then read back from the
// browser's own computed style — this is the actual engine's math, not a JS re-implementation.
roundBlock.style.setProperty("--raw", roundInput.value);
roundBlock.style.width = "round(up, calc(var(--raw) * 1px), 20px)";

// Same idea for mod()/rem(): each needle's rotation IS the CSS math function's result.
modNeedle.style.setProperty("--angle", `${modInput.value}deg`);
modNeedle.style.rotate = "mod(var(--angle), 360deg)";
remNeedle.style.setProperty("--angle", `${modInput.value}deg`);
remNeedle.style.rotate = "rem(var(--angle), 360deg)";

function updateRound() {
  const raw = roundInput.value;

  roundLabel.textContent = `${raw}px`;
  roundValue.textContent = `${raw}px`;
  positionRangeBubble(roundInput, roundValue);

  roundRawMarker.style.left = `${raw}px`;
  roundBlock.style.setProperty("--raw", raw);

  requestAnimationFrame(() => {
    const snapped = Math.round(parseFloat(getComputedStyle(roundBlock).width));
    readout.textContent = `round(up, ${raw}px, 20px) -> ${snapped}px`;
  });
}

function updateMod() {
  const angle = modInput.value;

  modLabel.textContent = `${angle}deg`;
  modValue.textContent = `${angle}deg`;
  positionRangeBubble(modInput, modValue);

  modNeedle.style.setProperty("--angle", `${angle}deg`);
  remNeedle.style.setProperty("--angle", `${angle}deg`);

  requestAnimationFrame(() => {
    const modResult = getComputedStyle(modNeedle).rotate;
    const remResult = getComputedStyle(remNeedle).rotate;
    modReadout.textContent = [
      `mod(${angle}deg, 360deg) -> ${modResult}  (always 0-360, same direction as the divisor)`,
      `rem(${angle}deg, 360deg) -> ${remResult}  (keeps ${angle}deg's own sign instead)`,
    ].join("\n");
  });
}

roundInput.addEventListener("input", updateRound);
modInput.addEventListener("input", updateMod);

updateRound();
updateMod();
