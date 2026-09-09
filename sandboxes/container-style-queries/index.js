import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./styles.css";

const frame = document.getElementById("card-frame");
const badge = document.querySelector(".badge");
const readout = document.getElementById("readout");

const BADGE_TEXT = { default: "", featured: "Featured", urgent: "Urgent" };

function update() {
  const variant = document.querySelector("input[name='variant']:checked").value;

  // The card/badge styling reacts to THIS custom property via @container style() — nothing else
  // changes on the card itself, no class is ever added to it or to the badge.
  frame.style.setProperty("--variant", variant);
  badge.textContent = BADGE_TEXT[variant];

  readout.textContent = `--variant: ${variant}`;
}

document.querySelectorAll("input[name='variant']").forEach((radio) =>
  radio.addEventListener("change", update)
);

update();
