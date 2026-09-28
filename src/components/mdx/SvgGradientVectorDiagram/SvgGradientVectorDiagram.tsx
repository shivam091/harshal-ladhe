import type { JSX } from "react";
import { SHAPE, VECTOR, ISOLINES, MID_STOP, ARROW_END, LEGEND } from "@/components/mdx/SvgGradientVectorDiagram/SvgGradientVectorDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/SvgGradientVectorDiagram/SvgGradientVectorDiagram.styles";

/*
  Static diagram of an SVG linearGradient's vector. Exists because "x1/y1/x2/y2" reads like an angle but is
  really a line segment: the stops are placed along it, color stays constant along every line perpendicular
  to it, and everything past its two ends is spreadMethod's business — none of which an angle alone conveys.
*/
export default function SvgGradientVectorDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 640 270" role="img" aria-labelledby="svg-gradient-vector-diagram-title svg-gradient-vector-diagram-desc">
          <title id="svg-gradient-vector-diagram-title">linearGradient vector diagram</title>
          <desc id="svg-gradient-vector-diagram-desc">
            A wide rectangle filled with a linear gradient. An arrow runs diagonally from the point x1, y1 to the point
            x2, y2 inside it. Three dashed lines cross the rectangle perpendicular to that arrow, at offset 0, offset 0.5
            and offset 1: along each dashed line the color is constant. Beyond the two ends of the vector, the end
            colors simply continue, which is the default pad spread method.
          </desc>

          <defs>
            <marker id="svg-gradient-vector-diagram-arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-default)" />
            </marker>
            {/* The real gradient being explained, in user space so its vector matches the drawn arrow exactly. */}
            <linearGradient id="svg-gradient-vector-diagram-ramp" gradientUnits="userSpaceOnUse" x1={VECTOR.x1} y1={VECTOR.y1} x2={VECTOR.x2} y2={VECTOR.y2}>
              <stop offset="0" style={{ stopColor: "var(--color-fg-accent)" }} />
              <stop offset="1" style={{ stopColor: "var(--color-bg-accent-muted)" }} />
            </linearGradient>
          </defs>

          {/* The painted shape. */}
          <rect x={SHAPE.x} y={SHAPE.y} width={SHAPE.width} height={SHAPE.height} rx={8} fill="url(#svg-gradient-vector-diagram-ramp)" stroke="var(--color-border-default)" strokeWidth={1.5} />

          {/* Isolines — one per stop, perpendicular to the vector, each labelled above the shape. */}
          {ISOLINES.map((line) => (
            <g key={line.label}>
              <line x1={line.top.x} y1={line.top.y} x2={line.bottom.x} y2={line.bottom.y} stroke="var(--color-fg-default)" strokeWidth={1.5} strokeDasharray="5 4" />
              <text x={line.top.x} y={line.top.y - 10} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">{line.label}</text>
            </g>
          ))}

          {/* The vector itself: start dot, arrow, midpoint stop marker, end dot. */}
          <line x1={VECTOR.x1} y1={VECTOR.y1} x2={ARROW_END.x} y2={ARROW_END.y} stroke="var(--color-fg-default)" strokeWidth={2} markerEnd="url(#svg-gradient-vector-diagram-arrow)" />
          <circle cx={VECTOR.x1} cy={VECTOR.y1} r={5} fill="var(--color-bg-default)" stroke="var(--color-fg-default)" strokeWidth={2} />
          <circle cx={VECTOR.x2} cy={VECTOR.y2} r={5} fill="var(--color-bg-default)" stroke="var(--color-fg-default)" strokeWidth={2} />
          <rect x={MID_STOP.x - 4} y={MID_STOP.y - 4} width={8} height={8} transform={`rotate(45 ${MID_STOP.x} ${MID_STOP.y})`} fill="var(--color-bg-default)" stroke="var(--color-fg-default)" strokeWidth={1.5} />

          {/* Endpoint labels on pills, so they stay legible over any part of the ramp in either theme. */}
          <rect x={92} y={108} width={56} height={18} rx={9} fill="var(--color-bg-default)" stroke="var(--color-border-muted)" />
          <text x={120} y={121} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--color-fg-default)">x1, y1</text>
          <rect x={312} y={190} width={56} height={18} rx={9} fill="var(--color-bg-default)" stroke="var(--color-border-muted)" />
          <text x={340} y={203} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--color-fg-default)">x2, y2</text>

          {/* Legend — the three ideas the picture is meant to teach, in reading order. */}
          {LEGEND.map((row) => (
            <text key={row.text} x={424} y={row.y} fontSize={row.bold ? 13 : 12} fontWeight={row.bold ? 600 : 400} fill={row.bold ? "var(--color-fg-default)" : "var(--color-fg-muted)"}>{row.text}</text>
          ))}
        </Svg>
      </Wrapper>
    </>
  );
}

SvgGradientVectorDiagram.displayName = "SvgGradientVectorDiagram";
