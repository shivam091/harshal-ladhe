import type { JSX } from "react";
import { RING, BBOX, SWATCHES, COLUMNS, VALUE_COLUMN_X, FIRST_ROW_Y, ROW_PITCH, VALUES } from "@/components/mdx/PointerEventsHitAreaDiagram/PointerEventsHitAreaDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/PointerEventsHitAreaDiagram/PointerEventsHitAreaDiagram.styles";

/*
  Static diagram pairing one stroked circle — its fill region, stroke band, and geometry bounding box shaded
  separately — with a matrix of which regions each pointer-events value makes clickable. Exists because
  "why doesn't clicking the middle of my outline icon work?" is a hit-testing question, and hit regions are
  invisible until you draw them.
*/
export default function PointerEventsHitAreaDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 680 340" role="img" aria-labelledby="pointer-events-hit-area-diagram-title pointer-events-hit-area-diagram-desc">
          <title id="pointer-events-hit-area-diagram-title">pointer-events hit regions diagram</title>
          <desc id="pointer-events-hit-area-diagram-desc">
            A stroked circle split into three shaded hit regions: the fill region inside the outline, the stroke band
            straddling the outline, and the corners of the geometry bounding box outside the stroke. A matrix maps each
            pointer-events value to the regions it hit-tests: visiblePainted (the default) and painted hit fill and stroke
            only where that paint is not none; visible and all hit both regardless of paint; fill hits only the fill
            region; stroke hits only the stroke band; none hits nothing; bounding-box hits the whole bounding box.
          </desc>

          {/* Left panel heading. */}
          <text x={RING.cx} y={30} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">One stroked circle, three regions</text>

          {/* Geometry bounding box — shaded first so the ring paints over it and only the corners stay visible. */}
          <rect x={BBOX.x} y={BBOX.y} width={BBOX.width} height={BBOX.height} fill="var(--color-bg-attention-muted)" stroke="var(--color-border-attention-emphasis)" strokeWidth={1.5} strokeDasharray="5 4" />

          {/* Fill region — everything inside the outline's geometry. */}
          <circle cx={RING.cx} cy={RING.cy} r={RING.r} fill="var(--color-bg-accent-muted)" />

          {/* Stroke band — centred on the outline, so half of it overlaps the fill and half sits outside it. */}
          <circle cx={RING.cx} cy={RING.cy} r={RING.r} fill="none" stroke="var(--color-bg-success-muted)" strokeWidth={RING.strokeWidth} />
          <circle cx={RING.cx} cy={RING.cy} r={RING.r - RING.strokeWidth / 2} fill="none" stroke="var(--color-border-success-emphasis)" strokeWidth={1.5} />
          <circle cx={RING.cx} cy={RING.cy} r={RING.r + RING.strokeWidth / 2} fill="none" stroke="var(--color-border-success-emphasis)" strokeWidth={1.5} />

          {/* Region labels drawn directly on the shape. */}
          <text x={RING.cx} y={RING.cy - RING.r + 4} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--color-fg-default)">stroke</text>
          <text x={RING.cx} y={RING.cy} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--color-fg-default)">fill region</text>
          <text x={RING.cx} y={RING.cy + 16} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">hollow when fill=&quot;none&quot;</text>

          {/* Legend swatches naming the three shaded regions. */}
          {SWATCHES.map((swatch) => (
            <g key={swatch.label}>
              <rect x={swatch.x} y={292} width={14} height={14} rx={3} fill={swatch.fill} stroke={swatch.stroke} strokeWidth={1.5} />
              <text x={swatch.x + 20} y={303} fontSize={11} fill="var(--color-fg-default)">{swatch.label}</text>
            </g>
          ))}

          {/* Matrix header row — each region column tinted to match its shading on the left. */}
          <text x={VALUE_COLUMN_X} y={58} fontSize={12} fontWeight={600} fill="var(--color-fg-default)">pointer-events</text>
          {COLUMNS.map((column) => (
            <g key={column.label}>
              <rect x={column.x - 26} y={43} width={52} height={22} rx={6} fill={column.fill} stroke={column.stroke} strokeWidth={1.5} />
              <text x={column.x} y={58} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--color-fg-default)">{column.label}</text>
            </g>
          ))}

          {/* Matrix body — one row per pointer-events value, one cell per region. */}
          {VALUES.map((value, rowIndex) => {
            const y = FIRST_ROW_Y + rowIndex * ROW_PITCH;

            return (
              <g key={value.name}>
                <line x1={VALUE_COLUMN_X} y1={y - 16} x2={670} y2={y - 16} stroke="var(--color-border-muted)" strokeWidth={1} />
                <text x={VALUE_COLUMN_X} y={y} fontSize={11} fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fill="var(--color-fg-default)">{value.name}</text>
                {value.cells.map((cell, cellIndex) => (
                  <text key={COLUMNS[cellIndex].label} x={COLUMNS[cellIndex].x} y={y} textAnchor="middle" fontSize={10} fontWeight={cell === "yes" ? 600 : 400} fill={cell === "—" ? "var(--color-fg-muted)" : "var(--color-fg-default)"}>{cell}</text>
                ))}
              </g>
            );
          })}

          {/* Footnotes for the two qualifiers the cells abbreviate. */}
          <text x={VALUE_COLUMN_X} y={300} fontSize={10} fill="var(--color-fg-muted)">* default. visiblePainted and visible also need visibility: visible</text>
          <text x={VALUE_COLUMN_X} y={316} fontSize={10} fill="var(--color-fg-muted)">&quot;if painted&quot; = paint is not none — fill=&quot;transparent&quot; counts</text>
        </Svg>
      </Wrapper>
    </>
  );
}

PointerEventsHitAreaDiagram.displayName = "PointerEventsHitAreaDiagram";
