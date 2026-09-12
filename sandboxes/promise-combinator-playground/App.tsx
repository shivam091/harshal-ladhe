import { useState } from "react";
import { runTask } from "./tasks";
import type { CombinatorKind, TaskConfig, TaskState } from "./types";
import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./styles.css";

// Starting delay/failure config for the three simulated tasks — staggered delays make the "loser
// keeps running" behavior visible instead of all three settling at once.
const INITIAL_TASKS: TaskConfig[] = [
  { label: "Task A", delayMs: 600, shouldFail: false },
  { label: "Task B", delayMs: 1200, shouldFail: false },
  { label: "Task C", delayMs: 1800, shouldFail: false }
];

// The four combinators this playground can switch between, in the segmented control's display order.
const COMBINATORS: { key: CombinatorKind; label: string }[] = [
  { key: "all", label: "Promise.all" },
  { key: "allSettled", label: "Promise.allSettled" },
  { key: "race", label: "Promise.race" },
  { key: "any", label: "Promise.any" }
];

export default function App() {
  const [tasks, setTasks] = useState<TaskConfig[]>(INITIAL_TASKS);
  const [combinator, setCombinator] = useState<CombinatorKind>("all");
  const [taskStates, setTaskStates] = useState<TaskState[]>(tasks.map(() => ({ status: "pending", elapsedMs: null })));
  const [running, setRunning] = useState(false);
  const [outcome, setOutcome] = useState<string | null>(null);

  function updateTask(index: number, changes: Partial<TaskConfig>) {
    setTasks((prev) => prev.map((task, i) => (i === index ? { ...task, ...changes } : task)));
  }

  async function run() {
    setRunning(true);
    setOutcome(null);
    setTaskStates(tasks.map(() => ({ status: "pending", elapsedMs: null })));

    const startedAt = performance.now();
    const promises = tasks.map((task, index) =>
      runTask(task, (elapsedMs, failed) => {
        setTaskStates((prev) => prev.map((state, i) => (i === index ? { status: failed ? "rejected" : "resolved", elapsedMs } : state)));
      })
    );

    try {
      let result: unknown;
      switch (combinator) {
        case "all":
          result = await Promise.all(promises);
          break;
        case "allSettled":
          result = await Promise.allSettled(promises);
          break;
        case "race":
          result = await Promise.race(promises);
          break;
        case "any":
          result = await Promise.any(promises);
          break;
      }
      const elapsedMs = Math.round(performance.now() - startedAt);
      setOutcome(`Settled after ${elapsedMs}ms →\n${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      const elapsedMs = Math.round(performance.now() - startedAt);
      setOutcome(`Rejected after ${elapsedMs}ms →\n${String(error)}`);
    }

    setRunning(false);
  }

  return (
    <main className="playground">
      <header className="playground-header">
        <h1>Promise Combinator Playground</h1>
        <p>
          Three simulated tasks, each with its own delay and pass/fail switch. Pick a combinator and run it — then
          watch the task list keep updating even after the combinator above it has already settled.
        </p>
      </header>

      <div className="segmented-control" role="radiogroup" aria-label="Promise combinator">
        {COMBINATORS.map((option) => (
          <label className="segment" key={option.key}>
            <input
              type="radio"
              name="combinator"
              checked={combinator === option.key}
              onChange={() => setCombinator(option.key)}
              disabled={running}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>

      <section className="demo-area" aria-label="Task status">
        <ul className="task-list">
          {tasks.map((task, index) => {
            const state = taskStates[index];
            return (
              <li className="task-row" key={task.label}>
                <span className="task-label">{task.label}</span>
                <span className={`task-status task-status--${state.status}`}>
                  {state.status === "pending" && "pending…"}
                  {state.status !== "pending" && `${state.status} @ ${Math.round(state.elapsedMs ?? 0)}ms`}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <fieldset className="control-group">
        <legend>Configure</legend>
        <div className="fields-grid fields-grid--3">
          {tasks.map((task, index) => (
            <div className="field" key={task.label}>
              <label htmlFor={`delay-${index}`}>
                {task.label} <span>delay</span>
              </label>
              <div className="field-input">
                <input
                  id={`delay-${index}`}
                  type="number"
                  min={100}
                  max={3000}
                  step={100}
                  value={task.delayMs}
                  onChange={(e) => updateTask(index, { delayMs: Number(e.target.value) })}
                  disabled={running}
                />
                <span className="unit-select">ms</span>
              </div>
              <label className="checkbox-field">
                <input
                  type="checkbox"
                  checked={task.shouldFail}
                  onChange={(e) => updateTask(index, { shouldFail: e.target.checked })}
                  disabled={running}
                />
                <span>Fails</span>
              </label>
            </div>
          ))}
        </div>
      </fieldset>

      <button className="toggle-btn" onClick={run} disabled={running}>
        {running ? "Running…" : "Run Combinator"}
      </button>

      {outcome && <p className="readout">{outcome}</p>}
    </main>
  );
}
