import "./shared/playground.css";
import "./styles.css";

const ROW_COUNT = 800;
const list = document.getElementById("list");
const toggle = document.getElementById("cv-toggle");
const measureBtn = document.getElementById("measure-btn");
const readout = document.getElementById("readout");

// Builds ROW_COUNT rows up front so the "before" measurement reflects the SAME DOM the "after"
// one does — only the content-visibility class differs between runs, nothing else.
function buildRows() {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < ROW_COUNT; i++) {
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `
      <div class="row-badge"></div>
      <div class="row-text">
        <p class="row-title">Row ${i + 1}</p>
        <p class="row-meta">Off-screen rows are skipped entirely while content-visibility is on.</p>
      </div>
    `;
    fragment.appendChild(row);
  }
  list.appendChild(fragment);
}

function applyMode() {
  list.classList.toggle("cv-on", toggle.checked);
}

// Reading offsetTop forces the browser to resolve layout for every row synchronously — the exact
// moment content-visibility: auto pays off, by skipping that work for every row off-screen.
function measureLayout() {
  const rows = list.querySelectorAll(".row");
  const start = performance.now();
  let total = 0;
  rows.forEach((row) => {
    total += row.offsetTop;
  });
  const elapsed = performance.now() - start;

  readout.textContent = [
    `content-visibility: ${toggle.checked ? "auto" : "visible (default)"}`,
    `${ROW_COUNT} rows, forced layout in ${elapsed.toFixed(2)}ms`,
    `(checksum ${total} — just here to stop the loop above from being optimized away)`,
  ].join("\n");
}

toggle.addEventListener("change", applyMode);
measureBtn.addEventListener("click", measureLayout);

buildRows();
applyMode();
