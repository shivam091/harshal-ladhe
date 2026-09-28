import type { JSX } from "react";
import { TILE, RADIUS, TILE_VIEW_SCALE, RESULT_SCALE, RESULT_COUNT, LAYOUT, PANELS } from "@/components/mdx/SeamlessTileDiagram/SeamlessTileDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/SeamlessTileDiagram/SeamlessTileDiagram.styles";

// Typed explicitly so TileContent accepts either panel's copies list, whichever tones it mixes.
interface MotifCopy {
  cx: number;
  cy: number;
  tone: string;
}

// Tone names map to theme tokens so the duplicated half can be told apart from the original in both themes.
const TONE_FILL: Record<string, string> = {
  accent: "var(--color-fg-accent)",
  attention: "var(--color-fg-attention)"
};

// Renders one tile's content clipped to the tile square, mirroring how a <pattern> clips its content to the tile.
function TileContent({ copies }: { copies: MotifCopy[] }): JSX.Element {
  return (
    <g clipPath="url(#seamless-tile-diagram-tile-clip)">
      <rect x={0} y={0} width={TILE} height={TILE} fill="var(--color-bg-default)" />
      {copies.map((copy) => (
        <circle key={`${copy.cx}-${copy.cy}`} cx={copy.cx} cy={copy.cy} r={RADIUS} fill={TONE_FILL[copy.tone]} />
      ))}
    </g>
  );
}

/*
  Static SVG diagram contrasting a tile whose motif crosses the tile's edge (and is clipped into half-moons) with the
  fixed version, which duplicates the motif on the opposite edge so the halves reunite across each seam. Exists
  because pattern content is always clipped to the tile, and the fix — draw every edge-crossing shape twice — is
  far easier to see than to describe.
*/
export default function SeamlessTileDiagram(): JSX.Element {
  const tileViewSize = TILE * TILE_VIEW_SCALE;
  const resultTileSize = TILE * RESULT_SCALE;
  const resultSize = resultTileSize * RESULT_COUNT;

  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 640 380" role="img" aria-labelledby="seamless-tile-diagram-title seamless-tile-diagram-desc">
          <title id="seamless-tile-diagram-title">Making a pattern tile seamless</title>
          <desc id="seamless-tile-diagram-desc">
            Left: a tile holds one circle centred on its right edge. The tile clips the circle, so the tiled result shows a
            row of half-moons. Right: the tile also holds a copy of the circle centred on its left edge. When tiled, the
            half cut off one tile&apos;s right edge is supplied by the next tile&apos;s left-edge copy, and full circles appear
            across every seam.
          </desc>

          <defs>
            <clipPath id="seamless-tile-diagram-tile-clip" clipPathUnits="userSpaceOnUse">
              <rect x={0} y={0} width={TILE} height={TILE} />
            </clipPath>
            <marker id="seamless-tile-diagram-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
          </defs>

          {PANELS.map((panel) => {
            const tileViewX = panel.centreX - tileViewSize / 2;
            const resultX = panel.centreX - resultSize / 2;

            return (
              <g key={panel.key}>
                {/* Panel title. */}
                <text x={panel.centreX} y={26} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">{panel.title}</text>

                {/* Enlarged single tile, with the clipped-away outline of each motif shown dashed. */}
                <g transform={`translate(${tileViewX} ${LAYOUT.tileTop}) scale(${TILE_VIEW_SCALE})`}>
                  <TileContent copies={panel.copies} />
                  {panel.copies.map((copy) => (
                    <circle key={`ghost-${copy.cx}`} cx={copy.cx} cy={copy.cy} r={RADIUS} fill="none" stroke="var(--color-fg-muted)" strokeWidth={0.75} strokeDasharray="2 1.5" />
                  ))}
                  <rect x={0} y={0} width={TILE} height={TILE} fill="none" stroke="var(--color-border-accent-emphasis)" strokeWidth={1} />
                </g>
                <text x={tileViewX - 32} y={LAYOUT.tileTop + tileViewSize / 2 + 4} textAnchor="end" fontSize={11} fill="var(--color-fg-muted)">one tile</text>

                {/* Arrow: the tile, repeated. */}
                <line x1={panel.centreX} y1={LAYOUT.arrowTop} x2={panel.centreX} y2={LAYOUT.arrowBottom} stroke="var(--color-fg-muted)" strokeWidth={2} markerEnd="url(#seamless-tile-diagram-arrow)" />
                <text x={panel.centreX + 10} y={LAYOUT.arrowTop + 16} fontSize={10} fontStyle="italic" fill="var(--color-fg-muted)">tiled 3 × 3</text>

                {/* Tiled result — the same tile repeated, with each tile's boundary drawn dashed so the seams are visible. */}
                {Array.from({ length: RESULT_COUNT }, (_, column) => Array.from({ length: RESULT_COUNT }, (_, row) => (
                  <g key={`${column}-${row}`} transform={`translate(${resultX + column * resultTileSize} ${LAYOUT.resultTop + row * resultTileSize}) scale(${RESULT_SCALE})`}>
                    <TileContent copies={panel.copies} />
                    <rect x={0} y={0} width={TILE} height={TILE} fill="none" stroke="var(--color-border-default)" strokeWidth={0.5} strokeDasharray="2 2" />
                  </g>
                )))}
                <rect x={resultX} y={LAYOUT.resultTop} width={resultSize} height={resultSize} fill="none" stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5} />

                {/* Panel caption — what the tiled result looks like. */}
                <text x={panel.centreX} y={LAYOUT.captionY} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">{panel.caption}</text>
              </g>
            );
          })}
        </Svg>
      </Wrapper>
    </>
  );
}

SeamlessTileDiagram.displayName = "SeamlessTileDiagram";
