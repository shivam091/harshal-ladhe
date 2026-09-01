import type { JSX } from "react";
import { STRIPE_A, STRIPE_B, BAR, UNIT_W, RADIAL_PANEL, RADIAL_UNIT_R } from "@/components/mdx/RepeatingGradientDiagram/RepeatingGradientDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/RepeatingGradientDiagram/RepeatingGradientDiagram.styles";

/*
  Static SVG diagram of `repeating-linear-gradient()` and `repeating-radial-gradient()` — both built with the
  SVG gradient's own native `spreadMethod="repeat"`, the exact primitive CSS's "repeating" gradients are
  built on, rather than hand-tiling copies. The bracket calls out that the span between the first and last
  color stop is the "repeat unit" that then tiles infinitely.
*/
export default function RepeatingGradientDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 440 380" role="img" aria-labelledby="repeating-gradient-diagram-title repeating-gradient-diagram-desc">
          <title id="repeating-gradient-diagram-title">repeating-gradient repeat-unit diagram</title>
          <desc id="repeating-gradient-diagram-desc">
            A striped bar where the first 20px tile — the span between the gradient&apos;s first and last color
            stop — is highlighted as the &quot;repeat unit,&quot; then tiles infinitely across the rest of the bar. The
            same idea works outward instead of sideways for repeating-radial-gradient.
          </desc>

          <defs>
            <marker id="repeating-gradient-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
            <linearGradient id="repeating-gradient-linear" gradientUnits="userSpaceOnUse" x1={BAR.x} y1={BAR.y + BAR.h / 2} x2={BAR.x + UNIT_W} y2={BAR.y + BAR.h / 2} spreadMethod="repeat">
              <stop offset="0%" stopColor={STRIPE_A} />
              <stop offset="50%" stopColor={STRIPE_A} />
              <stop offset="50%" stopColor={STRIPE_B} />
              <stop offset="100%" stopColor={STRIPE_B} />
            </linearGradient>
            <radialGradient id="repeating-gradient-radial" gradientUnits="userSpaceOnUse" cx={RADIAL_PANEL.cx} cy={RADIAL_PANEL.cy} r={RADIAL_UNIT_R} spreadMethod="repeat">
              <stop offset="0%" stopColor={STRIPE_A} />
              <stop offset="50%" stopColor={STRIPE_A} />
              <stop offset="50%" stopColor={STRIPE_B} />
              <stop offset="100%" stopColor={STRIPE_B} />
            </radialGradient>
          </defs>

          {/* Repeat-unit bracket over the bar's first tile. */}
          <path d={`M ${BAR.x} 50 L ${BAR.x} 58 M ${BAR.x} 50 L ${BAR.x + UNIT_W} 50 L ${BAR.x + UNIT_W} 58`} fill="none" stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5} />
          <text x={BAR.x} y={38} textAnchor="start" fontSize={12} fontWeight={600} fill="var(--color-fg-default)">repeat unit — {UNIT_W}px</text>

          <rect x={BAR.x} y={BAR.y} width={BAR.w} height={BAR.h} fill="url(#repeating-gradient-linear)" stroke="var(--color-border-muted)" strokeWidth={1} />
          <rect x={BAR.x} y={BAR.y} width={UNIT_W} height={BAR.h} fill="none" stroke="var(--color-border-accent-emphasis)" strokeWidth={2} />

          <text x={BAR.x} y={BAR.y + BAR.h + 20} fontSize={11} fill="var(--color-fg-muted)">0% → 100% of the color stops, then it starts over</text>
          <line x1={BAR.x + BAR.w + 4} y1={BAR.y + BAR.h / 2} x2={BAR.x + BAR.w + 20} y2={BAR.y + BAR.h / 2} stroke="var(--color-fg-muted)" strokeWidth={1.5} strokeDasharray="3 3" markerEnd="url(#repeating-gradient-arrow)" />

          {/* Radial swatch — same repeat-unit idea, measured outward from a center point instead of sideways. */}
          <text x={RADIAL_PANEL.cx} y={175} textAnchor="middle" fontSize={12} fill="var(--color-fg-default)">the same idea, radiating outward</text>
          <circle cx={RADIAL_PANEL.cx} cy={RADIAL_PANEL.cy} r={RADIAL_PANEL.outerR} fill="url(#repeating-gradient-radial)" stroke="var(--color-border-muted)" strokeWidth={1} />
          <circle cx={RADIAL_PANEL.cx} cy={RADIAL_PANEL.cy} r={RADIAL_UNIT_R} fill="none" stroke="var(--color-border-accent-emphasis)" strokeWidth={2} />
          <line x1={RADIAL_PANEL.cx + 14} y1={RADIAL_PANEL.cy - 14} x2={RADIAL_PANEL.cx + 60} y2={RADIAL_PANEL.cy - 60} stroke="var(--color-border-accent-emphasis)" strokeWidth={1} strokeDasharray="2 2" />
          <text x={RADIAL_PANEL.cx + 64} y={RADIAL_PANEL.cy - 62} fontSize={11} fill="var(--color-fg-default)">repeat unit — {RADIAL_UNIT_R}px radius</text>
          <text x={RADIAL_PANEL.cx} y={RADIAL_PANEL.cy + RADIAL_PANEL.outerR + 26} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">rings repeat outward every {RADIAL_UNIT_R}px</text>
        </Svg>
      </Wrapper>
    </>
  );
}

RepeatingGradientDiagram.displayName = "RepeatingGradientDiagram";
