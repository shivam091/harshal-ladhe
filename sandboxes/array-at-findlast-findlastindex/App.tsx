import { useState } from "react";
import "./styles.css";

// The three outcomes a request can settle into.
type Status = "success" | "error" | "pending";

// One entry in the request log.
interface LogEntry {
  id: number;
  status: Status;
}

// Every status a demo button can append, in the order the buttons render.
const STATUSES: Status[] = ["success", "error", "pending"];

const INITIAL_LOG: LogEntry[] = [
  { id: 1, status: "success" },
  { id: 2, status: "success" },
  { id: 3, status: "error" },
  { id: 4, status: "success" },
];

export default function App() {
  const [log, setLog] = useState<LogEntry[]>(INITIAL_LOG);

  // Appends a new entry with the given status to the end of the log.
  function addEntry(status: Status) {
    setLog((prev) => [...prev, { id: prev.length + 1, status }]);
  }

  const last = log.at(-1);
  const lastError = log.findLast((entry) => entry.status === "error");
  const lastErrorIndex = log.findLastIndex((entry) => entry.status === "error");

  return (
    <>
      <div className="wrapper">
        <h1 className="title">at() / findLast() / findLastIndex()</h1>

        <div className="controls">
          {STATUSES.map((status) => (
            <button key={status} type="button" className={`add-btn ${status}`} onClick={() => addEntry(status)}>
              + {status}
            </button>
          ))}
        </div>

        <ul className="log">
          {log.map((entry, index) => (
            <li key={entry.id} className={`${entry.status}${index === lastErrorIndex ? " flagged" : ""}`}>
              #{entry.id} — {entry.status}
            </li>
          ))}
        </ul>

        <dl className="derived">
          <div className="derived-row">
            <dt>log.at(-1)</dt>
            <dd>#{last?.id} ({last?.status})</dd>
          </div>
          <div className="derived-row">
            <dt>log.findLast(isError)</dt>
            <dd>{lastError ? `#${lastError.id}` : "none"}</dd>
          </div>
          <div className="derived-row">
            <dt>log.findLastIndex(isError)</dt>
            <dd>{lastErrorIndex}</dd>
          </div>
        </dl>
      </div>
    </>
  );
}
