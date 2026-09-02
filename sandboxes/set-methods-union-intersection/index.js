import "./styles.css";

const yourRoles = new Set(["editor", "reviewer", "billing"]);
const requiredRoles = new Set(["editor", "admin"]);

function renderChips(containerId, set) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  for (const value of set) {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.textContent = value;
    container.appendChild(chip);
  }
}

renderChips("set-a", yourRoles);
renderChips("set-b", requiredRoles);

const result = document.getElementById("result");

const OPERATIONS = {
  // Every one of these is a native Set method — no [...a, ...b] spreading into an array first.
  union: () => yourRoles.union(requiredRoles),
  intersection: () => yourRoles.intersection(requiredRoles),
  difference: () => yourRoles.difference(requiredRoles),
  symmetricDifference: () => yourRoles.symmetricDifference(requiredRoles),
  isSubsetOf: () => requiredRoles.isSubsetOf(yourRoles)
};

for (const button of document.querySelectorAll("[data-op]")) {
  button.addEventListener("click", () => {
    const op = button.dataset.op;
    const value = OPERATIONS[op]();
    console.log(`yourRoles.${op}(requiredRoles) →`, value);

    result.textContent =
      value instanceof Set
        ? `{ ${[...value].join(", ") || "∅"} }`
        : `${value} — you ${value ? "have every role required for this page" : "are missing at least one required role"}`;
  });
}
