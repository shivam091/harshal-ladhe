import { useState } from "react";
import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./styles.css";
import BallsDemo from "./BallsDemo";
import RotationRaceDemo from "./RotationRaceDemo";

type CanvasMode = "2d" | "3d";

/*
  Switching modes here just swaps which demo component is mounted — no manual DOM class toggling,
  and no `.segment-panel`/`display: none` panel to keep in sync with the segmented control, the way
  a vanilla-JS version of this same idea needs. Unmounting a demo when you switch away also means
  its `useEffect` cleanup runs immediately, and the other demo's canvas is never actually in the DOM
  with zero size — it only ever mounts once its panel is already visible, so there's no "resize
  whichever canvas just appeared" workaround to write in the first place.
*/
export default function App() {
  const [mode, setMode] = useState<CanvasMode>("2d");

  return (
    <main className="playground">
      <header className="playground-header">
        <h1>Canvas in React</h1>
        <p>
          Two small demos, each built around one specific lesson from the post: the <code>useCanvas</code> hook in
          real use, and a live side-by-side of what driving an animation with <code>useState</code> actually costs.
        </p>
      </header>

      <div className="segmented-control" role="tablist" aria-label="Canvas mode">
        <button
          type="button"
          role="tab"
          className={`segment${mode === "2d" ? " segment--active" : ""}`}
          aria-selected={mode === "2d"}
          onClick={() => setMode("2d")}
        >
          Bouncing Balls
        </button>
        <button
          type="button"
          role="tab"
          className={`segment${mode === "3d" ? " segment--active" : ""}`}
          aria-selected={mode === "3d"}
          onClick={() => setMode("3d")}
        >
          State vs. Ref
        </button>
      </div>

      {mode === "2d" ? <BallsDemo /> : <RotationRaceDemo />}
    </main>
  );
}
