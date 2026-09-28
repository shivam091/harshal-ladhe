import type { JSX } from "react";
import { TILE_SIZE, TILE_GAP, GRID_TOP, SOURCE_VIEWBOX, SOURCE_BANDS, X_ALIGNS, Y_ALIGNS, PANELS, SOURCE_THUMB, NONE_TILE } from "@/components/mdx/PreserveAspectRatioDiagram/PreserveAspectRatioDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/PreserveAspectRatioDiagram/PreserveAspectRatioDiagram.styles";

// Distance from one tile's left/top edge to the next — tile plus gap.
const STEP = TILE_SIZE + TILE_GAP;

// Width of one full 3×3 grid, used to centre each panel's title and caption over it.
const GRID_WIDTH = 3 * TILE_SIZE + 2 * TILE_GAP;

// The source artwork as nested-SVG children — shared so every tile is provably fitting the exact same picture.
function SourceBands(): JSX.Element {
  return (
    <>
      {SOURCE_BANDS.map((band) => (
        <rect key={band.x} x={band.x} y={0} width={20} height={30} fill={band.fill} />
      ))}
    </>
  );
}

/*
  One target box. It renders the source through a real nested <svg> with the real preserveAspectRatio value, so the
  diagram can't drift from actual browser behaviour — the browser is doing the fitting, not hand-computed geometry.
*/
function FitTile({ x, y, value }: { x: number; y: number; value: string }): JSX.Element {
  return (
    <g>
      <rect x={x} y={y} width={TILE_SIZE} height={TILE_SIZE} fill="var(--color-bg-muted)" />
      <svg x={x} y={y} width={TILE_SIZE} height={TILE_SIZE} viewBox={SOURCE_VIEWBOX} preserveAspectRatio={value}>
        <SourceBands />
      </svg>
      <rect x={x} y={y} width={TILE_SIZE} height={TILE_SIZE} fill="none" stroke="var(--color-fg-muted)" strokeWidth={1} strokeDasharray="3 2" />
    </g>
  );
}

/*
  Static diagram of preserveAspectRatio fitting a wide 2:1 source into a square box: all nine alignment values
  under meet, the same nine under slice, and the lone none value. Exists because the alignment keyword is usually
  explained only as "which part survives the crop" — seeing both grids side by side shows it also decides where a
  letterboxed meet image sits, and that for a wide source only one axis of the keyword ever matters.
*/
export default function PreserveAspectRatioDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 660 270" role="img" aria-labelledby="preserve-aspect-ratio-diagram-title preserve-aspect-ratio-diagram-desc">
          <title id="preserve-aspect-ratio-diagram-title">preserveAspectRatio alignment under meet, slice, and none</title>
          <desc id="preserve-aspect-ratio-diagram-desc">
            A wide 2:1 source made of three colour bands is fitted into square boxes. Under meet, the whole source is
            shown with empty bars above and below; yMin pins it to the top, yMid centres it, yMax pins it to the bottom,
            and the x keywords make no visible difference. Under slice, the source fills the box and is cropped; xMin
            keeps the left band, xMid the centre, xMax the right, and the y keywords make no visible difference. With
            none, the source is stretched to fill the square, distorting it.
          </desc>

          {/* meet and slice panels — title, column/row keyword labels, the nine tiles, and the object-fit caption. */}
          {PANELS.map((panel) => (
            <g key={panel.mode}>
              <text x={panel.x + GRID_WIDTH / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">{panel.title}</text>
              {X_ALIGNS.map((xAlign, column) => (
                <text key={xAlign} x={panel.x + column * STEP + TILE_SIZE / 2} y={42} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">{xAlign}</text>
              ))}
              {Y_ALIGNS.map((yAlign, row) => (
                <g key={yAlign}>
                  <text x={panel.x - 6} y={GRID_TOP + row * STEP + TILE_SIZE / 2 + 4} textAnchor="end" fontSize={10} fill="var(--color-fg-muted)">{yAlign}</text>
                  {X_ALIGNS.map((xAlign, column) => (
                    <FitTile key={xAlign} x={panel.x + column * STEP} y={GRID_TOP + row * STEP} value={`${xAlign}${yAlign} ${panel.mode}`} />
                  ))}
                </g>
              ))}
              <text x={panel.x + GRID_WIDTH / 2} y={226} textAnchor="middle" fontSize={11} fontStyle="italic" fill="var(--color-fg-muted)">{panel.caption}</text>
            </g>
          ))}

          {/* Source reference — the untouched 2:1 artwork every tile is fitting. */}
          <text x={SOURCE_THUMB.x + SOURCE_THUMB.width / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">source (2:1)</text>
          <svg x={SOURCE_THUMB.x} y={SOURCE_THUMB.y} width={SOURCE_THUMB.width} height={SOURCE_THUMB.height} viewBox={SOURCE_VIEWBOX}>
            <SourceBands />
          </svg>

          {/* none — alignment is ignored and the source is stretched non-uniformly to the box. */}
          <text x={NONE_TILE.x + TILE_SIZE / 2} y={NONE_TILE.y - 10} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">none</text>
          <FitTile x={NONE_TILE.x} y={NONE_TILE.y} value="none" />
          <text x={NONE_TILE.x + TILE_SIZE / 2} y={226} textAnchor="middle" fontSize={11} fontStyle="italic" fill="var(--color-fg-muted)">≈ object-fit: fill</text>

          <text x={330} y={256} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">wide source, square box: meet only moves along y, slice only crops along x</text>
        </Svg>
      </Wrapper>
    </>
  );
}

PreserveAspectRatioDiagram.displayName = "PreserveAspectRatioDiagram";
