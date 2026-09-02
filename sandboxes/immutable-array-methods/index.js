import "./styles.css";

const original = [42, 17, 8, 23];
const originalList = document.getElementById("original");
const resultList = document.getElementById("result");

function renderList(el, items) {
  el.innerHTML = "";
  for (const item of items) {
    const li = document.createElement("li");
    li.textContent = item;
    el.appendChild(li);
  }
}

const OPERATIONS = {
  // Every one of these returns a NEW array — `original` is never touched.
  sort: () => original.toSorted((a, b) => a - b),
  reverse: () => original.toReversed(),
  with: () => original.with(1, 99),
  splice: () => original.toSpliced(0, 1),
  reset: () => original
};

for (const button of document.querySelectorAll("[data-op]")) {
  button.addEventListener("click", () => {
    const next = OPERATIONS[button.dataset.op]();
    console.log(`${button.dataset.op} →`, next, " | original still:", original);
    renderList(resultList, next);
    renderList(originalList, original); // re-rendered every click to prove it never moved
  });
}

renderList(originalList, original);
renderList(resultList, original);
