import "./shared/playground.css";
import "./styles.css";

const $ = (id) => document.getElementById(id);
const select = $("colour-select");

// Each option's swatch colour, so the preview button can wear whichever one is chosen.
const COLOURS = {
  indigo: "#818cf8",
  teal: "#2dd4bf",
  amber: "#fbbf24",
  rose: "#fb7185",
  lime: "#a3e635"
};

// Without support the options are plain text, so the note says why rather than letting the demo look broken.
$("support-note").hidden = CSS.supports("appearance", "base-select");

// The CSS the current toggles amount to, so the readout always matches what's on screen.
function cssFor(custom, animated) {
  if (!custom) return "select {\n  /* the default: only the closed box can be styled */\n}";

  const optIn = "select,\n::picker(select) {\n  appearance: base-select;\n}";
  if (!animated) return optIn;

  return `${optIn}\n\n::picker(select) {\n  transition: opacity 0.2s, translate 0.2s,\n    display 0.2s allow-discrete, overlay 0.2s allow-discrete;\n}\n\n:not(:open)::picker(select) {\n  opacity: 0;\n  translate: 0 -0.5rem;\n}\n\n@starting-style {\n  :open::picker(select) {\n    opacity: 0;\n    translate: 0 -0.5rem;\n  }\n}`;
}

function update() {
  const custom = $("custom-toggle").checked;
  const animated = custom && $("animate-toggle").checked;

  select.classList.toggle("is-custom", custom);
  select.classList.toggle("is-animated", animated);
  $("animate-toggle").disabled = !custom;
  $("preview-button").style.setProperty("--accent", COLOURS[select.value]);
  $("readout").textContent = `Selected value: "${select.value}"\n\n${cssFor(custom, animated)}`;
}

$("custom-toggle").addEventListener("change", update);
$("animate-toggle").addEventListener("change", update);
select.addEventListener("change", update);
update();
