import { useMemo, useState } from "react";
import { authMiddleware } from "./authMiddleware";
import "./styles.css";

const PATHS = ["/", "/pricing", "/dashboard", "/settings", "/billing"];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pathname, setPathname] = useState("/dashboard");

  const decision = useMemo(() => authMiddleware({ pathname, isAuthenticated }), [pathname, isAuthenticated]);

  return (
    <>
      <div className="wrapper">
        <h1 className="title">Edge Middleware: Auth Gating</h1>
        <p className="subtitle">The exact decision function a real middleware.ts would run — pick a path and toggle auth state.</p>

        <label className="toggle">
          <input type="checkbox" checked={isAuthenticated} onChange={(e) => setIsAuthenticated(e.target.checked)} />
          Logged in
        </label>

        <div className="path-buttons">
          {PATHS.map((path) => (
            <button
              key={path}
              className={pathname === path ? "path-btn active" : "path-btn"}
              onClick={() => setPathname(path)}
            >
              {path}
            </button>
          ))}
        </div>

        <div className={`decision ${decision.type}`}>
          {decision.type === "next" ? (
            <span>Request allowed through to {pathname}</span>
          ) : (
            <span>Redirected to {decision.to}</span>
          )}
        </div>
      </div>
    </>
  );
}
