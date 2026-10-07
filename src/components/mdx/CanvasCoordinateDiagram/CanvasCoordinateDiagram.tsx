import type { JSX } from "react";
import {
  MONO_FONT,
  SCALE,
  ORIGIN_X,
  ORIGIN_Y,
  CANVAS_W,
  CANVAS_H,
  GRID_STEP,
  EXAMPLE_RECT,
  COORDINATE_POINTS
} from "@/components/mdx/CanvasCoordinateDiagram/CanvasCoordinateDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/CanvasCoordinateDiagram/CanvasCoordinateDiagram.styles";

// Lets every horizontal position be written in real canvas pixels rather than viewBox units.
const toX = (x: number): number => ORIGIN_X + x * SCALE;

// Lets every vertical position be written in real canvas pixels rather than viewBox units.
const toY = (y: number): number => ORIGIN_Y + y * SCALE;

// Interior columns only, since the canvas border already marks the outer edges.
const GRID_XS = Array.from({ length: CANVAS_W / GRID_STEP - 1 }, (_, i) => (i + 1) * GRID_STEP);

// Interior rows only, since the canvas border already marks the outer edges.
const GRID_YS = Array.from({ length: CANVAS_H / GRID_STEP - 1 }, (_, i) => (i + 1) * GRID_STEP);

// Makes the downward y-axis impossible to miss — the biggest surprise for anyone used to school maths, where y goes up.
export default function CanvasCoordinateDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 560 384" role="img" aria-labelledby="canvas-coordinate-diagram-title canvas-coordinate-diagram-desc">
          <title id="canvas-coordinate-diagram-title">Canvas coordinate system diagram</title>
          <desc id="canvas-coordinate-diagram-desc">
            A 500 by 300 pixel canvas drawn over a faint grid. The origin (0, 0) is marked at the top-left corner. An
            arrow runs right along the top edge labelled &quot;x increases&quot;, and another runs down the left edge labelled
            &quot;y increases&quot;, showing that y grows downwards. The other corners are labelled (500, 0) at the top-right,
            (0, 300) at the bottom-left and (500, 300) at the bottom-right, and the centre is marked at (250, 150). A dashed
            rectangle shows fillRect(50, 50, 150, 100), starting 50 pixels in from the left and 50 pixels down from the top.
          </desc>

          <defs>
            <marker id="canvas-coordinate-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-accent)" />
            </marker>
          </defs>

          <rect x={toX(0)} y={toY(0)} width={CANVAS_W * SCALE} height={CANVAS_H * SCALE} fill="var(--color-bg-muted)" />
          <g stroke="var(--color-border-muted)" strokeWidth={1}>
            {GRID_XS.map((x) => (
              <line key={`gx-${x}`} x1={toX(x)} y1={toY(0)} x2={toX(x)} y2={toY(CANVAS_H)} />
            ))}
            {GRID_YS.map((y) => (
              <line key={`gy-${y}`} x1={toX(0)} y1={toY(y)} x2={toX(CANVAS_W)} y2={toY(y)} />
            ))}
          </g>
          <rect x={toX(0)} y={toY(0)} width={CANVAS_W * SCALE} height={CANVAS_H * SCALE} fill="none" stroke="var(--color-border-default)" strokeWidth={2} />

          <rect
            x={toX(EXAMPLE_RECT.x)}
            y={toY(EXAMPLE_RECT.y)}
            width={EXAMPLE_RECT.w * SCALE}
            height={EXAMPLE_RECT.h * SCALE}
            fill="var(--color-bg-accent-muted)"
            stroke="var(--color-border-accent-emphasis)"
            strokeWidth={1.5}
            strokeDasharray="6 4"
          />
          <g stroke="var(--color-fg-muted)" strokeWidth={1} strokeDasharray="3 3">
            <line x1={toX(0)} y1={toY(EXAMPLE_RECT.y)} x2={toX(EXAMPLE_RECT.x)} y2={toY(EXAMPLE_RECT.y)} />
            <line x1={toX(EXAMPLE_RECT.x)} y1={toY(0)} x2={toX(EXAMPLE_RECT.x)} y2={toY(EXAMPLE_RECT.y)} />
          </g>
          <g fontFamily={MONO_FONT} fontSize={12} fill="var(--color-fg-muted)">
            <text x={toX(EXAMPLE_RECT.x / 2)} y={toY(EXAMPLE_RECT.y) + 15} textAnchor="middle">50</text>
            <text x={toX(EXAMPLE_RECT.x) + 5} y={toY(EXAMPLE_RECT.y / 2) + 4}>50</text>
            <text x={toX(EXAMPLE_RECT.x)} y={toY(EXAMPLE_RECT.y + EXAMPLE_RECT.h) + 18} fill="var(--color-fg-accent)">
              fillRect(50, 50, 150, 100)
            </text>
          </g>

          <line x1={toX(0)} y1={toY(0)} x2={toX(CANVAS_W) + 30} y2={toY(0)} stroke="var(--color-fg-accent)" strokeWidth={3} markerEnd="url(#canvas-coordinate-arrow)" />
          <line x1={toX(0)} y1={toY(0)} x2={toX(0)} y2={toY(CANVAS_H) + 30} stroke="var(--color-fg-accent)" strokeWidth={3} markerEnd="url(#canvas-coordinate-arrow)" />
          <text x={toX(CANVAS_W / 2)} y={toY(0) - 34} textAnchor="middle" fontSize={15} fontWeight={600} fill="var(--color-fg-accent)">
            x increases <tspan fontSize={20}>&#8594;</tspan>
          </text>
          <text x={toX(0) - 12} y={toY(CANVAS_H / 2) - 6} textAnchor="end" fontSize={15} fontWeight={600} fill="var(--color-fg-accent)">
            y increases
          </text>
          <text x={toX(0) - 54} y={toY(CANVAS_H / 2) + 18} textAnchor="middle" fontSize={20} fontWeight={600} fill="var(--color-fg-accent)">
            &#8595;
          </text>

          <text x={toX(0) - 8} y={toY(0) - 30} textAnchor="end" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">
            origin
          </text>

          {COORDINATE_POINTS.map((point) => (
            <g key={point.label}>
              <circle cx={toX(point.x)} cy={toY(point.y)} r={point.x === 0 && point.y === 0 ? 6 : 4.5} fill="var(--color-fg-default)" stroke="var(--color-bg-default)" strokeWidth={1.5} />
              <text
                x={toX(point.x) + point.dx}
                y={toY(point.y) + point.dy}
                textAnchor={point.anchor}
                fontSize={13}
                fontFamily={MONO_FONT}
                fill="var(--color-fg-default)"
              >
                {point.label}
              </text>
            </g>
          ))}

          <text x={toX(CANVAS_W / 2)} y={toY(CANVAS_H) + 56} textAnchor="middle" fontSize={13} fill="var(--color-fg-muted)">
            500 &#215; 300 canvas &#8212; units are pixels
          </text>
        </Svg>
      </Wrapper>
    </>
  );
}

CanvasCoordinateDiagram.displayName = "CanvasCoordinateDiagram";
