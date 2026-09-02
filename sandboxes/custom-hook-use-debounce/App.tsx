import { useMemo, useState } from "react";
import { useDebounce } from "./useDebounce";
import "./styles.css";

const FRUITS = [
  "Apple", "Apricot", "Banana", "Blackberry", "Blueberry", "Cherry",
  "Cranberry", "Date", "Fig", "Grape", "Grapefruit", "Guava",
  "Kiwi", "Lemon", "Lime", "Lychee", "Mango", "Melon",
  "Nectarine", "Orange", "Papaya", "Passionfruit", "Peach", "Pear",
  "Persimmon", "Pineapple", "Plum", "Pomegranate", "Raspberry", "Strawberry"
];

export default function App() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const [searchCount, setSearchCount] = useState(0);
  const results = useMemo(
    () =>
      debouncedQuery
        ? FRUITS.filter((fruit) => fruit.toLowerCase().includes(debouncedQuery.toLowerCase()))
        : [],
    [debouncedQuery]
  );

  // Counts each newly settled non-empty value as one "search" — mirrors a real API call fired
  // per debounce. Comparing against state (not a ref) and updating state during render is the
  // React-recommended way to derive one piece of state from another's change; see "adjusting
  // state during render" in the React docs.
  const [lastCountedQuery, setLastCountedQuery] = useState(debouncedQuery);
  if (lastCountedQuery !== debouncedQuery) {
    setLastCountedQuery(debouncedQuery);
    if (debouncedQuery) setSearchCount((count) => count + 1);
  }

  return (
    <>
      <div className="wrapper">
        <h1 className="title">useDebounce in Action</h1>
        <p className="subtitle">
          Type a fruit name — the &quot;search&quot; only fires 500ms after you stop typing.
        </p>

        <input
          className="search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search fruits..."
          autoFocus
        />

        <div className="stats">
          <span>
            Keystrokes: <strong>{query.length}</strong>
          </span>
          <span>
            Searches fired: <strong>{searchCount}</strong>
          </span>
        </div>

        <ul className="results">
          {results.length > 0 ? (
            results.map((fruit) => <li key={fruit}>{fruit}</li>)
          ) : (
            <li className="empty">{debouncedQuery ? "No matches" : "Start typing to search"}</li>
          )}
        </ul>
      </div>
    </>
  );
}
