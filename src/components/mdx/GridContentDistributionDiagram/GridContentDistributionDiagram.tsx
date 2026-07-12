import type { JSX } from "react";
import {
  TRACK_W,
  CONTAINER_H,
  CONTAINER_W,
  ORIGIN_X,
  ROW_CAPTION_Y,
  ROW_CONTAINER_Y,
  PAD_Y,
  ROWS
} from "@/components/mdx/GridContentDistributionDiagram/GridContentDistributionDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/GridContentDistributionDiagram/GridContentDistributionDiagram.styles";

/*
  Static SVG diagram comparing `space-between`, `space-around`, and `space-evenly` on the same 3
  fixed-size tracks in the same fixed-size container — the visual proportions do the explaining:
  space-between leaves no edge gap, space-around's edge gap is visibly half its between-track gap,
  and space-evenly's edges and between-gaps all match.
*/
export default function GridContentDistributionDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 410 400" role="img" aria-labelledby="grid-content-distribution-title grid-content-distribution-desc">
          <title id="grid-content-distribution-title">justify-content distribution diagram</title>
          <desc id="grid-content-distribution-desc">
            Three rows, each showing the same 3 fixed-width tracks inside the same container: space-between
            leaves no gap at the edges, space-around gives each edge half the gap size used between tracks,
            and space-evenly makes every gap — edge or between — the same size.
          </desc>

          {ROWS.map((row, rowIndex) => (
            <g key={row.caption}>
              <text x={ORIGIN_X} y={ROW_CAPTION_Y[rowIndex]} fontSize={13} fontWeight={600} fill="var(--color-fg-default)">
                {row.caption}
              </text>

              <rect
                x={ORIGIN_X} y={ROW_CONTAINER_Y[rowIndex]} width={CONTAINER_W} height={CONTAINER_H} rx={8}
                fill="var(--color-bg-muted)" stroke="var(--color-border-default)" strokeWidth={1.5}
              />

              {row.trackX.map((x, trackIndex) => (
                <rect
                  key={trackIndex}
                  x={ORIGIN_X + x} y={ROW_CONTAINER_Y[rowIndex] + PAD_Y} width={TRACK_W} height={TRACK_W}
                  rx={4} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5}
                />
              ))}
            </g>
          ))}
        </Svg>
      </Wrapper>
    </>
  );
}

GridContentDistributionDiagram.displayName = "GridContentDistributionDiagram";
