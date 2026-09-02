import { useState } from "react";
import { TRANSACTIONS, groupByReduce } from "./transactions";
import type { Transaction } from "./transactions";
import "./styles.css";

// The two keying strategies the demo toggles between — one groups by a string, the other by a boolean.
const KEY_FNS: Record<"category" | "isLarge", (t: Transaction) => string | boolean> = {
  category: (t) => t.category,
  isLarge: (t) => t.amount >= 100
};

export default function App() {
  const [keyName, setKeyName] = useState<"category" | "isLarge">("category");
  const keyFn = KEY_FNS[keyName];

  /*
    Object.groupBy's real type only accepts a PropertyKey-returning keyFn — but the runtime itself
    coerces any key (via ToPropertyKey) regardless, which is exactly the boolean-to-string
    coercion this demo exists to show. The cast below reflects that runtime behavior, not a
    limitation being worked around.
  */
  const objectGroups = Object.groupBy(TRANSACTIONS, keyFn as (t: Transaction) => PropertyKey);
  const mapGroups = Map.groupBy(TRANSACTIONS, keyFn);
  const reduceGroups = groupByReduce(TRANSACTIONS, keyFn as (t: Transaction) => PropertyKey);

  return (
    <>
      <div className="wrapper">
        <h1 className="title">Object.groupBy vs. Map.groupBy</h1>
        <p className="subtitle">Same 8 transactions, same key function — grouped three ways.</p>

        <div className="toggle-row">
          <button className={keyName === "category" ? "toggle active" : "toggle"} onClick={() => setKeyName("category")}>
            key: category (string)
          </button>
          <button className={keyName === "isLarge" ? "toggle active" : "toggle"} onClick={() => setKeyName("isLarge")}>
            key: amount &ge; 100 (boolean)
          </button>
        </div>

        <div className="panel">
          <p className="panel-label">Object.groupBy — keys coerced to strings</p>
          <ul className="key-list">
            {Object.entries(objectGroups).map(([key, items]) => (
              <li key={key}>
                <code>&quot;{key}&quot;</code> ({typeof key}) — {items!.length} item{items!.length === 1 ? "" : "s"}
              </li>
            ))}
          </ul>
        </div>

        <div className="panel">
          <p className="panel-label">Map.groupBy — keys keep their real type</p>
          <ul className="key-list">
            {[...mapGroups.entries()].map(([key, items]) => (
              <li key={String(key)}>
                <code>{JSON.stringify(key)}</code> ({typeof key}) — {items.length} item{items.length === 1 ? "" : "s"}
              </li>
            ))}
          </ul>
        </div>

        <div className="panel">
          <p className="panel-label">Manual reduce (pre-ES2024 equivalent) — matches Object.groupBy&apos;s shape</p>
          <ul className="key-list">
            {Object.entries(reduceGroups).map(([key, items]) => (
              <li key={key}>
                <code>&quot;{key}&quot;</code> — {(items as Transaction[]).length} item{(items as Transaction[]).length === 1 ? "" : "s"}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
