import "./shared/playground.css";
import "./styles.css";

const $ = (id) => document.getElementById(id);
const STEP = 400;
const supported =
  typeof DisposableStack === "function" &&
  typeof AsyncDisposableStack === "function" &&
  typeof SuppressedError === "function";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function setState(name, state) {
  const item = document.querySelector(`[data-resource="${name}"]`);
  item.dataset.state = state;
  item.querySelector(".resource-state").textContent = state;
}

// Collects timestamped lines so the readout shows the order things happened in, not just the end result.
function createLog() {
  const start = performance.now();
  const lines = [];
  return (message) => {
    lines.push(`+${String(Math.round(performance.now() - start)).padStart(4)}ms  ${message}`);
    $("readout").textContent = lines.join("\n");
  };
}

/*
  The lock is a plain object with no dispose method, so it goes onto the stack with adopt(), which pairs a value with
  the function that releases it.
*/
function acquireLock(log) {
  setState("lock", "held");
  log("acquire lock");
  return { name: "report-lock" };
}

async function releaseLock(lock, log) {
  await wait(STEP);
  setState("lock", "released");
  log(`release lock (${lock.name})`);
}

// The file is async disposable, like a Node FileHandle, so it goes onto the stack with use().
function openFile({ closeThrows, log }) {
  setState("file", "held");
  log("open file");
  return {
    async [Symbol.asyncDispose]() {
      await wait(STEP);
      if (closeThrows) {
        setState("file", "failed");
        log("close file: throws Error(\"close failed\")");
        throw new Error("close failed");
      }
      setState("file", "released");
      log("close file");
    }
  };
}

async function runTask({ throwInMiddle, closeThrows, log }) {
  const stack = new AsyncDisposableStack();

  try {
    await wait(STEP);
    stack.adopt(acquireLock(log), (lock) => releaseLock(lock, log));

    await wait(STEP);
    stack.use(openFile({ closeThrows, log }));

    if (throwInMiddle) {
      await wait(STEP);
      log("work: throws Error(\"work failed\")");
      throw new Error("work failed");
    }

    await wait(STEP);
    const timerId = setTimeout(() => log("autosave fired"), 10000);
    setState("timer", "held");
    log("start autosave timer");
    // defer() takes a callback with no value attached: here, clearing the timer.
    stack.defer(async () => {
      await wait(STEP);
      clearTimeout(timerId);
      setState("timer", "released");
      log("clear autosave timer");
    });

    await wait(STEP);
    log("work: done");
  } catch (error) {
    /*
      `await using` disposes with the error still on its way out, and a disposal error then wraps it in a
      SuppressedError. Deferring a callback that rethrows it, as the last entry, makes it run first, so disposeAsync()
      combines it with any later disposal error in exactly the same way, and rethrows it when there is none.
    */
    stack.defer(() => {
      throw error;
    });
  }

  log("block ends: disposing in reverse order");
  await stack.disposeAsync();
}

// The equivalent code with `await using`, kept in step with the checkboxes. It's only text: the sandbox's bundler
// may not parse `using` itself, which is why the demo above is built on AsyncDisposableStack.
function renderCode() {
  const throwInMiddle = $("throw-toggle").checked;
  const closeThrows = $("dispose-toggle").checked;
  const lines = [
    "async function runTask() {",
    "  using lock = acquireLock();          // released last",
    `  await using file = await openFile(); // closed ${throwInMiddle ? "first" : "second"}${
      closeThrows ? ": throws \"close failed\"" : ""
    }`
  ];

  if (throwInMiddle) {
    lines.push("  throw new Error(\"work failed\");");
    lines.push("  using autosave = startTimer(10000);  // never reached");
  } else {
    lines.push("  using autosave = startTimer(10000);  // cleared first");
    lines.push("  await doWork();");
  }

  lines.push("}");
  $("code").textContent = lines.join("\n");
}

function reset() {
  ["lock", "file", "timer"].forEach((name) => setState(name, "idle"));
  $("readout").textContent = "Press Run task to start.";
}

function setBusy(busy) {
  $("run-btn").disabled = busy;
  $("reset-btn").disabled = busy;
}

$("run-btn").addEventListener("click", async () => {
  reset();
  setBusy(true);
  const log = createLog();

  try {
    await runTask({
      throwInMiddle: $("throw-toggle").checked,
      closeThrows: $("dispose-toggle").checked,
      log
    });
    log("result: finished without an error");
  } catch (error) {
    if (error instanceof SuppressedError) {
      log("result: SuppressedError");
      log(`  .error      = Error("${error.error.message}")`);
      log(`  .suppressed = Error("${error.suppressed.message}")`);
    } else {
      log(`result: ${error.name}("${error.message}")`);
    }
  } finally {
    setBusy(false);
  }
});

$("reset-btn").addEventListener("click", reset);
$("throw-toggle").addEventListener("change", renderCode);
$("dispose-toggle").addEventListener("change", renderCode);
renderCode();

// Without the stack classes the demo can't run, so the buttons are disabled and the reason is shown instead.
if (!supported) {
  $("support-tip").hidden = false;
  setBusy(true);
}
