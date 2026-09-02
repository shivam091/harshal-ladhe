import { useState } from "react";
import { requestLock, tryLockWithoutWaiting } from "./locksDemo";
import type { LogLine } from "./locksDemo";
import "./styles.css";

const supportsLocks = typeof navigator !== "undefined" && "locks" in navigator;

export default function App() {
  const [lines, setLines] = useState<LogLine[]>([]);
  const [nextId, setNextId] = useState(1);

  function emit(text: string, kind: LogLine["kind"]) {
    setLines((prev) => [...prev, { id: nextId, text, kind }]);
    setNextId((id) => id + 1);
  }

  return (
    <>
      <div className="wrapper">
        <h1 className="title">Coordinating Work with navigator.locks</h1>
        <p className="subtitle">
          Every button below requests the same named lock — as if each were a separate browser tab. Fire A and B back to back and watch B queue behind A instead of running concurrently.
        </p>

        {!supportsLocks && <p className="unsupported">navigator.locks isn&apos;t available in this environment.</p>}

        <div className="button-row">
          <button className="run-btn" disabled={!supportsLocks} onClick={() => requestLock("Tab A", 1500, emit)}>
            Fire from Tab A
          </button>
          <button className="run-btn" disabled={!supportsLocks} onClick={() => requestLock("Tab B", 1500, emit)}>
            Fire from Tab B
          </button>
          <button className="run-btn ghost" disabled={!supportsLocks} onClick={() => tryLockWithoutWaiting("Tab C (non-blocking)", emit)}>
            Try Tab C (ifAvailable)
          </button>
        </div>

        <ul className="log">
          {lines.length === 0 && <li className="empty">Fire a request to see the queue in action.</li>}
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
