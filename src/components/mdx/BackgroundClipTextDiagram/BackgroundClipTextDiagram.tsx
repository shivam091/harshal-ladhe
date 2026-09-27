import type { JSX } from "react";
import {
  CODE_FONT,
  GRADIENT_START,
  GRADIENT_END,
  PANEL,
  GLYPHS,
  GLYPH_SIZE,
  GLYPH_BASELINE,
  STEPS
} from "@/components/mdx/BackgroundClipTextDiagram/BackgroundClipTextDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/BackgroundClipTextDiagram/BackgroundClipTextDiagram.styles";

/*
  Static SVG diagram of the gradient-text recipe as three cumulative steps: a gradient painted across the whole
  box, the same gradient clipped to the glyphs (but still hidden under the opaque text fill), and finally the fill
  made transparent. Exists because the middle step — clipped but still invisible — is the one readers can't picture,
  and it's why the fourth line of the recipe is needed at all.
*/
export default function BackgroundClipTextDiagram(): JSX.Element {
  const [paint, clip, reveal] = STEPS;
  const glyphX = PANEL.width / 2;

  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 540 230" role="img" aria-labelledby="background-clip-text-diagram-title background-clip-text-diagram-desc">
          <title id="background-clip-text-diagram-title">How background-clip: text builds gradient text</title>
          <desc id="background-clip-text-diagram-desc">
            Three panels. First, an orange-to-pink gradient fills the entire element box, with the letters only outlined
            on top of it. Second, after background-clip: text, the gradient survives only inside the letter shapes, but
            the solid text fill still covers it, so the letters look plain. Third, with the text fill made transparent,
            the clipped gradient shows through and the letters appear in gradient color.
          </desc>

          <defs>
            <marker id="background-clip-text-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
            {/* userSpaceOnUse in panel-local coordinates, so the gradient spans the element box, not each glyph's own bounds. */}
            <linearGradient id="background-clip-text-gradient" gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={PANEL.width} y2={0}>
              <stop offset="0%" stopColor={GRADIENT_START} />
              <stop offset="100%" stopColor={GRADIENT_END} />
            </linearGradient>
          </defs>

          {/* ① The gradient fills the whole box; the glyphs are only outlined to show where they'll sit. */}
          <g transform={`translate(${paint.x}, ${PANEL.y})`}>
            <rect width={PANEL.width} height={PANEL.height} rx={8} fill="url(#background-clip-text-gradient)" />
            <text
              x={glyphX} y={GLYPH_BASELINE} textAnchor="middle" fontSize={GLYPH_SIZE} fontWeight={900}
              fill="none" stroke="#fff" strokeWidth={1.5} strokeDasharray="4 3"
            >
              {GLYPHS}
            </text>
          </g>

          {/* ② Clipped to the glyphs, but the opaque text fill is still painted over it — so it looks like plain text. */}
          <g transform={`translate(${clip.x}, ${PANEL.y})`}>
            <rect width={PANEL.width} height={PANEL.height} rx={8} fill="var(--color-bg-muted)" stroke="var(--color-border-default)" strokeDasharray="4 3" />
            <text x={glyphX} y={GLYPH_BASELINE} textAnchor="middle" fontSize={GLYPH_SIZE} fontWeight={900} fill="url(#background-clip-text-gradient)">
              {GLYPHS}
            </text>
            <text x={glyphX} y={GLYPH_BASELINE} textAnchor="middle" fontSize={GLYPH_SIZE} fontWeight={900} fill="var(--color-fg-default)" fillOpacity={0.88}>
              {GLYPHS}
            </text>
          </g>

          {/* ③ Fill removed — the clipped gradient is finally visible. */}
          <g transform={`translate(${reveal.x}, ${PANEL.y})`}>
            <rect width={PANEL.width} height={PANEL.height} rx={8} fill="var(--color-bg-muted)" stroke="var(--color-border-default)" strokeDasharray="4 3" />
            <text x={glyphX} y={GLYPH_BASELINE} textAnchor="middle" fontSize={GLYPH_SIZE} fontWeight={900} fill="url(#background-clip-text-gradient)">
              {GLYPHS}
            </text>
          </g>

          {/* Step titles above and code captions below each panel. */}
          {STEPS.map((step) => (
            <g key={step.title}>
              <text x={step.x + PANEL.width / 2} y={PANEL.y - 12} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--color-fg-default)">
                {step.title}
              </text>
              {step.code.map((line, index) => (
                <text
                  key={line}
                  x={step.x + PANEL.width / 2} y={PANEL.y + PANEL.height + 20 + index * 14}
                  textAnchor="middle" fontSize={10} fontFamily={CODE_FONT} fill="var(--color-fg-muted)"
                >
                  {line}
                </text>
              ))}
            </g>
          ))}

          {/* Arrows between steps. */}
          <line x1={paint.x + PANEL.width + 3} y1={PANEL.y + PANEL.height / 2} x2={clip.x - 5} y2={PANEL.y + PANEL.height / 2} stroke="var(--color-fg-muted)" strokeWidth={2} markerEnd="url(#background-clip-text-arrow)" />
          <line x1={clip.x + PANEL.width + 3} y1={PANEL.y + PANEL.height / 2} x2={reveal.x - 5} y2={PANEL.y + PANEL.height / 2} stroke="var(--color-fg-muted)" strokeWidth={2} markerEnd="url(#background-clip-text-arrow)" />

          <text x={270} y={222} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">
            paint the background → clip it to the glyphs → remove the fill on top
          </text>
        </Svg>
      </Wrapper>
    </>
  );
}

BackgroundClipTextDiagram.displayName = "BackgroundClipTextDiagram";
