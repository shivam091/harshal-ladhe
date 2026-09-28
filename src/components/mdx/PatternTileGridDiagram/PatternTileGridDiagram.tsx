import type { JSX } from "react";
import { TILE, DOT_RADIUS, PANEL, SHAPE, PANELS } from "@/components/mdx/PatternTileGridDiagram/PatternTileGridDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/PatternTileGridDiagram/PatternTileGridDiagram.styles";

// The tile grid is infinite in both directions, so start positions are walked back from the anchor to just before 0 — every tile touching the panel gets drawn.
function tileStarts(anchor: number, extent: number): number[] {
  const starts: number[] = [];
  for (let start = anchor - Math.ceil(anchor / TILE) * TILE; start < extent; start += TILE) {
    starts.push(start);
  }
  return starts;
}

/*
  Static SVG diagram comparing a userSpaceOnUse pattern's default tile anchoring (x="0" y="0", the user-space
  origin) with x/y set to the filled rect's own corner. Exists because "tiles start at the shape's corner" is the
  most common wrong assumption about <pattern>: the grid is laid down in user space first, and the shape merely
  reveals whichever part of it it happens to cover.
*/
export default function PatternTileGridDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 640 300" role="img" aria-labelledby="pattern-tile-grid-diagram-title pattern-tile-grid-diagram-desc">
          <title id="pattern-tile-grid-diagram-title">Where pattern tiles start</title>
          <desc id="pattern-tile-grid-diagram-desc">
            Two panels show the same 40 by 40 dot tile filling the same rectangle, which sits at 22, 22. On the left the
            pattern keeps its default x and y of 0, so the tile grid starts at the user-space origin and the dots along the
            rectangle&apos;s top and left edges are cut in half. On the right the pattern&apos;s x and y are set to 22, so the
            first tile begins exactly at the rectangle&apos;s corner and every dot inside it is whole.
          </desc>

          <defs>
            <clipPath id="pattern-tile-grid-diagram-panel-clip" clipPathUnits="userSpaceOnUse">
              <rect x={0} y={0} width={PANEL.width} height={PANEL.height} />
            </clipPath>
            <clipPath id="pattern-tile-grid-diagram-shape-clip" clipPathUnits="userSpaceOnUse">
              <rect x={SHAPE.x} y={SHAPE.y} width={SHAPE.width} height={SHAPE.height} />
            </clipPath>
          </defs>

          {PANELS.map((panel) => {
            const columns = tileStarts(panel.anchorX, PANEL.width);
            const rows = tileStarts(panel.anchorY, PANEL.height);
            const isDefault = panel.anchorX === 0 && panel.anchorY === 0;

            return (
              <g key={panel.key}>
                {/* Panel title — the pattern's x/y values being compared. */}
                <text x={panel.offsetX + PANEL.width / 2} y={34} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">{panel.title}</text>

                <g transform={`translate(${panel.offsetX} ${panel.offsetY})`}>
                  {/* User-space canvas — the panel's top-left corner is the (0,0) origin tiles anchor to by default. */}
                  <rect x={0} y={0} width={PANEL.width} height={PANEL.height} fill="var(--color-bg-muted)" stroke="var(--color-border-muted)" strokeWidth={1} />

                  {/* Tile grid lines and faint dots — the infinite tiling the pattern lays down across user space, visible or not. */}
                  <g clipPath="url(#pattern-tile-grid-diagram-panel-clip)">
                    {columns.filter((x) => x > 0).map((x) => (
                      <line key={`col-${x}`} x1={x} y1={0} x2={x} y2={PANEL.height} stroke="var(--color-border-default)" strokeWidth={1} strokeDasharray="3 3" />
                    ))}
                    {rows.filter((y) => y > 0).map((y) => (
                      <line key={`row-${y}`} x1={0} y1={y} x2={PANEL.width} y2={y} stroke="var(--color-border-default)" strokeWidth={1} strokeDasharray="3 3" />
                    ))}
                    {columns.flatMap((x) => rows.map((y) => (
                      <circle key={`ghost-${x}-${y}`} cx={x + TILE / 2} cy={y + TILE / 2} r={DOT_RADIUS} fill="var(--color-fg-muted)" opacity={0.25} />
                    )))}
                  </g>

                  {/* Filled shape's background — the only region where the pattern actually paints. */}
                  <rect x={SHAPE.x} y={SHAPE.y} width={SHAPE.width} height={SHAPE.height} fill="var(--color-bg-default)" />

                  {/* The first tile, anchored at the pattern's x/y — highlighted so its position relative to the rect is obvious. */}
                  <rect x={panel.anchorX} y={panel.anchorY} width={TILE} height={TILE} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5} opacity={0.6} />

                  {/* Painted dots — the same tile grid, clipped to the shape; edge dots are cut wherever the grid misses the corner. */}
                  <g clipPath="url(#pattern-tile-grid-diagram-shape-clip)">
                    {columns.flatMap((x) => rows.map((y) => (
                      <circle key={`dot-${x}-${y}`} cx={x + TILE / 2} cy={y + TILE / 2} r={DOT_RADIUS} fill="var(--color-fg-accent)" />
                    )))}
                  </g>

                  {/* Shape outline — drawn last so the rect's true edge is visible over both grids. */}
                  <rect x={SHAPE.x} y={SHAPE.y} width={SHAPE.width} height={SHAPE.height} fill="none" stroke="var(--color-fg-default)" strokeWidth={1.5} />

                  {/* User-space origin marker. */}
                  <circle cx={0} cy={0} r={3.5} fill="var(--color-fg-danger)" />
                  <text x={-4} y={-6} textAnchor="end" fontSize={11} fill="var(--color-fg-danger)">(0,0)</text>

                  {isDefault ? (
                    <g>
                      {/* Width and height ticks on the first tile — the pattern's own width/height attributes. */}
                      <line x1={0} y1={-3} x2={TILE} y2={-3} stroke="var(--color-fg-muted)" strokeWidth={1} />
                      <text x={TILE / 2 + 6} y={-8} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">w = 40</text>
                      <line x1={-3} y1={0} x2={-3} y2={TILE} stroke="var(--color-fg-muted)" strokeWidth={1} />
                      <text transform={`translate(-8 ${TILE / 2}) rotate(-90)`} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">h = 40</text>
                    </g>
                  ) : (
                    <g>
                      {/* Offset from the origin to the first tile — what the pattern's x/y attributes actually set. */}
                      <line x1={0} y1={0} x2={panel.anchorX} y2={panel.anchorY} stroke="var(--color-fg-danger)" strokeWidth={1.5} strokeDasharray="3 2" />
                      <text x={panel.anchorX + 4} y={panel.anchorY - 6} fontSize={11} fontWeight={600} fill="var(--color-fg-default)" stroke="var(--color-bg-muted)" strokeWidth={3} paintOrder="stroke">x = 22, y = 22</text>
                    </g>
                  )}
                </g>

                {/* Panel caption — what the anchoring choice does to the dots inside the rect. */}
                <text x={panel.offsetX + PANEL.width / 2} y={panel.offsetY + PANEL.height + 24} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">{panel.caption}</text>
              </g>
            );
          })}
        </Svg>
      </Wrapper>
    </>
  );
}

PatternTileGridDiagram.displayName = "PatternTileGridDiagram";
