import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./shared/range-slider.css";
import "./styles.css";
import { updateRangeSlider } from "./shared/range-slider.js";

const $ = (id) => document.getElementById(id);

// Typed attr() and the classic form share a name, so support is tested on a non-content property.
$("support-note").hidden = CSS.supports("width", "attr(data-x type(<length>), 0px)");

function update() {
  const progress = $("progress-input").value;
  const columns = $("columns-input").value;
  const angle = `${$("angle-input").value}deg`;
  const colour = document.querySelector("input[name='colour']:checked").value;

  // The only thing JavaScript does: write attributes. Every visual change comes from attr() in the CSS.
  $("meter").setAttribute("data-progress", progress);
  $("meter").setAttribute("aria-label", `${progress}% complete`);
  $("tag").setAttribute("data-colour", colour);
  $("gallery").setAttribute("data-columns", columns);
  $("dial").setAttribute("data-angle", angle);

  updateRangeSlider($("progress-input"), $("progress-value"));
  updateRangeSlider($("columns-input"), $("columns-value"));
  updateRangeSlider($("angle-input"), $("angle-value"), (value) => `${value}deg`);

  $("colour-tip").textContent = colour === "not-a-colour"
    ? "\"not-a-colour\" doesn't parse as a <color>, so attr() uses its fallback: the playground's indigo."
    : "Any valid CSS colour works — hex, a named colour or oklch() — because the value is parsed as <color>.";

  $("readout").textContent = [
    `<div class="meter" data-progress="${progress}"></div>`,
    `<span class="tag" data-colour="${colour}">Design system</span>`,
    `<ul class="gallery" data-columns="${columns}">…</ul>`,
    `<div class="dial" data-angle="${angle}"></div>`
  ].join("\n");
}

document.querySelectorAll("input").forEach((input) => input.addEventListener("input", update));
update();
