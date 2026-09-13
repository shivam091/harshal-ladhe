import { useState } from "react";
import "./styles.css";

// One generated item — id comes straight from crypto.randomUUID(), never hand-assembled.
interface Item {
  id: string;
  label: string;
}

export default function App() {
  const [items, setItems] = useState<Item[]>([]);

  // Adds a new item with a fresh crypto.randomUUID() as its id — no counter, no timestamp, no collision bookkeeping.
  function addItem() {
    setItems((prev) => [...prev, { id: crypto.randomUUID(), label: `Item ${prev.length + 1}` }]);
  }

  return (
    <>
      <div className="wrapper">
        <h1 className="title">crypto.randomUUID()</h1>
        <button type="button" className="add-btn" onClick={addItem}>
          Add item
        </button>
        <ul className="item-list">
          {items.length === 0 && <li className="empty">Nothing added yet.</li>}
          {items.map((item) => (
            <li key={item.id} className="item">
              <span className="item-label">{item.label}</span>
              <span className="item-id">{item.id}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
