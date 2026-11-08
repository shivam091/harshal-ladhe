import "./shared/playground.css";
import "./styles.css";

const $ = (id) => document.getElementById(id);

const scroller = $("scroller");
const progressBar = scroller.querySelector(".progress");
const cards = [...scroller.querySelectorAll(".card")];
const controls = ["timeline-select", "start-name", "start-offset", "end-name", "end-offset", "reset-btn"].map($);

const supported = CSS.supports("animation-timeline: scroll()");

// Clamps a number input to 0–100 so a typed "250" can't produce an invalid animation-range.
function readOffset(input) {
  const value = Number(input.value);
  return Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
}

/*
  A timeline's currentTime is a CSSUnitValue percentage (e.g. { value: 42, unit: "percent" }) where CSS Typed OM
  is available. Read it defensively so the readout still works in a browser that hands back something else.
*/
function toPercent(time) {
  if (time == null) return "inactive";
  const value = typeof time === "number" ? time : time.value;
  return typeof value === "number" ? `${value.toFixed(0)}%` : String(time);
}

// Builds the two values from the controls. Range names only exist on view progress timelines.
function currentSettings() {
  const timeline = $("timeline-select").value;
  const start = readOffset($("start-offset"));
  const end = readOffset($("end-offset"));
  const isView = timeline.startsWith("view");

  const range = isView
    ? `${$("start-name").value} ${start}% ${$("end-name").value} ${end}%`
    : `${start}% ${end}%`;

  return { timeline, range, isView };
}

function applySettings() {
  const { timeline, range, isView } = currentSettings();

  scroller.style.setProperty("--card-timeline", timeline);
  scroller.style.setProperty("--card-range", range);

  $("start-name").disabled = !isView || !supported;
  $("end-name").disabled = !isView || !supported;
  $("range-hint").hidden = isView;

  updateReadout();
}

function updateReadout() {
  const { timeline, range } = currentSettings();
  const lines = [
    ".card {",
    "  animation: card-reveal linear both;",
    `  animation-timeline: ${timeline};`,
    `  animation-range: ${range};`,
    "}",
    ""
  ];

  if (!supported) {
    lines.push("Scroll-driven animations aren't supported here, so the cards are static.");
    $("readout").textContent = lines.join("\n");
    return;
  }

  // Plain checks instead of `?.`: Sandpack's bundler doesn't parse optional chaining.
  const barAnimation = progressBar.getAnimations()[0];
  const barTimeline = barAnimation && barAnimation.timeline;
  lines.push(`Panel scroll progress (scroll timeline): ${toPercent(barTimeline && barTimeline.currentTime)}`);

  // Card 1 and card 3, so you can compare two cards on different view timelines.
  for (const index of [0, 2]) {
    const animation = cards[index].getAnimations()[0];
    if (!animation) continue;

    const progress = animation.effect.getComputedTiming().progress;
    const shown = progress == null ? "not applied" : `${Math.round(progress * 100)}%`;
    lines.push(`Card ${index + 1}: timeline ${toPercent(animation.timeline && animation.timeline.currentTime)}, animation ${shown}`);
  }

  $("readout").textContent = lines.join("\n");
}

// The animations themselves need no JavaScript; this only keeps the readout in step, once per frame at most.
let frame = 0;
function scheduleReadout() {
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    updateReadout();
  });
}

function reset() {
  $("timeline-select").value = "view()";
  $("start-name").value = "entry";
  $("end-name").value = "entry";
  $("start-offset").value = "0";
  $("end-offset").value = "100";
  applySettings();
}

if (!supported) {
  $("support-tip").hidden = false;
  controls.forEach((control) => {
    control.disabled = true;
  });
}

["timeline-select", "start-name", "end-name"].forEach((id) => $(id).addEventListener("change", applySettings));
["start-offset", "end-offset"].forEach((id) => $(id).addEventListener("input", applySettings));
$("reset-btn").addEventListener("click", reset);
scroller.addEventListener("scroll", scheduleReadout, { passive: true });

applySettings();
// The timelines get their first value during the next rendering update, so read them once more after it.
requestAnimationFrame(() => requestAnimationFrame(updateReadout));
