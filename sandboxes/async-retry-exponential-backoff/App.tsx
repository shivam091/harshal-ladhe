import { useState } from "react";
import { retry, createFlakyCall } from "./retry";
import type { Status } from "./types";
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
    <>
      <div className="wrapper">
        <h1 className="title">Exponential Backoff Retry</h1>
        <p className="subtitle">
          Simulates an API that fails 3 times before succeeding. Open the <strong>Console</strong> tab to watch
          each retry attempt and its growing delay.
        </p>

        <button className="run-btn" onClick={run} disabled={status === "running"}>
          {status === "running" ? "Retrying…" : "Simulate Flaky Call"}
        </button>

        <div className={`status status--${status}`}>
          {status === "idle" && "Ready"}
          {status === "running" && "Requesting…"}
          {status === "success" && "✓ Success!"}
          {status === "failed" && "✗ Failed after all retries"}
        </div>
      </div>
    </>
  );
}
