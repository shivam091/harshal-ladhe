import type { JSX } from "react";
import { OUTER, FOCAL, LEGEND } from "@/components/mdx/RadialFocalDiagram/RadialFocalDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/RadialFocalDiagram/RadialFocalDiagram.styles";

/*
  Static diagram of radialGradient's two circles. Exists because the attribute names hide the model: a radial
  gradient interpolates from a start (focal) circle to an end (outer) circle, and fr is that start circle's
  radius — not a third coordinate — which only clicks once both circles are drawn together.
*/
export default function RadialFocalDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 640 310" role="img" aria-labelledby="radial-focal-diagram-title radial-focal-diagram-desc">
          <title id="radial-focal-diagram-title">radialGradient outer and focal circle diagram</title>
          <desc id="radial-focal-diagram-desc">
            A large circle filled with a radial gradient. Its center is labelled cx, cy and a dashed line from the center
            to the edge is labelled r: this outer circle is where the 100% stop lands. Up and to the left sits a small
            dashed focal circle labelled fx, fy, with its radius labelled fr: this is where the 0% stop starts. The
            colors interpolate from the focal circle outward to the outer circle.
          </desc>

          <defs>
            {/* The real gradient being explained, in user space so its circles match the drawn outlines exactly. */}
            <radialGradient id="radial-focal-diagram-ramp" gradientUnits="userSpaceOnUse" cx={OUTER.cx} cy={OUTER.cy} r={OUTER.r} fx={FOCAL.cx} fy={FOCAL.cy} fr={FOCAL.r}>
              <stop offset="0" style={{ stopColor: "var(--color-bg-accent-muted)" }} />
              <stop offset="1" style={{ stopColor: "var(--color-fg-accent)" }} />
            </radialGradient>
          </defs>

          {/* The painted circle, with the outer circle's outline drawn over its edge. */}
          <circle cx={OUTER.cx} cy={OUTER.cy} r={OUTER.r} fill="url(#radial-focal-diagram-ramp)" stroke="var(--color-border-accent-emphasis)" strokeWidth={2} />

          {/* Outer circle's center and radius. */}
          <line x1={OUTER.cx} y1={OUTER.cy} x2={OUTER.cx + OUTER.r} y2={OUTER.cy} stroke="var(--color-fg-default)" strokeWidth={1.5} strokeDasharray="5 4" />
          <circle cx={OUTER.cx} cy={OUTER.cy} r={4} fill="var(--color-fg-default)" />

          {/* Focal circle outline, its center and its radius (fr). */}
          <circle cx={FOCAL.cx} cy={FOCAL.cy} r={FOCAL.r} fill="none" stroke="var(--color-fg-default)" strokeWidth={1.5} strokeDasharray="4 3" />
          <line x1={FOCAL.cx} y1={FOCAL.cy} x2={FOCAL.cx + FOCAL.r} y2={FOCAL.cy} stroke="var(--color-fg-default)" strokeWidth={1.5} />
          <circle cx={FOCAL.cx} cy={FOCAL.cy} r={3} fill="var(--color-fg-default)" />

          {/* Labels on pills, so they stay legible over any part of the ramp in either theme. */}
          <rect x={FOCAL.cx - 26} y={FOCAL.cy - FOCAL.r - 24} width={52} height={18} rx={9} fill="var(--color-bg-default)" stroke="var(--color-border-muted)" />
          <text x={FOCAL.cx} y={FOCAL.cy - FOCAL.r - 11} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--color-fg-default)">fx, fy</text>
          <rect x={FOCAL.cx + FOCAL.r + 6} y={FOCAL.cy - 9} width={28} height={18} rx={9} fill="var(--color-bg-default)" stroke="var(--color-border-muted)" />
          <text x={FOCAL.cx + FOCAL.r + 20} y={FOCAL.cy + 4} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--color-fg-default)">fr</text>
          <rect x={OUTER.cx - 28} y={OUTER.cy + 10} width={56} height={18} rx={9} fill="var(--color-bg-default)" stroke="var(--color-border-muted)" />
          <text x={OUTER.cx} y={OUTER.cy + 23} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--color-fg-default)">cx, cy</text>
          <rect x={OUTER.cx + OUTER.r / 2 - 12} y={OUTER.cy - 26} width={24} height={18} rx={9} fill="var(--color-bg-default)" stroke="var(--color-border-muted)" />
          <text x={OUTER.cx + OUTER.r / 2} y={OUTER.cy - 13} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--color-fg-default)">r</text>

          {/* Legend — what each circle controls, in reading order. */}
          {LEGEND.map((row) => (
            <text key={row.text} x={368} y={row.y} fontSize={row.bold ? 13 : 12} fontWeight={row.bold ? 600 : 400} fill={row.bold ? "var(--color-fg-default)" : "var(--color-fg-muted)"}>{row.text}</text>
          ))}
        </Svg>
      </Wrapper>
    </>
  );
}

RadialFocalDiagram.displayName = "RadialFocalDiagram";
