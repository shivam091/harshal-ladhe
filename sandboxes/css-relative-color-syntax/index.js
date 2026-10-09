import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./shared/range-slider.css";
import "./styles.css";
import { updateRangeSlider } from "./shared/range-slider.js";

const $ = (id) => document.getElementById(id);
const playground = $("playground");

// Without support every swatch shows the plain brand colour, so the note says so rather than letting it look broken.
$("support-note").hidden = CSS.supports("color", "oklch(from red l c h)");

const SPACE_TIPS = {
  oklch: "oklch() lightness matches how bright a colour looks, so the lighter and darker swatches move by the same visible amount for any brand colour.",
  hsl: "hsl() lightness is maths on the RGB values, not perceived brightness. Try a yellow and then a blue: the same step looks very different."
};

function update() {
  const space = document.querySelector("input[name='space']:checked").value;

  // The only things JS changes: four custom properties and one attribute. Each swatch's colour comes from the CSS.
  playground.style.setProperty("--brand", $("brand-input").value);
  playground.style.setProperty("--step", $("step-input").value);
  playground.style.setProperty("--hue-shift", $("hue-input").value);
  playground.style.setProperty("--alpha", `${$("alpha-input").value}%`);
  playground.dataset.space = space;

  updateRangeSlider($("step-input"), $("step-value"));
  updateRangeSlider($("hue-input"), $("hue-value"));
  updateRangeSlider($("alpha-input"), $("alpha-value"), (value) => `${value}%`);

  $("space-tip").textContent = SPACE_TIPS[space];

  // Computed values show what the browser resolved each relative colour to.
  $("readout").textContent = [...document.querySelectorAll(".swatch")]
    .map((swatch) => `${swatch.textContent.padEnd(15)} ${getComputedStyle(swatch).backgroundColor}`)
    .join("\n");
}

document.querySelectorAll("input").forEach((input) => input.addEventListener("input", update));
update();
