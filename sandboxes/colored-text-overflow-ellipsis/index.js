import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./shared/range-slider.css";
import "./styles.css";
import { updateRangeSlider } from "./shared/range-slider.js";

const $ = (id) => document.getElementById(id);
const cards = $("cards");
const titles = [...cards.querySelectorAll(".card-title")];

// The checked value of a radio group, so each update reads the controls' current state.
const checked = (name) => document.querySelector(`input[name='${name}']:checked`).value;

// A one-line title overflows sideways and a clamped one downwards, so each is measured along its own axis.
function isTruncated(title, clamped) {
  return clamped ? title.scrollHeight > title.clientHeight : title.scrollWidth > title.clientWidth;
}

// The CSS the current controls amount to, so the readout always matches what's on screen.
function cssFor(accent, clamped, shrinkable) {
  const body = shrinkable ? "  min-inline-size: 0;" : "  /* min-inline-size: auto — can't shrink */";
  const truncate = clamped
    ? "  display: -webkit-box;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 2;\n  overflow: hidden;"
    : "  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;";
  const colour = accent ? "var(--accent); /* the dots */" : "var(--text);";

  return `.card-body {\n  flex: 1;\n${body}\n}\n\n.card-title {\n${truncate}\n  color: ${colour}\n}\n\n.card-title > span {\n  color: var(--text); /* the text */\n}`;
}

/*
  Truncation is measured after the layout changes, and the full text goes in a title attribute only on titles that
  are cut off, so titles that fit don't repeat themselves on hover.
*/
function update() {
  const accent = checked("colour") === "accent";
  const clamped = checked("lines") === "2";
  const shrinkable = $("shrink-toggle").checked;

  cards.classList.toggle("is-accent", accent);
  cards.classList.toggle("is-clamped", clamped);
  cards.classList.toggle("is-unshrinkable", !shrinkable);
  cards.style.setProperty("--card-width", `${$("width-input").value}rem`);
  updateRangeSlider($("width-input"), $("width-value"), (value) => `${value}rem`);

  let truncated = 0;
  for (const title of titles) {
    const cut = isTruncated(title, clamped);
    if (cut) truncated += 1;
    title.toggleAttribute("title", cut);
    if (cut) title.title = title.textContent;
  }

  $("readout").textContent = `${truncated} of ${titles.length} titles truncated\n\n${cssFor(accent, clamped, shrinkable)}`;
}

document.querySelectorAll("input[name='colour'], input[name='lines']").forEach((radio) => radio.addEventListener("change", update));
$("width-input").addEventListener("input", update);
$("shrink-toggle").addEventListener("change", update);
// The cards also narrow when the preview pane does, which changes which titles are cut off.
new ResizeObserver(update).observe(cards);
update();
