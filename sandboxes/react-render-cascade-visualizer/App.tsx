import { memo, useCallback, useState } from "react";
import { Box } from "./Node";
import "./styles.css";

// Leaf of the plain (unmemoized) tree — owns its own state, independent of Root and Middle.
function Leaf() {
  const [leafTick, setLeafTick] = useState(0);
  return (
    <Box label="Leaf" sub={`leafTick: ${leafTick}`}>
      <button className="btn btn-small" onClick={() => setLeafTick((t) => t + 1)}>
        bump Leaf&apos;s own state
      </button>
    </Box>
  );
}

// Middle of the plain tree — takes no props at all, so nothing about ITS inputs ever changes.
function Middle() {
  return (
    <Box label="Middle">
      <div className="children">
        <Leaf />
      </div>
    </Box>
  );
}

/*
  Demo 1: a state update cascades to every child below it, regardless of whether that child's own
  props changed — Middle takes no props whatsoever and still re-renders (and flashes) every time
  Root does. Bumping Leaf's own state does the reverse: only Leaf flashes, because a render never
  bubbles upward to ancestors.
*/
function CascadeDemo() {
  const [rootTick, setRootTick] = useState(0);

  return (
    <Box label="Root" sub={`rootTick: ${rootTick}`}>
      <div className="row">
        <button className="btn btn-small" onClick={() => setRootTick((t) => t + 1)}>
          bump Root&apos;s state
        </button>
      </div>
      <div className="children">
        <Middle />
      </div>
    </Box>
  );
}

// Props for MemoMiddle — a single callback, deliberately the only thing that can make it re-render.
interface MemoMiddleProps {
  onPing: () => void;
}

// Leaf of the memoized tree — same shape as the plain Leaf, kept separate so its render count isn't shared.
function MemoLeaf() {
  return <Box label="Leaf" />;
}

/*
  Middle of the memoized tree, wrapped in React.memo below. memo doesn't stop Root from being
  allowed to re-render this subtree — it lets React skip actually calling this function when it
  can prove, by reference equality, that every prop is identical to last time.
*/
function MemoMiddleImpl({ onPing }: MemoMiddleProps) {
  void onPing;
  return (
    <Box label="Middle (memoized)">
      <div className="children">
        <MemoLeaf />
      </div>
    </Box>
  );
}

const MemoMiddle = memo(MemoMiddleImpl);

/*
  Demo 2: same shape as Demo 1, but Middle is wrapped in React.memo. With the checkbox on,
  `onPing` is produced by useCallback with an empty dependency array — the same function
  reference every render — so memo bails out and MemoMiddle/MemoLeaf never flash. Uncheck it and
  `onPing` becomes a brand-new arrow function every render instead; memo sees a changed prop, and
  the cascade comes right back.
*/
function MemoDemo() {
  const [rootTick, setRootTick] = useState(0);
  const [stableCallback, setStableCallback] = useState(true);

  const stablePing = useCallback(() => {}, []);
  const unstablePing = () => {};

  return (
    <Box label="Root" sub={`rootTick: ${rootTick}`}>
      <div className="row">
        <button className="btn btn-small" onClick={() => setRootTick((t) => t + 1)}>
          bump Root&apos;s state
        </button>
        <label className="toggle">
          <input
            type="checkbox"
            checked={stableCallback}
            onChange={(e) => setStableCallback(e.target.checked)}
          />
          pass a stable callback prop
        </label>
      </div>
      <div className="children">
        <MemoMiddle onPing={stableCallback ? stablePing : unstablePing} />
      </div>
    </Box>
  );
}

// Root component: two side-by-side trees, one plain and one memoized, sharing the same shape.
export default function App() {
  return (
    <>
      <div className="wrapper">
        <h1 className="title">Render Cascade Visualizer</h1>
        <p className="subtitle">
          Every box flashes for a moment the instant it re-renders. Click the buttons below and
          watch which boxes light up.
        </p>

        <div className="section">
          <span className="section-title">1. Renders cascade down, never up</span>
          <p className="section-hint">
            Middle takes no props at all — it still flashes whenever Root re-renders. Leaf owns its
            own state, so bumping it flashes only Leaf.
          </p>
          <CascadeDemo />
        </div>

        <div className="section">
          <span className="section-title">2. memo can stop the cascade — until a prop stops being stable</span>
          <p className="section-hint">
            With the checkbox on, Middle receives the same function reference every render and
            React skips re-rendering it. Uncheck it to pass a new function literal each render
            instead, and the cascade reappears.
          </p>
          <MemoDemo />
        </div>
      </div>
    </>
  );
}
