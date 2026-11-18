import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./styles.css";

// Every control is looked up by id, and a short alias keeps those lookups readable.
const $ = (id) => document.getElementById(id);
// Feature detection decides whether to show the real method or the stand-in, since support differs by browser.
const hasNative = typeof Iterator !== "undefined" && typeof Iterator.zip === "function" && typeof Iterator.zipKeyed === "function";

$("badge").dataset.source = hasNative ? "native" : "fallback";
$("badge").textContent = hasNative ? "native Iterator.zip()" : "fallback: generator stand-in";

// The tip under the mode picker must describe the selected mode in the same words as the tutorial.
const MODES = {
  shortest: "Stops as soon as any list runs out. The other lists are closed.",
  longest: "Carries on until every list runs out. Gaps take the padding value for that list, or undefined.",
  strict: "Every list must be the same length. If one finishes early, a TypeError is thrown."
};

/*
  Browsers without Iterator.zip would otherwise show nothing, and the demo is about the mode, padding and closing
  rules, so this stand-in reproduces those rules rather than just the happy path.
*/
function* fallbackZip(iterables, { mode = "shortest", padding } = {}) {
  const iterators = [...iterables].map((iterable) => iterable[Symbol.iterator]());
  const pads = mode === "longest" ? [...(padding ?? [])] : [];
  const done = iterators.map(() => false);

  try {
    while (iterators.length > 0) {
      const row = [];
      let finished = 0;

      for (let i = 0; i < iterators.length; i++) {
        const result = done[i] ? { done: true } : iterators[i].next();
        if (result.done) {
          done[i] = true;
          finished++;
          row.push(pads[i]);
        } else {
          row.push(result.value);
        }
        // The native method stops at the first exhausted list, and advancing the others would consume values it never reads.
        if (mode === "shortest" && finished > 0) return;
      }

      if (finished === iterators.length) return;
      if (finished > 0 && mode === "strict") throw new TypeError("Iterator.zip: the iterables did not all finish at the same time (fallback)");
      yield row;
    }
  } finally {
    // An open list may hold a resource (a generator's finally block, say), and native zip releases it when it stops.
    iterators.forEach((iterator, i) => { if (!done[i]) iterator.return?.(); });
  }
}

// Both shapes must follow identical mode and padding rules, so they share one implementation instead of two copies that could drift.
function* fallbackZipKeyed(object, { mode, padding } = {}) {
  const keys = Object.keys(object);
  const arrayPadding = padding ? keys.map((key) => padding[key]) : undefined;
  for (const row of fallbackZip(keys.map((key) => object[key]), { mode, padding: arrayPadding })) {
    yield Object.fromEntries(keys.map((key, i) => [key, row[i]]));
  }
}

// One call site for the demo means the native and fallback paths cannot behave differently by accident.
const zip = hasNative ? (...args) => Iterator.zip(...args) : fallbackZip;
// Same reason as zip: the demo code never needs to know which implementation it got.
const zipKeyed = hasNative ? (...args) => Iterator.zipKeyed(...args) : fallbackZipKeyed;

// Numbers must stay numbers so the output matches the tutorial's examples, but only plain decimals: Number() would also turn 0x1F or 1e3 into surprises.
function parseList(text) {
  return text.split(",").map((part) => part.trim()).filter((part) => part !== "").map((part) => (/^-?\d+(\.\d+)?$/.test(part) ? Number(part) : part));
}

// A padded gap is the interesting part of longest mode, so undefined and strings must be visibly distinct from each other and from numbers.
const show = (value) => (value === undefined ? "undefined" : typeof value === "string" ? `"${value}"` : JSON.stringify(value));

// Rows yielded before a strict-mode TypeError are part of what the lesson shows, so the error must not discard them.
function collect(createIterator) {
  const rows = [];
  let error = null;
  try {
    for (const row of createIterator()) rows.push(row);
  } catch (caught) {
    error = caught;
  }
  return { rows, error };
}

$("mode-picker").innerHTML = Object.keys(MODES).map((name, index) => `
  <label class="segment">
    <input type="radio" name="mode" value="${name}" ${index === 0 ? "checked" : ""}>
    <span>${name}</span>
  </label>`).join("");

// Every input affects both outputs, so a single redraw keeps the two views and the summary consistent.
function update() {
  const mode = document.querySelector("input[name='mode']:checked").value;
  const lists = { names: parseList($("list-names").value), scores: parseList($("list-scores").value) };
  if ($("use-third").checked) lists.tags = parseList($("list-tags").value);
  $("list-tags").disabled = !$("use-third").checked;

  const keys = Object.keys(lists);
  const paddingValues = parseList($("padding").value);
  const options = mode === "longest"
    ? { mode, padding: paddingValues }
    : { mode };
  const keyedOptions = mode === "longest"
    ? { mode, padding: Object.fromEntries(keys.map((key, i) => [key, paddingValues[i]])) }
    : { mode };

  $("padding-field").hidden = mode !== "longest";
  $("tip").textContent = MODES[mode];

  const arrays = collect(() => zip(keys.map((key) => lists[key]), options));
  const keyed = collect(() => zipKeyed(lists, keyedOptions));

  $("zip-rows").textContent = arrays.rows.length ? arrays.rows.map((row) => `[${row.map(show).join(", ")}]`).join("\n") : "(no steps)";
  $("keyed-rows").textContent = keyed.rows.length
    ? keyed.rows.map((row) => `{ ${Object.entries(row).map(([key, value]) => `${key}: ${show(value)}`).join(", ")} }`).join("\n")
    : "(no steps)";

  const error = arrays.error ?? keyed.error;
  $("error").hidden = !error;
  if (error) $("error").textContent = `${error.name}: ${error.message}`;

  $("readout").textContent = [
    `Iterator.zip([${keys.join(", ")}], { mode: "${mode}"${mode === "longest" ? `, padding: [${paddingValues.map(show).join(", ")}]` : ""} })`,
    `// lengths → ${keys.map((key) => `${key}: ${lists[key].length}`).join(", ")}`,
    `// steps   → ${arrays.rows.length}${error ? " (then threw)" : ""}`
  ].join("\n");
}

document.querySelectorAll("input").forEach((input) => input.addEventListener("input", update));
update();
