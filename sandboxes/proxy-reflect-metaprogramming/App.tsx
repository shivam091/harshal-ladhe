import { useRef, useState } from "react";
import { createValidatedSettings } from "./validatedSettings";
import "./styles.css";

interface LogEntry {
  id: number;
  text: string;
  rejected: boolean;
}

export default function App() {
  const nextId = useRef(1);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [volume, setVolume] = useState(50);

  // Created once — every get/set on `settings` below goes through the Proxy's trap handlers.
  const settingsRef = useRef(
    createValidatedSettings({ volume: 50, brightness: 80 }, (text) => {
      setLog((prev) => [{ id: nextId.current++, text, rejected: text.startsWith("REJECTED") }, ...prev].slice(0, 8));
    })
  );

  function applyVolume(next: number) {
    try {
      // A plain property assignment — the Proxy's "set" trap runs underneath it either way. In
      // strict mode (the default for modules), a trap returning `false` makes this THROW rather
      // than fail silently, so an invalid write has to be handled the same way a thrown error is.
      settingsRef.current.volume = next;
    } catch {
      // Rejected by the trap — already logged from inside it, nothing else to do here.
    }
    setVolume(settingsRef.current.volume);
  }

  return (
    <>
      <div className="wrapper">
        <h1 className="title">Proxy + Reflect</h1>
        <p className="subtitle">Every read/write below goes through a Proxy trap — try the invalid button to see it get rejected.</p>

        <label className="field-label" htmlFor="volume-input">
          Volume: <strong>{volume}</strong>
        </label>
        <input
          id="volume-input"
          className="range-input"
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => applyVolume(Number(e.target.value))}
        />

        <div className="button-row">
          <button className="action-btn" type="button" onClick={() => applyVolume(volume + 10)}>
            +10
          </button>
          <button className="action-btn invalid" type="button" onClick={() => applyVolume(-10)}>
            Set to -10 (invalid)
          </button>
          <button className="action-btn" type="button" onClick={() => settingsRef.current.brightness}>
            Read brightness
          </button>
        </div>

        <ul className="log">
          {log.length === 0 && <li className="empty">Interact above to see get/set traps fire.</li>}
          {log.map((entry) => (
            <li key={entry.id} className={`log-entry ${entry.rejected ? "rejected" : ""}`}>
              {entry.text}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
