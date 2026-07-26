import { useState, useRef, useId } from "react";
import "./styles.css";

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

const INITIAL_TODOS: Todo[] = [
  { id: 1, text: "Build a todo app", done: true },
  { id: 2, text: "Add TypeScript types", done: false },
  { id: 3, text: "Style it nicely", done: false },
];

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(INITIAL_TODOS);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  function add() {
    const text = input.trim();
    if (!text) return;
    setTodos((prev) => [...prev, { id: Date.now(), text, done: false }]);
    setInput("");
    inputRef.current?.focus();
  }

  function toggle(id: number) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  function remove(id: number) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  const remaining = todos.filter((t) => !t.done).length;

  return (
    <div className="wrapper">
      <header className="header">
        <h1 className="title">Todos</h1>
        {todos.length > 0 && (
          <span className="badge">{remaining} of {todos.length} left</span>
        )}
      </header>

      <div className="input-row">
        <label htmlFor={inputId} className="sr-only">New todo</label>
        <input
          id={inputId}
          ref={inputRef}
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="What needs doing?"
        />
        <button className="btn-add" onClick={add} aria-label="Add todo">
          Add
        </button>
      </div>

      {todos.length === 0 ? (
        <p className="empty">Nothing here yet — add something above!</p>
      ) : (
        <ul className="list" role="list">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`item${todo.done ? " item--done" : ""}`}
            >
              <button
                className="check"
                onClick={() => toggle(todo.id)}
                aria-pressed={todo.done}
                aria-label={todo.done ? "Mark incomplete" : "Mark complete"}
              >
                {todo.done ? "✓" : ""}
              </button>
              <span className="text">{todo.text}</span>
              <button
                className="remove"
                onClick={() => remove(todo.id)}
                aria-label={`Remove "${todo.text}"`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
