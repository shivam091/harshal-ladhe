import { useState } from "react";
import { countingNaturals, FILTERS, MAPS } from "./naturals";
import "./styles.css";

/*
  Iterator helper methods used below (Iterator.prototype.drop/filter/map/take) — real, chainable,
  and lazy at runtime, but not every TS lib target ships their types yet, so this shape stands in
  for them rather than reaching for `any` everywhere they're called.
*/
interface IteratorChain<T> {
  drop(n: number): IteratorChain<T>;
  filter(predicate: (value: T) => boolean): IteratorChain<T>;
  map<U>(transform: (value: T) => U): IteratorChain<U>;
  take(n: number): Iterable<T>;
}

// One completed run's inputs and outputs, kept around so the log can show more than the latest result.
interface RunResult {
  id: number;
  filterKey: string;
  mapKey: string;
  dropCount: number;
  takeCount: number;
  values: number[];
  pulls: number;
}

export default function App() {
  const [filterKey, setFilterKey] = useState("prime");
  const [mapKey, setMapKey] = useState("square");
  const [dropCount, setDropCount] = useState(0);
  const [takeCount, setTakeCount] = useState(5);
  const [runs, setRuns] = useState<RunResult[]>([]);
  const [nextId, setNextId] = useState(1);

  function run() {
    let pulls = 0;
    const source = countingNaturals(() => {
      pulls++;
    }) as unknown as IteratorChain<number>;

    const taken = source.drop(dropCount).filter(FILTERS[filterKey]).map(MAPS[mapKey]).take(takeCount);
    const values = [...taken];

    setRuns((prev) => [{ id: nextId, filterKey, mapKey, dropCount, takeCount, values, pulls }, ...prev].slice(0, 5));
    setNextId((id) => id + 1);
  }

  return (
    <>
      <div className="wrapper">
        <h1 className="title">Lazy Chains Over an Infinite Generator</h1>
        <p className="subtitle">
          Every run pulls values from an infinite counting generator (1, 2, 3, …) through
          .drop().filter().map().take() — never converted to an array first.
        </p>

        <div className="controls">
          <label className="field">
            Drop first
            <input
              type="number"
              min={0}
              max={50}
              value={dropCount}
              onChange={(e) => setDropCount(Number(e.target.value))}
            />
          </label>

          <label className="field">
            Filter
            <select value={filterKey} onChange={(e) => setFilterKey(e.target.value)}>
              <option value="even">even</option>
              <option value="odd">odd</option>
              <option value="prime">prime</option>
            </select>
          </label>

          <label className="field">
            Map
            <select value={mapKey} onChange={(e) => setMapKey(e.target.value)}>
              <option value="square">square</option>
              <option value="double">double</option>
              <option value="none">none</option>
            </select>
          </label>

          <label className="field">
            Take
            <input
              type="number"
              min={1}
              max={20}
              value={takeCount}
              onChange={(e) => setTakeCount(Number(e.target.value))}
            />
          </label>
        </div>

        <button className="run-btn" onClick={run}>
          Run Chain
        </button>

        <ul className="runs">
          {runs.length === 0 && <li className="empty">Run the chain to see results.</li>}
          {runs.map((r) => (
            <li key={r.id} className="run">
              <p className="run-expr">
                naturals().drop({r.dropCount}).filter({r.filterKey}).map({r.mapKey}).take({r.takeCount})
              </p>
              <p className="run-values">[{r.values.join(", ")}]</p>
              <p className="run-pulls">generator pulled {r.pulls} value{r.pulls === 1 ? "" : "s"} — not infinity</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
