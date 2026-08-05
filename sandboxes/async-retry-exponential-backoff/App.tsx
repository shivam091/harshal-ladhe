import { useState } from "react";
import { retry, createFlakyCall } from "./retry";
import type { Status } from "./types";
import "./shared/playground.css";
import "./styles.css";

export default function App() {
  const [status, setStatus] = useState<Status>("idle");

  async function run() {
    setStatus("running");
    try {
      const result = await retry(createFlakyCall(3), { retries: 4, delay: 400, maxDelay: 3000 });
      console.log(result.data);
      setStatus("success");
    } catch {
      console.error("Operation failed after all retries.");
      setStatus("failed");
    }
  }

  return (
    <main className="playground">
      <header className="playground-header">
        <h1>Exponential Backoff Retry</h1>
        <p>
          Simulates an API that fails 3 times before succeeding. Open the <strong>Console</strong> tab to watch
          each retry attempt and its growing delay.
        </p>
      </header>

      <div className={`status status--${status}`}>
        {status === "idle" && "Ready"}
        {status === "running" && "Requesting…"}
        {status === "success" && "✓ Success!"}
        {status === "failed" && "✗ Failed after all retries"}
      </div>

      <button className="toggle-btn" onClick={run} disabled={status === "running"}>
        {status === "running" ? "Retrying…" : "Simulate Flaky Call"}
      </button>
    </main>
  );
}
