import { useDeferredValue, useMemo, useState } from "react";
import { generateItems, isExpensiveMatch } from "./generateItems";
import "./styles.css";

const ITEMS = generateItems(4000);

export default function App() {
  const [query, setQuery] = useState("");

  // The INPUT itself always reflects `query` immediately — deferring happens only for the
  // expensive list below, which reads `deferredQuery` instead of `query` directly.
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  const filtered = useMemo(
    () => ITEMS.filter((item) => isExpensiveMatch(item, deferredQuery)).slice(0, 40),
    [deferredQuery]
  );

  return (
    <>
      <div className="wrapper">
        <h1 className="title">useDeferredValue</h1>
        <p className="subtitle">Type quickly into 4,000 deliberately expensive items — the input stays snappy while the filtered list lags a beat behind.</p>

        <input
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type to filter..."
          autoFocus
        />

        <p className="status">
          {isStale ? "List is stale, catching up..." : `${filtered.length} shown`}
        </p>

        <ul className={`list ${isStale ? "stale" : ""}`}>
          {filtered.map((item) => (
            <li key={item.id} className="list-item">
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
