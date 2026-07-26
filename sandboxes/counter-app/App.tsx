import { useState } from "react";
import "./styles.css";

type Step = 1 | 5 | 10;

export default function App() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState<Step>(1);

  return (
    <div className="wrapper">
      <h1 className="title">Counter</h1>

      <div className="display">
        <span className="count">{count}</span>
      </div>

      <div className="step-picker">
        <span className="step-label">Step</span>
        {([1, 5, 10] as Step[]).map((s) => (
          <button
            key={s}
            className={`step-btn${step === s ? " step-btn--active" : ""}`}
            onClick={() => setStep(s)}
          >
            {s}
          </button>
        ))}
      </div>

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
    </div>
  );
}
