import "./styles.css";

// A realistic "risky" function: throws SYNCHRONOUSLY for obviously-bad input (no need to wait a
// tick to know it's invalid), but returns a REJECTED PROMISE for input that only fails an async
// check (a network validation, here simulated with a delay).
function validate(mode) {
  if (mode === "sync-throw") {
    throw new Error("empty input (caught synchronously, before any async work started)");
  }

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mode === "async-reject") reject(new Error("failed remote validation (rejected async)"));
      else resolve("input accepted");
    }, 300);
  });
}

const log = document.getElementById("log");

function addEntry(text, isError) {
  const li = document.createElement("li");
  li.textContent = text;
  li.className = isError ? "error" : "success";
  log.prepend(li);
}

for (const button of document.querySelectorAll("[data-mode]")) {
  button.addEventListener("click", () => {
    const mode = button.dataset.mode;

    // Promise.try() wraps the call so a SYNCHRONOUS throw becomes a rejection too — one .catch()
    // handles both failure paths. Without it, the sync-throw case would need its own try/catch
    // wrapped around the call site, separate from this .catch().
    Promise.try(() => validate(mode))
      .then((result) => addEntry(`✓ ${result}`, false))
      .catch((error) => addEntry(`✗ ${error.message}`, true));
  });
}
