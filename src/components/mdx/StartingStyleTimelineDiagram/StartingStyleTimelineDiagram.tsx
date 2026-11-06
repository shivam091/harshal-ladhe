import type { JSX } from "react";
import type { StartingStyleCard } from "@/components/mdx/StartingStyleTimelineDiagram/StartingStyleTimelineDiagram.types";
import { CARD_W, CARD_H, ROW_WITHOUT_Y, ROW_WITH_Y, WITHOUT_CARDS, WITH_CARDS } from "@/components/mdx/StartingStyleTimelineDiagram/StartingStyleTimelineDiagram.constants";
import { getCardRectOrigin } from "@/components/mdx/StartingStyleTimelineDiagram/StartingStyleTimelineDiagram.helpers";
import { Wrapper, Svg } from "@/components/mdx/StartingStyleTimelineDiagram/StartingStyleTimelineDiagram.styles";

// Lets the not-yet-rendered starting state be told apart from the settled final state at a glance.
function Card({ card }: { card: StartingStyleCard }): JSX.Element {
  const origin = getCardRectOrigin(card);
  return (
    <rect
      x={origin.x} y={origin.y} width={CARD_W} height={CARD_H} rx={8}
      fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5}
      opacity={card.opacity} strokeDasharray={card.dashed ? "4 4" : undefined}
    />
  );
}

/*
  Static SVG diagram contrasting a plain style change (top row) with one that has an @starting-style state to
  transition from (bottom row) — the same "single frame vs. two distinct states" idea the post's intro walks
  through in prose, made visual.
*/
export default function StartingStyleTimelineDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 420 250" role="img" aria-labelledby="starting-style-timeline-title starting-style-timeline-desc">
          <title id="starting-style-timeline-title">Why a transition needs @starting-style on first render</title>
          <desc id="starting-style-timeline-desc">
            Two rows compare the first style update of an element. Without @starting-style, both the before and
            after style are computed in the same frame, so the element simply appears already in its final
            state. With @starting-style, the browser has a distinct faint, shifted-down before-state to
            transition from, so the transition actually plays on the way to the final style.
          </desc>

          <defs>
            <marker id="starting-style-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
          </defs>

          {/* Row 1 — no @starting-style: a lightning bolt instead of an arrow, since there's nothing to animate. */}
          <text x={210} y={20} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--color-fg-default)">Without @starting-style</text>
          {WITHOUT_CARDS.map((card, index) => (
            <g key={index}>
              <Card card={card} />
              <text x={card.x} y={card.y + CARD_H / 2 + 18} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">{card.label}</text>
            </g>
          ))}
          <text x={210} y={ROW_WITHOUT_Y - 4} textAnchor="middle" fontSize={16} fill="var(--color-fg-attention)">⚡</text>
          <text x={210} y={ROW_WITHOUT_Y + 6} textAnchor="middle" fontSize={9} fill="var(--color-fg-muted)">pops in instantly</text>
          <text x={210} y={104} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">No prior style exists to transition from.</text>

          <line x1={20} y1={128} x2={400} y2={128} stroke="var(--color-border-muted)" strokeWidth={1} strokeDasharray="2 3" />

          {/* Row 2 — with @starting-style: a real arrow, since there's now a distinct before-state to animate from. */}
          <text x={210} y={148} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--color-fg-default)">With @starting-style</text>
          {WITH_CARDS.map((card, index) => (
            <g key={index}>
              <Card card={card} />
              <text x={card.x} y={card.y + CARD_H / 2 + card.offsetY + 18} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">{card.label}</text>
            </g>
          ))}
          <line
            x1={WITH_CARDS[0].x + CARD_W / 2 + 6} y1={ROW_WITH_Y} x2={WITH_CARDS[1].x - CARD_W / 2 - 8} y2={ROW_WITH_Y}
            stroke="var(--color-fg-success)" strokeWidth={2} markerEnd="url(#starting-style-arrow)"
          />
          <text x={210} y={ROW_WITH_Y - 10} textAnchor="middle" fontSize={9} fill="var(--color-fg-success)">transition (e.g. 0.3s ease-out)</text>
          <text x={210} y={224} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">@starting-style supplies the missing before-state.</text>
        </Svg>
      </Wrapper>
    </>
  );
}

StartingStyleTimelineDiagram.displayName = "StartingStyleTimelineDiagram";
