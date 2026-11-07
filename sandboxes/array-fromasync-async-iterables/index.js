import "./shared/playground.css";
import "./styles.css";

const $ = (id) => document.getElementById(id);
const DELAY = 300;

const PAGES = [
  ["Desk lamp", "Notebook"],
  ["Fountain pen", "Ink bottle"],
  ["Pencil case"]
];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/*
  Stands in for a paginated API: each call to next() resolves with the next page after a delay. It's written as a
  hand-built async iterable (an object whose Symbol.asyncIterator method returns an iterator with an async next())
  rather than an `async function*`, which the sandbox's bundler doesn't handle; Array.fromAsync() treats both the
  same way.
*/
function fetchPages({ failOnPage, log }) {
  let index = 0;

  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    async next() {
      if (index >= PAGES.length) return { done: true, value: undefined };

      await wait(DELAY);
      index += 1;
      if (index === failOnPage) throw new Error(`page ${index} returned a 500`);

      const page = PAGES[index - 1];
      log(`page ${index}: ${page.length} item(s)`);
      return { done: false, value: page };
    }
  };
}

// One request in the timing comparison: resolves with a product name after the same delay as a page.
async function fetchItem(id) {
  await wait(DELAY);
  return `Product ${id}`;
}

// Collects timestamped lines so the readout shows when each step happened, not just the end result.
function createLog() {
  const start = performance.now();
  const lines = [];
  const log = (message) => {
    lines.push(`+${String(Math.round(performance.now() - start)).padStart(4)}ms  ${message}`);
    $("readout").textContent = lines.join("\n");
  };
  return log;
}

function showResults(items) {
  $("results").replaceChildren(
    ...items.map((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      return li;
    })
  );
  $("empty").hidden = items.length > 0;
}

function setBusy(busy) {
  $("collect-btn").disabled = busy;
  $("compare-btn").disabled = busy;
}

$("collect-btn").addEventListener("click", async () => {
  setBusy(true);
  showResults([]);
  const log = createLog();
  log("Array.fromAsync(fetchPages()) started");

  try {
    const pages = await Array.fromAsync(fetchPages({ failOnPage: $("fail-toggle").checked ? 2 : 0, log }));
    // Each page is an array of products, so the collected result is an array of arrays until it's flattened.
    const products = pages.flat();
    showResults(products);
    log(`collected ${pages.length} pages, ${products.length} products`);
  } catch (error) {
    log(`rejected: ${error.message}`);
    log("the products from page 1 are discarded with it");
  } finally {
    setBusy(false);
  }
});

$("compare-btn").addEventListener("click", async () => {
  setBusy(true);
  showResults([]);
  const ids = [1, 2, 3, 4, 5];
  const log = createLog();

  log("Array.fromAsync(ids, fetchItem): one request at a time");
  let start = performance.now();
  await Array.fromAsync(ids, fetchItem);
  log(`done in ${Math.round(performance.now() - start)}ms`);

  log("Promise.all(ids.map(fetchItem)): all requests at once");
  start = performance.now();
  const items = await Promise.all(ids.map(fetchItem));
  log(`done in ${Math.round(performance.now() - start)}ms`);

  showResults(items);
  setBusy(false);
});

// Without Array.fromAsync the demo can't run, so the buttons are disabled and the reason is shown instead.
if (typeof Array.fromAsync !== "function") {
  $("support-tip").hidden = false;
  setBusy(true);
}
