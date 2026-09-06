import type { JSX } from "react";
import {
  SWATCH_W,
  SWATCH_H,
  SWATCH_GAP,
  ROW_X,
  ROW_SRGB_Y,
  ROW_OKLCH_Y,
  MIX_COLUMNS,
  DEAD_ZONE_INDEX
} from "@/components/mdx/ColorMixBlendDiagram/ColorMixBlendDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/ColorMixBlendDiagram/ColorMixBlendDiagram.styles";

/*
  Static SVG diagram teaching one fact: `color-mix()` between the same two colors produces a completely
  different result depending on the color space you mix in. Two rows of 5 discrete swatches (0/25/50/75/100%
  of color B) blend the same blue → yellow pair — the top row mixed `in srgb` collapses to an exact mid-gray
  at 50% (the "gray dead zone" from the mastering-css-gradients post, here caused by color-mix() instead of
  a gradient), while the bottom row mixed `in oklch` swings through a vivid teal instead, because OKLCH keeps
  perceptual lightness/chroma roughly level across the blend instead of averaging raw channel numbers.
*/
export default function ColorMixBlendDiagram(): JSX.Element {
  const deadZoneColumn = MIX_COLUMNS[DEAD_ZONE_INDEX];
  const deadZoneX = ROW_X + DEAD_ZONE_INDEX * (SWATCH_W + SWATCH_GAP) + SWATCH_W / 2;

  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 560 310" role="img" aria-labelledby="color-mix-blend-diagram-title color-mix-blend-diagram-desc">
          <title id="color-mix-blend-diagram-title">color-mix() blend comparison: srgb vs oklch</title>
          <desc id="color-mix-blend-diagram-desc">
            Two rows of five swatches, each blending the same blue and yellow at 0%, 25%, 50%, 75%, and 100%
            of yellow. The row mixed in the srgb color space turns into an exact mid-gray at the 50% swatch —
            the &quot;gray dead zone&quot;. The row mixed in the oklch color space never turns gray at all,
            passing through a vivid teal at its own 50% swatch instead.
          </desc>

          <text x={ROW_X} y={24} fontSize={13} fontWeight={600} fill="var(--color-fg-default)">
            color-mix(in srgb, blue, yellow X%)
          </text>
          {MIX_COLUMNS.map((column, index) => {
            const x = ROW_X + index * (SWATCH_W + SWATCH_GAP);
            return (
              <g key={`srgb-${column.percent}`}>
                <rect x={x} y={ROW_SRGB_Y} width={SWATCH_W} height={SWATCH_H} rx={8} fill={column.srgb} stroke="var(--color-border-muted)" strokeWidth={1} />
                <text x={x + SWATCH_W / 2} y={ROW_SRGB_Y + SWATCH_H + 18} textAnchor="middle" fontSize={12} fill="var(--color-fg-muted)">{column.percent}%</text>
              </g>
            );
          })}

          {/* "Gray dead zone" callout — a leader line from the exact-gray srgb swatch up to its label. */}
          <line x1={deadZoneX} y1={ROW_SRGB_Y - 6} x2={deadZoneX} y2={ROW_SRGB_Y - 24} stroke="var(--color-border-attention-emphasis)" strokeWidth={1.5} strokeDasharray="3 3" />
          <text x={deadZoneX} y={ROW_SRGB_Y - 30} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--color-border-attention-emphasis)">
            gray dead zone
          </text>

          <text x={ROW_X} y={ROW_OKLCH_Y - 14} fontSize={13} fontWeight={600} fill="var(--color-fg-default)">
            color-mix(in oklch, blue, yellow X%)
          </text>
          {MIX_COLUMNS.map((column, index) => {
            const x = ROW_X + index * (SWATCH_W + SWATCH_GAP);
            return (
              <g key={`oklch-${column.percent}`}>
                <rect x={x} y={ROW_OKLCH_Y} width={SWATCH_W} height={SWATCH_H} rx={8} fill={column.oklch} stroke="var(--color-border-muted)" strokeWidth={1} />
                <text x={x + SWATCH_W / 2} y={ROW_OKLCH_Y + SWATCH_H + 18} textAnchor="middle" fontSize={12} fill="var(--color-fg-muted)">{column.percent}%</text>
              </g>
            );
          })}

          <text x={ROW_X} y={ROW_OKLCH_Y + SWATCH_H + 42} fontSize={11} fill="var(--color-fg-muted)">
            {`Same start and end colors both rows — only the "in <color-space>" argument changes what the 50% column looks like: ${deadZoneColumn.srgb} vs ${MIX_COLUMNS[DEAD_ZONE_INDEX].oklch}.`}
          </text>
        </Svg>
      </Wrapper>
    </>
  );
}

ColorMixBlendDiagram.displayName = "ColorMixBlendDiagram";
