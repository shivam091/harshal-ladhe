import { useRef, useState } from "react";
import { mockRequest } from "./mockRequest";
import "./styles.css";

const TIMEOUT_MS = 2000;

interface LogEntry {
  id: number;
  delayMs: number;
  status: "pending" | "completed" | "timed-out";
}

export default function App() {
  const [delayMs, setDelayMs] = useState(1200);
  const [log, setLog] = useState<LogEntry[]>([]);
  const nextId = useRef(1);

  function sendRequest() {
    const id = nextId.current++;
    const requestDelay = delayMs;
    setLog((prev) => [{ id, delayMs: requestDelay, status: "pending" } satisfies LogEntry, ...prev].slice(0, 6));

    // AbortSignal.timeout() returns a signal that aborts itself after TIMEOUT_MS — no manual
    // setTimeout(() => controller.abort(), ms) + cleanup required to build one.
    const signal = AbortSignal.timeout(TIMEOUT_MS);

    mockRequest(requestDelay, signal)
      .then(() => {
        setLog((prev) => prev.map((e): LogEntry => (e.id === id ? { ...e, status: "completed" } : e)));
      })
      .catch(() => {
        setLog((prev) => prev.map((e): LogEntry => (e.id === id ? { ...e, status: "timed-out" } : e)));
      });
  }

  return (
    <>
      <div className="wrapper">
        <h1 className="title">AbortSignal.timeout()</h1>
        <p className="subtitle">Every request gets a {TIMEOUT_MS}ms budget via AbortSignal.timeout({TIMEOUT_MS}). Slower than that, and it aborts itself.</p>

        <label className="field-label" htmlFor="delay-input">
          Simulated response time: <strong>{delayMs}ms</strong>
        </label>
        <input
          id="delay-input"
          className="range-input"
          type="range"
          min={200}
          max={4000}
          step={100}
          value={delayMs}
          onChange={(e) => setDelayMs(Number(e.target.value))}
        />

        <button className="send-btn" type="button" onClick={sendRequest}>
          Send request
        </button>

        <ul className="log">
          {log.length === 0 && <li className="empty">Send a request to see it here.</li>}
          {log.map((entry) => (
            <li key={entry.id} className={`log-entry ${entry.status}`}>
              <span className="log-query">{entry.delayMs}ms request</span>
              <span className="log-status">{entry.status.replace("-", " ")}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
