import "./shared/playground.css";
import "./shared/tabs.css";
import "./styles.css";
import { initTabs } from "./shared/tabs.js";

const content = document.getElementById("content");
const readout = document.getElementById("readout");
const viewportFrame = document.getElementById("viewport-frame");

// A couple of short lines — not enough on their own to fill the "viewport" frame, so .content's
// flex-grow is what's doing all the work of pushing the footer down to the bottom edge.
const SHORT_CONTENT = [
  "Just a couple of lines of page content.",
  "That's it — nothing else here."
];

// One paragraph, repeated enough times to overflow the fixed-height "viewport" frame — long
// enough that .content no longer needs flex-grow to reach the footer, it just gets there on its
// own, and the frame itself has to scroll to show the rest.
const LONG_PARAGRAPH =
  "This paragraph repeats a few times to stand in for a real page's worth of content, long enough that the footer no longer needs any help from flex-grow to end up below the fold.";
const LONG_REPEAT_COUNT = 7;

// Rebuilds .content's markup for the given mode ("short" | "long"), and resets the frame's scroll
// position back to the top so switching modes always starts from a clean, readable state.
function renderContent(mode) {
  const paragraphs = mode === "long"
    ? Array.from({ length: LONG_REPEAT_COUNT }, () => LONG_PARAGRAPH)
    : SHORT_CONTENT;

  content.innerHTML = paragraphs.map((text) => `<p>${text}</p>`).join("");
  viewportFrame.scrollTop = 0;
}

// Refreshes the readout to show the exact CSS pattern in play, plus a one-line note on which
// behavior it's currently producing — so the code and the visible result stay tied together.
function renderReadout(mode) {
  const behavior = mode === "long"
    ? "long content — .content already fills the space, footer sits below the fold, frame scrolls"
    : "short content — .content grows to fill leftover space, pushing the footer flush to the bottom";

  readout.textContent = `.page    { display: flex; flex-direction: column; min-height: 100vh; }
.content { flex: 1 0 auto; }
.footer  { flex-shrink: 0; }

/* ${behavior} */`;
}

function applyMode(mode) {
  renderContent(mode);
  renderReadout(mode);
}

initTabs(".tab", applyMode);

applyMode("short");
