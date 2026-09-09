import { useState } from "react";
import { handleGetPosts, handleGetPost, handleCreatePost } from "./postsApi";
import type { ApiResult } from "./postsApi";
import "./styles.css";

type Endpoint = "list" | "one" | "create";

const ENDPOINTS: { id: Endpoint; label: string; method: string }[] = [
  { id: "list", label: "/api/posts", method: "GET" },
  { id: "one", label: "/api/posts/1", method: "GET" },
  { id: "create", label: "/api/posts", method: "POST" },
];

export default function App() {
  const [endpoint, setEndpoint] = useState<Endpoint>("list");
  const [body, setBody] = useState('{ "title": "New Post" }');
  const [result, setResult] = useState<ApiResult | null>(null);

  function send() {
    if (endpoint === "list") setResult(handleGetPosts());
    else if (endpoint === "one") setResult(handleGetPost(1));
    else setResult(handleCreatePost(body));
  }

  return (
    <>
      <div className="wrapper">
        <h1 className="title">Route Handlers</h1>
        <p className="subtitle">Each button below calls a function shaped exactly like a real app/api/.../route.ts export.</p>

        <div className="endpoint-row">
          {ENDPOINTS.map((e) => (
            <button
              key={e.id}
              className={`endpoint-btn ${endpoint === e.id ? "active" : ""}`}
              type="button"
              onClick={() => setEndpoint(e.id)}
            >
              <span className="method">{e.method}</span> {e.label}
            </button>
          ))}
        </div>

        {endpoint === "create" && (
          <textarea className="body-input" value={body} onChange={(e) => setBody(e.target.value)} rows={3} />
        )}

        <button className="send-btn" type="button" onClick={send}>
          Send request
        </button>

        {result && (
          <pre className={`response ${result.status >= 400 ? "error" : "success"}`}>
            {result.status} {"\n"}
            {JSON.stringify(result.body, null, 2)}
          </pre>
        )}
      </div>
    </>
  );
}
