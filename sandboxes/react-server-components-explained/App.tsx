import { useMemo, useState } from "react";
import "./shared/playground.css";
import "./styles.css";

/*
  This is a real, running React app — every click below calls a real useState setter and re-renders
  real JSX; the KB tally is real arithmetic over real component state. What it visualizes is still a
  conceptual simulator, not literal Server/Client Component execution: this sandbox cannot run an
  actual Server Component, because a Server Component's entire point is that it never reaches the
  browser in the first place. The propagation rule it demonstrates — marking one component
  "use client" drags every descendant of it into the client bundle too, whether or not that descendant
  was toggled directly — is the real rule from the post, just re-implemented here with plain component
  state instead of an actual bundler/server boundary.
*/

type NodeId =
  | "app"
  | "layout"
  | "header"
  | "sidebar"
  | "usermenu"
  | "avatar"
  | "maincontent"
  | "postlist"
  | "commentbox";

// Parent of every node in the tree below — walking this chain up to the root is how "use client"
// propagates downward in the real RSC model: a component renders as client if IT or ANY ancestor is
// a Client Component, never just because it was toggled directly.
const TREE_PARENT: Record<NodeId, NodeId | null> = {
  app: null,
  layout: "app",
  header: "layout",
  sidebar: "layout",
  usermenu: "sidebar",
  avatar: "usermenu",
  maincontent: "layout",
  postlist: "maincontent",
  commentbox: "maincontent"
};

const NODE_LABELS: Record<NodeId, string> = {
  app: "App",
  layout: "Layout",
  header: "Header",
  sidebar: "Sidebar",
  usermenu: "UserMenu",
  avatar: "Avatar",
  maincontent: "MainContent",
  postlist: "PostList",
  commentbox: "CommentBox"
};

// Illustrative per-component JS weight in KB if that component ends up shipped as client code — rough,
// made-up numbers, just concrete enough to make the running tally below feel real as you click around.
const NODE_KB: Record<NodeId, number> = {
  app: 1.5,
  layout: 2.5,
  header: 3,
  sidebar: 2,
  usermenu: 5.5,
  avatar: 1.5,
  maincontent: 2.5,
  postlist: 6.5,
  commentbox: 8.5
};

const ALL_IDS = Object.keys(TREE_PARENT) as NodeId[];
const TOTAL_KB = ALL_IDS.reduce((sum, id) => sum + NODE_KB[id], 0);

// Walks a node's ancestor chain (including itself) looking for an explicit "use client" toggle —
// mirrors how client-ness inherits downward through a real component tree.
function isEffectivelyClient(id: NodeId, ownClientIds: Set<NodeId>): boolean {
  let current: NodeId | null = id;
  while (current) {
    if (ownClientIds.has(current)) return true;
    current = TREE_PARENT[current];
  }
  return false;
}

interface TreeNodeButtonProps {
  id: NodeId;
  isOwn: boolean;
  isClient: boolean;
  onToggle: (id: NodeId) => void;
}

function TreeNodeButton({ id, isOwn, isClient, onToggle }: TreeNodeButtonProps) {
  return (
    <button
      type="button"
      className={`tree-node${isClient ? " tree-node--client" : ""}${isOwn ? " tree-node--own" : ""}`}
      aria-pressed={isClient}
      onClick={() => onToggle(id)}
    >
      <span className="tree-node-label">{NODE_LABELS[id]}</span>
      <span className="tree-node-kb">{NODE_KB[id]}kb</span>
    </button>
  );
}

export default function App() {
  const [ownClientIds, setOwnClientIds] = useState<Set<NodeId>>(new Set());

  const toggle = (id: NodeId) => {
    setOwnClientIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const reset = () => setOwnClientIds(new Set());

  const clientIds = useMemo(
    () => ALL_IDS.filter((id) => isEffectivelyClient(id, ownClientIds)),
    [ownClientIds]
  );
  const shippedKb = useMemo(
    () => clientIds.reduce((sum, id) => sum + NODE_KB[id], 0),
    [clientIds]
  );
  const shippedPercent = TOTAL_KB === 0 ? 0 : Math.round((shippedKb / TOTAL_KB) * 100);

  const renderNode = (id: NodeId) => (
    <TreeNodeButton id={id} isOwn={ownClientIds.has(id)} isClient={clientIds.includes(id)} onToggle={toggle} />
  );

  let readout: string;
  if (clientIds.length === 0) {
    readout = 'No "use client" anywhere in this tree — every node is a Server Component. 0kb of it ships to the browser.';
  } else {
    readout = `${clientIds.length} of ${ALL_IDS.length} nodes now ship as client JS: ${clientIds.map((id) => NODE_LABELS[id]).join(", ")}.`;
  }

  return (
    <main className="playground">
      <header className="playground-header">
        <h1>Component Tree Visualizer</h1>
        <p>
          A real, interactive React app — click any node to toggle its own <code>&quot;use client&quot;</code>.
          The tree, the propagation logic, and the KB tally below are all real state and real
          arithmetic. What&apos;s <strong>illustrative</strong> is the premise itself: this sandbox can&apos;t
          run an actual Server Component, since a Server Component&apos;s entire point is that it never
          reaches the browser at all.
        </p>
      </header>

      <section className="demo-area tree-demo-area" aria-label="Component tree">
        <div className="tree">
          <div className="tree-node-wrap">{renderNode("app")}</div>

          <div className="tree-connector" />

          <div className="tree-node-wrap">{renderNode("layout")}</div>

          <div className="tree-connector" />

          <div className="tree-row">
            <div className="tree-branch">
              {renderNode("header")}
            </div>

            <div className="tree-branch">
              {renderNode("sidebar")}
              <div className="tree-connector tree-connector--small" />
              {renderNode("usermenu")}
              <div className="tree-connector tree-connector--small" />
              {renderNode("avatar")}
            </div>

            <div className="tree-branch">
              {renderNode("maincontent")}
              <div className="tree-connector tree-connector--small" />
              <div className="tree-row tree-row--nested">
                {renderNode("postlist")}
                {renderNode("commentbox")}
              </div>
            </div>
          </div>
        </div>
      </section>

      <output className="readout" aria-live="polite">{readout}</output>

      <fieldset className="control-group">
        <legend>Shipped JS</legend>
        <div className="kb-meter">
          <div className="kb-meter-track">
            <div className="kb-meter-fill" style={{ inlineSize: `${shippedPercent}%` }} />
          </div>
          <span className="kb-meter-label">
            {shippedKb.toFixed(1)}kb / {TOTAL_KB.toFixed(1)}kb ({shippedPercent}%)
          </span>
        </div>
        <button type="button" className="toggle-btn" onClick={reset} disabled={ownClientIds.size === 0}>
          Reset — make everything a Server Component
        </button>
        <p className="tip">
          Solid border = this node has its own <code>&quot;use client&quot;</code>. Dashed border = it&apos;s
          client only because an ancestor is. Toggle <code>UserMenu</code> and watch <code>Avatar</code> get
          dragged along despite never being clicked directly — that&apos;s the propagation rule from the post.
        </p>
      </fieldset>
    </main>
  );
}
