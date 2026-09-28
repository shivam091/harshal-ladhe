import type { JSX } from "react";
import { TILE, ANGLE, PANEL, SHAPE, GRID_RANGE, PANELS } from "@/components/mdx/PatternTransformDiagram/PatternTransformDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/PatternTransformDiagram/PatternTransformDiagram.styles";

// Grid line offsets symmetric around 0, so the same set of lines covers the panel whichever pivot the rotation uses.
const GRID_OFFSETS = Array.from({ length: GRID_RANGE * 2 + 1 }, (_, index) => (index - GRID_RANGE) * TILE);

// Half-length of each grid line — long enough to still span the panel once rotated.
const LINE_REACH = GRID_RANGE * TILE;

// Arc path for the rotation-angle indicator; sweep-flag 1 because a positive SVG rotate() turns clockwise in a y-down space.
function angleArc(pivotX: number, pivotY: number, radius: number): string {
  const radians = (ANGLE * Math.PI) / 180;
  const endX = pivotX + radius * Math.cos(radians);
  const endY = pivotY + radius * Math.sin(radians);
  return `M${pivotX + radius},${pivotY} A${radius},${radius} 0 0 1 ${endX.toFixed(2)},${endY.toFixed(2)}`;
}

// Draws a whole tile grid as lines — one component so the unrotated and rotated grids are guaranteed identical before transforming.
function GridLines({ stroke, strokeWidth, dash, opacity }: { stroke: string; strokeWidth: number; dash?: string; opacity?: number }): JSX.Element {
  return (
    <g stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={dash} opacity={opacity}>
      {GRID_OFFSETS.map((offset) => (
        <g key={offset}>
          <line x1={offset} y1={-LINE_REACH} x2={offset} y2={LINE_REACH} />
          <line x1={-LINE_REACH} y1={offset} x2={LINE_REACH} y2={offset} />
        </g>
      ))}
    </g>
  );
}

/*
  Static SVG diagram of patternTransform="rotate(30)" vs. rotate(30 cx cy): the unrotated tile grid (dashed), the
  same grid after the transform (solid, clipped to the shape), and the shape's outline, which never moves. Exists
  because rotate() pivots around the pattern's coordinate origin — the user-space (0,0), not the shape — so the
  texture inside a shape can appear to shift as well as turn unless the pivot is set explicitly.
*/
export default function PatternTransformDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 640 316" role="img" aria-labelledby="pattern-transform-diagram-title pattern-transform-diagram-desc">
          <title id="pattern-transform-diagram-title">patternTransform rotation origin</title>
          <desc id="pattern-transform-diagram-desc">
            Two panels show the same rectangle filled with a 40 by 40 tile grid rotated 30 degrees. On the left,
            patternTransform is rotate(30), so the grid pivots around the user-space origin at the panel&apos;s top-left
            corner. On the right, patternTransform is rotate(30 130 100), so the grid pivots around the rectangle&apos;s
            centre. In both panels the unrotated grid is shown dashed and the rectangle&apos;s outline stays exactly where it was.
          </desc>

          <defs>
            <clipPath id="pattern-transform-diagram-panel-clip" clipPathUnits="userSpaceOnUse">
              <rect x={0} y={0} width={PANEL.width} height={PANEL.height} />
            </clipPath>
            <clipPath id="pattern-transform-diagram-shape-clip" clipPathUnits="userSpaceOnUse">
              <rect x={SHAPE.x} y={SHAPE.y} width={SHAPE.width} height={SHAPE.height} />
            </clipPath>
          </defs>

          {PANELS.map((panel) => {
            const rotation = panel.pivotX === 0 && panel.pivotY === 0 ? `rotate(${ANGLE})` : `rotate(${ANGLE} ${panel.pivotX} ${panel.pivotY})`;
            const isOrigin = panel.pivotX === 0 && panel.pivotY === 0;
            const arcRadius = isOrigin ? 50 : 40;
            const labelRadius = arcRadius + 8;
            const labelRadians = ((ANGLE / 2) * Math.PI) / 180;

            return (
              <g key={panel.key}>
                {/* Panel title — the exact patternTransform value. */}
                <text x={panel.offsetX + PANEL.width / 2} y={30} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">{panel.title}</text>

                <g transform={`translate(${panel.offsetX} ${panel.offsetY})`}>
                  {/* User-space canvas — its top-left corner is (0,0). */}
                  <rect x={0} y={0} width={PANEL.width} height={PANEL.height} fill="var(--color-bg-muted)" stroke="var(--color-border-muted)" strokeWidth={1} />

                  <g clipPath="url(#pattern-transform-diagram-panel-clip)">
                    {/* Unrotated tile grid — where the tiles would sit with no patternTransform. */}
                    <GridLines stroke="var(--color-border-default)" strokeWidth={1} dash="3 3" />

                    {/* Rotated grid across the whole panel, faint — the transform applies to the infinite grid, not just the visible part. */}
                    <g transform={rotation}>
                      {isOrigin ? (
                        <rect x={0} y={0} width={TILE} height={TILE} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={1} />
                      ) : null}
                      <GridLines stroke="var(--color-fg-accent)" strokeWidth={1} opacity={0.3} />
                    </g>
                  </g>

                  {/* Shape background plus the rotated grid clipped to it — the part of the texture that actually paints. */}
                  <rect x={SHAPE.x} y={SHAPE.y} width={SHAPE.width} height={SHAPE.height} fill="var(--color-bg-default)" />
                  <g clipPath="url(#pattern-transform-diagram-shape-clip)">
                    <g transform={rotation}>
                      <GridLines stroke="var(--color-fg-accent)" strokeWidth={1.5} />
                    </g>
                  </g>

                  {/* Shape outline — identical in both panels; patternTransform never moves it. */}
                  <rect x={SHAPE.x} y={SHAPE.y} width={SHAPE.width} height={SHAPE.height} fill="none" stroke="var(--color-fg-default)" strokeWidth={2} />

                  {/* Angle arc and label — how far the grid turned around its pivot. */}
                  <path d={angleArc(panel.pivotX, panel.pivotY, arcRadius)} fill="none" stroke="var(--color-fg-danger)" strokeWidth={1.5} />
                  <text
                    x={panel.pivotX + labelRadius * Math.cos(labelRadians)}
                    y={panel.pivotY + labelRadius * Math.sin(labelRadians) + 4}
                    fontSize={11}
                    fontWeight={600}
                    fill="var(--color-fg-danger)"
                    stroke="var(--color-bg-default)"
                    strokeWidth={3}
                    paintOrder="stroke"
                  >
                    {`${ANGLE}°`}
                  </text>

                  {/* User-space origin — always marked, so the right panel shows it's no longer the pivot. */}
                  <circle cx={0} cy={0} r={3.5} fill={isOrigin ? "var(--color-fg-danger)" : "var(--color-fg-muted)"} />
                  <text x={6} y={-6} fontSize={11} fill={isOrigin ? "var(--color-fg-danger)" : "var(--color-fg-muted)"}>{isOrigin ? "pivot (0,0)" : "(0,0)"}</text>

                  {/* Explicit pivot marker — only when rotate() was given cx/cy. */}
                  {isOrigin ? null : (
                    <g>
                      <circle cx={panel.pivotX} cy={panel.pivotY} r={4} fill="var(--color-fg-danger)" />
                      <text x={panel.pivotX - 8} y={panel.pivotY - 8} textAnchor="end" fontSize={11} fontWeight={600} fill="var(--color-fg-danger)" stroke="var(--color-bg-default)" strokeWidth={3} paintOrder="stroke">pivot (130, 100)</text>
                    </g>
                  )}
                </g>

                {/* Panel caption — which point the rotation turned around. */}
                <text x={panel.offsetX + PANEL.width / 2} y={panel.offsetY + PANEL.height + 24} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">{panel.caption}</text>
              </g>
            );
          })}

          {/* Shared legend for both panels. */}
          <text x={320} y={306} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">dashed: unrotated tile grid · solid: grid after patternTransform · outline: the shape (never rotates)</text>
        </Svg>
      </Wrapper>
    </>
  );
}

PatternTransformDiagram.displayName = "PatternTransformDiagram";
