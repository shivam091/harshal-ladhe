import { useEffect, useState } from "react";
import "./styles.css";

// The three "pages" this mini SPA can show, keyed by pathname.
const PAGES: Record<string, { title: string; body: string }> = {
  "/": { title: "Home", body: "Welcome — pick a link above, then try the Back/Forward buttons below." },
  "/about": { title: "About", body: "A tiny history.pushState() demo — no router library involved anywhere." },
  "/contact": { title: "Contact", body: "This panel changed without a single page reload." },
};

const PATHS = Object.keys(PAGES);

function resolvePath(path: string): string {
  return path in PAGES ? path : "/";
}

export default function App() {
  const [path, setPath] = useState(() => resolvePath(window.location.pathname));

  useEffect(() => {
    // Fires on the browser's real Back/Forward buttons (and history.back()/forward() below) — NOT on pushState itself, which is why navigate() updates state directly instead of relying on this listener for forward navigation.
    function handlePopState() {
      setPath(resolvePath(window.location.pathname));
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Pushes a new history entry for the given path and updates the rendered page — pushState alone doesn't fire any event or trigger any re-render on its own.
  function navigate(nextPath: string) {
    if (nextPath === path) return;
    window.history.pushState({}, "", nextPath);
    setPath(nextPath);
  }

  const page = PAGES[path];

  return (
    <>
      <div className="wrapper">
        <h1 className="title">history.pushState() Navigation</h1>

        <nav className="nav">
          {PATHS.map((p) => (
            <button key={p} type="button" className={p === path ? "active" : ""} onClick={() => navigate(p)}>
              {PAGES[p].title}
            </button>
          ))}
        </nav>

        <div className="browser-controls">
          <button type="button" onClick={() => window.history.back()}>◀ Back</button>
          <button type="button" onClick={() => window.history.forward()}>Forward ▶</button>
        </div>

        <div className="page">
          <p className="page-path">{path}</p>
          <h2>{page.title}</h2>
          <p>{page.body}</p>
        </div>
      </div>
    </>
  );
}
