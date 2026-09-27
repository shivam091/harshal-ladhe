import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./styles.css";

const card = document.getElementById("card");
const badge = document.getElementById("badge");
const readout = document.getElementById("readout");
const radios = document.querySelectorAll("input[name='priority']");

// Without support every priority renders the same gray, so say so rather than let the demo look broken.
const supportsIf = CSS.supports("color", "if(else: red)");

function update(priority) {
  // The only thing JS ever touches: one custom property. Which color that produces is entirely
  // the stylesheet's decision, via `if(style(--priority: ...))`.
  if (priority === "none") {
    card.style.removeProperty("--priority");
  } else {
    card.style.setProperty("--priority", priority);
  }
  badge.textContent = `Priority: ${priority}`;

  const property = priority === "none" ? "/* --priority not set */" : `--priority: ${priority};`;
  const support = supportsIf
    ? "if() supported: yes, so the color comes from the matching branch."
    : "if() supported: no, so every priority keeps the plain gray fallback declared before it.";
  readout.textContent = `.card { ${property} }\n\n${support}`;
}

for (const radio of radios) {
  radio.addEventListener("change", () => update(radio.value));
}

update("none");
