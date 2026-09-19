import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./styles.css";

const cardRow = document.getElementById("card-row");
const readout = document.getElementById("readout");
const alignItemsRadios = document.querySelectorAll("input[name='align-items']");

// Applies the selected align-items value to the live row and refreshes the CSS readout — the
// button-position difference (lined up vs. staggered) comes for free from the browser's own
// layout, no measuring or simulation needed.
function updateAlignItems() {
  const alignItems = document.querySelector("input[name='align-items']:checked").value;

  cardRow.style.alignItems = alignItems;

  readout.textContent = `.card-row {
  display: flex;
  gap: 1rem;
  align-items: ${alignItems};
}`;
}

alignItemsRadios.forEach((radio) => radio.addEventListener("change", updateAlignItems));

updateAlignItems();
