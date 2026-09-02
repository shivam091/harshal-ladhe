import { useEffect, useMemo, useState } from "react";
import { debounce, throttle } from "./debounceThrottle";
import "./styles.css";

export default function App() {
  const [rawCount, setRawCount] = useState(0);
  const [debouncedCount, setDebouncedCount] = useState(0);
  const [throttledCount, setThrottledCount] = useState(0);

  const debouncedIncrement = useMemo(() => debounce(() => setDebouncedCount((c) => c + 1), 300), []);
  const throttledIncrement = useMemo(() => throttle(() => setThrottledCount((c) => c + 1), 300), []);

  useEffect(() => {
    // Cancel any pending calls scheduled by either wrapper if the sandbox unmounts mid-window.
    return () => {
      debouncedIncrement.cancel();
      throttledIncrement.cancel();
    };
  }, [debouncedIncrement, throttledIncrement]);

  function handleMove() {
    setRawCount((c) => c + 1);
    debouncedIncrement();
    throttledIncrement();
  }

  function reset() {
    debouncedIncrement.cancel();
    throttledIncrement.cancel();
    setRawCount(0);
    setDebouncedCount(0);
    setThrottledCount(0);
  }

  return (
    <>
      <div className="wrapper">
        <h1 className="title">Debounce vs. Throttle</h1>
        <p className="subtitle">Move your pointer across the panel — compare how often each strategy actually fires.</p>

        <div className="panel" onMouseMove={handleMove}>
          Move here
        </div>

        <div className="stats">
          <div className="stat">
            <span className="stat-label">Raw events</span>
            <span className="stat-value">{rawCount}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Debounced (300ms)</span>
            <span className="stat-value">{debouncedCount}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Throttled (300ms)</span>
            <span className="stat-value">{throttledCount}</span>
          </div>
        </div>

        <button className="reset-btn" onClick={reset}>
          Reset
        </button>
      </div>
    </>
  );
}
