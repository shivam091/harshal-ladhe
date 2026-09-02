import { Suspense, use, useState } from "react";
import "./styles.css";

const cache = new Map<string, Promise<string>>();

// Simulates a slow data fetch, cached by key so the SAME promise is returned across Suspense
// retries — use() needs a stable promise reference, not a fresh one created on every render.
function getData(label: string, delayMs: number): Promise<string> {
  const key = `${label}-${delayMs}`;

  if (!cache.has(key)) {
    cache.set(
      key,
      new Promise((resolve) => setTimeout(() => resolve(`${label} data loaded`), delayMs))
    );
  }

  return cache.get(key) as Promise<string>;
}

function Skeleton({ label }: { label: string }) {
  return <div className="section skeleton">Loading {label}…</div>;
}

function SlowSection({ label, delayMs }: { label: string; delayMs: number }) {
  const data = use(getData(label, delayMs));
  return <div className="section loaded">{data}</div>;
}

function Page() {
  return (
    <div className="page">
      <div className="section header">Header — renders instantly, not wrapped in Suspense</div>

      <Suspense fallback={<Skeleton label="Comments" />}>
        <SlowSection label="Comments" delayMs={900} />
      </Suspense>

      <Suspense fallback={<Skeleton label="Recommendations" />}>
        <SlowSection label="Recommendations" delayMs={1800} />
      </Suspense>

      <Suspense fallback={<Skeleton label="Analytics" />}>
        <SlowSection label="Analytics" delayMs={2700} />
      </Suspense>
    </div>
  );
}

export default function App() {
  const [runId, setRunId] = useState(0);

  function restart() {
    cache.clear();
    setRunId((id) => id + 1);
  }

  return (
    <>
      <div className="wrapper">
        <h1 className="title">Streaming with Suspense</h1>
        <p className="subtitle">
          Each section streams in independently as its own data resolves — the header and faster sections never wait
          for the slowest one.
        </p>

        <button className="restart-btn" onClick={restart}>
          Restart
        </button>

        <Page key={runId} />
      </div>
    </>
  );
}
