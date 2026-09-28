import type { JSX } from "react";
import { BAR, VECTOR, ROWS } from "@/components/mdx/SpreadMethodDiagram/SpreadMethodDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/SpreadMethodDiagram/SpreadMethodDiagram.styles";

/*
  Static comparison of spreadMethod's three values on identical bars sharing one short vector. Exists
  because the attribute is invisible until the vector is shorter than the shape: marking the vector's
  extent makes it obvious that everything right of the dashed line is spreadMethod's output, not the stops'.
*/
export default function SpreadMethodDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 640 272" role="img" aria-labelledby="spread-method-diagram-title spread-method-diagram-desc">
          <title id="spread-method-diagram-title">spreadMethod pad, reflect and repeat diagram</title>
          <desc id="spread-method-diagram-desc">
            Three identical bars share one short gradient vector covering only their first quarter, marked by a dashed
            line. Past that line, pad continues the final color flatly, reflect mirrors the ramp back and forth, and
            repeat restarts the ramp from its first color each time, producing hard-edged bands.
          </desc>

          <defs>
            <marker id="spread-method-diagram-arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-default)" />
            </marker>
            {/* One real gradient per method — identical except for spreadMethod, so the bars differ for that reason only. */}
            {ROWS.map((row) => (
              <linearGradient key={row.method} id={`spread-method-diagram-${row.method}`} gradientUnits="userSpaceOnUse" x1={VECTOR.x1} y1="0" x2={VECTOR.x2} y2="0" spreadMethod={row.method}>
                <stop offset="0" style={{ stopColor: "var(--color-fg-accent)" }} />
                <stop offset="1" style={{ stopColor: "var(--color-bg-accent-muted)" }} />
              </linearGradient>
            ))}
          </defs>

          {/* Vector bracket above the first bar — the only span the stops themselves describe. */}
          <line x1={VECTOR.x1} y1={30} x2={VECTOR.x2} y2={30} stroke="var(--color-fg-default)" strokeWidth={1.5} markerStart="url(#spread-method-diagram-arrow)" markerEnd="url(#spread-method-diagram-arrow)" />
          <text x={(VECTOR.x1 + VECTOR.x2) / 2} y={20} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--color-fg-default)">vector: x1 → x2</text>
          <text x={VECTOR.x2 + 12} y={34} fontSize={11} fill="var(--color-fg-muted)">beyond here, spreadMethod decides</text>

          {/* The three bars with their method labels. */}
          {ROWS.map((row) => (
            <g key={row.method}>
              <rect x={BAR.x} y={row.y} width={BAR.width} height={BAR.height} rx={4} fill={`url(#spread-method-diagram-${row.method})`} stroke="var(--color-border-default)" strokeWidth={1.5} />
              <text x={130} y={row.note ? row.y + 20 : row.y + 27} textAnchor="end" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">{row.method}</text>
              {row.note && <text x={130} y={row.y + 36} textAnchor="end" fontSize={11} fill="var(--color-fg-muted)">{row.note}</text>}
            </g>
          ))}

          {/* Dashed marker at the vector's end, carried through every bar. */}
          <line x1={VECTOR.x2} y1={40} x2={VECTOR.x2} y2={232} stroke="var(--color-fg-default)" strokeWidth={1.5} strokeDasharray="5 4" />

          <text x={320} y={258} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">pad freezes the end colors · reflect mirrors the ramp · repeat restarts it</text>
        </Svg>
      </Wrapper>
    </>
  );
}

SpreadMethodDiagram.displayName = "SpreadMethodDiagram";
