import { useMemo, useState } from "react";
import { pipe } from "./curryCompose";
import "./styles.css";

interface Operation {
  key: string;
  label: string;
  fn: (s: string) => string;
}

const OPERATIONS: Operation[] = [
  { key: "trim", label: "Trim", fn: (s) => s.trim() },
  { key: "lowercase", label: "Lowercase", fn: (s) => s.toLowerCase() },
  { key: "reverse", label: "Reverse", fn: (s) => s.split("").reverse().join("") },
  { key: "truncate", label: "Truncate to 10", fn: (s) => (s.length > 10 ? `${s.slice(0, 10)}…` : s) }
];

export default function App() {
  const [input, setInput] = useState("  Hello, World!  ");
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    trim: true,
    lowercase: true,
    reverse: false,
    truncate: false
  });

  const output = useMemo(() => {
    const activeFns = OPERATIONS.filter((op) => enabled[op.key]).map((op) => op.fn);
    return pipe(...activeFns)(input);
  }, [input, enabled]);

  function toggle(key: string) {
    setEnabled((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <>
      <div className="wrapper">
        <h1 className="title">Composable Pipeline</h1>
        <p className="subtitle">Toggle steps on or off — pipe() runs whichever are enabled, left to right.</p>

        <input className="text-input" value={input} onChange={(e) => setInput(e.target.value)} />

        <div className="steps">
          {OPERATIONS.map((op) => (
            <label key={op.key} className="step">
              <input type="checkbox" checked={enabled[op.key]} onChange={() => toggle(op.key)} />
              {op.label}
            </label>
          ))}
        </div>

        <div className="output">
          <span className="output-label">Output:</span>
          <span className="output-value">{output || "(empty)"}</span>
        </div>
      </div>
    </>
  );
}
