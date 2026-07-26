import React from "react";
import { clamp } from "@/utils/number";

/*
  Height range a reader can drag the sandbox container to — enough room to still show the toolbar/editor
  at the low end, capped so an embed can't blow out the page at the high end.
*/
const MIN_HEIGHT = 200;
const MAX_HEIGHT = 1200;

// Tracks an absolute pixel height from the drag delta, since there's no second pane to size against.
export function useResizableHeight({
  defaultHeight,
  handleRef
}: {
  defaultHeight: number;
  handleRef: React.RefObject<HTMLElement | null>;
}): number {
  const [height, setHeight] = React.useState(defaultHeight);

  // Ref so onPointerDown always reads the latest height without re-registering listeners.
  const heightRef = React.useRef(height);
  heightRef.current = height;

  const dragStartRef = React.useRef({ pointerY: 0, height });

  React.useEffect(() => {
    const handle = handleRef.current;
    if (!handle) return;

    // Captures the pointer so drag events keep firing on the handle even once it leaves its bounds.
    function onPointerDown(event: PointerEvent) {
      event.preventDefault();
      (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
      dragStartRef.current = { pointerY: event.clientY, height: heightRef.current };
    }

    // Recomputes height from how far the pointer has moved since pointerdown, clamped to [MIN_HEIGHT, MAX_HEIGHT].
    function onPointerMove(event: PointerEvent) {
      if (!(event.currentTarget as HTMLElement).hasPointerCapture(event.pointerId)) {
        return;
      }
      event.preventDefault();
      const delta = event.clientY - dragStartRef.current.pointerY;
      setHeight(clamp(dragStartRef.current.height + delta, MIN_HEIGHT, MAX_HEIGHT));
    }

    // Releases pointer capture once the drag ends (or is cancelled).
    function onPointerUp(event: PointerEvent) {
      (event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);
    }

    // Matches the VisuallyHidden hint text ("Use up/down arrows").
    const STEP = 20;
    const STEP_FAST = 60;

    // Arrow-key nudging — Up decreases height, Down increases it; Shift steps faster.
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
      event.preventDefault();

      const step = event.shiftKey ? STEP_FAST : STEP;
      const delta = event.key === "ArrowDown" ? step : -step;
      setHeight((current) => clamp(current + delta, MIN_HEIGHT, MAX_HEIGHT));
    }

    handle.addEventListener("pointerdown", onPointerDown);
    handle.addEventListener("pointermove", onPointerMove);
    handle.addEventListener("pointerup", onPointerUp);
    handle.addEventListener("pointercancel", onPointerUp);
    handle.addEventListener("keydown", onKeyDown);

    return () => {
      handle.removeEventListener("pointerdown", onPointerDown);
      handle.removeEventListener("pointermove", onPointerMove);
      handle.removeEventListener("pointerup", onPointerUp);
      handle.removeEventListener("pointercancel", onPointerUp);
      handle.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return height;
}
