import { useState } from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import "./styles.css";

function BuggyCounter() {
  const [count, setCount] = useState(0);

  if (count === 3) {
    throw new Error("Count hit 3 — simulated render crash");
  }

  return (
    <div className="counter">
      <p className="count">{count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
      <p className="hint">Crashes at 3 — try it.</p>
    </div>
  );
}

export default function App() {
  return (
    <>
      <div className="wrapper">
        <h1 className="title">Error Boundary with Fallback</h1>
        <p className="subtitle">Increment the counter — it throws at 3, caught by the boundary below.</p>

        <ErrorBoundary
          onError={(error) => console.error("Logged to tracking service:", error.message)}
          fallback={(error, reset) => (
            <div className="fallback">
              <p className="fallback-title">Something went wrong</p>
              <p className="fallback-message">{error.message}</p>
              <button onClick={reset}>Try again</button>
            </div>
          )}
        >
          <BuggyCounter />
        </ErrorBoundary>
      </div>
    </>
  );
}
