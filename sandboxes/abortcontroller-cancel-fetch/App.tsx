import { useMemo, useRef, useState } from "react";
import { createLatestRequest } from "./abortableRequest";
import "./styles.css";

interface LogEntry {
  id: number;
  query: string;
  status: "pending" | "completed" | "aborted";
}

// Stands in for a real fetch() — resolves after a random delay, unless aborted first.
function mockFetch(query: string, signal: AbortSignal): Promise<string> {
  return new Promise((resolve, reject) => {
    const delay = 500 + Math.random() * 900;
    const timeoutId = setTimeout(() => resolve(`Results for "${query}"`), delay);

    signal.addEventListener("abort", () => {
      clearTimeout(timeoutId);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}

export default function App() {
  const request = useMemo(() => createLatestRequest<string>(), []);
  const nextId = useRef(1);
  const [query, setQuery] = useState("");
  const [log, setLog] = useState<LogEntry[]>([]);

  function handleChange(value: string) {
    setQuery(value);
    if (!value) return;

    const id = nextId.current++;
    const pendingEntry: LogEntry = { id, query: value, status: "pending" };
    setLog((prev) => [pendingEntry, ...prev].slice(0, 6));

    request
      .run((signal) => mockFetch(value, signal))
      .then(() => {
        setLog((prev) => prev.map((entry): LogEntry => (entry.id === id ? { ...entry, status: "completed" } : entry)));
      })
      .catch(() => {
        setLog((prev) => prev.map((entry): LogEntry => (entry.id === id ? { ...entry, status: "aborted" } : entry)));
      });
  }

  return (
    <>
      <div className="wrapper">
        <h1 className="title">Cancelling In-Flight Requests</h1>
        <p className="subtitle">
          Type quickly — each keystroke starts a new &quot;request&quot; and aborts whatever was still in flight.
        </p>

        <input
          className="search-input"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Type to search..."
          autoFocus
        />

        <ul className="log">
          {log.length === 0 && <li className="empty">Start typing to see requests fire.</li>}
          {log.map((entry) => (
            <li key={entry.id} className={`log-entry ${entry.status}`}>
              <span className="log-query">&quot;{entry.query}&quot;</span>
              <span className="log-status">{entry.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
