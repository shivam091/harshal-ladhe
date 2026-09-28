import type { JSX } from "react";
import { SHAPES, MODES, CAPTION_OFFSET } from "@/components/mdx/PatternUnitsDiagram/PatternUnitsDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/PatternUnitsDiagram/PatternUnitsDiagram.styles";

// Fractional tile counts (2.4 rows) are the point of the userSpaceOnUse row, so counts keep one decimal instead of rounding away the partial tile.
function formatCount(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

/*
  Static SVG diagram filling a small and a large rect with the same pattern under each patternUnits mode, drawn as a
  checkerboard so individual tiles can be counted. Exists to show the one behavioural difference that decides which
  mode to reach for: objectBoundingBox keeps the number of tiles constant (tiles stretch), userSpaceOnUse keeps the
  size of each tile constant (more tiles appear, and the last row can be partial).
*/
export default function PatternUnitsDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 640 372" role="img" aria-labelledby="pattern-units-diagram-title pattern-units-diagram-desc">
          <title id="pattern-units-diagram-title">patternUnits: objectBoundingBox vs. userSpaceOnUse</title>
          <desc id="pattern-units-diagram-desc">
            A small 80 by 48 rectangle and a large 200 by 120 rectangle are each filled twice. With patternUnits set to
            objectBoundingBox and width and height of 0.25, both rectangles get 4 by 4 tiles; the tiles simply grow with the
            shape. With patternUnits set to userSpaceOnUse and width and height of 20, every tile is 20 by 20, so the small
            rectangle fits 4 by 2.4 tiles and the large one fits 10 by 6.
          </desc>

          {/* Column headings — the two target shapes. */}
          {SHAPES.map((shape) => (
            <text key={shape.key} x={shape.x + shape.width / 2} y={30} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--color-fg-default)">{shape.heading}</text>
          ))}

          {/* Divider between the two patternUnits rows. */}
          <line x1={16} y1={204} x2={624} y2={204} stroke="var(--color-border-muted)" strokeWidth={1} />

          {MODES.map((mode) => (
            <g key={mode.key}>
              {/* Row label — the patternUnits value, its width/height, and the rule it follows. */}
              <text x={16} y={mode.top + 50} fontSize={13} fontWeight={600} fill="var(--color-fg-default)">{mode.label}</text>
              <text x={16} y={mode.top + 68} fontSize={11} fill="var(--color-fg-muted)">{mode.attributes}</text>
              <text x={16} y={mode.top + 88} fontSize={11} fontWeight={600} fill="var(--color-fg-accent)">{mode.rule}</text>

              {SHAPES.map((shape) => {
                const tile = mode.tileFor(shape.width, shape.height);
                const columns = Math.ceil(shape.width / tile.width - 1e-9);
                const rows = Math.ceil(shape.height / tile.height - 1e-9);

                return (
                  <g key={shape.key}>
                    {/* Checkerboard of tiles — each cell is one tile, trimmed where the shape's edge cuts the last row or column. */}
                    {Array.from({ length: columns }, (_, column) => Array.from({ length: rows }, (_, row) => (
                      <rect
                        key={`${column}-${row}`}
                        x={shape.x + column * tile.width}
                        y={mode.top + row * tile.height}
                        width={Math.min(tile.width, shape.width - column * tile.width)}
                        height={Math.min(tile.height, shape.height - row * tile.height)}
                        fill={(column + row) % 2 === 0 ? "var(--color-bg-accent-muted)" : "var(--color-bg-default)"}
                        stroke="var(--color-border-muted)"
                        strokeWidth={0.75}
                      />
                    )))}

                    {/* Shape outline — the filled rect's true bounds. */}
                    <rect x={shape.x} y={mode.top} width={shape.width} height={shape.height} fill="none" stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5} />

                    {/* Cell caption — tile count and the size each tile resolves to. */}
                    <text x={shape.x + shape.width / 2} y={mode.top + CAPTION_OFFSET} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">
                      {`${formatCount(shape.width / tile.width)} × ${formatCount(shape.height / tile.height)} tiles of ${tile.width} × ${tile.height}`}
                    </text>
                  </g>
                );
              })}
            </g>
          ))}
        </Svg>
      </Wrapper>
    </>
  );
}

PatternUnitsDiagram.displayName = "PatternUnitsDiagram";
