import "./shared/playground.css";
import "./styles.css";

const fileCol = document.getElementById("file-col");
const toggle = document.getElementById("fix-toggle");
const readout = document.getElementById("readout");

// Applies (or removes) the real min-width: 0 rule on the flex item via a class toggle, then reads
// the actual computed min-width back out of the browser (not a JS-tracked value) so the readout
// reflects genuine layout state — the same number DevTools' Computed panel would show.
function update() {
  const fixed = toggle.checked;

  fileCol.classList.toggle("demo-col--fixed", fixed);

  const computedMinWidth = getComputedStyle(fileCol).minWidth;

  readout.textContent = fixed
    ? `.file-column {
  min-width: 0; /* overrides the initial "auto" */
}

Computed min-width: ${computedMinWidth}

The floor is gone, so flex-shrink can now shrink this column down to its fair 1/3 share of the row. The filename truncates with an ellipsis, and its siblings get their space back.`
    : `.file-column {
  /* min-width left unset — the initial value is "auto" */
}

Computed min-width: ${computedMinWidth}

"auto" resolves to this column's min-content size: the full width of the unbroken filename. flex-shrink cannot push the column below that floor, so the 420px row overflows instead of shrinking to fit.`;
}

toggle.addEventListener("change", update);

update();
