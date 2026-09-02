import { useState } from "react";
import { MouseTracker } from "./MouseTracker";
import { useMousePosition } from "./useMousePosition";
import "./styles.css";

type Mode = "render-prop" | "hook";

function Readout({ x, y }: { x: number; y: number }) {
  return (
    <div className="readout">
      <span>
        x: <strong>{Math.round(x)}</strong>
      </span>
      <span>
        y: <strong>{Math.round(y)}</strong>
      </span>
    </div>
  );
}

function HookVersion() {
  const position = useMousePosition();
  return <Readout x={position.x} y={position.y} />;
}

export default function App() {
  const [mode, setMode] = useState<Mode>("render-prop");

  return (
    <>
      <div className="wrapper">
        <h1 className="title">Render Prop vs. Hook</h1>
        <p className="subtitle">Same mouse-tracking logic, two ways to consume it. Move your pointer over the panel.</p>

        <div className="tabs">
          <button className={mode === "render-prop" ? "tab active" : "tab"} onClick={() => setMode("render-prop")}>
            Render Prop
          </button>
          <button className={mode === "hook" ? "tab active" : "tab"} onClick={() => setMode("hook")}>
            Hook
          </button>
        </div>

        <div className="panel">
          {mode === "render-prop" ? (
            <MouseTracker>{(position) => <Readout x={position.x} y={position.y} />}</MouseTracker>
          ) : (
            <HookVersion />
          )}
        </div>

        <p className="hint">
          {mode === "render-prop"
            ? "<MouseTracker> wraps the readout in a function-as-children component."
            : "useMousePosition() returns the value directly — no wrapper component at all."}
        </p>
      </div>
    </>
  );
}
