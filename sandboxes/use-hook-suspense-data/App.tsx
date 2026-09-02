import { Suspense, use, useState } from "react";
import { getUserPromise } from "./userResource";
import { ThemeContext } from "./ThemeContext";
import "./styles.css";

// Suspends via use(promise) until the cached promise for `userId` resolves — the nearest <Suspense> above shows its fallback meanwhile.
function UserCard({ userId }: { userId: number }) {
  const user = use(getUserPromise(userId));
  return (
    <div className="user-card">
      <p className="user-name">{user.name}</p>
      <p className="user-role">{user.role}</p>
    </div>
  );
}

// use(context) instead of useContext(context) — the only way to read a context from inside a plain conditional like this one.
function ThemeNote({ show }: { show: boolean }) {
  if (!show) return null;
  const theme = use(ThemeContext);
  return <p className="theme-note">Current theme (read conditionally): {theme}</p>;
}

export default function App() {
  const [userId, setUserId] = useState(1);
  const [showTheme, setShowTheme] = useState(false);

  return (
    <>
      <div className="wrapper">
        <h1 className="title">Reading Promises and Context with use()</h1>
        <p className="subtitle">Switch users to see the Suspense fallback re-trigger, and toggle the theme note to see use() called conditionally.</p>

        <div className="button-row">
          <button className="run-btn" onClick={() => setUserId(1)}>
            Load User 1
          </button>
          <button className="run-btn" onClick={() => setUserId(2)}>
            Load User 2
          </button>
        </div>

        <Suspense fallback={<p className="loading">Loading user…</p>}>
          <UserCard key={userId} userId={userId} />
        </Suspense>

        <label className="toggle">
          <input type="checkbox" checked={showTheme} onChange={(e) => setShowTheme(e.target.checked)} />
          Show theme note (calls use(ThemeContext) conditionally)
        </label>

        <ThemeContext.Provider value="dark">
          <ThemeNote show={showTheme} />
        </ThemeContext.Provider>
      </div>
    </>
  );
}
