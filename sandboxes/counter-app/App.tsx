import { useState } from "react";
import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./styles.css";

type Step = 1 | 5 | 10;

export default function App() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState<Step>(1);

  return (
    <main className="playground">
      <header className="playground-header">
        <h1>Counter</h1>
        <p>Increment, decrement, and reset — with a configurable step.</p>
      </header>

      <section className="demo-area" aria-label="Counter display">
        <div className="display">
          <span className="count">{count}</span>
        </div>
      </section>

      <fieldset className="control-group">
        <legend>Step</legend>
        <div className="segmented-control" role="group" aria-label="Step size">
          {([1, 5, 10] as Step[]).map((s) => (
            <button
              key={s}
              type="button"
              className={`segment${step === s ? " segment--active" : ""}`}
              onClick={() => setStep(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="control-group">
        <legend>Adjust</legend>
        <div className="controls">
          <button
            className="btn btn--minus"
            onClick={() => setCount((c) => c - step)}
            aria-label={`Decrement by ${step}`}
          >
            −
          </button>
          <button
            className="btn btn--reset"
            onClick={() => setCount(0)}
          >
            Reset
          </button>
          <button
            className="btn btn--plus"
            onClick={() => setCount((c) => c + step)}
            aria-label={`Increment by ${step}`}
          >
            +
          </button>
        </div>
      </fieldset>
    </main>
  );
}
