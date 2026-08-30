import { useState } from "react";
import "./shared/playground.css";
import "./styles.css";

type Direction = "ltr" | "rtl";
type WritingMode = "horizontal-tb" | "vertical-rl" | "vertical-lr";

const WRITING_MODES: WritingMode[] = ["horizontal-tb", "vertical-rl", "vertical-lr"];

export default function App() {
  const [direction, setDirection] = useState<Direction>("ltr");
  const [writingMode, setWritingMode] = useState<WritingMode>("horizontal-tb");

  return (
    <main className="playground">
      <header className="playground-header">
        <h1>Logical vs Physical Properties</h1>
        <p>Flip the direction and writing mode — watch which card holds up.</p>
      </header>

      <div className="control-group">
        <span className="control-group-label">Configuration</span>
        <div className="fields-grid">
          <div className="field">
            <span className="field-label">Direction</span>
            <div className="segmented-control" role="group" aria-label="Direction">
              {(["ltr", "rtl"] as Direction[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  className={`segment${direction === d ? " segment--active" : ""}`}
                  onClick={() => setDirection(d)}
                >
                  {d.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <span className="field-label">Writing mode</span>
            <div className="segmented-control" role="group" aria-label="Writing mode">
              {WRITING_MODES.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={`segment${writingMode === mode ? " segment--active" : ""}`}
                  onClick={() => setWritingMode(mode)}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="stage" dir={direction} style={{ writingMode }}>
        <div className="card card--physical">
          <span className="card-badge card-badge--physical">Physical</span>
          <code className="card-code">
            margin-left · padding-left · border-left · text-align: left
          </code>
          <p className="card-text">
            Nailed to the left, no matter what you pick above.
          </p>
        </div>

        <div className="card card--logical">
          <span className="card-badge card-badge--logical">Logical</span>
          <code className="card-code">
            margin-inline-start · padding-inline-start · border-inline-start · text-align: start
          </code>
          <p className="card-text">
            Follows the start edge — flips with direction and writing mode.
          </p>
        </div>
      </div>

      <p className="hint">
        <code>direction: {direction}</code> · <code>writing-mode: {writingMode}</code>
      </p>
    </main>
  );
}
