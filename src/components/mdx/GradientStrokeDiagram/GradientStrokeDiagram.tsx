import type { JSX } from "react";
import {
  GRADIENT_START,
  GRADIENT_END,
  CODE_FONT,
  PANEL,
  GLYPHS,
  GLYPH_SIZE,
  GLYPH_BASELINE,
  GLYPH_FONT,
  STROKE_WIDTH,
  VARIANTS
} from "@/components/mdx/GradientStrokeDiagram/GradientStrokeDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/GradientStrokeDiagram/GradientStrokeDiagram.styles";

/*
  Static SVG diagram of gradient stroke text, side by side: with a transparent fill the clipped gradient shows
  through the entire glyph (so it just looks like filled gradient text), while a fill matching the background covers
  the middle and leaves only the stroke ring. Exists because the "obvious" transparent-fill version silently fails,
  and the reason — background-clip: text clips to glyph *plus* stroke — isn't visible from the code alone.
*/
export default function GradientStrokeDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 460 244" role="img" aria-labelledby="gradient-stroke-diagram-title gradient-stroke-diagram-desc">
          <title id="gradient-stroke-diagram-title">Why gradient stroke text needs a background-colored fill</title>
          <desc id="gradient-stroke-diagram-desc">
            Two panels showing the letters Ab with a transparent gradient stroke. On the left, with a transparent fill,
            the gradient shows through the entire letter and looks like ordinary filled gradient text — marked as not
            working. On the right, with the fill set to the background color, only a thin gradient outline is visible —
            marked as working.
          </desc>

          <defs>
            {/* userSpaceOnUse in panel-local coordinates, so the gradient spans the element box like a real background. */}
            <linearGradient id="gradient-stroke-gradient" gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={PANEL.width} y2={0}>
              <stop offset="0%" stopColor={GRADIENT_START} />
              <stop offset="100%" stopColor={GRADIENT_END} />
            </linearGradient>
          </defs>

          {VARIANTS.map((variant) => (
            <g key={variant.key}>
              <text x={variant.x + PANEL.width / 2} y={PANEL.y - 12} textAnchor="middle" fontSize={11} fontFamily={CODE_FONT} fontWeight={600} fill="var(--color-fg-default)">
                {variant.title}
              </text>

              <g transform={`translate(${variant.x}, ${PANEL.y})`}>
                <rect width={PANEL.width} height={PANEL.height} rx={8} fill="var(--color-bg-muted)" stroke="var(--color-border-default)" />
                {/*
                  SVG paints fill first and stroke on top, matching how -webkit-text-stroke is drawn over the glyph fill —
                  so the stroke ring stays fully visible whichever fill is used.
                */}
                <text
                  x={PANEL.width / 2} y={GLYPH_BASELINE} textAnchor="middle" fontSize={GLYPH_SIZE} fontWeight={900} fontFamily={GLYPH_FONT}
                  fill={variant.works ? "var(--color-bg-muted)" : "url(#gradient-stroke-gradient)"}
                  stroke="url(#gradient-stroke-gradient)" strokeWidth={STROKE_WIDTH} strokeLinejoin="round"
                >
                  {GLYPHS}
                </text>

                {/* Pass/fail badge in the panel's top-right corner. */}
                <circle
                  cx={PANEL.width - 16} cy={16} r={11} fill="var(--color-bg-default)" strokeWidth={1.5}
                  stroke={variant.works ? "var(--color-border-success-emphasis)" : "var(--color-border-danger-emphasis)"}
                />
                <text
                  x={PANEL.width - 16} y={20.5} textAnchor="middle" fontSize={13} fontWeight={700}
                  fill={variant.works ? "var(--color-fg-success)" : "var(--color-fg-danger)"}
                >
                  {variant.works ? "✓" : "✗"}
                </text>
              </g>

              {variant.caption.map((line, index) => (
                <text key={line} x={variant.x + PANEL.width / 2} y={PANEL.y + PANEL.height + 20 + index * 14} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">
                  {line}
                </text>
              ))}
            </g>
          ))}
        </Svg>
      </Wrapper>
    </>
  );
}

GradientStrokeDiagram.displayName = "GradientStrokeDiagram";
