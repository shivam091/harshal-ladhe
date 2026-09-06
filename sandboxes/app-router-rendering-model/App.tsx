import { useEffect, useRef, useState } from "react";
import "./shared/playground.css";
import "./shared/tabs.css";
import "./styles.css";

/*
  This is a real, running React app — but it's still a conceptual simulator, not real Next.js code. It
  cannot run an actual Next.js server, and the "use client" propagation / streaming timeline below are
  re-implemented with plain React state, not real Server/Client Component semantics. It exists to make the
  server/client boundary and the streaming timeline from the post tangible through direct interaction.
*/

type Mode = "boundary" | "streaming";

/* ----------------------------- Boundary Simulator panel ----------------------------- */

type NodeId = "page" | "header" | "sidebar" | "content" | "article" | "likebutton";

// Parent of each toggleable node — walking this chain up to the root is how client-ness propagates down
// in the real App Router: a node renders as client if IT or ANY ancestor has "use client".
const TREE_PARENT: Record<NodeId, NodeId | null> = {
  page: null,
  header: "page",
  sidebar: "page",
  content: "page",
  article: "content",
  likebutton: "content"
};

const NODE_LABELS: Record<NodeId, string> = {
  page: "Page",
  header: "Header",
  sidebar: "Sidebar",
  content: "Content",
  article: "Article",
  likebutton: "LikeButton"
};

const TOGGLEABLE_IDS = Object.keys(TREE_PARENT) as NodeId[];

function isEffectivelyClient(id: NodeId, ownClientFlags: Set<NodeId>): boolean {
  let current: NodeId | null = id;
  while (current) {
    if (ownClientFlags.has(current)) return true;
    current = TREE_PARENT[current];
  }
  return false;
}

interface TreeNodeButtonProps {
  id: NodeId;
  label: string;
  client: boolean;
  onToggle: (id: NodeId) => void;
}

function TreeNodeButton({ id, label, client, onToggle }: TreeNodeButtonProps) {
  return (
    <button
      type="button"
      className={`tree-node${client ? " tree-node--client" : ""}`}
      aria-pressed={client}
      onClick={() => onToggle(id)}
    >
      {label}
    </button>
  );
}

function BoundarySimulator() {
  const [ownClientFlags, setOwnClientFlags] = useState<Set<NodeId>>(new Set());

  const toggle = (id: NodeId) => {
    setOwnClientFlags((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clientIds = TOGGLEABLE_IDS.filter((id) => isEffectivelyClient(id, ownClientFlags));
  const inheritedIds = clientIds.filter((id) => !ownClientFlags.has(id));

  let output: string;
  if (clientIds.length === 0) {
    output = 'No "use client" anywhere in this subtree — every node here is a Server Component. Zero JS shipped for any of them.';
  } else {
    const lines = [`Client Components: ${clientIds.map((id) => NODE_LABELS[id]).join(", ")}`];
    if (inheritedIds.length > 0) {
      lines.push(`(${inheritedIds.map((id) => NODE_LABELS[id]).join(", ")} inherited it from an ancestor — not toggled directly.)`);
    }
    lines.push(`${clientIds.length} of ${TOGGLEABLE_IDS.length} nodes now ship JS to the browser.`);
    output = lines.join("\n");
  }

  return (
    <>
      <section className="demo-area tree-demo-area" aria-label="Simulated App Router component tree">
        <div className="tree">
          <div className="tree-node-wrap tree-node-wrap--fixed">
            <div className="tree-node tree-node--server tree-node--fixed">layout.tsx</div>
            <span className="tree-node-caption">always server</span>
          </div>

          <div className="tree-connector" />

          <div className="tree-node-wrap">
            <TreeNodeButton id="page" label="Page (page.tsx)" client={isEffectivelyClient("page", ownClientFlags)} onToggle={toggle} />
          </div>

          <div className="tree-connector" />

          <div className="tree-row">
            <div className="tree-branch">
              <TreeNodeButton id="header" label="Header" client={isEffectivelyClient("header", ownClientFlags)} onToggle={toggle} />
            </div>
            <div className="tree-branch">
              <TreeNodeButton id="sidebar" label="Sidebar" client={isEffectivelyClient("sidebar", ownClientFlags)} onToggle={toggle} />
            </div>
            <div className="tree-branch">
              <TreeNodeButton id="content" label="Content" client={isEffectivelyClient("content", ownClientFlags)} onToggle={toggle} />
              <div className="tree-connector tree-connector--small" />
              <div className="tree-row tree-row--nested">
                <TreeNodeButton id="article" label="Article" client={isEffectivelyClient("article", ownClientFlags)} onToggle={toggle} />
                <TreeNodeButton id="likebutton" label="LikeButton" client={isEffectivelyClient("likebutton", ownClientFlags)} onToggle={toggle} />
              </div>
            </div>
          </div>

          <div className="tree-connector" />

          <div className="tree-node-wrap tree-node-wrap--fixed">
            <div className="tree-node tree-node--server tree-node--fixed">loading.tsx</div>
            <span className="tree-node-caption">auto Suspense boundary</span>
          </div>

          <div className="tree-node-wrap tree-node-wrap--fixed">
            <div className="tree-node tree-node--client tree-node--fixed">error.tsx</div>
            <span className="tree-node-caption">forced client — needs state</span>
          </div>
        </div>
      </section>

      <output className="readout" aria-live="polite">{output}</output>

      <fieldset className="control-group">
        <legend>How to use</legend>
        <p className="tip">
          Click any node under Page to toggle its own <code>&quot;use client&quot;</code>. layout.tsx, loading.tsx,
          and error.tsx aren&apos;t toggleable — they&apos;re pinned to what the framework actually forces. Every
          descendant of a client node ships as client JS too, whether or not you toggled it directly, the same
          propagation rule the post&apos;s boundary-placement diagram shows.
        </p>
      </fieldset>
    </>
  );
}

/* ----------------------------- Streaming Timeline panel ----------------------------- */

// Conceptual delay before the slow data section "resolves" — not a real measurement, just long enough to
// see the shell-first vs. wait-for-everything contrast play out.
const DATA_DELAY_MS = 1800;

type StreamingPhase = "idle" | "first" | "second";

interface BarState {
  widthPercent: number;
  className: string;
  text: string;
}

function StreamingTimeline() {
  const [streaming, setStreaming] = useState(true);
  const [phase, setPhase] = useState<StreamingPhase>("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const clearPending = () => {
    if (timeoutRef.current !== undefined) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  };

  useEffect(() => clearPending, []);

  const runSimulation = () => {
    clearPending();
    setPhase("first");
    timeoutRef.current = setTimeout(() => setPhase("second"), DATA_DELAY_MS);
  };

  const resetStreaming = () => {
    clearPending();
    setPhase("idle");
  };

  let shell: BarState = { widthPercent: 0, className: "timeline-bar--waiting", text: "" };
  let data: BarState = { widthPercent: 0, className: "timeline-bar--waiting", text: "" };
  let output = 'Press "Simulate page load" to begin.';

  if (phase === "first") {
    if (streaming) {
      shell = { widthPercent: 100, className: "timeline-bar--shell", text: "shell painted" };
      data = { widthPercent: 100, className: "timeline-bar--fallback", text: "loading.tsx fallback" };
      output = "t=0ms — shell painted. Data section shows its loading.tsx fallback while the slow query runs.";
    } else {
      shell = { widthPercent: 100, className: "timeline-bar--waiting", text: "blank — waiting" };
      data = { widthPercent: 100, className: "timeline-bar--waiting", text: "blank — waiting" };
      output = "t=0ms — nothing visible yet. Without a loading.tsx / Suspense boundary, the whole page waits for the slowest part.";
    }
  } else if (phase === "second") {
    if (streaming) {
      shell = { widthPercent: 100, className: "timeline-bar--shell", text: "shell painted" };
      data = { widthPercent: 100, className: "timeline-bar--ready", text: "data streamed in" };
      output = `t≈${DATA_DELAY_MS}ms — data section streamed in. The shell has been visible and interactive this whole time.`;
    } else {
      shell = { widthPercent: 100, className: "timeline-bar--shell", text: "shell appears" };
      data = { widthPercent: 100, className: "timeline-bar--ready", text: "data appears" };
      output = `t≈${DATA_DELAY_MS}ms — the full page appears all at once, shell included, even though the shell itself was ready almost instantly.`;
    }
  }

  return (
    <>
      <section className="demo-area streaming-demo-area" aria-label="Streaming timeline preview">
        <div className="timeline-row">
          <span className="timeline-label">Shell (nav/header)</span>
          <div className="timeline-track">
            <div className={`timeline-bar ${shell.className}`} style={{ inlineSize: `${shell.widthPercent}%` }}>{shell.text}</div>
          </div>
        </div>
        <div className="timeline-row">
          <span className="timeline-label">Data section</span>
          <div className="timeline-track">
            <div className={`timeline-bar ${data.className}`} style={{ inlineSize: `${data.widthPercent}%` }}>{data.text}</div>
          </div>
        </div>
      </section>

      <output className="readout" aria-live="polite">{output}</output>

      <fieldset className="control-group">
        <legend>Streaming</legend>
        <div className="fields-grid">
          <label className="checkbox-field" htmlFor="streaming-toggle">
            <input
              type="checkbox"
              id="streaming-toggle"
              checked={streaming}
              onChange={(event) => {
                setStreaming(event.target.checked);
                resetStreaming();
              }}
            />
            <span>Stream the slow section separately (<code>loading.tsx</code> / <code>&lt;Suspense&gt;</code>)</span>
          </label>
        </div>
        <button type="button" className="toggle-btn" onClick={runSimulation}>Simulate page load</button>
        <p className="tip">
          Checked: the shell paints immediately and the data section shows a fallback until it streams in.
          Unchecked: nothing paints until every part of the page — fast and slow — is ready at once.
        </p>
      </fieldset>
    </>
  );
}

/* ----------------------------- App shell / tabs ----------------------------- */

export default function App() {
  const [mode, setMode] = useState<Mode>("boundary");

  return (
    <main className="playground">
      <header className="playground-header">
        <h1>App Router Rendering Model Simulator</h1>
        <p>
          A real React app, but still a <strong>conceptual simulator</strong> — it re-implements the server/client
          boundary and streaming timeline from the post with plain React state, not an actual Next.js server. It
          exists to make both ideas tangible through direct interaction.
        </p>
      </header>

      <div className="tabs" role="tablist" aria-label="Playground mode">
        <button
          type="button"
          className={`tab${mode === "boundary" ? " tab--active" : ""}`}
          role="tab"
          aria-selected={mode === "boundary"}
          onClick={() => setMode("boundary")}
        >
          Boundary Simulator
        </button>
        <button
          type="button"
          className={`tab${mode === "streaming" ? " tab--active" : ""}`}
          role="tab"
          aria-selected={mode === "streaming"}
          onClick={() => setMode("streaming")}
        >
          Streaming Timeline
        </button>
      </div>

      <div className={`tab-panel${mode === "boundary" ? " tab-panel--active" : ""}`}>
        {mode === "boundary" && <BoundarySimulator />}
      </div>
      <div className={`tab-panel${mode === "streaming" ? " tab-panel--active" : ""}`}>
        {mode === "streaming" && <StreamingTimeline />}
      </div>
    </main>
  );
}
