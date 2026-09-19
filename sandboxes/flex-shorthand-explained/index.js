import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./styles.css";

const preview = document.getElementById("flex-preview");
const output = document.getElementById("flex-output");
const modeRadios = document.querySelectorAll("input[name='flex-mode']");

// Nav items with deliberately different text lengths — "Home" vs "Contact and Support" — so the
// equal-width (flex: 1) vs content-proportional (flex: auto) difference is visible at a glance,
// not just in the numbers.
const items = [0, 1, 2].map((i) => ({
  el: document.getElementById(`item-${i}`),
  widthLabel: document.getElementById(`item-${i}-width`),
}));

// Applies the selected shorthand as REAL CSS on every item, then reads back each item's rendered
// width from the DOM via getBoundingClientRect() — the browser's flexbox engine does the sizing,
// nothing here is precomputed. That's the whole point: flex: 1 and flex: auto both set
// flex-grow: 1 and flex-shrink: 1, so only a live measurement makes their differing basis visible.
function render() {
  const mode = document.querySelector("input[name='flex-mode']:checked").value;
  const isEqual = mode === "one";
  const flexValue = isEqual ? "1 1 0%" : "1 1 auto";

  items.forEach((item) => {
    item.el.style.flex = flexValue;
  });

  // Layout is synchronous, so by this point the browser has already resolved every item's main
  // size — this reads the real computed result, not a guess.
  const measured = items.map((item) => {
    const width = Math.round(item.el.getBoundingClientRect().width);
    item.widthLabel.textContent = `${width}px`;
    return width;
  });

  const allEqual = measured.every((w) => w === measured[0]);

  output.textContent = `.flex-item {
  flex: ${flexValue}; /* ${isEqual ? "flex: 1" : "flex: auto"} */
}

Home:                  ${measured[0]}px
About Us:              ${measured[1]}px
Contact and Support:   ${measured[2]}px

${
  isEqual
    ? `Basis 0% ignores content size → widths are ${allEqual ? "identical" : "forced equal"}, regardless of label length.`
    : `Basis auto starts from each item's own content size → widths stay proportional to how much text each one holds.`
}`;
}

modeRadios.forEach((radio) => radio.addEventListener("change", render));
window.addEventListener("resize", render);

render();
