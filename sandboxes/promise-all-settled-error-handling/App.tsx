import { useState } from "react";
import { runAllSettled } from "./settleAll";
import "./styles.css";

interface TaskOutcome {
  id: number;
  willFail: boolean;
  delayMs: number;
}

type RunState =
  | { kind: "idle" }
  | { kind: "running" }
  | { kind: "all-failed"; message: string }
  | { kind: "all-succeeded"; results: string[] }
  | { kind: "settled"; fulfilled: string[]; rejected: string[] };

const TASK_COUNT = 6;

function createOutcomes(): TaskOutcome[] {
  return Array.from({ length: TASK_COUNT }, (_, i) => ({
    id: i + 1,
    willFail: Math.random() < 0.4,
    delayMs: 300 + Math.random() * 500
  }));
}

function runTask(outcome: TaskOutcome): Promise<string> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (outcome.willFail) reject(new Error(`Task ${outcome.id} failed`));
      else resolve(`Task ${outcome.id} succeeded`);
    }, outcome.delayMs);
  });
}

export default function App() {
  const [allState, setAllState] = useState<RunState>({ kind: "idle" });
  const [settledState, setSettledState] = useState<RunState>({ kind: "idle" });

  async function runComparison() {
    const outcomes = createOutcomes();
    setAllState({ kind: "running" });
    setSettledState({ kind: "running" });

    Promise.all(outcomes.map(runTask))
      .then((results) => setAllState({ kind: "all-succeeded", results }))
      .catch((error: Error) => setAllState({ kind: "all-failed", message: error.message }));

    const summary = await runAllSettled(outcomes.map(runTask));
    setSettledState({
      kind: "settled",
      fulfilled: summary.fulfilled,
      rejected: summary.rejected.map((reason) => (reason as Error).message)
    });
  }

  return (
    <>
      <div className="wrapper">
        <h1 className="title">Promise.all vs. Promise.allSettled</h1>
        <p className="subtitle">{TASK_COUNT} tasks run in parallel, each with a ~40% chance of failing — same outcomes, two strategies.</p>

        <button className="run-btn" onClick={runComparison}>
          Run {TASK_COUNT} Parallel Tasks
        </button>

        <div className="columns">
          <div className="column">
            <p className="column-title">Promise.all</p>
            {allState.kind === "idle" && <p className="hint">Not run yet.</p>}
            {allState.kind === "running" && <p className="hint">Running…</p>}
            {allState.kind === "all-failed" && <p className="error-line">Rejected entirely: {allState.message}</p>}
            {allState.kind === "all-succeeded" && (
              <ul className="result-list">
                {allState.results.map((r) => (
                  <li key={r} className="ok">
                    {r}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="column">
            <p className="column-title">Promise.allSettled</p>
            {settledState.kind === "idle" && <p className="hint">Not run yet.</p>}
            {settledState.kind === "running" && <p className="hint">Running…</p>}
            {settledState.kind === "settled" && (
              <ul className="result-list">
                {settledState.fulfilled.map((r) => (
                  <li key={r} className="ok">
                    {r}
                  </li>
                ))}
                {settledState.rejected.map((r) => (
                  <li key={r} className="err">
                    {r}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
