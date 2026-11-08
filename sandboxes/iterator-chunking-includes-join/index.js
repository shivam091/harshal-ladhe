import "./shared/playground.css";
import "./styles.css";

const $ = (id) => document.getElementById(id);

/*
  Each method is detected on its own: Chrome has join() and includes() but not chunks() or windows(), so one global
  "supported" flag would either hide working native methods or call missing ones. Iterator itself is checked first,
  since the helpers live on Iterator.prototype.
*/
const proto = typeof Iterator === "function" ? Iterator.prototype : {};
const NATIVE = {
  chunks: typeof proto.chunks === "function",
  windows: typeof proto.windows === "function",
  includes: typeof proto.includes === "function",
  join: typeof proto.join === "function"
};

const DONE = { done: true, value: undefined };

// Same checks, in the same order, as the spec: a non-integer is a TypeError, an integer out of range a RangeError.
function checkSize(size, name) {
  if (typeof size !== "number" || !Number.isInteger(size)) throw new TypeError(`${name} must be an integer`);
  if (size < 1 || size > 2 ** 32 - 1) throw new RangeError(`${name} must be between 1 and 2^32 - 1`);
}

/*
  The fallbacks below are the hand-written iterators from the tutorial: objects with next(), return() and
  Symbol.iterator. They're used only where the native method is missing, and they accept any iterable.
*/
function chunksFallback(iterable, size) {
  checkSize(size, "chunkSize");
  const source = iterable[Symbol.iterator]();
  let finished = false;

  return {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      if (finished) return DONE;
      const chunk = [];
      while (chunk.length < size) {
        const step = source.next();
        if (step.done) {
          finished = true;
          break;
        }
        chunk.push(step.value);
      }
      return chunk.length > 0 ? { done: false, value: chunk } : DONE;
    },
    return() {
      if (!finished) {
        finished = true;
        // Plain check instead of `?.`: Sandpack's bundler doesn't parse optional chaining.
        if (typeof source.return === "function") source.return();
      }
      return DONE;
    }
  };
}

function windowsFallback(iterable, size, undersized = "only-full") {
  checkSize(size, "windowSize");
  if (undersized !== "only-full" && undersized !== "allow-partial") {
    throw new TypeError('undersized must be "only-full" or "allow-partial"');
  }
  const source = iterable[Symbol.iterator]();
  const buffer = [];
  let finished = false;

  return {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      while (!finished) {
        const step = source.next();
        if (step.done) {
          finished = true;
          // Only reachable with a partial buffer when the whole source was shorter than one window.
          if (undersized === "allow-partial" && buffer.length > 0 && buffer.length < size) {
            return { done: false, value: [...buffer] };
          }
          break;
        }
        buffer.push(step.value);
        if (buffer.length > size) buffer.shift();
        if (buffer.length === size) return { done: false, value: [...buffer] };
      }
      return DONE;
    },
    return() {
      if (!finished) {
        finished = true;
        // Plain check instead of `?.`: Sandpack's bundler doesn't parse optional chaining.
        if (typeof source.return === "function") source.return();
      }
      return DONE;
    }
  };
}

function includesFallback(iterable, searchElement, skippedElements = 0) {
  const isNumber = typeof skippedElements === "number";
  if (!isNumber || (!Number.isInteger(skippedElements) && Math.abs(skippedElements) !== Infinity)) {
    throw new TypeError("skippedElements must be an integer");
  }
  if (skippedElements < 0) throw new RangeError("skippedElements can't be negative");

  let skipped = 0;
  // for...of calls the iterator's return() when it exits early, which is how the native method closes it.
  for (const value of iterable) {
    if (skipped < skippedElements) {
      skipped += 1;
    } else if (value === searchElement || (value !== value && searchElement !== searchElement)) {
      return true; // SameValueZero: like ===, except NaN matches NaN
    }
  }
  return false;
}

function joinFallback(iterable, separator) {
  const sep = separator === undefined ? "," : String(separator);
  let result = "";
  let first = true;
  for (const value of iterable) {
    if (!first) result += sep;
    first = false;
    if (value !== undefined && value !== null) result += String(value);
  }
  return result;
}

/*
  A source that counts how many values were pulled from it and whether it was closed, so the includes() demo can show
  that the search stops at the first match. Iterator.from() wraps it for the native method, and passes return() on.
*/
function trackedSource(values) {
  const stats = { pulled: 0, closed: false };
  let index = 0;
  const iterator = {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      if (index >= values.length) return DONE;
      stats.pulled += 1;
      return { done: false, value: values[index++] };
    },
    return() {
      stats.closed = true;
      return DONE;
    }
  };
  return { iterator, stats };
}

// Array iterators inherit from Iterator.prototype, so values.values() has every native helper the browser ships.
const fromValues = (values) => values.values();

const run = {
  chunks: (values, size) => (NATIVE.chunks ? fromValues(values).chunks(size).toArray() : [...chunksFallback(values, size)]),
  windows: (values, size, undersized) => (NATIVE.windows
    ? fromValues(values).windows(size, undersized).toArray()
    : [...windowsFallback(values, size, undersized)]),
  includes: (values, search, skip) => {
    const { iterator, stats } = trackedSource(values);
    const found = NATIVE.includes
      ? Iterator.from(iterator).includes(search, skip)
      : includesFallback(iterator, search, skip);
    return { found, stats };
  },
  join: (values, separator) => (NATIVE.join ? fromValues(values).join(separator) : joinFallback(values, separator))
};

const tag = (method) => (NATIVE[method] ? "native" : "fallback");

// Numbers become numbers, and NaN / null / undefined are kept as those values so SameValueZero and join() can be tried.
function parseToken(token) {
  const text = token.trim();
  if (text === "NaN") return NaN;
  if (text === "null") return null;
  if (text === "undefined") return undefined;
  if (text !== "" && !Number.isNaN(Number(text))) return Number(text);
  return text;
}

function parseList(text) {
  if (text.trim() === "") return [];
  return text.split(",").map(parseToken);
}

const show = (value) => (typeof value === "string" ? JSON.stringify(value) : String(value));
const showArray = (array) => `[${array.map(show).join(", ")}]`;

// An optional integer field: empty means "not passed", anything else is passed through as a number (even 1.5 or -1).
function readOptionalNumber(id) {
  const text = $(id).value.trim();
  return text === "" ? undefined : Number(text);
}

function renderRows(containerId, rows) {
  $(containerId).replaceChildren(
    ...rows.map((row) => {
      const li = document.createElement("li");
      li.append(
        ...row.map((value) => {
          const cell = document.createElement("span");
          cell.textContent = show(value);
          return cell;
        })
      );
      return li;
    })
  );
}

function renderError(containerId, error) {
  const li = document.createElement("li");
  li.className = "error";
  li.textContent = `${error.name}: ${error.message}`;
  $(containerId).replaceChildren(li);
}

function updateGroups() {
  const values = parseList($("values").value);
  const size = Number($("size").value);
  const undersized = $("undersized").value;
  const lines = [];

  $("chunks-title").textContent = `chunks(${$("size").value}) · ${tag("chunks")}`;
  $("windows-title").textContent = `windows(${$("size").value}, "${undersized}") · ${tag("windows")}`;

  try {
    const chunks = run.chunks(values, size);
    renderRows("chunks-list", chunks);
    const lastChunk = chunks.at(-1);
    lines.push(`chunks: ${chunks.length} group(s), the last one ${lastChunk ? lastChunk.length : 0} long`);
  } catch (error) {
    renderError("chunks-list", error);
    lines.push(`chunks threw ${error.name}`);
  }

  try {
    const windows = run.windows(values, size, undersized);
    renderRows("windows-list", windows);
    lines.push(`windows: ${windows.length} window(s)`);

    if (windows.length === 0) {
      lines.push("moving average: no full window (fewer values than the window size)");
    } else if (values.every((value) => typeof value === "number" && !Number.isNaN(value))) {
      const averages = windows.map((window) => window.reduce((sum, value) => sum + value, 0) / window.length);
      lines.push(`moving average: [${averages.map((average) => Number(average.toFixed(2))).join(", ")}]`);
    } else {
      lines.push("moving average: needs every value to be a number");
    }
  } catch (error) {
    renderError("windows-list", error);
    lines.push(`windows threw ${error.name}`);
  }

  $("groups-readout").textContent = lines.join("\n");
}

function updateSearch() {
  const values = parseList($("values").value);
  const search = parseToken($("search").value);
  const skip = readOptionalNumber("skip");
  const separatorText = $("separator").value;
  const separator = $("default-separator").checked ? undefined : separatorText;
  const lines = [];

  $("separator").disabled = $("default-separator").checked;

  try {
    const { found, stats } = run.includes(values, search, skip);
    const skipText = skip === undefined ? "" : `, ${skip}`;
    lines.push(`includes(${show(search)}${skipText}) → ${found}   [${tag("includes")}]`);
    lines.push(`  read ${stats.pulled} of ${values.length} value(s); source ${stats.closed ? "closed with return()" : "ran to the end"}`);
  } catch (error) {
    lines.push(`includes threw ${error.name}: ${error.message}   [${tag("includes")}]`);
  }

  const joined = run.join(values, separator);
  const sepText = separator === undefined ? "" : show(separator);
  lines.push(`join(${sepText}) → ${JSON.stringify(joined)}   [${tag("join")}]`);

  $("search-readout").textContent = lines.join("\n");
}

function update() {
  $("parsed").textContent = `Parsed as ${showArray(parseList($("values").value))}`;
  updateGroups();
  updateSearch();
}

// The status list says, per method, whether this browser's native method or the tutorial's fallback is running.
$("status").replaceChildren(
  ...Object.keys(NATIVE).map((method) => {
    const li = document.createElement("li");
    li.className = NATIVE[method] ? "is-native" : "is-fallback";
    li.textContent = `${method}(): ${NATIVE[method] ? "native" : "fallback"}`;
    return li;
  })
);
$("fallback-tip").hidden = Object.values(NATIVE).every(Boolean);

for (const id of ["values", "size", "undersized", "search", "skip", "separator", "default-separator"]) {
  $(id).addEventListener("input", update);
}

update();
