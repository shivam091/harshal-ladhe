import type { JSX } from "react";
import { MONO_FONT, CX, CY, R, QUARTER_POINTS } from "@/components/mdx/CanvasArcDiagram/CanvasArcDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/CanvasArcDiagram/CanvasArcDiagram.styles";

// School maths turns angles anticlockwise from 3 o'clock; on a canvas the y-axis points down, so they turn clockwise.
export default function CanvasArcDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 520 440" role="img" aria-labelledby="canvas-arc-diagram-title canvas-arc-diagram-desc">
          <title id="canvas-arc-diagram-title">Canvas arc() angle diagram</title>
          <desc id="canvas-arc-diagram-desc">
            A circle with its centre and radius marked. Angle 0 sits at the 3 o&apos;clock position, pointing along the
            positive x-axis. Moving clockwise, π/2 (90°) is at the bottom, π (180°) is on the left and 3π/2 (270°) is at
            the top. A highlighted arc with an arrowhead sweeps clockwise from 0 to π/2, the default direction. A small
            axis key shows x pointing right and y pointing down. Captions explain that angles grow clockwise because the
            y-axis points down, and that passing true as the sixth argument draws the arc anticlockwise instead.
          </desc>

          <defs>
            <marker id="canvas-arc-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-accent)" />
            </marker>
            <marker id="canvas-arc-axis-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
          </defs>

          <g stroke="var(--color-fg-muted)" strokeWidth={2}>
            <line x1={24} y1={24} x2={76} y2={24} markerEnd="url(#canvas-arc-axis-arrow)" />
            <line x1={24} y1={24} x2={24} y2={76} markerEnd="url(#canvas-arc-axis-arrow)" />
          </g>
          <g fontFamily={MONO_FONT} fontSize={13} fill="var(--color-fg-muted)">
            <text x={84} y={28}>x</text>
            <text x={24} y={96} textAnchor="middle">y</text>
          </g>

          <circle cx={CX} cy={CY} r={R} fill="var(--color-bg-muted)" stroke="var(--color-border-default)" strokeWidth={2} />
          <g stroke="var(--color-border-muted)" strokeWidth={1} strokeDasharray="4 4">
            <line x1={CX - R} y1={CY} x2={CX + R} y2={CY} />
            <line x1={CX} y1={CY - R} x2={CX} y2={CY + R} />
          </g>

          <line x1={CX} y1={CY} x2={CX + R} y2={CY} stroke="var(--color-fg-default)" strokeWidth={2} />
          <text x={CX + R / 2} y={CY - 8} textAnchor="middle" fontSize={13} fontFamily={MONO_FONT} fill="var(--color-fg-default)">r</text>
          <circle cx={CX} cy={CY} r={5} fill="var(--color-fg-default)" />
          <text x={CX - 8} y={CY - 10} textAnchor="end" fontSize={12} fontFamily={MONO_FONT} fill="var(--color-fg-muted)">(x, y)</text>

          <path
            d={`M ${CX + R} ${CY} A ${R} ${R} 0 0 1 ${CX + 4} ${CY + R}`}
            fill="none"
            stroke="var(--color-fg-accent)"
            strokeWidth={5}
            strokeLinecap="round"
            markerEnd="url(#canvas-arc-arrow)"
          />
          <text x={CX + R * 0.707 + 16} y={CY + R * 0.707 + 14} fontSize={14} fontWeight={600} fill="var(--color-fg-accent)">clockwise</text>
          <text x={CX + R * 0.707 + 16} y={CY + R * 0.707 + 30} fontSize={12} fontFamily={MONO_FONT} fill="var(--color-fg-accent)">0 &#8594; π/2</text>

          {QUARTER_POINTS.map((point) => (
            <g key={point.radians}>
              <circle cx={point.x} cy={point.y} r={5} fill="var(--color-fg-default)" stroke="var(--color-bg-default)" strokeWidth={1.5} />
              <text x={point.labelX} y={point.labelY} textAnchor={point.anchor} fontSize={16} fontWeight={600} fontFamily={MONO_FONT} fill="var(--color-fg-default)">
                {point.radians}
              </text>
              <text x={point.labelX} y={point.labelY + 18} textAnchor={point.anchor} fontSize={13} fill="var(--color-fg-muted)">
                {point.degrees}
              </text>
            </g>
          ))}

          <text x={CX} y={402} textAnchor="middle" fontSize={15} fontWeight={600} fill="var(--color-fg-default)">
            angles grow clockwise because the y-axis points down
          </text>
          <text x={CX} y={426} textAnchor="middle" fontSize={13} fill="var(--color-fg-muted)">
            pass <tspan fontFamily={MONO_FONT} fill="var(--color-fg-accent)">true</tspan> as the 6th argument to go anticlockwise
          </text>
        </Svg>
      </Wrapper>
    </>
  );
}

CanvasArcDiagram.displayName = "CanvasArcDiagram";
