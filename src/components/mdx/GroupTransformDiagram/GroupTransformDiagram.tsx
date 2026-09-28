import type { JSX } from "react";
import { SCALE, CANVAS, ORIGIN, ROTATION_DEG, OUTER_AXIS_LENGTH, INNER_AXIS_LENGTH, LEGEND } from "@/components/mdx/GroupTransformDiagram/GroupTransformDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/GroupTransformDiagram/GroupTransformDiagram.styles";

// Rotation in radians — the rotated axis endpoints are computed rather than hand-typed so they stay exact if the angle changes.
const RADIANS = (ROTATION_DEG * Math.PI) / 180;

// End of the inner (rotated) x′ axis.
const INNER_X_END = { x: ORIGIN.x + INNER_AXIS_LENGTH * Math.cos(RADIANS), y: ORIGIN.y + INNER_AXIS_LENGTH * Math.sin(RADIANS) };

// End of the inner (rotated) y′ axis — perpendicular to x′, so it swings the same 20° clockwise from straight down.
const INNER_Y_END = { x: ORIGIN.x - INNER_AXIS_LENGTH * Math.sin(RADIANS), y: ORIGIN.y + INNER_AXIS_LENGTH * Math.cos(RADIANS) };

// Faint 10-unit grid offsets inside the canvas, so the reader can count user units against the example's coordinates.
const GRID_OFFSETS = Array.from({ length: 9 }, (_, index) => (index + 1) * 10 * SCALE);

// Swatch colours per legend kind — each matches the stroke of the thing it labels in the drawing.
const SWATCH_COLOR = {
  root: "var(--color-fg-muted)",
  outer: "var(--color-fg-default)",
  inner: "var(--color-fg-accent)",
  head: "var(--color-border-attention-emphasis)"
};

/*
  Static diagram of the post's nested-group example: an outer g translated to the canvas centre, an inner g rotated
  20° inside it holding the body, and a head circle that sits directly in the outer group. Exists to make the three
  coordinate systems visible at once — each transform creates new local axes, nested transforms compose, and a sibling
  outside the inner group never sees its rotation.
*/
export default function GroupTransformDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 660 360" role="img" aria-labelledby="group-transform-diagram-title group-transform-diagram-desc">
          <title id="group-transform-diagram-title">Nested group transforms and their local axes</title>
          <desc id="group-transform-diagram-desc">
            A 100 by 100 canvas with its origin at the top-left. An outer group translated by 50, 50 moves the origin to the
            centre, shown by a horizontal x axis and vertical y axis. Inside it, an inner group rotated 20 degrees has its own
            tilted x prime and y prime axes, and the body rectangle is drawn tilted along them. The head circle sits above
            the centre on the outer group&apos;s unrotated y axis, unaffected by the body&apos;s rotation.
          </desc>

          <defs>
            <marker id="group-transform-diagram-arrow-muted" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
            <marker id="group-transform-diagram-arrow-default" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-default)" />
            </marker>
            <marker id="group-transform-diagram-arrow-accent" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-accent)" />
            </marker>
          </defs>

          {/* The 100 × 100 canvas with a faint 10-unit grid. */}
          <rect x={CANVAS.x} y={CANVAS.y} width={CANVAS.size} height={CANVAS.size} fill="var(--color-bg-default)" stroke="var(--color-border-default)" strokeWidth={1.5} />
          {GRID_OFFSETS.map((offset) => (
            <g key={offset}>
              <line x1={CANVAS.x + offset} y1={CANVAS.y} x2={CANVAS.x + offset} y2={CANVAS.y + CANVAS.size} stroke="var(--color-border-muted)" strokeWidth={0.75} />
              <line x1={CANVAS.x} y1={CANVAS.y + offset} x2={CANVAS.x + CANVAS.size} y2={CANVAS.y + offset} stroke="var(--color-border-muted)" strokeWidth={0.75} />
            </g>
          ))}

          {/* Root svg axes at the viewBox's own (0, 0). */}
          <line x1={CANVAS.x} y1={CANVAS.y} x2={CANVAS.x + 60} y2={CANVAS.y} stroke="var(--color-fg-muted)" strokeWidth={2} markerEnd="url(#group-transform-diagram-arrow-muted)" />
          <line x1={CANVAS.x} y1={CANVAS.y} x2={CANVAS.x} y2={CANVAS.y + 60} stroke="var(--color-fg-muted)" strokeWidth={2} markerEnd="url(#group-transform-diagram-arrow-muted)" />
          <text x={CANVAS.x + 64} y={CANVAS.y + 14} fontSize={11} fill="var(--color-fg-muted)">x</text>
          <text x={CANVAS.x + 6} y={CANVAS.y + 74} fontSize={11} fill="var(--color-fg-muted)">y</text>
          <text x={CANVAS.x} y={CANVAS.y - 6} fontSize={10} fill="var(--color-fg-muted)">(0, 0)</text>

          {/* Body — drawn in the inner group's rotated frame, exactly as the example's rect is. */}
          <rect x={-15 * SCALE} y={-25 * SCALE} width={30 * SCALE} height={50 * SCALE} rx={6 * SCALE} transform={`translate(${ORIGIN.x} ${ORIGIN.y}) rotate(${ROTATION_DEG})`} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5} />

          {/* Head — drawn in the outer group's unrotated frame, directly above the shared origin. */}
          <circle cx={ORIGIN.x} cy={ORIGIN.y - 35 * SCALE} r={10 * SCALE} fill="var(--color-bg-attention-muted)" stroke="var(--color-border-attention-emphasis)" strokeWidth={1.5} />

          {/* Outer g axes — the translated origin both parts share. */}
          <line x1={ORIGIN.x} y1={ORIGIN.y} x2={ORIGIN.x + OUTER_AXIS_LENGTH} y2={ORIGIN.y} stroke="var(--color-fg-default)" strokeWidth={2} markerEnd="url(#group-transform-diagram-arrow-default)" />
          <line x1={ORIGIN.x} y1={ORIGIN.y} x2={ORIGIN.x} y2={ORIGIN.y + OUTER_AXIS_LENGTH} stroke="var(--color-fg-default)" strokeWidth={2} markerEnd="url(#group-transform-diagram-arrow-default)" />
          <text x={ORIGIN.x + OUTER_AXIS_LENGTH + 6} y={ORIGIN.y + 4} fontSize={11} fill="var(--color-fg-default)">x</text>
          <text x={ORIGIN.x} y={ORIGIN.y + OUTER_AXIS_LENGTH + 14} textAnchor="middle" fontSize={11} fill="var(--color-fg-default)">y</text>

          {/* Inner g axes — the same origin, rotated 20°. */}
          <line x1={ORIGIN.x} y1={ORIGIN.y} x2={INNER_X_END.x} y2={INNER_X_END.y} stroke="var(--color-fg-accent)" strokeWidth={2} markerEnd="url(#group-transform-diagram-arrow-accent)" />
          <line x1={ORIGIN.x} y1={ORIGIN.y} x2={INNER_Y_END.x} y2={INNER_Y_END.y} stroke="var(--color-fg-accent)" strokeWidth={2} markerEnd="url(#group-transform-diagram-arrow-accent)" />
          <text x={INNER_X_END.x + 6} y={INNER_X_END.y + 10} fontSize={11} fill="var(--color-fg-accent)">x′</text>
          <text x={INNER_Y_END.x - 14} y={INNER_Y_END.y + 8} fontSize={11} fill="var(--color-fg-accent)">y′</text>

          {/* Shared origin dot and its label. */}
          <circle cx={ORIGIN.x} cy={ORIGIN.y} r={3.5} fill="var(--color-fg-default)" />
          <text x={ORIGIN.x - 8} y={ORIGIN.y - 8} textAnchor="end" fontSize={10} fill="var(--color-fg-default)">(50, 50)</text>

          {/* Legend — one swatch per coordinate system, matching its stroke in the drawing. */}
          {LEGEND.map((entry) => (
            <g key={entry.kind}>
              {entry.kind === "head" ? (
                <circle cx={365} cy={entry.y - 4} r={8} fill="var(--color-bg-attention-muted)" stroke={SWATCH_COLOR.head} strokeWidth={1.5} />
              ) : (
                <line x1={350} y1={entry.y - 4} x2={378} y2={entry.y - 4} stroke={SWATCH_COLOR[entry.kind]} strokeWidth={2} markerEnd={`url(#group-transform-diagram-arrow-${entry.kind === "root" ? "muted" : entry.kind === "outer" ? "default" : "accent"})`} />
              )}
              {entry.lines.map((line, index) => (
                <text key={line} x={392} y={entry.y + index * 16} fontSize={index === 0 ? 12 : 11} fontWeight={index === 0 ? 600 : 400} fill={index === 0 ? "var(--color-fg-default)" : "var(--color-fg-muted)"}>{line}</text>
              ))}
            </g>
          ))}

          <text x={330} y={348} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">transforms compose outward: body coordinates → rotate(20) → translate(50, 50) → svg user space</text>
        </Svg>
      </Wrapper>
    </>
  );
}

GroupTransformDiagram.displayName = "GroupTransformDiagram";
