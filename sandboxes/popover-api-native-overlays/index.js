import "./shared/playground.css";
import "./styles.css";

const log = document.getElementById("log");

// The native "toggle" event fires on any [popover] element whenever the browser shows/hides it —
// including light-dismiss (outside click, Esc), which never runs any of our own JS at all.
function logToggle(name) {
  return (event) => {
    log.textContent = `${name}: ${event.oldState} -> ${event.newState}`;
  };
}

document.getElementById("auto-popover").addEventListener("toggle", logToggle("auto popover"));
document.getElementById("manual-popover").addEventListener("toggle", logToggle("manual popover"));
