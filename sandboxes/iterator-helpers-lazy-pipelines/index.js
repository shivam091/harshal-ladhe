import "./shared/playground.css";
import "./styles.css";

const $ = (id) => document.getElementById(id);
const EAGER_SIZE = 30;

const FILTERS = {
  even: { code: "(n) => n % 2 === 0", test: (n) => n % 2 === 0 },
  three: { code: "(n) => n % 3 === 0", test: (n) => n % 3 === 0 },
  seven: { code: "(n) => n % 7 === 0", test: (n) => n % 7 === 0 }
};

const MAPPERS = {
  square: { code: "(n) => n * n", fn: (n) => n * n },
  ten: { code: "(n) => n * 10", fn: (n) => n * 10 }
};

const hasIteratorHelpers =
  typeof Iterator === "function" &&
  typeof Iterator.from === "function" &&
  typeof Iterator.prototype.take === "function";

// The pipeline built by "Pull one value", kept between clicks so each click pulls from the same iterator.
let stepper = null;

function readSettings() {
  const limit = Math.min(8, Math.max(1, Math.round(Number($("take-input").value)) || 1));
  return {
    filter: FILTERS[$("filter-select").value],
    mapper: MAPPERS[$("map-select").value],
    limit
  };
}

function showCode(mode) {
  const { filter, mapper, limit } = readSettings();
  $("code").textContent =
    mode === "eager"
      ? `Array.from({ length: ${EAGER_SIZE} }, (_, i) => i + 1)\n  .filter(${filter.code})\n  .map(${mapper.code})\n  .slice(0, ${limit})`
      : `Iterator.from(naturals()) // 1, 2, 3, ... forever\n  .filter(${filter.code})\n  .map(${mapper.code})\n  .take(${limit})`;
}

function createRun() {
  const stats = { pulled: 0, filter: 0, map: 0, arrays: 0, closed: false };
  const lines = [];
  const log = (message) => {
    lines.push(message);
    $("readout").textContent = lines.join("\n");
    $("readout").scrollTop = $("readout").scrollHeight;
  };
  return { stats, log };
}

function render(stats, results) {
  $("stat-pulled").textContent = stats.pulled;
  $("stat-filter").textContent = stats.filter;
  $("stat-map").textContent = stats.map;
  $("stat-arrays").textContent = stats.arrays;
  $("stat-closed").textContent = stats.closed ? "yes" : "no";
  $("results").replaceChildren(
    ...results.map((value) => {
      const li = document.createElement("li");
      li.textContent = value;
      return li;
    })
  );
  $("empty").hidden = results.length > 0;
}

/*
  An endless source of 1, 2, 3, ... written by hand: an object with next(), return() and Symbol.iterator, rather
  than a `function*`, which the sandbox's bundler doesn't handle. It logs every value it hands out, and return() is
  what take() calls when it has enough values.
*/
function naturals({ stats, log }) {
  let n = 0;
  let closed = false;

  return {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      if (closed) return { value: undefined, done: true };
      n += 1;
      stats.pulled += 1;
      log(`source   → ${n}`);
      return { value: n, done: false };
    },
    return() {
      closed = true;
      stats.closed = true;
      log("source   return() called: closed");
      return { value: undefined, done: true };
    }
  };
}

// Iterator.from() wraps the plain object above in an iterator that has map(), filter(), take() and the rest.
function buildLazyPipeline(settings, run) {
  const { stats, log } = run;
  return Iterator.from(naturals(run))
    .filter((n) => {
      stats.filter += 1;
      const keep = settings.filter.test(n);
      log(`filter   ${n} ${keep ? "kept" : "skipped"}`);
      return keep;
    })
    .map((n) => {
      stats.map += 1;
      const value = settings.mapper.fn(n);
      log(`map      ${n} → ${value}`);
      return value;
    })
    .take(settings.limit);
}

function runLazy() {
  stepper = null;
  const settings = readSettings();
  const run = createRun();
  showCode("lazy");
  run.log("pipeline built: nothing has run yet");

  const results = [];
  for (const value of buildLazyPipeline(settings, run)) {
    results.push(value);
    run.log(`result   ${value} (${results.length} of ${settings.limit})`);
  }

  run.log(`done: ${results.length} results after reading ${run.stats.pulled} values, no intermediate arrays`);
  // The one array is the list of results, the same array toArray() would build; the pipeline itself never made one.
  run.stats.arrays = 1;
  render(run.stats, results);
}

function runEager() {
  stepper = null;
  const { filter, mapper, limit } = readSettings();
  const { stats, log } = createRun();
  showCode("eager");

  const source = Array.from({ length: EAGER_SIZE }, (_, i) => i + 1);
  stats.pulled = source.length;
  stats.arrays += 1;
  log(`Array.from  built [1 … ${EAGER_SIZE}]: array 1`);

  const kept = source.filter((n) => {
    stats.filter += 1;
    const keep = filter.test(n);
    log(`filter   ${n} ${keep ? "kept" : "skipped"}`);
    return keep;
  });
  stats.arrays += 1;
  log(`filter() finished: ${kept.length} of ${source.length} kept, array 2`);

  const mapped = kept.map((n) => {
    stats.map += 1;
    const value = mapper.fn(n);
    log(`map      ${n} → ${value}`);
    return value;
  });
  stats.arrays += 1;
  log(`map() finished: ${mapped.length} values, array 3`);

  const results = mapped.slice(0, limit);
  stats.arrays += 1;
  log(`slice(0, ${limit}): kept ${results.length}, threw away ${mapped.length - results.length}, array 4`);

  if (results.length < limit) {
    log(`only ${results.length} matches in the first ${EAGER_SIZE}: an array needs an end, the lazy source doesn't`);
  }

  render(stats, results);
}

// Calls next() once on a lazy pipeline, building it on the first click so the log shows that building runs nothing.
function pullOne() {
  if (!stepper) {
    const settings = readSettings();
    const run = createRun();
    showCode("lazy");
    stepper = { settings, run, iterator: buildLazyPipeline(settings, run), results: [], finished: false };
    run.log("pipeline built: nothing has run yet");
  }

  const { run, iterator, results } = stepper;

  if (stepper.finished) {
    run.log("next()   → { done: true } again: an iterator is read once, press Reset to build a new one");
    return;
  }

  run.log("next() called");
  const { value, done } = iterator.next();

  if (done) {
    stepper.finished = true;
    run.log("next()   → { value: undefined, done: true }");
  } else {
    results.push(value);
    run.log(`next()   → { value: ${value}, done: false }`);
  }

  render(run.stats, results);
}

function reset() {
  // Closing a half-read pipeline passes return() down to the source, as leaving a for...of loop early would.
  if (stepper && !stepper.finished) stepper.iterator.return();
  stepper = null;
  showCode("lazy");
  render({ pulled: 0, filter: 0, map: 0, arrays: 0, closed: false }, []);
  $("readout").textContent = "Press a button to start.";
}

$("lazy-btn").addEventListener("click", runLazy);
$("eager-btn").addEventListener("click", runEager);
$("step-btn").addEventListener("click", pullOne);
$("reset-btn").addEventListener("click", reset);

// A half-pulled pipeline was built with the old settings, so changing any of them starts again.
for (const id of ["filter-select", "map-select", "take-input"]) {
  $(id).addEventListener("change", reset);
}

showCode("lazy");

// Without iterator helpers the lazy demos can't run, so their buttons are disabled and the reason is shown instead.
if (!hasIteratorHelpers) {
  $("support-tip").hidden = false;
  $("lazy-btn").disabled = true;
  $("step-btn").disabled = true;
}
