import type { JSX } from "react";
import {
  BAR_W,
  BAR_H,
  BAR_X,
  GRAY_BAR_Y,
  DUOTONE_BAR_Y,
  CANVAS_W,
  CANVAS_H,
  SHADOW_COLOR,
  HIGHLIGHT_COLOR,
  SAMPLE_STOPS
} from "@/components/mdx/DuotoneMappingDiagram/DuotoneMappingDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/DuotoneMappingDiagram/DuotoneMappingDiagram.styles";

/*
  Static SVG diagram of the mapping every duotone technique runs on: a plain grayscale luminance ramp
  (top bar, as if from `filter: grayscale(1)`) re-expressed through a two-color gradient from a dark
  "shadow" color to a light "highlight" color (bottom bar). Five evenly-spaced dashed guide lines
  connect the same luminance value's two outputs — 0% luminance (black) always lands on the shadow
  color, 100% (white) always lands on the highlight color, and every gray in between lands on the
  matching blend — whether that remap is done with a cheap CSS gradient overlay or a precise SVG
  feComponentTransfer, this is the mapping both are approximating and computing, respectively.
*/
export default function DuotoneMappingDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} role="img" aria-labelledby="duotone-mapping-title duotone-mapping-desc">
          <title id="duotone-mapping-title">How grayscale luminance maps into a duotone gradient</title>
          <desc id="duotone-mapping-desc">
            Two stacked horizontal bars. The top bar is a plain black-to-white grayscale ramp. The
            bottom bar is the same ramp re-expressed as a gradient from a dark shadow color to a
            light highlight color. Dashed guide lines at 0%, 25%, 50%, 75%, and 100% connect matching
            points on the two bars, showing that black always becomes the shadow color, white always
            becomes the highlight color, and every gray in between becomes the corresponding blend.
          </desc>

          <defs>
            <linearGradient id="duotone-gray-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#000000" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
            <linearGradient id="duotone-color-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={SHADOW_COLOR} />
              <stop offset="100%" stopColor={HIGHLIGHT_COLOR} />
            </linearGradient>
          </defs>

          <text x={BAR_X} y={GRAY_BAR_Y - 12} fontSize={12} fontWeight={700} fill="var(--color-fg-default)">
            Grayscale luminance (0%–100%)
          </text>
          <rect x={BAR_X} y={GRAY_BAR_Y} width={BAR_W} height={BAR_H} rx={6} fill="url(#duotone-gray-gradient)" stroke="var(--color-border-muted)" strokeWidth={1} />

          <text x={BAR_X} y={DUOTONE_BAR_Y - 12} fontSize={12} fontWeight={700} fill="var(--color-fg-default)">
            Duotone: shadow → highlight
          </text>
          <rect x={BAR_X} y={DUOTONE_BAR_Y} width={BAR_W} height={BAR_H} rx={6} fill="url(#duotone-color-gradient)" stroke="var(--color-border-muted)" strokeWidth={1} />

          {SAMPLE_STOPS.map((percent) => {
            const x = BAR_X + (percent / 100) * BAR_W;
            return (
              <g key={percent}>
                <line
                  x1={x}
                  y1={GRAY_BAR_Y + BAR_H}
                  x2={x}
                  y2={DUOTONE_BAR_Y}
                  stroke="var(--color-fg-muted)"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  opacity={0.7}
                />
                <circle cx={x} cy={GRAY_BAR_Y + BAR_H / 2} r={2.5} fill="var(--color-bg-default)" stroke="var(--color-fg-default)" strokeWidth={1} />
                <circle cx={x} cy={DUOTONE_BAR_Y + BAR_H / 2} r={2.5} fill="var(--color-bg-default)" stroke="var(--color-fg-default)" strokeWidth={1} />
                <text x={x} y={GRAY_BAR_Y - 26} textAnchor="middle" fontSize={9.5} fill="var(--color-fg-muted)">
                  {percent}%
                </text>
              </g>
            );
          })}

          <text x={BAR_X} y={DUOTONE_BAR_Y + BAR_H + 22} fontSize={10.5} fill="var(--color-fg-muted)">
            Shadow color ↖
          </text>
          <text x={BAR_X + BAR_W} y={DUOTONE_BAR_Y + BAR_H + 22} textAnchor="end" fontSize={10.5} fill="var(--color-fg-muted)">
            ↗ Highlight color
          </text>
        </Svg>
      </Wrapper>
    </>
  );
}

DuotoneMappingDiagram.displayName = "DuotoneMappingDiagram";
