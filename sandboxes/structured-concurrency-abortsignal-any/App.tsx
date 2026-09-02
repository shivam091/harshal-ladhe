import { useRef, useState } from "react";
import { mockTask, describeAbortReason } from "./mockTask";
import "./styles.css";

interface LogLine {
  id: number;
  text: string;
  kind: "start" | "success" | "timeout" | "manual";
}

const COMPLETION_MS = 4000;

export default function App() {
  const [timeoutMs, setTimeoutMs] = useState(2000);
  const [running, setRunning] = useState(false);
  const [lines, setLines] = useState<LogLine[]>([]);
  const [nextId, setNextId] = useState(1);
  const manualControllerRef = useRef<AbortController | null>(null);

  function emit(text: string, kind: LogLine["kind"]) {
    setLines((prev) => [{ id: nextId, text, kind }, ...prev].slice(0, 8));
    setNextId((id) => id + 1);
  }

  async function startTask() {
    const manualController = new AbortController();
    manualControllerRef.current = manualController;

    const combined = AbortSignal.any([manualController.signal, AbortSignal.timeout(timeoutMs)]);

    setRunning(true);
    emit(`task started (times out in ${timeoutMs}ms, completes in ${COMPLETION_MS}ms)`, "start");

    try {
      await mockTask(COMPLETION_MS, combined);
      emit("task completed successfully", "success");
    } catch (reason) {
      const description = describeAbortReason(reason);
      emit(`task aborted — ${description}`, description.startsWith("timed") ? "timeout" : "manual");
    } finally {
      setRunning(false);
      manualControllerRef.current = null;
    }
  }

  function cancelManually() {
    manualControllerRef.current?.abort(new DOMException("Cancelled by user", "AbortError"));
  }

  return (
    <>
      <div className="wrapper">
        <h1 className="title">Composing Cancellation with AbortSignal.any()</h1>
        <p className="subtitle">
          One combined signal from two sources — a manual cancel button and AbortSignal.timeout(). Whichever fires first wins, and the log shows which one it was.
        </p>

        <label className="field">
          Timeout: {timeoutMs}ms
          <input
            type="range"
            min={500}
            max={6000}
            step={250}
            value={timeoutMs}
            onChange={(e) => setTimeoutMs(Number(e.target.value))}
            disabled={running}
          />
        </label>

        <div className="button-row">
          <button className="run-btn" onClick={startTask} disabled={running}>
            Start Task
          </button>
          <button className="cancel-btn" onClick={cancelManually} disabled={!running}>
            Cancel Manually
          </button>
        </div>

        <ul className="log">
          {lines.length === 0 && <li className="empty">Start a task to see which signal wins.</li>}
          {lines.map((line) => (
            <li key={line.id} className={`log-line ${line.kind}`}>
              {line.text}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
