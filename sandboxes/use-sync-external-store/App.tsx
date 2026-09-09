import { useSyncExternalStore } from "react";
import { subscribe, getSnapshot, increment } from "./counterStore";
import "./styles.css";

// Two independent components, each subscribed to the SAME external store on their own — neither
// knows the other exists, yet both stay in lockstep because they read the one shared snapshot.
function Consumer({ name }: { name: string }) {
  const count = useSyncExternalStore(subscribe, getSnapshot);
  return (
    <div className="consumer">
      <p className="consumer-name">{name}</p>
      <p className="consumer-count">{count}</p>
    </div>
  );
}

export default function App() {
  return (
    <>
      <div className="wrapper">
        <h1 className="title">useSyncExternalStore</h1>
        <p className="subtitle">Neither panel below holds its own state — both read the SAME external store, updated from outside React entirely.</p>

        <button className="increment-btn" type="button" onClick={increment}>
          store.increment() — not setState
        </button>

        <div className="consumers">
          <Consumer name="Header badge" />
          <Consumer name="Sidebar counter" />
        </div>
      </div>
    </>
  );
}
