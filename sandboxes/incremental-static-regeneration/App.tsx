import { useEffect, useRef, useState } from "react";
import "./shared/playground.css";
import "./shared/range-slider.css";
import "./styles.css";

/*
  This is a real, running React app — every slider, button, timer, and state transition below
  genuinely executes in your browser. But the premise it's modeling — a server/CDN holding onto a
  previously-built page and regenerating it in the background — is a conceptual simulation. No
  browser sandbox can host an actual Next.js build pipeline or a real page cache, so this app
  re-implements the DECISION LOGIC (is the cache fresh or stale? has a rebuild already started?)
  with plain React state and a fake, user-controlled clock, exactly the way the post's ISR timeline
  diagram lays it out: one row for what a request is served, one row for background regeneration.
*/

const MIN_WINDOW = 5;
const MAX_WINDOW = 60;
const MIN_CLOCK = 0;
const MAX_CLOCK = 180;

// Real (wall-clock) delays before a simulated rebuild "finishes" — long enough to watch the
// rebuilding badge sit there for a moment before the version bumps, short enough not to be tedious.
// The on-demand path is a little faster to underline that it's a direct, targeted action rather
// than something waiting on the next stray visitor.
const REQUEST_TRIGGERED_REBUILD_MS = 1700;
const ON_DEMAND_REBUILD_MS = 1000;

type RebuildTrigger = "request" | "on-demand";

interface CacheState {
  version: number;
  // Simulated clock reading (seconds) at which this version was generated.
  builtAt: number;
}

interface LastRequestResult {
  version: number;
  outcome: "fresh" | "stale-triggered" | "stale-already-rebuilding";
  atSimTime: number;
}

let logIdCounter = 0;

export default function App() {
  const [revalidateWindow, setRevalidateWindow] = useState(20);
  const [simClock, setSimClock] = useState(0);
  const [cache, setCache] = useState<CacheState>({ version: 1, builtAt: 0 });
  const [rebuilding, setRebuilding] = useState(false);
  const [rebuildTrigger, setRebuildTrigger] = useState<RebuildTrigger | null>(null);
  const [lastRequest, setLastRequest] = useState<LastRequestResult | null>(null);
  const [log, setLog] = useState<{ id: number; text: string }[]>([]);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isFirstVersionEffect = useRef(true);

  const clearPendingRebuild = () => {
    if (timeoutRef.current !== undefined) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  };

  // Clean up any in-flight rebuild timer if the component unmounts mid-rebuild.
  useEffect(() => clearPendingRebuild, []);

  const pushLog = (text: string) => {
    logIdCounter += 1;
    setLog((prev) => [{ id: logIdCounter, text }, ...prev].slice(0, 6));
  };

  // Fires once a rebuild actually completes (the version bump), regardless of what triggered it —
  // this is the ONE place "the newly rebuilt version is now cached" gets logged.
  useEffect(() => {
    if (isFirstVersionEffect.current) {
      isFirstVersionEffect.current = false;
      return;
    }
    pushLog(`Rebuild finished — cache is now v${cache.version}, fresh as of t=${cache.builtAt}s (simulated).`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cache.version]);

  const elapsedSinceBuild = simClock - cache.builtAt;
  const isCurrentlyStale = elapsedSinceBuild > revalidateWindow;

  const startRebuild = (trigger: RebuildTrigger, triggeredAtSimTime: number) => {
    clearPendingRebuild();
    setRebuilding(true);
    setRebuildTrigger(trigger);

    const delay = trigger === "request" ? REQUEST_TRIGGERED_REBUILD_MS : ON_DEMAND_REBUILD_MS;

    timeoutRef.current = setTimeout(() => {
      setCache({ version: cache.version + 1, builtAt: triggeredAtSimTime });
      setRebuilding(false);
      setRebuildTrigger(null);
      timeoutRef.current = undefined;
    }, delay);
  };

  const handleSimulateRequest = () => {
    if (isCurrentlyStale) {
      setLastRequest({ version: cache.version, outcome: rebuilding ? "stale-already-rebuilding" : "stale-triggered", atSimTime: simClock });
      if (rebuilding) {
        pushLog(`Request served v${cache.version} instantly — still STALE (t=${simClock}s). A rebuild is already in flight; this request doesn't start another.`);
      } else {
        pushLog(`Request served v${cache.version} instantly — STALE (${elapsedSinceBuild}s since last build, window is ${revalidateWindow}s). Rebuild silently triggered.`);
        startRebuild("request", simClock);
      }
    } else {
      setLastRequest({ version: cache.version, outcome: "fresh", atSimTime: simClock });
      pushLog(`Request served v${cache.version} — FRESH (${elapsedSinceBuild}s since last build ≤ ${revalidateWindow}s window). No rebuild triggered.`);
    }
  };

  const handleOnDemandRevalidate = () => {
    pushLog(`On-demand revalidation called at t=${simClock}s — invalidating the cache immediately, no matter where the clock sits.`);
    startRebuild("on-demand", simClock);
  };

  const resetSimulation = () => {
    clearPendingRebuild();
    setRevalidateWindow(20);
    setSimClock(0);
    setCache({ version: 1, builtAt: 0 });
    setRebuilding(false);
    setRebuildTrigger(null);
    setLastRequest(null);
    setLog([]);
    isFirstVersionEffect.current = true;
  };

  let requestReadout = "Drag the clock, then press “Simulate a request” to see what a visitor would get.";
  if (lastRequest) {
    if (lastRequest.outcome === "fresh") {
      requestReadout = `t=${lastRequest.atSimTime}s → served v${lastRequest.version} instantly. FRESH — well within the ${revalidateWindow}s window, no rebuild triggered.`;
    } else if (lastRequest.outcome === "stale-triggered") {
      requestReadout = `t=${lastRequest.atSimTime}s → served v${lastRequest.version} instantly. STALE — the window had elapsed, so this request silently kicked off a background rebuild.`;
    } else {
      requestReadout = `t=${lastRequest.atSimTime}s → served v${lastRequest.version} instantly. STALE — a rebuild was already running in the background from an earlier request.`;
    }
  }

  return (
    <main className="playground">
      <header className="playground-header">
        <h1>ISR Timeline Simulator</h1>
        <p>
          A real, interactive React app — but ISR is fundamentally a server/CDN caching concept, so the actual page
          cache and rebuild here are a conceptual simulation, driven by a fake clock you control. Watch the top row
          below (what a request gets) and the bottom row (background regeneration) — they mirror the two-row
          timeline diagram in the post exactly.
        </p>
      </header>

      <section className="demo-area cache-card" aria-label="Simulated cached page">
        <div className="cache-card-header">
          <span className="cache-card-title">Cached page</span>
          <span className={`badge ${isCurrentlyStale ? "badge--stale" : "badge--fresh"}`}>
            {isCurrentlyStale ? "cache: stale" : "cache: fresh"}
          </span>
        </div>
        <div className="cache-card-version">v{cache.version}</div>
        <dl className="cache-card-meta">
          <div>
            <dt>Last built</dt>
            <dd>t={cache.builtAt}s (simulated)</dd>
          </div>
          <div>
            <dt>Simulated now</dt>
            <dd>t={simClock}s <span className="cache-card-elapsed">({elapsedSinceBuild}s since last build)</span></dd>
          </div>
        </dl>
        <div className={`badge badge--rebuild ${rebuilding ? "badge--rebuilding" : "badge--idle"}`}>
          {rebuilding
            ? `background rebuild: in progress (${rebuildTrigger === "on-demand" ? "on-demand" : "request-triggered"})`
            : "background rebuild: idle"}
        </div>
      </section>

      <output className="readout" aria-live="polite">{requestReadout}</output>

      <fieldset className="control-group">
        <legend>Revalidate window</legend>
        <div className="range-row">
          <span className="range-edge">{MIN_WINDOW}s</span>
          <div className="range-track">
            <input
              type="range"
              min={MIN_WINDOW}
              max={MAX_WINDOW}
              step={1}
              value={revalidateWindow}
              onChange={(event) => setRevalidateWindow(Number(event.target.value))}
              aria-label="Revalidate window in seconds"
            />
          </div>
          <span className="range-edge">{MAX_WINDOW}s</span>
        </div>
        <p className="tip">
          <code>export const revalidate = {revalidateWindow}</code> — the page becomes eligible for regeneration
          once this many simulated seconds have passed since the last build.
        </p>
      </fieldset>

      <fieldset className="control-group">
        <legend>Simulated clock (fast-forward time)</legend>
        <div className="range-row">
          <span className="range-edge">{MIN_CLOCK}s</span>
          <div className="range-track">
            <input
              type="range"
              min={MIN_CLOCK}
              max={MAX_CLOCK}
              step={1}
              value={simClock}
              onChange={(event) => setSimClock(Number(event.target.value))}
              aria-label="Simulated clock in seconds"
            />
          </div>
          <span className="range-edge">{MAX_CLOCK}s</span>
        </div>
        <p className="tip">
          Dragging this never rebuilds anything by itself — nothing in ISR regenerates on a timer. It only decides
          whether the NEXT simulated request lands inside or outside the revalidate window.
        </p>
      </fieldset>

      <div className="action-row">
        <button type="button" className="toggle-btn" onClick={handleSimulateRequest}>
          Simulate a request arriving now
        </button>
        <button type="button" className="toggle-btn toggle-btn--ondemand" onClick={handleOnDemandRevalidate}>
          Trigger on-demand revalidation
        </button>
        <button type="button" className="toggle-btn toggle-btn--reset" onClick={resetSimulation}>
          Reset
        </button>
      </div>

      <fieldset className="control-group">
        <legend>Activity log</legend>
        {log.length === 0 ? (
          <p className="tip">Nothing has happened yet — try simulating a request past the revalidate window.</p>
        ) : (
          <ol className="activity-log">
            {log.map((entry) => (
              <li key={entry.id}>{entry.text}</li>
            ))}
          </ol>
        )}
      </fieldset>
    </main>
  );
}
