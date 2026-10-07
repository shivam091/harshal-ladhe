import type { JSX } from "react";
import {
  MONO_FONT,
  PANEL_W,
  PANEL_H,
  PANEL_Y,
  LEFT_PANEL_X,
  RIGHT_PANEL_X,
  GRID_STEP,
  ORIGIN,
  LEFT_ORIGINAL,
  LEFT_ROTATED,
  LEFT_CENTRE,
  LEFT_CENTRE_ROTATED,
  LEFT_SWING_RADIUS,
  ORIGIN_WEDGE_RADIUS,
  ORIGIN_WEDGE,
  ORIGIN_WEDGE_LABEL,
  RIGHT_CENTRE,
  RIGHT_ORIGINAL,
  RIGHT_ROTATED,
  SPIN_RADIUS,
  SPIN_START,
  SPIN_END,
  TRANSLATE_LINE_DEG,
  toPoints
} from "@/components/mdx/CanvasTransformDiagram/CanvasTransformDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/CanvasTransformDiagram/CanvasTransformDiagram.styles";

// Fixed reference lines make each square's displacement measurable.
function FrameGrid(): JSX.Element {
  const columns = Array.from({ length: Math.floor(PANEL_W / GRID_STEP) }, (_, index) => (index + 1) * GRID_STEP);
  const rows = Array.from({ length: Math.floor(PANEL_H / GRID_STEP) }, (_, index) => (index + 1) * GRID_STEP);

  return (
    <g stroke="var(--color-border-muted)" strokeWidth={1}>
      {columns.map((x) => <line key={`col-${x}`} x1={x} y1={0} x2={x} y2={PANEL_H} />)}
      {rows.map((y) => <line key={`row-${y}`} x1={0} y1={y} x2={PANEL_W} y2={y} />)}
    </g>
  );
}

// Shows why `rotate()` alone moves a shape away, the commonest surprise when rotating on a canvas.
export default function CanvasTransformDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 640 384" role="img" aria-labelledby="canvas-transform-diagram-title canvas-transform-diagram-desc">
          <title id="canvas-transform-diagram-title">Canvas rotate() pivot diagram</title>
          <desc id="canvas-transform-diagram-desc">
            Two small canvas frames side by side, each with its (0,0) origin at the top-left corner. In the left frame,
            titled &quot;rotate() alone&quot;, a faint dashed square sits near the middle of the canvas; after
            ctx.rotate(Math.PI / 6) the same square has swung 30 degrees clockwise around the top-left origin along a
            dashed arc, ending up lower and further left than where it started. In the right frame, titled
            &quot;translate() then rotate()&quot;, the origin is first moved to the square&apos;s centre with
            ctx.translate(cx, cy), so ctx.rotate(Math.PI / 6) spins the square 30 degrees clockwise in place around its
            own centre, shown by a pivot dot and a curved arrow. There the square is drawn at (-w/2, -h/2) so it stays
            centred on the new origin.
          </desc>

          <defs>
            <marker id="canvas-transform-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
            <marker id="canvas-transform-spin-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-success)" />
            </marker>
            <clipPath id="canvas-transform-frame-clip">
              <rect width={PANEL_W} height={PANEL_H} />
            </clipPath>
          </defs>
          <text x={LEFT_PANEL_X + PANEL_W / 2} y={26} textAnchor="middle" fontSize={16} fontWeight={600} fill="var(--color-fg-default)">
            rotate() alone
          </text>
          <g transform={`translate(${LEFT_PANEL_X}, ${PANEL_Y})`}>
            <text x={0} y={-8} fontSize={12} fontFamily={MONO_FONT} fill="var(--color-fg-muted)">(0,0)</text>
            <rect width={PANEL_W} height={PANEL_H} fill="var(--color-bg-default)" />
            <g clipPath="url(#canvas-transform-frame-clip)">
              <FrameGrid />

              <line x1={ORIGIN.x} y1={ORIGIN.y} x2={LEFT_CENTRE.x} y2={LEFT_CENTRE.y} stroke="var(--color-fg-muted)" strokeWidth={1} strokeDasharray="3 4" />
              <line x1={ORIGIN.x} y1={ORIGIN.y} x2={LEFT_CENTRE_ROTATED.x} y2={LEFT_CENTRE_ROTATED.y} stroke="var(--color-fg-muted)" strokeWidth={1} strokeDasharray="3 4" />
              <path
                d={`M ${ORIGIN_WEDGE.start.x} ${ORIGIN_WEDGE.start.y} A ${ORIGIN_WEDGE_RADIUS} ${ORIGIN_WEDGE_RADIUS} 0 0 1 ${ORIGIN_WEDGE.end.x} ${ORIGIN_WEDGE.end.y}`}
                fill="none"
                stroke="var(--color-fg-attention)"
                strokeWidth={1.5}
              />
              <text x={ORIGIN_WEDGE_LABEL.x} y={ORIGIN_WEDGE_LABEL.y} textAnchor="middle" dominantBaseline="middle" fontSize={12} fontWeight={600} fill="var(--color-fg-attention)">
                30°
              </text>

              <polygon points={toPoints(LEFT_ORIGINAL)} fill="none" stroke="var(--color-fg-muted)" strokeWidth={1.5} strokeDasharray="5 4" />
              <polygon points={toPoints(LEFT_ROTATED)} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={2} />

              <path
                d={`M ${LEFT_CENTRE.x} ${LEFT_CENTRE.y} A ${LEFT_SWING_RADIUS} ${LEFT_SWING_RADIUS} 0 0 1 ${LEFT_CENTRE_ROTATED.x} ${LEFT_CENTRE_ROTATED.y}`}
                fill="none"
                stroke="var(--color-fg-muted)"
                strokeWidth={1.5}
                strokeDasharray="5 4"
                markerEnd="url(#canvas-transform-arrow)"
              />
              <circle cx={LEFT_CENTRE.x} cy={LEFT_CENTRE.y} r={2.5} fill="var(--color-fg-muted)" />
            </g>
            <rect width={PANEL_W} height={PANEL_H} fill="none" stroke="var(--color-border-default)" strokeWidth={1.5} />
            <circle cx={ORIGIN.x} cy={ORIGIN.y} r={5} fill="var(--color-fg-danger)" />
            <text x={PANEL_W / 2} y={PANEL_H + 33} textAnchor="middle" fontSize={13} fontFamily={MONO_FONT} fill="var(--color-fg-accent)">
              ctx.rotate(Math.PI / 6);
            </text>
            <text x={PANEL_W / 2} y={PANEL_H + 66} textAnchor="middle" fontSize={13} fill="var(--color-fg-muted)">
              Pivots on the canvas origin (0,0),
            </text>
            <text x={PANEL_W / 2} y={PANEL_H + 84} textAnchor="middle" fontSize={13} fill="var(--color-fg-muted)">
              so the square swings away.
            </text>
          </g>
          <text x={RIGHT_PANEL_X + PANEL_W / 2} y={26} textAnchor="middle" fontSize={16} fontWeight={600} fill="var(--color-fg-default)">
            translate() → rotate()
          </text>
          <g transform={`translate(${RIGHT_PANEL_X}, ${PANEL_Y})`}>
            <text x={0} y={-8} fontSize={12} fontFamily={MONO_FONT} fill="var(--color-fg-muted)">(0,0)</text>
            <rect width={PANEL_W} height={PANEL_H} fill="var(--color-bg-default)" />
            <g clipPath="url(#canvas-transform-frame-clip)">
              <FrameGrid />

              <line
                x1={ORIGIN.x}
                y1={ORIGIN.y}
                x2={RIGHT_CENTRE.x}
                y2={RIGHT_CENTRE.y}
                stroke="var(--color-fg-muted)"
                strokeWidth={1.5}
                strokeDasharray="3 4"
              />
              <text
                transform={`translate(${RIGHT_CENTRE.x * 0.42}, ${RIGHT_CENTRE.y * 0.42}) rotate(${TRANSLATE_LINE_DEG})`}
                y={-7}
                textAnchor="middle"
                fontSize={12}
                fontFamily={MONO_FONT}
                fill="var(--color-fg-muted)"
              >
                translate(cx, cy)
              </text>

              <polygon points={toPoints(RIGHT_ORIGINAL)} fill="none" stroke="var(--color-fg-muted)" strokeWidth={1.5} strokeDasharray="5 4" />
              <polygon points={toPoints(RIGHT_ROTATED)} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={2} />

              <path
                d={`M ${SPIN_START.x} ${SPIN_START.y} A ${SPIN_RADIUS} ${SPIN_RADIUS} 0 0 1 ${SPIN_END.x} ${SPIN_END.y}`}
                fill="none"
                stroke="var(--color-fg-success)"
                strokeWidth={2}
                markerEnd="url(#canvas-transform-spin-arrow)"
              />
              <circle cx={RIGHT_CENTRE.x} cy={RIGHT_CENTRE.y} r={5} fill="var(--color-fg-success)" />
            </g>
            <rect width={PANEL_W} height={PANEL_H} fill="none" stroke="var(--color-border-default)" strokeWidth={1.5} />
            <circle cx={ORIGIN.x} cy={ORIGIN.y} r={3.5} fill="var(--color-fg-muted)" />
            <text x={PANEL_W / 2} y={PANEL_H + 24} textAnchor="middle" fontSize={13} fontFamily={MONO_FONT} fill="var(--color-fg-accent)">
              ctx.translate(cx, cy);
            </text>
            <text x={PANEL_W / 2} y={PANEL_H + 42} textAnchor="middle" fontSize={13} fontFamily={MONO_FONT} fill="var(--color-fg-accent)">
              ctx.rotate(Math.PI / 6);
            </text>
            <text x={PANEL_W / 2} y={PANEL_H + 66} textAnchor="middle" fontSize={13} fill="var(--color-fg-muted)">
              Spins in place on its own centre;
            </text>
            <text x={PANEL_W / 2} y={PANEL_H + 84} textAnchor="middle" fontSize={13} fill="var(--color-fg-muted)">
              the square is drawn at (-w/2, -h/2).
            </text>
          </g>
        </Svg>
      </Wrapper>
    </>
  );
}

CanvasTransformDiagram.displayName = "CanvasTransformDiagram";
