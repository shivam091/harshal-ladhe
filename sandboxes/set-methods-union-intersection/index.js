import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./styles.css";

const $ = (id) => document.getElementById(id);
const supported = typeof Set.prototype.union === "function";

// Without support the fallback below takes over, so the note says the results aren't from the native methods.
$("support-note").hidden = supported;

const ROLES = ["editor", "reviewer", "billing", "admin", "auditor"];
const START_YOURS = ["editor", "reviewer", "billing"];
const START_REQUIRED = ["editor", "admin"];

/*
  Each method has its native call, the array pattern it replaces (used only where the methods
  are missing) and a plain-English reading of the result. The call is always yours.method(required).
*/
const METHODS = {
  union: {
    label: "Everything in either set",
    native: (a, b) => a.union(b),
    fallback: (a, b) => new Set([...a, ...b]),
    explain: () => "Every role you hold or the page requires, with no duplicates."
  },
  intersection: {
    label: "Only what's in both",
    native: (a, b) => a.intersection(b),
    fallback: (a, b) => new Set([...a].filter((role) => b.has(role))),
    explain: () => "The roles you hold that the page also requires."
  },
  difference: {
    label: "In yours, but not required",
    native: (a, b) => a.difference(b),
    fallback: (a, b) => new Set([...a].filter((role) => !b.has(role))),
    explain: () => "The roles you hold that the page doesn't ask for. Swap the sets to see what you're missing instead."
  },
  symmetricDifference: {
    label: "In exactly one of the two",
    native: (a, b) => a.symmetricDifference(b),
    fallback: (a, b) => new Set([...[...a].filter((role) => !b.has(role)), ...[...b].filter((role) => !a.has(role))]),
    explain: () => "Roles held by only one side: either extra roles you have, or required roles you lack."
  },
  isSubsetOf: {
    label: "Every role of yours is required",
    native: (a, b) => a.isSubsetOf(b),
    fallback: (a, b) => [...a].every((role) => b.has(role)),
    explain: (result) => result
      ? "Every role you hold is required: you have nothing extra. An empty set is a subset of everything."
      : "You hold at least one role the page doesn't require."
  },
  isSupersetOf: {
    label: "You hold every required role",
    native: (a, b) => a.isSupersetOf(b),
    fallback: (a, b) => [...b].every((role) => a.has(role)),
    explain: (result) => result
      ? "You hold every required role, so the permission check passes."
      : "At least one required role is missing, so the permission check fails."
  },
  isDisjointFrom: {
    label: "No roles in common",
    native: (a, b) => a.isDisjointFrom(b),
    fallback: (a, b) => [...a].every((role) => !b.has(role)),
    explain: (result) => result
      ? "You share no roles with the requirement."
      : "You share at least one role with the requirement."
  }
};

// Builds the two role pickers from the same list, so the sets are always read back from what's ticked.
function renderRolePicker(containerId, name, selected) {
  $(containerId).innerHTML = ROLES.map((role) => `
    <label class="chip">
      <input type="checkbox" name="${name}" value="${role}" ${selected.includes(role) ? "checked" : ""}>
      <span>${role}</span>
    </label>`).join("");
}

// A real Set built from the ticked boxes, so the methods run on exactly what the reader chose.
function readSet(name) {
  return new Set([...document.querySelectorAll(`input[name='${name}']:checked`)].map((input) => input.value));
}

// Mirrors how the console prints a Set, so the readout matches what the tutorial's code comments show.
function formatSet(set) {
  return `Set(${set.size}) {${[...set].map((role) => `"${role}"`).join(", ")}}`;
}

$("method-picker").innerHTML = Object.entries(METHODS).map(([name, method], index) => `
  <label class="segment">
    <input type="radio" name="method" value="${name}" ${index === 0 ? "checked" : ""}>
    <span>${name}</span>
  </label>`).join("");

renderRolePicker("your-roles", "yours", START_YOURS);
renderRolePicker("required-roles", "required", START_REQUIRED);

function update() {
  const name = document.querySelector("input[name='method']:checked").value;
  const method = METHODS[name];
  const yours = readSet("yours");
  const required = readSet("required");
  const result = (supported ? method.native : method.fallback)(yours, required);

  $("result-label").textContent = method.label;
  $("tip").textContent = method.explain(result);

  if (typeof result === "boolean") {
    $("result").innerHTML = `<span class="result-text">${result}</span>`;
  } else if (result.size === 0) {
    $("result").innerHTML = `<span class="result-text">∅ (an empty set)</span>`;
  } else {
    $("result").innerHTML = [...result].map((role) => `<span class="result-chip">${role}</span>`).join("");
  }

  $("readout").textContent = [
    `yourRoles.${name}(requiredRoles)`,
    `// yourRoles     → ${formatSet(yours)}`,
    `// requiredRoles → ${formatSet(required)}`,
    `// result        → ${typeof result === "boolean" ? result : formatSet(result)}${supported ? "" : "  (array fallback)"}`
  ].join("\n");
}

document.querySelectorAll("input").forEach((input) => input.addEventListener("input", update));
update();
