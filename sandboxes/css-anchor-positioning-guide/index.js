import "./shared/playground.css";
import "./styles.css";

const stage = document.getElementById("stage");
const anchor = document.getElementById("anchor");
const tooltip = document.getElementById("tooltip");
const readout = document.getElementById("readout");
const unsupported = document.getElementById("unsupported");
const areaSelect = document.getElementById("area-select");
const fallbackSelect = document.getElementById("fallback-select");

const KEY_STEP = 8;

// Feature-detecting rather than sniffing the browser means the notice appears only where the CSS is genuinely ignored.
const supported = CSS.supports("position-anchor", "--a");

// A drag that escapes the stage would leave the anchor unreachable, so every position is held inside it.
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Only the anchor moves, because the tooltip follows its box, so there is no position maths to do for the tooltip.
function moveAnchor(left, top) {
  const maxLeft = stage.clientWidth - anchor.offsetWidth;
  const maxTop = stage.clientHeight - anchor.offsetHeight;

  anchor.style.insetInlineStart = `${clamp(left, 0, maxLeft)}px`;
  anchor.style.insetBlockStart = `${clamp(top, 0, maxTop)}px`;
}

// The picker shows what was requested, not where the tooltip landed, so a flipped fallback needs its own description.
function describePlacement() {
  const a = anchor.getBoundingClientRect();
  const t = tooltip.getBoundingClientRect();

  const vertical = t.bottom <= a.top + 1 ? "above" : t.top >= a.bottom - 1 ? "below" : "level with";
  const horizontal = t.right <= a.left + 1 ? "left of" : t.left >= a.right - 1 ? "right of" : "overlapping";

  return horizontal === "overlapping" ? `${vertical} the anchor` : `${vertical}, ${horizontal} the anchor`;
}

// Reading the controls in one place stops the read-out and the live tooltip from ever disagreeing.
function update() {
  const area = areaSelect.value;
  const fallbacks = fallbackSelect.value;

  tooltip.style.setProperty("position-area", area);
  tooltip.style.setProperty("position-try-fallbacks", fallbacks);

  const css = `.anchor {
  anchor-name: --anchor;
}

.tooltip {
  position: absolute;
  position-anchor: --anchor;
  position-area: ${area};
  position-try-fallbacks: ${fallbacks};
}`;

  readout.textContent = supported
    ? `${css}\n\n/* Rendered: ${describePlacement()} */`
    : css;
}

// Starts a drag by remembering where inside the anchor the pointer grabbed it, so it doesn't jump to the pointer's corner.
function startDrag(event) {
  const rect = anchor.getBoundingClientRect();
  const offsetX = event.clientX - rect.left;
  const offsetY = event.clientY - rect.top;

  anchor.setPointerCapture(event.pointerId);

  // Reads the stage's box fresh on each move so scrolling the page mid-drag stays accurate.
  function onMove(moveEvent) {
    const stageRect = stage.getBoundingClientRect();
    moveAnchor(moveEvent.clientX - stageRect.left - offsetX, moveEvent.clientY - stageRect.top - offsetY);
    update();
  }

  // Releases the capture and listeners together so a finished drag leaves nothing behind.
  function onUp() {
    anchor.removeEventListener("pointermove", onMove);
    anchor.removeEventListener("pointerup", onUp);
    anchor.removeEventListener("pointercancel", onUp);
  }

  anchor.addEventListener("pointermove", onMove);
  anchor.addEventListener("pointerup", onUp);
  anchor.addEventListener("pointercancel", onUp);
}

// Arrow keys give keyboard users the same drag, since a pointer-only demo would exclude them.
function onKeyDown(event) {
  const moves = {
    ArrowLeft: [-KEY_STEP, 0],
    ArrowRight: [KEY_STEP, 0],
    ArrowUp: [0, -KEY_STEP],
    ArrowDown: [0, KEY_STEP],
  };
  const move = moves[event.key];

  if (!move) return;

  event.preventDefault();
  moveAnchor(anchor.offsetLeft + move[0], anchor.offsetTop + move[1]);
  update();
}

anchor.addEventListener("pointerdown", startDrag);
anchor.addEventListener("keydown", onKeyDown);
areaSelect.addEventListener("change", update);
fallbackSelect.addEventListener("change", update);

// Keeps the anchor inside the stage if the preview is resized (e.g. rotating a phone).
window.addEventListener("resize", () => {
  moveAnchor(anchor.offsetLeft, anchor.offsetTop);
  update();
});

if (!supported) {
  unsupported.hidden = false;
  tooltip.hidden = true;
}

update();
