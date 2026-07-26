import React from "react";
import { clamp } from "@/utils/number";
import type { SplitPaneDirection } from "@/components/SplitPane/SplitPane.types";

// Refs and geometry useDrag needs to track a pointer/keyboard drag into a pane size split.
export interface UseDragOptions {
  // Split ratio (0-1) to fall back to when no drag has occurred yet.
  defaultRatio: number;
  // Ref to the element whose bounds define the draggable range.
  rulerRef: React.RefObject<HTMLElement | null>;
  // Ref to the outer container used to compute pointer position as a ratio.
  containerRef: React.RefObject<HTMLElement | null>;
  // Ref to the draggable divider element itself.
  dividerRef: React.RefObject<HTMLElement | null>;
  // Divider thickness (px), subtracted when computing available pane space.
  dividerWidth: number;
  // Whether the pane is currently expanded to fill the viewport.
  isFullscreened?: boolean;
  // Layout axis along which the drag offset is measured.
  direction?: SplitPaneDirection;
}

// Drives SplitPane's divider via pointer drag and arrow-key nudging; split % is clamped to [20, 80].
export function useDrag({
  defaultRatio,
  containerRef,
  dividerRef,
  dividerWidth,
  direction = "horizontal"
}: UseDragOptions) {
  // Current split ratio as a percentage (0-100) — the driven value SplitPane reads.
  const [firstSize, setFirstSize] = React.useState(defaultRatio * 100);

  // Ref so direction changes are visible to pointer handlers without re-registering listeners.
  const directionRef = React.useRef(direction);
  directionRef.current = direction;

  React.useEffect(() => {
    const divider = dividerRef.current;
    const container = containerRef.current;
    if (!divider || !container) return;

    // Captures the pointer so drag events keep firing on the divider even once it leaves its bounds.
    function onPointerDown(event: PointerEvent) {
      event.preventDefault();
      (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    }

    // Recomputes the split ratio from the pointer's position within the container, clamped to [20, 80].
    function onPointerMove(event: PointerEvent) {
      if (!(event.currentTarget as HTMLElement).hasPointerCapture(event.pointerId)) {
        return;
      }
      event.preventDefault();

      if (directionRef.current === "horizontal") {
        const { left, width } = container!.getBoundingClientRect();
        const ratio = (event.clientX - left - dividerWidth / 2) / (width - dividerWidth);
        setFirstSize(clamp(ratio * 100, 20, 80));
      } else {
        const { top, height } = container!.getBoundingClientRect();
        const ratio = (event.clientY - top - dividerWidth / 2) / (height - dividerWidth);
        setFirstSize(clamp(ratio * 100, 20, 80));
      }
    }

    // Releases pointer capture once the drag ends (or is cancelled).
    function onPointerUp(event: PointerEvent) {
      (event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);
    }

    // Matches the VisuallyHidden hint text ("Use left/right/up/down arrows").
    const STEP = 2;
    const STEP_FAST = 5;

    // Arrow-key nudging — Left/Up decreases the split, Right/Down increases it; Shift steps faster.
    function onKeyDown(e: KeyboardEvent) {
      const isHorizontal = directionRef.current === "horizontal";
      const decreaseKey = isHorizontal ? "ArrowLeft" : "ArrowUp";
      const increaseKey = isHorizontal ? "ArrowRight" : "ArrowDown";

      if (e.key !== decreaseKey && e.key !== increaseKey) return;
      e.preventDefault();

      const step = e.shiftKey ? STEP_FAST : STEP;
      const delta = e.key === increaseKey ? step : -step;
      setFirstSize((current) => clamp(current + delta, 20, 80));
    }

    divider.addEventListener("pointerdown", onPointerDown);
    divider.addEventListener("pointermove", onPointerMove);
    divider.addEventListener("pointerup", onPointerUp);
    divider.addEventListener("pointercancel", onPointerUp);
    divider.addEventListener("keydown", onKeyDown);

    return () => {
      divider.removeEventListener("pointerdown", onPointerDown);
      divider.removeEventListener("pointermove", onPointerMove);
      divider.removeEventListener("pointerup", onPointerUp);
      divider.removeEventListener("pointercancel", onPointerUp);
      divider.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return { firstSize, secondSize: 100 - firstSize };
}
