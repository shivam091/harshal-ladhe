import type { JSX } from "react";
import { ROW, AXIS_Y, OBB_RECTS, UOU_RECTS, UOU_VECTOR, UOU_TICKS, OBB_TICK_LABELS } from "@/components/mdx/GradientUnitsDiagram/GradientUnitsDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/GradientUnitsDiagram/GradientUnitsDiagram.styles";

/*
  Static side-by-side of gradientUnits. Exists because the two modes use identical-looking attribute values
  but measure them against different rulers — each shape's own bounding box vs. one shared user-space
  coordinate system — and that difference is far easier to see as two rulers than to read about.
*/
export default function GradientUnitsDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 640 260" role="img" aria-labelledby="gradient-units-diagram-title gradient-units-diagram-desc">
          <title id="gradient-units-diagram-title">objectBoundingBox vs. userSpaceOnUse diagram</title>
          <desc id="gradient-units-diagram-desc">
            Left panel, objectBoundingBox: a small and a wide rectangle each show the complete two-color ramp, and each
            has its own axis running from 0 to 1 across its own width. Right panel, userSpaceOnUse: the same two
            rectangles share one axis from x equals 350 to x equals 600 in user units, so the small rectangle shows
            only the start of the ramp and the wide one continues it.
          </desc>

          <defs>
            {/* objectBoundingBox (the default): 0 → 1 re-measured against whichever shape is painted. */}
            <linearGradient id="gradient-units-diagram-obb" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" style={{ stopColor: "var(--color-fg-accent)" }} />
              <stop offset="1" style={{ stopColor: "var(--color-bg-accent-muted)" }} />
            </linearGradient>
            {/* userSpaceOnUse: one fixed line in the SVG's own coordinates, shared by every shape. */}
            <linearGradient id="gradient-units-diagram-uou" gradientUnits="userSpaceOnUse" x1={UOU_VECTOR.x1} y1="0" x2={UOU_VECTOR.x2} y2="0">
              <stop offset="0" style={{ stopColor: "var(--color-fg-accent)" }} />
              <stop offset="1" style={{ stopColor: "var(--color-bg-accent-muted)" }} />
            </linearGradient>
          </defs>

          {/* Panel headings. */}
          <text x={165} y={40} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">objectBoundingBox (default)</text>
          <text x={475} y={40} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">userSpaceOnUse</text>

          {/* Divider between the two panels. */}
          <line x1={320} y1={24} x2={320} y2={236} stroke="var(--color-border-muted)" strokeWidth={1} strokeDasharray="4 4" />

          {/* objectBoundingBox panel — each rect with its own 0 → 1 ruler. */}
          {OBB_RECTS.map((rect) => (
            <g key={rect.x}>
              <rect x={rect.x} y={ROW.y} width={rect.width} height={ROW.height} rx={4} fill="url(#gradient-units-diagram-obb)" stroke="var(--color-border-default)" strokeWidth={1.5} />
              <line x1={rect.x} y1={AXIS_Y} x2={rect.x + rect.width} y2={AXIS_Y} stroke="var(--color-fg-muted)" strokeWidth={1.5} />
              {OBB_TICK_LABELS.map((label, index) => {
                // Ticks at 0, 0.5 and 1 of THIS rect's width — each shape's ruler is scaled to its own box.
                const tickX = rect.x + (rect.width * index) / 2;

                return (
                  <g key={label}>
                    <line x1={tickX} y1={AXIS_Y - 4} x2={tickX} y2={AXIS_Y + 4} stroke="var(--color-fg-muted)" strokeWidth={1.5} />
                    <text x={tickX} y={AXIS_Y + 18} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">{label}</text>
                  </g>
                );
              })}
            </g>
          ))}

          {/* userSpaceOnUse panel — both rects sampling one shared ramp. */}
          {UOU_RECTS.map((rect) => (
            <rect key={rect.x} x={rect.x} y={ROW.y} width={rect.width} height={ROW.height} rx={4} fill="url(#gradient-units-diagram-uou)" stroke="var(--color-border-default)" strokeWidth={1.5} />
          ))}

          {/* The single shared user-space ruler, spanning the gap between the rects too. */}
          <line x1={UOU_VECTOR.x1} y1={AXIS_Y} x2={UOU_VECTOR.x2} y2={AXIS_Y} stroke="var(--color-fg-muted)" strokeWidth={1.5} />
          {UOU_TICKS.map((tick) => (
            <g key={tick}>
              <line x1={tick} y1={AXIS_Y - 4} x2={tick} y2={AXIS_Y + 4} stroke="var(--color-fg-muted)" strokeWidth={1.5} />
              <text x={tick} y={AXIS_Y + 18} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">{`x = ${tick}`}</text>
            </g>
          ))}

          {/* Captions — the one-line takeaway under each panel. */}
          <text x={165} y={200} textAnchor="middle" fontSize={12} fill="var(--color-fg-default)">every shape gets the full ramp</text>
          <text x={165} y={218} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">0 → 1 = that shape&apos;s own bounding box</text>
          <text x={475} y={200} textAnchor="middle" fontSize={12} fill="var(--color-fg-default)">one ramp shared by both shapes</text>
          <text x={475} y={218} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">x1 / x2 = user-space coordinates</text>

          <text x={320} y={252} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">same two stops — only the ruler that x1 / x2 are measured against changes</text>
        </Svg>
      </Wrapper>
    </>
  );
}

GradientUnitsDiagram.displayName = "GradientUnitsDiagram";
