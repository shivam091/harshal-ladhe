import type { JSX } from "react";
import {
  GRADIENT_STOPS,
  FONT_SIZE,
  WORD_WIDTH,
  SKEW_DEG,
  BASELINE,
  COLUMNS
} from "@/components/mdx/GlyphOverflowDiagram/GlyphOverflowDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/GlyphOverflowDiagram/GlyphOverflowDiagram.styles";

/*
  Static SVG diagram of gradient text losing the parts of its glyphs that fall outside the painted box — a tight
  line-height beside the line-height + padding fix. Exists because "the tails just vanish" only makes sense once
  you can see the box edge cutting straight through the letters.
*/
export default function GlyphOverflowDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 540 212" role="img" aria-labelledby="glyph-overflow-diagram-title glyph-overflow-diagram-desc">
          <title id="glyph-overflow-diagram-title">Gradient text clipped by its own box</title>
          <desc id="glyph-overflow-diagram-desc">
            The italic word Jumpy in gradient text, shown twice. On the left, with line-height 0.8, the dashed painted
            box stops just below the baseline and at the last letter's edge, so the tails of p and y and the top of the
            leaning y fall outside it and are drawn only as faint ghosts, because there is no background there to show
            through. On the right, with line-height 1.2 and a little padding, the box is taller and slightly wider and
            every glyph is fully painted.
          </desc>

          <defs>
            {/* Clips the gradient letters to each column's box — where the background, and so the gradient, ends. */}
            {COLUMNS.map(({ key, box }) => (
              <clipPath key={key} id={`glyph-overflow-clip-${key}`}>
                <rect x={0} y={box.top} width={WORD_WIDTH + box.extraRight} height={box.bottom - box.top} />
              </clipPath>
            ))}
            <linearGradient id="glyph-overflow-gradient" gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={WORD_WIDTH} y2={0}>
              {GRADIENT_STOPS.map((color, stopIndex) => (
                <stop key={color} offset={`${(stopIndex / (GRADIENT_STOPS.length - 1)) * 100}%`} stopColor={color} />
              ))}
            </linearGradient>
            <marker id="glyph-overflow-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" fill="var(--color-fg-danger)" />
            </marker>
          </defs>

          {COLUMNS.map((column) => {
            const { top, bottom, extraRight } = column.box;
            // Drawn twice per column (ghost + clipped gradient), so both copies share the exact same lean and width.
            const word = (fill: string, opacity?: number) => (
              <g transform={`skewX(${SKEW_DEG})`}>
                <text
                  x={0} y={0} textLength={WORD_WIDTH} lengthAdjust="spacingAndGlyphs"
                  fontSize={FONT_SIZE} fontWeight={800} fill={fill} opacity={opacity}
                >
                  Jumpy
                </text>
              </g>
            );

            return (
              <g key={column.key} transform={`translate(${column.x} ${BASELINE})`}>
                <text x={0} y={-80} fontSize={12} fontWeight={700} fill="var(--color-fg-default)" fontFamily="'Source Code Pro', ui-monospace, monospace">
                  {column.title}
                </text>

                {/* The painted box: the only area the gradient exists in. */}
                <rect
                  x={0} y={top} width={WORD_WIDTH + extraRight} height={bottom - top}
                  fill="var(--color-bg-accent-muted)" fillOpacity={0.35}
                  stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5} strokeDasharray="5 3"
                />

                {/* Whole glyphs as faint ghosts — whatever shows only here has no background behind it, so it's invisible. */}
                {word("var(--color-fg-muted)", 0.25)}

                {/* The gradient letters, cut at the box edge. */}
                <g clipPath={`url(#glyph-overflow-clip-${column.key})`}>{word("url(#glyph-overflow-gradient)")}</g>

                <text x={0} y={52} fontSize={11} fill="var(--color-fg-muted)">{column.caption}</text>
              </g>
            );
          })}

          {/* Callouts on the tight column: the descender tails and the italic lean. */}
          <g transform={`translate(${COLUMNS[0].x} ${BASELINE})`}>
            <line x1={120} y1={30} x2={140} y2={14} stroke="var(--color-fg-danger)" strokeWidth={1.25} markerEnd="url(#glyph-overflow-arrow)" />
            <line x1={120} y1={30} x2={172} y2={14} stroke="var(--color-fg-danger)" strokeWidth={1.25} markerEnd="url(#glyph-overflow-arrow)" />
            <text x={116} y={36} textAnchor="end" fontSize={10} fill="var(--color-fg-danger)">tails cut off</text>

            <line x1={206} y1={-58} x2={197} y2={-34} stroke="var(--color-fg-danger)" strokeWidth={1.25} markerEnd="url(#glyph-overflow-arrow)" />
            <text x={206} y={-62} textAnchor="middle" fontSize={10} fill="var(--color-fg-danger)">lean cut off</text>
          </g>

          <rect x={40} y={196} width={10} height={10} fill="var(--color-fg-muted)" opacity={0.25} />
          <text x={56} y={205} fontSize={11} fill="var(--color-fg-muted)">
            faint = part of a glyph with no background behind it, so it disappears
          </text>
        </Svg>
      </Wrapper>
    </>
  );
}

GlyphOverflowDiagram.displayName = "GlyphOverflowDiagram";
