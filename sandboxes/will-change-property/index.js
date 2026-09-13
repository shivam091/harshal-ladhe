import "./shared/playground.css";
import "./shared/tabs.css";
import "./styles.css";
import { initTabs } from "./shared/tabs.js";

const demoArea = document.getElementById("demo-area");
const box = document.getElementById("demo-box");
const moveBtn = document.getElementById("move-btn");
const status = document.getElementById("status");
const log = document.getElementById("log");

let mode = "none";
let hasLoggedYet = false;

// Measures the demo area's real content width (minus its padding and the box's own width) so the
// box always travels exactly to the right edge of the available space — on any viewport, not a
// fixed distance guessed for one screen size. Safe to call while the box is mid-transition too,
// since transform never affects layout size.
function updateShiftDistance() {
  const areaStyles = getComputedStyle(demoArea);
  const paddingLeft = parseFloat(areaStyles.paddingLeft) || 0;
  const paddingRight = parseFloat(areaStyles.paddingRight) || 0;
  const available = demoArea.clientWidth - paddingLeft - paddingRight - box.offsetWidth;
  box.style.setProperty("--shift-x", `${Math.max(0, available)}px`);
}

// Formats the current wall-clock time down to the millisecond, so log entries read like real event timestamps.
function timestamp() {
  return new Date().toLocaleTimeString([], { hour12: false }) + `.${new Date().getMilliseconds().toString().padStart(3, "0")}`;
}

// Prepends one line to the log (newest first) and refreshes the "current value" readout from the box's
// actual computed style — never a value we just assume, so the readout can't drift from reality.
function logLine(text) {
  const line = `[${timestamp()}] ${text}`;
  log.textContent = hasLoggedYet ? `${line}\n${log.textContent}` : line;
  hasLoggedYet = true;
  status.textContent = `Current will-change: ${getComputedStyle(box).willChange}`;
}

// "Always on" sets the hint the moment it's selected and never clears it — the overuse anti-pattern
// the linked post warns about. The other two modes always start (or return to) will-change: auto.
function applyMode(nextMode) {
  mode = nextMode;
  box.style.willChange = mode === "always" ? "transform" : "auto";
  logLine(`Mode: ${mode}. will-change: ${getComputedStyle(box).willChange}`);
}

function handleMoveClick() {
  updateShiftDistance();

  if (mode === "toggle") {
    box.style.willChange = "transform";
    logLine("will-change: transform (added just before moving)");
  } else if (mode === "none") {
    logLine("Moving with no will-change hint set");
  } else {
    logLine("Moving (will-change has been set since this mode was selected)");
  }

  box.classList.toggle("demo-box--shifted");
}

function handleTransitionEnd(event) {
  if (event.propertyName !== "transform") return;

  if (mode === "toggle") {
    box.style.willChange = "auto";
    logLine("will-change: auto (removed immediately after)");
  } else if (mode === "always") {
    logLine("will-change stays set — never removed (the overuse case)");
  } else {
    logLine("Transition finished");
  }
}

initTabs(".tab", applyMode);
moveBtn.addEventListener("click", handleMoveClick);
box.addEventListener("transitionend", handleTransitionEnd);
window.addEventListener("resize", updateShiftDistance);

updateShiftDistance();
status.textContent = `Current will-change: ${getComputedStyle(box).willChange}`;
