import type { JSX } from "react";
import { SWATCH_W, SWATCH_H, CHECKER_TILE, MASK_VISIBILITY_COLUMNS, PHOTO_GRADIENT_FROM, PHOTO_GRADIENT_TO } from "@/components/mdx/MaskVisibilityDiagram/MaskVisibilityDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/MaskVisibilityDiagram/MaskVisibilityDiagram.styles";

/*
  Static SVG diagram contrasting the two mask-mode readings side by side. Each column's "source" swatch fill IS
  the actual gradient CSS would use for that mode — an alpha-based `black, transparent` fade for one column, an
  opaque `white, black` luminance fade for the other — rendered over a checkerboard so the alpha column's real
  transparency is visible. Both mechanisms converge on the same result, shown once below as a shared fade swatch
  rather than duplicated per column, since re-deriving it per mode would need SVG's separate alpha-mask-type
  attribute (which current React SVG typings don't expose) for no extra clarity.
*/
export default function MaskVisibilityDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 480 270" role="img" aria-labelledby="mask-visibility-diagram-title mask-visibility-diagram-desc">
          <title id="mask-visibility-diagram-title">CSS mask-mode alpha vs luminance diagram</title>
          <desc id="mask-visibility-diagram-desc">
            Two columns compare mask-mode: alpha against mask-mode: luminance. The alpha column&apos;s source gradient
            goes from opaque black to fully transparent black, and reads the source&apos;s opacity. The luminance
            column&apos;s source gradient goes from opaque white to opaque black, and reads the source&apos;s brightness.
            Both converge on the same visible fade, shown once below as a shared result, but by two different
            mechanisms.
          </desc>

          <defs>
            <marker id="mask-visibility-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>

            <pattern id="mask-visibility-checker" width={CHECKER_TILE * 2} height={CHECKER_TILE * 2} patternUnits="userSpaceOnUse">
              <rect width={CHECKER_TILE * 2} height={CHECKER_TILE * 2} fill="var(--color-bg-default)" />
              <rect width={CHECKER_TILE} height={CHECKER_TILE} fill="var(--color-bg-muted)" />
              <rect x={CHECKER_TILE} y={CHECKER_TILE} width={CHECKER_TILE} height={CHECKER_TILE} fill="var(--color-bg-muted)" />
            </pattern>

            {/* The shared result swatch's fill: photo colors fading to transparent, matching what both mechanisms above produce. */}
            <linearGradient id="mask-visibility-result-fade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={PHOTO_GRADIENT_FROM} stopOpacity={1} />
              <stop offset="100%" stopColor={PHOTO_GRADIENT_TO} stopOpacity={0} />
            </linearGradient>

            {MASK_VISIBILITY_COLUMNS.map((column) => (
              <linearGradient key={column.key} id={`mask-visibility-source-${column.key}`} x1="0" y1="0" x2="1" y2="0">
                {column.sourceStops.map((stop) => (
                  <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} stopOpacity={stop.opacity} />
                ))}
              </linearGradient>
            ))}
          </defs>

          {MASK_VISIBILITY_COLUMNS.map((column) => (
            <g key={column.key} transform={`translate(${column.x}, 0)`}>
              <text x={0} y={16} fontSize={13} fontWeight={600} fill="var(--color-fg-default)">{column.title}</text>

              <text x={0} y={34} fontSize={11} fill="var(--color-fg-muted)">source: {column.sourceLabel}</text>
              <rect y={42} width={SWATCH_W} height={SWATCH_H} rx={8} fill="url(#mask-visibility-checker)" stroke="var(--color-border-muted)" strokeWidth={1} />
              <rect y={42} width={SWATCH_W} height={SWATCH_H} rx={8} fill={`url(#mask-visibility-source-${column.key})`} />

              <text x={0} y={116} fontSize={10} fill="var(--color-fg-muted)">{column.mechanism}</text>
            </g>
          ))}

          {/* Both columns converge on one shared result swatch, since the whole point is that they produce the same outcome. */}
          <line x1={120} y1={128} x2={200} y2={166} stroke="var(--color-fg-muted)" strokeWidth={2} markerEnd="url(#mask-visibility-arrow)" />
          <line x1={360} y1={128} x2={280} y2={166} stroke="var(--color-fg-muted)" strokeWidth={2} markerEnd="url(#mask-visibility-arrow)" />

          <text x={240} y={158} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">same result</text>
          <rect x={140} y={166} width={SWATCH_W} height={SWATCH_H} rx={8} fill="url(#mask-visibility-checker)" stroke="var(--color-border-muted)" strokeWidth={1} />
          <rect x={140} y={166} width={SWATCH_W} height={SWATCH_H} rx={8} fill="url(#mask-visibility-result-fade)" />

          <text x={240} y={246} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">same visible fade, two different mechanisms</text>
        </Svg>
      </Wrapper>
    </>
  );
}

MaskVisibilityDiagram.displayName = "MaskVisibilityDiagram";
