import "./shared/playground.css";
import "./styles.css";

const toggle = document.getElementById("breakout-toggle");
const banner = document.getElementById("banner");
const column = document.getElementById("column");
const readout = document.getElementById("readout");

function update() {
  const isFullBleed = banner.classList.contains("is-full-bleed");
  toggle.textContent = isFullBleed ? "Constrain to column" : "Break out to full width";

  const columnWidth = Math.round(column.getBoundingClientRect().width);
  const bannerWidth = Math.round(banner.getBoundingClientRect().width);

  readout.textContent = [
    `viewport width: ${window.innerWidth}px`,
    `column width:   ${columnWidth}px`,
    `banner width:   ${bannerWidth}px  ${isFullBleed ? "(full-bleed — matches the viewport)" : "(contained — matches the column)"}`,
  ].join("\n");
}

toggle.addEventListener("click", () => {
  banner.classList.toggle("is-full-bleed");
  update();
});

window.addEventListener("resize", update);

update();
