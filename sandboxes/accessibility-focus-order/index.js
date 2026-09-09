import "./shared/playground.css";
import "./styles.css";

const readout = document.getElementById("readout");

// Describes whatever just received focus — purely for the live readout. Tab order itself is
// never touched by this file; it's already correct because the markup declares the skip link
// first, the nav links next, then main's content, in plain DOM order with no positive tabindex.
function describeFocus(target) {
  if (!target || target === document.body) return "(nothing focused yet — press Tab)";
  const label = target.textContent?.trim() || target.id || target.tagName.toLowerCase();
  return `focused: <${target.tagName.toLowerCase()}> "${label}"`;
}

document.addEventListener("focusin", (event) => {
  readout.textContent = describeFocus(event.target);
});

readout.textContent = describeFocus(null);
