import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./styles.css";

const $ = (id) => document.getElementById(id);
const specimens = $("specimens");

// Without support nothing moves, so the note says why rather than letting the demo look broken.
$("support-note").hidden = CSS.supports("text-box", "trim-both cap alphabetic");

const checked = (name) => document.querySelector(`input[name='${name}']:checked`).value;

function update() {
  const trim = checked("trim");
  const edge = `${checked("over")} ${checked("under")}`;
  const textBox = trim === "none" ? "normal" : `${trim} ${edge}`;

  // One custom property feeds every trimmed element, so all three examples always agree.
  specimens.style.setProperty("--text-box", textBox);
  specimens.classList.toggle("show-outlines", $("outline-toggle").checked);
  $("edge-group").classList.toggle("is-inactive", trim === "none");

  $("readout").textContent = trim === "none"
    ? ".trimmed {\n  text-box: normal; /* no trimming */\n}"
    : `.trimmed {\n  text-box: ${textBox};\n\n  /* the same as */\n  text-box-trim: ${trim};\n  text-box-edge: ${edge};\n}`;
}

document.querySelectorAll("input").forEach((input) => input.addEventListener("change", update));
update();
