import { useState, useTransition } from "react";
import type { ChangeEvent } from "react";
import { ITEMS, filterItems } from "./items";
import "./styles.css";

export default function App() {
  const [useTransitionEnabled, setUseTransitionEnabled] = useState(true);
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState(ITEMS);
  const [isPending, startTransition] = useTransition();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    // Urgent — always applied immediately, so the input itself never lags regardless of the toggle below.
    setQuery(value);

    if (useTransitionEnabled) {
      // Non-urgent — React can interrupt this work (e.g. if you keep typing) instead of blocking the input on it.
      startTransition(() => {
        setFiltered(filterItems(ITEMS, value));
      });
    } else {
      // Same expensive filter, but as a normal synchronous update — it blocks the input's own re-render until it finishes.
      setFiltered(filterItems(ITEMS, value));
    }
  }

  return (
    <>
      <div className="wrapper">
        <h1 className="title">Keeping Input Responsive with useTransition</h1>
        <p className="subtitle">
          Type quickly in the box below. With the transition on, typing stays smooth while the (deliberately expensive) list filter lags behind. Turn it off and typing itself starts to stutter.
        </p>

        <label className="toggle">
          <input
            type="checkbox"
            checked={useTransitionEnabled}
            onChange={(e) => setUseTransitionEnabled(e.target.checked)}
          />
          Use useTransition for the filter
        </label>

        <input className="search-input" value={query} onChange={handleChange} placeholder="Type to filter 4,000 items…" autoFocus />

        <p className="status">
          {isPending ? "Updating list…" : `${filtered.length} match${filtered.length === 1 ? "" : "es"}`}
        </p>

        <ul className={isPending ? "results pending" : "results"}>
          {filtered.slice(0, 25).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
