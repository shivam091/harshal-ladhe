import type { JSX } from "react";
import {
  MONO_FONT,
  RULE_CARDS,
  CARD_W,
  CARD_Y,
  CARD_H
} from "@/components/mdx/LayerSpecificityDiagram/LayerSpecificityDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/LayerSpecificityDiagram/LayerSpecificityDiagram.styles";

/*
  Static SVG diagram of the rule readers find hardest to believe: once layers are declared, layer order beats
  specificity outright. Seeing a one-class utility beat a far more specific selector makes it stick in a way the
  sentence alone doesn't.
*/
export default function LayerSpecificityDiagram(): JSX.Element {
  const resultColor = "var(--color-fg-accent)";

  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 600 420" role="img" aria-labelledby="layer-specificity-title layer-specificity-desc">
          <title id="layer-specificity-title">Layer order beats specificity diagram</title>
          <desc id="layer-specificity-desc">
            Two competing CSS rules. The first, in a layer named base declared first, targets
            #card .title.title — an ID plus two classes, high specificity. The second, in a layer named
            utilities declared last, targets .text-accent — a single class, low specificity. Despite its
            much lower specificity, the utilities rule wins, because its layer was declared after base is.
          </desc>

          <defs>
            <marker id="layer-specificity-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
          </defs>

          {/* The order statement comes first, since it — not either selector — decides the result below. */}
          <text x={300} y={18} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">
            @layer base, utilities;
          </text>

          <rect x={40} y={30} width={150} height={38} rx={8} fill="var(--color-bg-neutral-muted)" stroke="var(--color-border-neutral-muted)" strokeWidth={1.5} />
          <text x={115} y={54} textAnchor="middle" fontSize={13} fontWeight={600} fontFamily={MONO_FONT} fill="var(--color-fg-default)">base</text>

          <rect x={410} y={30} width={150} height={38} rx={8} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5} />
          <text x={485} y={54} textAnchor="middle" fontSize={13} fontWeight={600} fontFamily={MONO_FONT} fill="var(--color-fg-accent)">utilities</text>

          <line x1={192} y1={49} x2={408} y2={49} stroke="var(--color-fg-muted)" strokeWidth={2} markerEnd="url(#layer-specificity-arrow)" />
          <text x={300} y={88} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">declared later → higher priority</text>

          {/* Each card shows its specificity, so the reader can see the higher one lose. */}
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
              <text x={card.x + 30} y={CARD_Y + 70} fontSize={12} fontFamily={MONO_FONT} fill="var(--color-fg-default)">
                {card.declaration}
              </text>
              <text x={card.x + 16} y={CARD_Y + 90} fontSize={12} fontFamily={MONO_FONT} fill="var(--color-fg-default)">
                {"}"}
              </text>

              <text x={card.x + 16} y={CARD_Y + 114} fontSize={11} fill="var(--color-fg-muted)">
                specificity {card.specificity}
              </text>
              <text x={card.x + 16} y={CARD_Y + 130} fontSize={10.5} fontStyle="italic" fill="var(--color-fg-muted)">
                ({card.specificityNote})
              </text>

              <circle cx={card.x + CARD_W - 16} cy={CARD_Y - 2} r={14} fill={card.wins ? "var(--color-bg-success-muted)" : "var(--color-bg-neutral-muted)"} stroke={card.wins ? "var(--color-border-success-emphasis)" : "var(--color-border-neutral-muted)"} strokeWidth={1.5} />
              <text x={card.x + CARD_W - 16} y={CARD_Y + 3} textAnchor="middle" fontSize={13} fontWeight={700} fill={card.wins ? "var(--color-fg-success)" : "var(--color-fg-muted)"}>
                {card.wins ? "✓" : "✕"}
              </text>
            </g>
          ))}

          {/* Both rules feed one result, making it clear they compete for the same element. */}
          <line x1={155} y1={CARD_Y + CARD_H} x2={255} y2={314} stroke="var(--color-border-neutral-muted)" strokeWidth={1.5} strokeDasharray="4 4" />
          <line x1={445} y1={CARD_Y + CARD_H} x2={345} y2={314} stroke="var(--color-border-success-emphasis)" strokeWidth={2} markerEnd="url(#layer-specificity-arrow)" />

          <rect x={140} y={316} width={320} height={64} rx={10} fill="var(--color-bg-success-muted)" stroke="var(--color-border-success-emphasis)" strokeWidth={1.5} />
          <rect x={158} y={334} width={16} height={16} rx={3} fill={resultColor} />
          <text x={184} y={347} fontSize={12} fontFamily={MONO_FONT} fill="var(--color-fg-default)">
            {"<p class=\"title text-accent\">"}
          </text>
          <text x={184} y={366} fontSize={11} fill="var(--color-fg-default)">
            renders in the <tspan fontWeight={600} fill="var(--color-fg-accent)">utilities</tspan> color
          </text>

          <text x={300} y={402} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">
            Layer order decides it — specificity never even gets compared across layers.
          </text>
        </Svg>
      </Wrapper>
    </>
  );
}

LayerSpecificityDiagram.displayName = "LayerSpecificityDiagram";
