"use client";

import { useRef, useState } from "react";
import type { JSX, PointerEvent as ReactPointerEvent } from "react";
import { clamp } from "@/utils/number";
import { CORNER_NAMES } from "@/interfaces/border-radius";
import type { CornerName, RadiusOverlayProps } from "@/interfaces/border-radius";
import { Overlay, Handle } from "@/components/BorderRadiusGenerator/RadiusOverlay/RadiusOverlay.styles";

// Which edges of the box each corner's (h, v) grows inward from — drives both where its handle sits and how a raw 0-100% drag point converts back into px.
const CORNER_ANCHOR: Record<CornerName, { flipX: boolean; flipY: boolean }> = {
  topLeft: { flipX: false, flipY: false },
  topRight: { flipX: true, flipY: false },
  bottomRight: { flipX: true, flipY: true },
  bottomLeft: { flipX: false, flipY: true }
};

/*
  Draggable corner "pinch point" handles layered over PreviewPane's clay lump — the tactile
  counterpart to CornerFields' typed inputs, editing the exact same 8 (or, in uniform mode, 1)
  values. Pointer capture lives on each Handle button itself (the same element that receives
  pointerdown/move/up), mirroring GradientGenerator's own PositionPad — there's no shared drag hook
  on this branch to reuse (RadiusOverlay's own source design assumed one from a different tool that
  isn't present here), so this reimplements that same small pattern per-handle rather than
  introducing a new cross-tool hook for a single consumer.

  The percentage read off the pointer is scaled against state.size, NOT the lump's actual rendered
  pixel size — so a corner radius means the same real px value regardless of how large the
  (responsive) preview happens to render on screen. `activeCorner` is purely local visual state (see
  Handle's own `data-active` styling for the tactile scale/shadow feedback) and never touches the
  undo stack itself.
*/
export default function RadiusOverlay({ state, actions }: RadiusOverlayProps): JSX.Element {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [activeCorner, setActiveCorner] = useState<CornerName | null>(null);

  // Reads the current pointer position as a point in the overlay's own 0-100 coordinate space.
  function pointFromClient(clientX: number, clientY: number): { x: number; y: number } {
    const overlay = overlayRef.current;
    if (!overlay) return { x: 0, y: 0 };
    const { left, top, width, height } = overlay.getBoundingClientRect();
    return { x: clamp(((clientX - left) / width) * 100, 0, 100), y: clamp(((clientY - top) / height) * 100, 0, 100) };
  }

  // Converts a 0-100% drag point back into this corner's own (h, v) px pair, honoring which edges it grows inward from, then routes it through setUniformRadius or setCorner depending on the uniform toggle.
  function applyPoint(corner: CornerName, point: { x: number; y: number }) {
    const { flipX, flipY } = CORNER_ANCHOR[corner];
    const h = ((flipX ? 100 - point.x : point.x) / 100) * state.size;
    const v = ((flipY ? 100 - point.y : point.y) / 100) * state.size;
    if (state.uniform) actions.setUniformRadius(h);
    else actions.setCorner(corner, { h, v });
  }

  function handlePointerDown(corner: CornerName) {
    return (event: ReactPointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      actions.selectCorner(corner);
      setActiveCorner(corner);
      applyPoint(corner, pointFromClient(event.clientX, event.clientY));
    };
  }

  function handlePointerMove(corner: CornerName) {
    return (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
      event.preventDefault();
      applyPoint(corner, pointFromClient(event.clientX, event.clientY));
    };
  }

  function handlePointerUp(corner: CornerName) {
    return (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
      event.currentTarget.releasePointerCapture(event.pointerId);
      setActiveCorner((current) => (current === corner ? null : current));
      actions.commitDrag();
    };
  }

  return (
    <>
      <Overlay ref={overlayRef}>
        {CORNER_NAMES.map((corner) => {
          const { flipX, flipY } = CORNER_ANCHOR[corner];
          const { h, v } = state.corners[corner];
          const left = ((flipX ? state.size - h : h) / state.size) * 100;
          const top = ((flipY ? state.size - v : v) / state.size) * 100;

          return (
            <Handle
              key={corner}
              type="button"
              style={{ left: `${left}%`, top: `${top}%` }}
              data-selected={state.selectedCorner === corner ? "true" : undefined}
              data-active={activeCorner === corner ? "true" : undefined}
              aria-label={`${corner} radius, ${Math.round(h)} by ${Math.round(v)} pixels`}
              onPointerDown={handlePointerDown(corner)}
              onPointerMove={handlePointerMove(corner)}
              onPointerUp={handlePointerUp(corner)}
              onPointerCancel={handlePointerUp(corner)}
            />
          );
        })}
      </Overlay>
    </>
  );
}

RadiusOverlay.displayName = "RadiusOverlay";
