"use client";

import { useRef } from "react";
import type { JSX, KeyboardEvent, MouseEvent } from "react";
import { usePointDrag } from "@/hooks/use-point-drag";
import { clamp } from "@/utils/number";
import { compilePathData, incomingControlPoint, outgoingControlPoint, pointOnCubicBezier } from "@/utils/svg-path";
import type { PathOverlayProps } from "@/interfaces/svg-path";
import {
  OverlaySvg,
  PathOutline,
  EdgeHitPath,
  HandleLine,
  VertexHandle,
  HandleDot
} from "@/components/SvgPathGenerator/PathOverlay/PathOverlay.styles";

const ARROW_STEP = 1;
const ARROW_STEP_FAST = 10;

// data-* booleans render as the literal string "false" (unlike native boolean attributes, React never omits them) — this keeps every handle's markup free of a stray data-active="false"/data-selected="false" when idle.
function boolAttr(value: boolean): "true" | undefined {
  return value ? "true" : undefined;
}

/*
  The draggable SVG surface layered over PreviewPane — reuses usePointDrag exactly as ShapeOverlay
  does (same hook, unmodified) since a point drag is identical regardless of what it's shaping. The
  one interaction ShapeOverlay never needs is here: a click on truly empty canvas (not a handle or
  edge) appends a new vertex after the path's last point, the "keep drawing" pen-tool gesture that a
  clip-path shape — always a closed loop with no loose end — has no use for.
*/
export default function PathOverlay({ vertices, closed, selection, actions }: PathOverlayProps): JSX.Element {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const { activeId, startDrag, handlePointerMove, handlePointerUp } = usePointDrag({
    containerRef: svgRef,
    onDrag: (id, point, modifiers) => {
      if (id.startsWith("vertex-")) {
        actions.updateVertexPoint(Number(id.slice("vertex-".length)), point);
      } else if (id.startsWith("handle-")) {
        const [, indexStr, which] = id.split("-");
        actions.updateVertexHandle(Number(indexStr), which === "in" ? "handleIn" : "handleOut", point, modifiers.altKey);
      }
    },
    onDragEnd: () => actions.commitDrag()
  });

  // Fires only for a click that lands directly on the SVG surface itself, not one bubbling up from a child handle/edge — those already have their own onClick (select/insert), and without this guard every edge click would ALSO append a stray extra point.
  function handleBackgroundClick(event: MouseEvent<SVGSVGElement>) {
    if (event.target !== event.currentTarget) return;
    const svg = svgRef.current;
    if (!svg) return;

    const { left, top, width, height } = svg.getBoundingClientRect();
    actions.appendVertex({
      x: clamp(((event.clientX - left) / width) * 100, 0, 100),
      y: clamp(((event.clientY - top) / height) * 100, 0, 100)
    });
  }

  function handleKeyDown(event: KeyboardEvent<SVGSVGElement>) {
    if (!selection) return;
    const vertex = vertices[selection.vertexIndex];
    if (!vertex) return;

    if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault();
      actions.deleteVertex(selection.vertexIndex);
      return;
    }

    const step = event.shiftKey ? ARROW_STEP_FAST : ARROW_STEP;
    const delta: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step]
    };
    if (!(event.key in delta)) return;
    event.preventDefault();
    const [dx, dy] = delta[event.key];

    if (selection.part === "point") {
      actions.updateVertexPoint(selection.vertexIndex, { x: vertex.point.x + dx, y: vertex.point.y + dy });
    } else if (vertex.type === "curve") {
      const handle = vertex[selection.part];
      actions.updateVertexHandle(selection.vertexIndex, selection.part, { x: handle.x + dx, y: handle.y + dy }, event.altKey);
    }
    actions.commitDrag();
  }

  const edgeCount = closed ? vertices.length : vertices.length - 1;

  return (
    <>
      <OverlaySvg
        ref={svgRef}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        tabIndex={0}
        role="application"
        aria-label="Path editor — drag handles to reshape, click an edge to insert a point, click empty space to extend the path, arrow keys to nudge the selected point, Delete to remove it"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={handleBackgroundClick}
        onKeyDown={handleKeyDown}
      >
        <PathOutline d={compilePathData(vertices, closed)} />

        {/*
          Two separate passes, not one <g> per vertex: an edge's hit-path starts/ends exactly AT its
          neighboring vertices' own coordinates, so with a single interleaved pass, a later vertex's
          incoming-edge hit-path would paint over an earlier vertex's handle circle at their shared
          point and silently swallow its clicks. Rendering every edge first, then every handle/dot
          afterward, guarantees handles are always the topmost (and therefore actually draggable)
          element at any point they share with an edge.
        */}
        {Array.from({ length: edgeCount }, (_, index) => {
          const current = vertices[index];
          const next = vertices[(index + 1) % vertices.length];
          const c1 = outgoingControlPoint(current);
          const c2 = incomingControlPoint(next);

          return (
            <EdgeHitPath
              key={index}
              d={`M ${current.point.x} ${current.point.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${next.point.x} ${next.point.y}`}
              onClick={() => {
                const midpoint = pointOnCubicBezier(current.point, c1, c2, next.point, 0.5);
                actions.insertVertexAfter(index, midpoint);
              }}
            />
          );
        })}

        {vertices.map((vertex, index) => {
          const isSelected = selection?.vertexIndex === index;

          return (
            <g key={index}>
              {vertex.type === "curve" && (
                <>
                  <HandleLine x1={vertex.point.x} y1={vertex.point.y} x2={vertex.handleOut.x} y2={vertex.handleOut.y} />
                  <HandleLine x1={vertex.point.x} y1={vertex.point.y} x2={vertex.handleIn.x} y2={vertex.handleIn.y} />
                  <HandleDot
                    cx={vertex.handleOut.x}
                    cy={vertex.handleOut.y}
                    data-active={boolAttr(activeId === `handle-${index}-out`)}
                    data-selected={boolAttr(isSelected && selection?.part === "handleOut")}
                    onPointerDown={(e) => {
                      actions.select({ vertexIndex: index, part: "handleOut" });
                      startDrag(`handle-${index}-out`)(e);
                    }}
                  />
                  <HandleDot
                    cx={vertex.handleIn.x}
                    cy={vertex.handleIn.y}
                    data-active={boolAttr(activeId === `handle-${index}-in`)}
                    data-selected={boolAttr(isSelected && selection?.part === "handleIn")}
                    onPointerDown={(e) => {
                      actions.select({ vertexIndex: index, part: "handleIn" });
                      startDrag(`handle-${index}-in`)(e);
                    }}
                  />
                </>
              )}
              <VertexHandle
                cx={vertex.point.x}
                cy={vertex.point.y}
                data-active={boolAttr(activeId === `vertex-${index}`)}
                data-selected={boolAttr(isSelected && selection?.part === "point")}
                onPointerDown={(e) => {
                  actions.select({ vertexIndex: index, part: "point" });
                  startDrag(`vertex-${index}`)(e);
                }}
                onDoubleClick={() => actions.toggleVertexCurve(index)}
              />
            </g>
          );
        })}
      </OverlaySvg>
    </>
  );
}

PathOverlay.displayName = "PathOverlay";
