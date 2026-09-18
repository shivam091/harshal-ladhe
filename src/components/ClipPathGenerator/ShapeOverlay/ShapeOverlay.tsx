"use client";

import { useRef } from "react";
import type { JSX, KeyboardEvent } from "react";
import { usePointDrag } from "@/hooks/use-point-drag";
import { compilePathData, incomingControlPoint, outgoingControlPoint, pointOnCubicBezier } from "@/utils/clip-path";
import type { ClipPathShape, ShapeOverlayProps } from "@/interfaces/clip-path";
import {
  OverlaySvg,
  ShapeOutline,
  GhostOutline,
  EdgeHitPath,
  HandleLine,
  VertexHandle,
  HandleDot,
  InsetOutline
} from "@/components/ClipPathGenerator/ShapeOverlay/ShapeOverlay.styles";

const ARROW_STEP = 1;
const ARROW_STEP_FAST = 10;

// data-* booleans render as the literal string "false" (unlike native boolean attributes, React never omits them) — this keeps every handle's markup free of a stray data-active="false"/data-selected="false" when idle.
function boolAttr(value: boolean): "true" | undefined {
  return value ? "true" : undefined;
}

/*
  The draggable SVG surface layered over PreviewPane. One usePointDrag instance drives every handle
  regardless of family or count (see the hook's own comment for why); this component's job is purely
  translating "which id is being dragged" into the right editor-state mutation for the shape's
  current family, plus the non-drag interactions (click-to-select, click-an-edge-to-insert,
  Delete/arrow-key handling) that a plain drag hook has no way to express on its own.
*/
export default function ShapeOverlay({ shape, selection, actions, ghostShape }: ShapeOverlayProps): JSX.Element {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const { activeId, startDrag, handlePointerMove, handlePointerUp } = usePointDrag({
    containerRef: svgRef,
    onDrag: (id, point, modifiers) => {
      if (shape.family === "polygon") {
        if (id.startsWith("vertex-")) {
          actions.updateVertexPoint(Number(id.slice("vertex-".length)), point);
        } else if (id.startsWith("handle-")) {
          const [, indexStr, which] = id.split("-");
          actions.updateVertexHandle(Number(indexStr), which === "in" ? "handleIn" : "handleOut", point, modifiers.altKey);
        }
      } else if (shape.family === "circle") {
        if (id === "center") actions.updateCircle({ center: point });
        if (id === "radius") actions.updateCircle({ radius: Math.hypot(point.x - shape.center.x, point.y - shape.center.y) });
      } else if (shape.family === "ellipse") {
        if (id === "center") actions.updateEllipse({ center: point });
        if (id === "rx") actions.updateEllipse({ rx: Math.abs(point.x - shape.center.x) });
        if (id === "ry") actions.updateEllipse({ ry: Math.abs(point.y - shape.center.y) });
      } else if (shape.family === "inset") {
        if (id === "top") actions.updateInset({ top: point.y });
        if (id === "right") actions.updateInset({ right: 100 - point.x });
        if (id === "bottom") actions.updateInset({ bottom: 100 - point.y });
        if (id === "left") actions.updateInset({ left: point.x });
        if (id === "corner") actions.updateInset({ cornerRadius: Math.max(0, point.x - shape.left) });
      }
    },
    onDragEnd: () => actions.commitDrag()
  });

  function handleKeyDown(event: KeyboardEvent<SVGSVGElement>) {
    if (!selection || shape.family !== "polygon") return;
    const vertex = shape.vertices[selection.vertexIndex];
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

  return (
    <>
      <OverlaySvg
        ref={svgRef}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        tabIndex={0}
        role="application"
        aria-label="Shape editor — drag handles to reshape, arrow keys to nudge the selected point, Delete to remove it"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
      >
        {ghostShape && <GhostOutline d={pathFor(ghostShape)} />}
        <ShapeOutline d={pathFor(shape)} />

        {/*
          Two separate passes, not one <g> per vertex: an edge's hit-path starts/ends exactly AT its
          neighboring vertices' own coordinates, so with a single interleaved pass, a later vertex's
          incoming-edge hit-path would paint over an earlier vertex's handle circle at their shared
          point and silently swallow its clicks. Rendering every edge first, then every handle/dot
          afterward, guarantees handles are always the topmost (and therefore actually draggable)
          element at any point they share with an edge.
        */}
        {shape.family === "polygon" &&
          shape.vertices.map((vertex, index) => {
            const next = shape.vertices[(index + 1) % shape.vertices.length];
            const c1 = outgoingControlPoint(vertex);
            const c2 = incomingControlPoint(next);

            return (
              <EdgeHitPath
                key={index}
                d={`M ${vertex.point.x} ${vertex.point.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${next.point.x} ${next.point.y}`}
                onClick={() => {
                  const midpoint = pointOnCubicBezier(vertex.point, c1, c2, next.point, 0.5);
                  actions.insertVertexAfter(index, midpoint);
                }}
              />
            );
          })}

        {shape.family === "polygon" &&
          shape.vertices.map((vertex, index) => {
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

        {shape.family === "circle" && (
          <>
            <VertexHandle cx={shape.center.x} cy={shape.center.y} data-active={boolAttr(activeId === "center")} onPointerDown={startDrag("center")} />
            <VertexHandle
              cx={shape.center.x + shape.radius}
              cy={shape.center.y}
              data-active={boolAttr(activeId === "radius")}
              onPointerDown={startDrag("radius")}
            />
          </>
        )}

        {shape.family === "ellipse" && (
          <>
            <VertexHandle cx={shape.center.x} cy={shape.center.y} data-active={boolAttr(activeId === "center")} onPointerDown={startDrag("center")} />
            <VertexHandle cx={shape.center.x + shape.rx} cy={shape.center.y} data-active={boolAttr(activeId === "rx")} onPointerDown={startDrag("rx")} />
            <VertexHandle cx={shape.center.x} cy={shape.center.y + shape.ry} data-active={boolAttr(activeId === "ry")} onPointerDown={startDrag("ry")} />
          </>
        )}

        {shape.family === "inset" && (
          <>
            <InsetOutline
              x={shape.left}
              y={shape.top}
              width={Math.max(0, 100 - shape.left - shape.right)}
              height={Math.max(0, 100 - shape.top - shape.bottom)}
              rx={shape.cornerRadius}
            />
            <VertexHandle cx={50} cy={shape.top} data-active={boolAttr(activeId === "top")} onPointerDown={startDrag("top")} />
            <VertexHandle cx={100 - shape.right} cy={50} data-active={boolAttr(activeId === "right")} onPointerDown={startDrag("right")} />
            <VertexHandle cx={50} cy={100 - shape.bottom} data-active={boolAttr(activeId === "bottom")} onPointerDown={startDrag("bottom")} />
            <VertexHandle cx={shape.left} cy={50} data-active={boolAttr(activeId === "left")} onPointerDown={startDrag("left")} />
            <HandleDot
              cx={shape.left + shape.cornerRadius}
              cy={shape.top}
              data-active={boolAttr(activeId === "corner")}
              onPointerDown={startDrag("corner")}
            />
          </>
        )}
      </OverlaySvg>
    </>
  );
}

// Path data for any shape family, used for both the live outline and the ghost (Shape B) preview — circle/ellipse/inset render as a closed 4-point Bezier approximation so one <path> element covers every family without a per-family SVG element.
function pathFor(shape: ClipPathShape): string {
  if (shape.family === "polygon") return compilePathData(shape.vertices);

  if (shape.family === "circle") return ellipsePath(shape.center.x, shape.center.y, shape.radius, shape.radius);
  if (shape.family === "ellipse") return ellipsePath(shape.center.x, shape.center.y, shape.rx, shape.ry);

  const { top, right, bottom, left, cornerRadius: r } = shape;
  const x2 = 100 - right;
  const y2 = 100 - bottom;
  return `M ${left + r} ${top} L ${x2 - r} ${top} Q ${x2} ${top} ${x2} ${top + r} L ${x2} ${y2 - r} Q ${x2} ${y2} ${x2 - r} ${y2} L ${left + r} ${y2} Q ${left} ${y2} ${left} ${y2 - r} L ${left} ${top + r} Q ${left} ${top} ${left + r} ${top} Z`;
}

// kappa ≈ 0.5523 — the standard 4-cubic circle/ellipse Bezier approximation constant.
function ellipsePath(cx: number, cy: number, rx: number, ry: number): string {
  const kx = rx * 0.5523;
  const ky = ry * 0.5523;
  return [
    `M ${cx - rx} ${cy}`,
    `C ${cx - rx} ${cy - ky} ${cx - kx} ${cy - ry} ${cx} ${cy - ry}`,
    `C ${cx + kx} ${cy - ry} ${cx + rx} ${cy - ky} ${cx + rx} ${cy}`,
    `C ${cx + rx} ${cy + ky} ${cx + kx} ${cy + ry} ${cx} ${cy + ry}`,
    `C ${cx - kx} ${cy + ry} ${cx - rx} ${cy + ky} ${cx - rx} ${cy}`,
    "Z"
  ].join(" ");
}

ShapeOverlay.displayName = "ShapeOverlay";
