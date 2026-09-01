"use client";

import { useCallback, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, RefObject } from "react";
import { clamp } from "@/utils/number";
import type { ClipPathPoint } from "@/interfaces/clip-path";

export interface UsePointDragModifiers {
  shiftKey: boolean;
  altKey: boolean;
}

export interface UsePointDragOptions {
  // The drag surface whose bounds define the 0-100% coordinate space — read fresh on every move (matches use-drag.ts's pattern), not cached at drag-start.
  containerRef: RefObject<Element | null>;
  onDrag: (id: string, point: ClipPathPoint, modifiers: UsePointDragModifiers) => void;
  // Fires once on pointerup — the natural place to checkpoint an undo snapshot, so a drag doesn't spam one undo step per pointermove frame.
  onDragEnd?: (id: string) => void;
}

export interface UsePointDragResult {
  activeId: string | null;
  startDrag: (id: string) => (event: ReactPointerEvent) => void;
  handlePointerMove: (event: ReactPointerEvent) => void;
  handlePointerUp: (event: ReactPointerEvent) => void;
}

/*
  Drives every draggable handle in the shape overlay (vertices, curve handles, circle/ellipse/inset
  edges, Shape B's ghost handles) from ONE shared hook instance rather than one per handle — handle
  count changes constantly as vertices are inserted/removed/converted, so a per-handle hook would
  mean attaching/detaching listener sets on every structural edit. This works because
  setPointerCapture ties subsequent pointermove/pointerup events to whichever element actually
  received pointerdown, so every handle can safely share the same two handler references — only the
  captured one ever fires.
*/
export function usePointDrag({ containerRef, onDrag, onDragEnd }: UsePointDragOptions): UsePointDragResult {
  const [activeId, setActiveId] = useState<string | null>(null);
  // Ref mirror of activeId — the shared move/up handlers close over this once at registration, so a plain state read would go stale the moment a *different* handle starts a new drag.
  const activeIdRef = useRef<string | null>(null);

  const startDrag = useCallback(
    (id: string) => (event: ReactPointerEvent) => {
      event.preventDefault();
      event.stopPropagation();
      (event.currentTarget as Element).setPointerCapture(event.pointerId);
      activeIdRef.current = id;
      setActiveId(id);
    },
    []
  );

  /*
    handlePointerMove/handlePointerUp are registered on the SVG surface, not on the individual
    handle that actually called setPointerCapture — pointer capture retargets which ELEMENT the
    event is considered "over" for hit-testing, but the event still bubbles up through the real DOM
    tree from that element, so the SVG (its ancestor) still receives it. Checking
    `event.currentTarget.hasPointerCapture(...)` here would therefore always be false (currentTarget
    is the SVG, capture belongs to the handle) — activeIdRef is the actual source of truth for
    "is a drag in progress," not the capture check use-drag.ts uses (which only works there because
    the same single element both captures the pointer and hosts the move/up listeners).
  */
  const handlePointerMove = useCallback(
    (event: ReactPointerEvent) => {
      const id = activeIdRef.current;
      const container = containerRef.current;
      if (!id || !container) return;
      event.preventDefault();

      const { left, top, width, height } = container.getBoundingClientRect();
      const point: ClipPathPoint = {
        x: clamp(((event.clientX - left) / width) * 100, 0, 100),
        y: clamp(((event.clientY - top) / height) * 100, 0, 100)
      };
      onDrag(id, point, { shiftKey: event.shiftKey, altKey: event.altKey });
    },
    [containerRef, onDrag]
  );

  const handlePointerUp = useCallback(
    (event: ReactPointerEvent) => {
      event.preventDefault();
      const id = activeIdRef.current;
      activeIdRef.current = null;
      setActiveId(null);
      if (id) onDragEnd?.(id);
    },
    [onDragEnd]
  );

  return { activeId, startDrag, handlePointerMove, handlePointerUp };
}
