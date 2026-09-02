import { useState } from "react";
import { runBlock } from "./resource";
import type { LogLine } from "./resource";
import "./styles.css";

const RESOURCE_NAMES = ["db-connection", "file-handle", "lock"];

export default function App() {
  const [throwMidBlock, setThrowMidBlock] = useState(false);
  const [lines, setLines] = useState<LogLine[]>([]);
  const [nextId, setNextId] = useState(1);

  function run() {
    let id = nextId;
    const collected: LogLine[] = [];
    runBlock(RESOURCE_NAMES, throwMidBlock, (text, kind) => {
      collected.push({ id: id++, text, kind });
    });
    setLines(collected);
    setNextId(id);
  }

  return (
    <>
      <div className="wrapper">
        <h1 className="title">Deterministic Cleanup with using</h1>
        <p className="subtitle">
          Three resources acquired in order — watch them dispose in reverse order, even when the block throws partway through.
        </p>

        <label className="toggle">
          <input type="checkbox" checked={throwMidBlock} onChange={(e) => setThrowMidBlock(e.target.checked)} />
          Throw partway through the block
        </label>

        <button className="run-btn" onClick={run}>
          Run Block
        </button>

        <ul className="log">
          {lines.length === 0 && <li className="empty">Run the block to see the acquire/dispose order.</li>}
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
