import { useState } from "react";
import "./styles.css";

// The board only ever has these two columns — a task's column is the only thing that changes on drop.
type Column = "todo" | "done";

// One card on the board.
interface Task {
  id: string;
  label: string;
  column: Column;
}

const INITIAL_TASKS: Task[] = [
  { id: "1", label: "Write the proposal", column: "todo" },
  { id: "2", label: "Review pull request", column: "todo" },
  { id: "3", label: "Fix the flaky test", column: "done" },
];

// Column ids in render order, paired with their display title.
const COLUMNS: Array<{ id: Column; title: string }> = [
  { id: "todo", title: "To Do" },
  { id: "done", title: "Done" },
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [dragOverColumn, setDragOverColumn] = useState<Column | null>(null);

  // Stashes the dragged card's id on the native DataTransfer object — the only channel a drag event has for passing data from the source to whatever it's eventually dropped on.
  function handleDragStart(event: React.DragEvent<HTMLDivElement>, id: string) {
    event.dataTransfer.setData("text/plain", id);
    event.dataTransfer.effectAllowed = "move";
  }

  // preventDefault() here is what tells the browser this element accepts the drop — skip it and ondrop never fires at all.
  function handleDragOver(event: React.DragEvent<HTMLDivElement>, column: Column) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDragOverColumn(column);
  }

  function handleDragLeave() {
    setDragOverColumn(null);
  }

  // Reads the id stashed during dragstart back out of DataTransfer and moves that task into this column.
  function handleDrop(event: React.DragEvent<HTMLDivElement>, column: Column) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain");
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, column } : task)));
    setDragOverColumn(null);
  }

  return (
    <>
      <div className="wrapper">
        <h1 className="title">Drag &amp; Drop Task Board</h1>
        <p className="subtitle">Drag a card into the other column — nothing here is a library, just draggable and a few native events.</p>
        <div className="board">
          {COLUMNS.map((col) => (
            <div
              key={col.id}
              className={`column${dragOverColumn === col.id ? " drag-over" : ""}`}
              onDragOver={(event) => handleDragOver(event, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(event) => handleDrop(event, col.id)}
            >
              <p className="column-title">{col.title}</p>
              {tasks
                .filter((task) => task.column === col.id)
                .map((task) => (
                  <div
                    key={task.id}
                    className="card"
                    draggable
                    onDragStart={(event) => handleDragStart(event, task.id)}
                  >
                    {task.label}
                  </div>
                ))}
              {tasks.every((task) => task.column !== col.id) && <p className="empty">Drop here</p>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
