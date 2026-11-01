import "./styles.css";

const PAGES = [
  ["Widget A", "Widget B"],
  ["Widget C", "Widget D"],
  ["Widget E"]
];

// Stands in for a real paginated fetch loop — yields one page at a time, arriving over the wire.
async function* fetchPages() {
  for (const page of PAGES) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    console.log(`fetched page of ${page.length} item(s)`);
    yield page;
  }
}

const button = document.getElementById("load");
const results = document.getElementById("results");

button.addEventListener("click", async () => {
  button.disabled = true;
  button.textContent = "Loading…";
  results.innerHTML = "";

  // Array.fromAsync awaits the WHOLE async iterable and collects it into one real array — no
  // manual `for await...of` loop pushing into an accumulator.
  const pages = await Array.fromAsync(fetchPages());
  const flat = pages.flat();

  console.log("collected:", flat);
  for (const item of flat) {
    const li = document.createElement("li");
    li.textContent = item;
    results.appendChild(li);
  }

  button.disabled = false;
  button.textContent = "Reload";
});
