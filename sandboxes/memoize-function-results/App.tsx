import { useMemo, useState } from "react";
import { memoize } from "./memoize";
import "./styles.css";

interface LogEntry {
  n: number;
  ms: number;
  cached: boolean;
}

// Deliberately expensive so a cold call takes noticeably longer than a cache hit.
function expensiveCompute(n: number): number {
  let total = 0;
  for (let i = 0; i < 5_000_000; i++) {
    total += Math.sqrt(i) % 7;
  }
  return Math.round(total) + n;
}

export default function App() {
  const memoizedCompute = useMemo(() => memoize(expensiveCompute, { maxSize: 5 }), []);
  const [input, setInput] = useState(4);
  const [log, setLog] = useState<LogEntry[]>([]);

  function run() {
    const sizeBefore = memoizedCompute.size();
    const start = performance.now();
    memoizedCompute(input);
    const ms = performance.now() - start;
    const wasCached = memoizedCompute.size() === sizeBefore;
    setLog((prev) => [{ n: input, ms, cached: wasCached }, ...prev].slice(0, 6));
  }

  function clearCache() {
    memoizedCompute.clear();
    setLog([]);
  }

  return (
    <>
      <div className="wrapper">
        <h1 className="title">Memoized Expensive Function</h1>
        <p className="subtitle">Run the same (or a different) input repeatedly — a cache hit returns almost instantly.</p>

        <div className="controls">
          <input type="number" className="number-input" value={input} onChange={(e) => setInput(Number(e.target.value))} />
          <button className="run-btn" onClick={run}>
            Run
          </button>
          <button className="clear-btn" onClick={clearCache}>
            Clear Cache
          </button>
        </div>

        <ul className="log">
          {log.length === 0 && <li className="empty">Run a few times to see cache hits appear.</li>}
          {log.map((entry, i) => (
            <li key={i} className={entry.cached ? "cached" : "computed"}>
              n={entry.n} → {entry.cached ? "cache hit" : "computed"} in {entry.ms.toFixed(2)}ms
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
