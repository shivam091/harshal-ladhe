"use client";

import { useRef } from "react";
import type { JSX } from "react";
import { usePointDrag } from "@/hooks/use-point-drag";
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
  Draggable corner handles layered over PreviewPane's swatch — the visual counterpart to
  CornerFields' typed inputs, editing the exact same 8 (or, in uniform mode, 1) values. Built on
  usePointDrag (borrowed from the clip-path tool, whose {x, y} drag point is a plain
  container-relative percentage with no clip-path-specific meaning — the same reuse
  AngleDial/PositionPad already made in the gradient tool) rather than a new drag hook.

  The percentage usePointDrag reports is scaled against state.size, NOT the swatch's actual
  rendered pixel size — so a corner radius means the same real px value regardless of how large the
  (responsive) preview happens to render on screen, exactly like ClipPathGenerator's 0-100
  coordinate space stays meaningful at any preview size.
*/
export default function RadiusOverlay({ state, actions }: RadiusOverlayProps): JSX.Element {
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const { startDrag, handlePointerMove, handlePointerUp } = usePointDrag({
    containerRef: overlayRef,
    onDrag: (id, point) => {
      const corner = id as CornerName;
      const { flipX, flipY } = CORNER_ANCHOR[corner];
      const h = ((flipX ? 100 - point.x : point.x) / 100) * state.size;
      const v = ((flipY ? 100 - point.y : point.y) / 100) * state.size;
      if (state.uniform) actions.setUniformRadius(h);
      else actions.setCorner(corner, { h, v });
    },
    onDragEnd: () => actions.commitDrag()
  });

  return (
    <>
      <Overlay ref={overlayRef} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
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
              aria-label={`${corner} radius, ${Math.round(h)} by ${Math.round(v)} pixels`}
              onPointerDown={(event) => {
                actions.selectCorner(corner);
                startDrag(corner)(event);
              }}
            />
          );
        })}
      </Overlay>
    </>
  );
}

RadiusOverlay.displayName = "RadiusOverlay";
