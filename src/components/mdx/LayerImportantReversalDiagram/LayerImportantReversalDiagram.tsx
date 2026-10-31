import type { JSX } from "react";
import {
  MONO_FONT,
  RULE_CARDS,
  CARD_W,
  CARD_Y,
  CARD_H
} from "@/components/mdx/LayerImportantReversalDiagram/LayerImportantReversalDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/LayerImportantReversalDiagram/LayerImportantReversalDiagram.styles";

/*
  Static SVG diagram of the one exception to "later layer wins". Exists because the reversal is the layer rule
  readers least expect: shown straight after the layer-order diagram with only `!important` changed, the winner
  visibly flips back to the earlier layer.
*/
export default function LayerImportantReversalDiagram(): JSX.Element {
  const resultColor = "royalblue";

  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 600 400" role="img" aria-labelledby="layer-important-reversal-title layer-important-reversal-desc">
          <title id="layer-important-reversal-title">important reverses cascade layer priority diagram</title>
          <desc id="layer-important-reversal-desc">
            The same base and utilities layers and the same two selectors as the layer-order-beats-
            specificity diagram, but both declarations now carry the important flag. The winner flips:
            base, declared first, now beats utilities, declared last — because for important
            declarations, layer priority runs in the opposite order from normal declarations.
          </desc>

          <defs>
            <marker id="layer-important-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
          </defs>

          <text x={300} y={18} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">
            @layer base, utilities; <tspan fill="var(--color-fg-danger)">(both rules !important)</tspan>
          </text>

          <rect x={40} y={30} width={150} height={38} rx={8} fill="var(--color-bg-success-muted)" stroke="var(--color-border-success-emphasis)" strokeWidth={1.5} />
          <text x={115} y={54} textAnchor="middle" fontSize={13} fontWeight={600} fontFamily={MONO_FONT} fill="var(--color-fg-success)">base</text>

          <rect x={410} y={30} width={150} height={38} rx={8} fill="var(--color-bg-muted)" stroke="var(--color-border-muted)" strokeWidth={1.5} />
          <text x={485} y={54} textAnchor="middle" fontSize={13} fontWeight={600} fontFamily={MONO_FONT} fill="var(--color-fg-muted)">utilities</text>

          <line x1={408} y1={49} x2={192} y2={49} stroke="var(--color-fg-danger)" strokeWidth={2} markerEnd="url(#layer-important-arrow)" />
          <text x={300} y={88} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">for !important, priority flips: declared earlier → higher priority</text>

          {RULE_CARDS.map((card) => (
            <g key={card.layerName}>
              <rect
                x={card.x}
                y={CARD_Y}
                width={CARD_W}
                height={CARD_H}
                rx={10}
                fill={card.wins ? "var(--color-bg-success-muted)" : "var(--color-bg-muted)"}
                stroke={card.wins ? "var(--color-border-success-emphasis)" : "var(--color-border-muted)"}
                strokeWidth={1.5}
              />

              <text x={card.x + 16} y={CARD_Y + 24} fontSize={12} fontWeight={600} fill="var(--color-fg-default)">
                Layer: {card.layerName} <tspan fill="var(--color-fg-muted)" fontWeight={400}>({card.layerOrder})</tspan>
              </text>

              <text x={card.x + 16} y={CARD_Y + 50} fontSize={12} fontFamily={MONO_FONT} fill="var(--color-fg-default)">
                {card.selector} {"{"}
              </text>
              <text x={card.x + 30} y={CARD_Y + 70} fontSize={11.5} fontFamily={MONO_FONT} fill="var(--color-fg-danger)">
                {card.declaration}
              </text>
              <text x={card.x + 16} y={CARD_Y + 90} fontSize={12} fontFamily={MONO_FONT} fill="var(--color-fg-default)">
                {"}"}
              </text>

              <circle cx={card.x + CARD_W - 16} cy={CARD_Y - 2} r={14} fill={card.wins ? "var(--color-bg-success-muted)" : "var(--color-bg-neutral-muted)"} stroke={card.wins ? "var(--color-border-success-emphasis)" : "var(--color-border-neutral-muted)"} strokeWidth={1.5} />
              <text x={card.x + CARD_W - 16} y={CARD_Y + 3} textAnchor="middle" fontSize={13} fontWeight={700} fill={card.wins ? "var(--color-fg-success)" : "var(--color-fg-muted)"}>
                {card.wins ? "✓" : "✕"}
              </text>
            </g>
          ))}

          <line x1={445} y1={CARD_Y + CARD_H} x2={345} y2={292} stroke="var(--color-border-neutral-muted)" strokeWidth={1.5} strokeDasharray="4 4" />
          <line x1={155} y1={CARD_Y + CARD_H} x2={255} y2={292} stroke="var(--color-border-success-emphasis)" strokeWidth={2} markerEnd="url(#layer-important-arrow)" />

          <rect x={140} y={294} width={320} height={64} rx={10} fill="var(--color-bg-success-muted)" stroke="var(--color-border-success-emphasis)" strokeWidth={1.5} />
          <rect x={158} y={312} width={16} height={16} rx={3} fill={resultColor} />
          <text x={184} y={325} fontSize={12} fontFamily={MONO_FONT} fill="var(--color-fg-default)">
            {"<p class=\"title text-accent\">"}
          </text>
          <text x={184} y={344} fontSize={11} fill="var(--color-fg-default)">
            renders in the <tspan fontWeight={600} fill="var(--color-fg-success)">base</tspan> color — the flip
          </text>

          <text x={300} y={380} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">
            Same rules, same layer order — only !important changed, and the winner flipped.
          </text>
        </Svg>
      </Wrapper>
    </>
  );
}

LayerImportantReversalDiagram.displayName = "LayerImportantReversalDiagram";
