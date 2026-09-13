import { useState } from "react";
import "./styles.css";

const INITIAL_ITEMS = [
  "Write the proposal",
  "Review pull request",
  "Fix the flaky test",
  "Update the changelog",
  "Ship it",
];

export default function App() {
  const [items, setItems] = useState<string[]>(INITIAL_ITEMS);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  function handleDragStart(event: React.DragEvent<HTMLLIElement>, index: number) {
    setDraggedIndex(index);
    event.dataTransfer.effectAllowed = "move";
    // Some browsers require SOME data to be set for a drag to register at all — the value itself is never read back, since draggedIndex (React state) is already tracking which row is being dragged.
    event.dataTransfer.setData("text/plain", String(index));
  }

  // Reorders the array live the moment the dragged row crosses over a new position — by the time drop fires, the list is already in its final order.
  function handleDragOver(event: React.DragEvent<HTMLLIElement>, overIndex: number) {
    event.preventDefault();
    if (draggedIndex === null || draggedIndex === overIndex) return;

    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(draggedIndex, 1);
      next.splice(overIndex, 0, moved);
      return next;
    });
    setDraggedIndex(overIndex);
  }

  // The reorder already happened during dragover above — drop only needs preventDefault to formally accept it.
  function handleDrop(event: React.DragEvent<HTMLLIElement>) {
    event.preventDefault();
  }

  function handleDragEnd() {
    setDraggedIndex(null);
  }

  return (
    <>
      <div className="wrapper">
        <h1 className="title">Reorder a List</h1>
        <p className="subtitle">Drag any row up or down — the array reorders live as you cross over each neighbor.</p>
        <ul className="list">
          {items.map((item, index) => (
            <li
              key={item}
              className={`row${index === draggedIndex ? " dragging" : ""}`}
              draggable
              onDragStart={(event) => handleDragStart(event, index)}
              onDragOver={(event) => handleDragOver(event, index)}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
            >
              <span className="handle" aria-hidden="true">⠿</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
