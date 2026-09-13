import { useRef, useState } from "react";
import "./styles.css";

const TOTAL_ITEMS = 6000;
// Forces progress even in a browser tab that's never truly idle, rather than stalling forever.
const IDLE_TIMEOUT_MS = 1000;

// A deliberately non-trivial per-item computation — just enough real work that processing all of it is visible spread across several idle periods, instead of finishing within a single tick.
function doUnitOfWork(): number {
  let total = 0;
  for (let i = 0; i < 2000; i++) total += Math.sqrt(i);
  return total;
}

// Schedules `callback` via requestIdleCallback when the browser supports it, falling back to a plain setTimeout (with a synthesized, generous IdleDeadline) in browsers — Safari, at the time of writing — that don't implement it.
function scheduleIdleWork(callback: IdleRequestCallback) {
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(callback, { timeout: IDLE_TIMEOUT_MS });
  } else {
    setTimeout(() => callback({ didTimeout: false, timeRemaining: () => 8 }), 0);
  }
}

export default function App() {
  const [processed, setProcessed] = useState(0);
  const [running, setRunning] = useState(false);
  const cancelled = useRef(false);

  // Kicks off processing TOTAL_ITEMS in idle-time chunks — each callback does as much work as the current idle period's deadline allows, then reschedules itself for the next one.
  function start() {
    if (running) return;
    cancelled.current = false;
    setRunning(true);
    setProcessed(0);
    let done = 0;

    function step(deadline: IdleDeadline) {
      if (cancelled.current) return;
      while (done < TOTAL_ITEMS && (deadline.timeRemaining() > 0 || deadline.didTimeout)) {
        doUnitOfWork();
        done++;
      }
      setProcessed(done);
      if (done < TOTAL_ITEMS) {
        scheduleIdleWork(step);
      } else {
        setRunning(false);
      }
    }

    scheduleIdleWork(step);
  }

  const percent = Math.round((processed / TOTAL_ITEMS) * 100);

  return (
    <>
      <div className="wrapper">
        <h1 className="title">requestIdleCallback</h1>
        <p className="subtitle">
          Processing {TOTAL_ITEMS.toLocaleString()} items in idle-time chunks — type below while it runs, the input never lags.
        </p>

        <input className="type-test" placeholder="Type here while it runs..." />

        <button type="button" className="start-btn" onClick={start} disabled={running}>
          {running ? "Processing…" : "Start"}
        </button>

        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
        <p className="progress-label">
          {processed.toLocaleString()} / {TOTAL_ITEMS.toLocaleString()} ({percent}%)
        </p>
      </div>
    </>
  );
}
