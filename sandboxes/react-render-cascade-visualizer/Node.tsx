import { useEffect, useRef, type ReactNode } from "react";

// Props for Box — the one visualized node reused by both demo trees.
interface BoxProps {
  label: string;
  sub?: string;
  children?: ReactNode;
}

/*
  One node in a visualized tree: shows its label and flashes on every render. The render count is
  tracked in a ref and written straight into the DOM from inside the effect below, deliberately
  bypassing React state — a `setState` call here would itself trigger another render, and reading
  or writing a ref's `.current` during render (rather than in an effect or event handler) is
  exactly the kind of side effect the render phase isn't allowed to have (see the post's Render
  Phase section). Effects run after commit, so mutating the ref there is safe.
*/
export function Box({ label, sub, children }: BoxProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    if (countRef.current) countRef.current.textContent = `renders: ${renderCount.current}`;

    const node = boxRef.current;
    if (!node) return;
    node.classList.remove("flash");
    // Force a reflow so re-adding the class restarts the CSS animation even on back-to-back renders.
    void node.offsetWidth;
    node.classList.add("flash");
  });

  return (
    <div ref={boxRef} className="box">
      <div className="box-head">
        <span className="box-label">{label}</span>
        <span ref={countRef} className="box-count">
          renders: 0
        </span>
      </div>
      {sub ? <span className="box-sub">{sub}</span> : null}
      {children}
    </div>
  );
}
