import { useRef, useState } from "react";
import { retryWithJitter, createFlakyCall } from "./retryWithJitter";
import type { RetryEvent } from "./types";
import "./shared/playground.css";
import "./styles.css";

const CLIENT_COUNT = 6;
const TIMELINE_MS = 4000;

export default function App() {
  const [jitter, setJitter] = useState(true);
  const [events, setEvents] = useState<RetryEvent[]>([]);
  const [running, setRunning] = useState(false);
  const startRef = useRef(0);

  async function run() {
    setEvents([]);
    setRunning(true);
    startRef.current = performance.now();

    await Promise.all(
      Array.from({ length: CLIENT_COUNT }, (_, client) => {
        const label = `Client ${client + 1}`;

        return retryWithJitter(createFlakyCall(label), {
          retries: 3,
          delay: 400,
          maxDelay: 4000,
          jitter,
          label,
          onWait: () => {
            const elapsedMs = performance.now() - startRef.current;
            setEvents((prev) => [...prev, { client, elapsedMs }]);
          },
        })
          .then(() => console.log(`${label}: succeeded`))
          .catch(() => console.error(`${label}: failed after all retries`));
      })
    );

    setRunning(false);
  }

  return (
    <main className="playground">
      <header className="playground-header">
        <h1>Exponential Backoff: Jitter vs. No Jitter</h1>
        <p>
          {CLIENT_COUNT} clients hit the same failing request at once. Watch where their retries land on the
          timeline below.
        </p>
      </header>

      <section className="demo-area" aria-label="Retry timeline">
        <div className="timeline">
          {Array.from({ length: CLIENT_COUNT }, (_, client) => (
            <div className="timeline-row" key={client}>
              <span className="timeline-label">Client {client + 1}</span>
              <div className="timeline-track">
                {events
                  .filter((e) => e.client === client)
                  .map((e, i) => (
                    <span
                      key={i}
                      className="timeline-mark"
                      style={{ left: `${Math.min((e.elapsedMs / TIMELINE_MS) * 100, 100)}%` }}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <fieldset className="control-group">
        <legend>Simulate</legend>
        <label className="checkbox-field">
          <input type="checkbox" checked={jitter} onChange={(e) => setJitter(e.target.checked)} disabled={running} />
          <span>Full Jitter enabled</span>
        </label>
        <button className="toggle-btn" onClick={run} disabled={running}>
          {running ? "Retrying…" : "Simulate Concurrent Clients"}
        </button>
      </fieldset>

      <p className="tip">
        {jitter
          ? "Marks scatter — retries spread out over time, easing load on the server."
          : "Marks stack in vertical columns — every client retries at the exact same moment."}
      </p>
    </main>
  );
}
