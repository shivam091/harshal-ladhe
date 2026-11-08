import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./styles.css";

const themes = document.getElementById("themes");
const themesReadout = document.getElementById("themes-readout");
const innermostText = document.getElementById("innermost-text");
const modeRadios = document.querySelectorAll("input[name='mode']");
const supportTip = document.getElementById("scope-support");

const donut = document.getElementById("donut");
const donutReadout = document.getElementById("donut-readout");
const limit = document.getElementById("limit");
const bioLink = donut.querySelector(".content a");

// Browsers with @scope expose the CSSScopeRule interface for it in the CSSOM.
const supportsScope = typeof CSSScopeRule !== "undefined";

// The light theme's text colour, as getComputedStyle reports it.
const LIGHT_INK = "rgb(15, 23, 42)";

const descriptions = {
  descendant:
    ".theme-light .text { ... }  /* (0,2,0) */\n.theme-dark .text  { ... }  /* (0,2,0), later in the file */\n\n" +
    "Same specificity, so source order decides: the dark rule wins inside ANY dark ancestor.",
  scope:
    "@scope (.theme-light) { p { ... } }  /* (0,0,1) */\n@scope (.theme-dark)  { p { ... } }  /* (0,0,1), later in the file */\n\n" +
    "Same specificity, so scope proximity decides: the nearest theme root wins.",
  specific:
    "@scope (.theme-light) { p     { ... } }  /* (0,0,1) */\n@scope (.theme-dark)  { .text { ... } }  /* (0,1,0) */\n\n" +
    "Specificity is compared before proximity, so the dark rule wins again.",
};

function updateThemes(mode) {
  themes.dataset.mode = mode;

  // Read back what the cascade actually chose for the innermost card's paragraph.
  const readable = getComputedStyle(innermostText).color === LIGHT_INK;
  const verdict = readable
    ? "Innermost light card: light theme colours (readable)."
    : "Innermost light card: dark theme colours leak in (pale text on a pale card).";

  themesReadout.textContent = `${descriptions[mode]}\n\n${verdict}`;
}

function updateDonut() {
  donut.classList.toggle("limited", limit.checked);

  const prelude = limit.checked ? "@scope (.profile) to (.content)" : "@scope (.profile)";
  const leaked = getComputedStyle(bioLink).borderRadius !== "0px";
  const verdict = leaked
    ? "The card's p and a rules reach into the bio: its link is a pill button and its text is uppercase."
    : ".content is a scoping limit, so the bio keeps its own default styles.";

  donutReadout.textContent = `${prelude} {\n  p { ... }\n  a { ... }\n}\n\n${verdict}`;
}

if (!supportsScope) {
  supportTip.hidden = false;
  for (const radio of modeRadios) {
    if (radio.value !== "descendant") radio.disabled = true;
  }
  limit.disabled = true;
}

for (const radio of modeRadios) {
  radio.addEventListener("change", () => updateThemes(radio.value));
}
limit.addEventListener("change", updateDonut);

updateThemes("descendant");

if (supportsScope) {
  updateDonut();
} else {
  donutReadout.textContent = "@scope isn't supported in this browser, so neither version of the profile card rules applies.";
}
