import type { JSX } from "react";
import { GRID_ORIGIN, GRID_SCALE, GRID_UNITS, ROW_SCALE, ROW_STROKE, VERTEX_X, LINE_START_X, ROWS } from "@/components/mdx/MarkerAnatomyDiagram/MarkerAnatomyDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/MarkerAnatomyDiagram/MarkerAnatomyDiagram.styles";

// Maps a marker-unit x coordinate onto the enlarged left-panel grid, so the triangle and ref point share one source of truth.
const gx = (u: number): number => GRID_ORIGIN.x + u * GRID_SCALE;

// Maps a marker-unit y coordinate onto the enlarged left-panel grid.
const gy = (u: number): number => GRID_ORIGIN.y + u * GRID_SCALE;

// Every grid line index from 0 to 10 inclusive, so both edges of the viewBox are drawn along with the interior cells.
const GRID_LINES = Array.from({ length: GRID_UNITS + 1 }, (_, index) => index);

// Only 0, 5, and 10 are labelled — enough to read (8, 5) off the grid without crowding the edges.
const TICKS = [0, 5, 10];

/*
  Static SVG diagram of a marker's anatomy — its own 0 0 10 10 viewBox grid, the arrowhead drawn on it, the
  (refX, refY) point, and the markerWidth × markerHeight box — beside a true-scale comparison of refX="10" and
  refX="8" on a thick line. Exists because refX is the attribute people get wrong most: the comparison shows why a
  reference point slightly behind the tip hides the stroke's square butt end, and what that choice costs.
*/
export default function MarkerAnatomyDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 660 350" role="img" aria-labelledby="marker-anatomy-diagram-title marker-anatomy-diagram-desc">
          <title id="marker-anatomy-diagram-title">Anatomy of an SVG marker and the effect of refX</title>
          <desc id="marker-anatomy-diagram-desc">
            Left: a marker&apos;s 0 0 10 10 viewBox drawn as a grid, with a triangle whose tip is at (10, 5) and a reference
            point at refX 8, refY 5. The whole grid is the markerWidth by markerHeight box, here 6 by 6 stroke-widths.
            Right: the same arrowhead on a thick line twice. With refX 10 the tip sits exactly on the line&apos;s end vertex,
            and the square corners of the stroke poke out beside the narrow tip. With refX 8 the line ends inside the wider
            part of the arrow so the stroke is hidden, at the cost of the tip overshooting the vertex by 2 marker units.
          </desc>

          {/* Left panel heading — names the coordinate system every other left-panel label is measured in. */}
          <text x={gx(5)} y={24} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">marker viewBox=&quot;0 0 10 10&quot;</text>

          {/* Grid — one cell per marker unit, so (8, 5) can be counted off directly. */}
          {GRID_LINES.map((index) => (
            <g key={index}>
              <line x1={gx(index)} y1={gy(0)} x2={gx(index)} y2={gy(GRID_UNITS)} stroke="var(--color-border-muted)" strokeWidth={1} />
              <line x1={gx(0)} y1={gy(index)} x2={gx(GRID_UNITS)} y2={gy(index)} stroke="var(--color-border-muted)" strokeWidth={1} />
            </g>
          ))}

          {/* Tick labels — along the top for x and down the left for y. */}
          {TICKS.map((tick) => (
            <g key={tick}>
              <text x={gx(tick)} y={GRID_ORIGIN.y - 10} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">{tick}</text>
              <text x={GRID_ORIGIN.x - 8} y={gy(tick) + 4} textAnchor="end" fontSize={11} fill="var(--color-fg-muted)">{tick}</text>
            </g>
          ))}

          {/* The arrowhead artwork — M0,0 L10,5 L0,10 Z, drawn in marker units. */}
          <path d={`M${gx(0)},${gy(0)} L${gx(10)},${gy(5)} L${gx(0)},${gy(10)} Z`} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5} />

          {/* markerWidth × markerHeight box — the whole viewBox, which is what gets scaled to the render size. */}
          <rect x={gx(0)} y={gy(0)} width={GRID_UNITS * GRID_SCALE} height={GRID_UNITS * GRID_SCALE} fill="none" stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5} strokeDasharray="6 4" />
          <text x={gx(5)} y={gy(10) + 22} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--color-fg-default)">markerWidth × markerHeight</text>
          <text x={gx(5)} y={gy(10) + 38} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">the whole grid, scaled to 6 × 6 stroke-widths</text>

          {/* Tip — the coordinate refX="10" would pick. */}
          <circle cx={gx(10)} cy={gy(5)} r={3.5} fill="var(--color-fg-muted)" />
          <text x={gx(10) + 8} y={gy(5) - 10} fontSize={11} fill="var(--color-fg-muted)">tip (10, 5)</text>

          {/* Reference point — the one point of the artwork that is pinned to the vertex. */}
          <circle cx={gx(8)} cy={gy(5)} r={5} fill="var(--color-fg-danger)" />
          <line x1={gx(8)} y1={gy(5) + 6} x2={gx(7.2)} y2={gy(6.7)} stroke="var(--color-fg-danger)" strokeWidth={1.5} />
          <text x={gx(6.8)} y={gy(7.4)} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--color-fg-danger)">(refX, refY) = (8, 5)</text>

          {/* Comparison rows — the same arrowhead at true relative scale on a thick line, differing only in refX. */}
          {ROWS.map((row) => {
            // Where the tip lands: refX units behind the tip sit on the vertex, so a smaller refX pushes the tip past it.
            const tipX =VERTEX_X + (GRID_UNITS - row.refX) * ROW_SCALE;
            // The triangle's flat back edge, a full 10 marker units behind the tip.
            const baseX = tipX - GRID_UNITS * ROW_SCALE;
            // Half the arrow's height at its widest, matching the 0..10 y-span of the artwork.
            const half = (GRID_UNITS / 2) * ROW_SCALE;

            return (
              <g key={row.refX}>
                <text x={480} y={row.y - 64} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--color-fg-default)">{row.title}</text>

                {/* The line itself, with a butt cap — its square end is exactly as wide as the stroke. */}
                <line x1={LINE_START_X} y1={row.y} x2={VERTEX_X} y2={row.y} stroke="var(--color-fg-muted)" strokeWidth={ROW_STROKE} strokeLinecap="butt" />

                {/* The marker, painted after the stroke, positioned so marker-space (refX, 5) sits on the vertex. */}
                <path d={`M${baseX},${row.y - half} L${tipX},${row.y} L${baseX},${row.y + half} Z`} fill="var(--color-border-accent-emphasis)" />

                {/* The vertex the line ends at. */}
                <circle cx={VERTEX_X} cy={row.y} r={4} fill="var(--color-bg-default)" stroke="var(--color-fg-danger)" strokeWidth={2} />

                {/* Highlight the exposed stroke corners in the refX="10" row only — they are the problem being fixed. */}
                {row.refX === GRID_UNITS && (
                  <circle cx={VERTEX_X - 8} cy={row.y} r={18} fill="none" stroke="var(--color-border-danger-emphasis)" strokeWidth={1.5} strokeDasharray="4 3" />
                )}

                <text x={640} y={row.y + 66} textAnchor="end" fontSize={11} fill="var(--color-fg-muted)">{row.note}</text>
              </g>
            );
          })}

          {/* Overshoot note — the trade-off refX="8" makes, and the fix for it. */}
          <text x={640} y={332} textAnchor="end" fontSize={11} fill="var(--color-fg-muted)">cost: tip overshoots by 2 marker units, so shorten the path</text>
        </Svg>
      </Wrapper>
    </>
  );
}

MarkerAnatomyDiagram.displayName = "MarkerAnatomyDiagram";
