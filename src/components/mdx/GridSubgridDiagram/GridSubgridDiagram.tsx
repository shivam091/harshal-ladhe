import type { JSX } from "react";
import GridSubgridCard from "@/components/mdx/GridSubgridDiagram/GridSubgridCard";
import {
  CARD_W, CARD_GAP, NO_SUBGRID_X, SUBGRID_X, NO_SUBGRID_CARDS, SUBGRID_CARDS,
  NO_SUBGRID_BUTTON_TOP, SUBGRID_BUTTON_TOP
} from "@/components/mdx/GridSubgridDiagram/GridSubgridDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/GridSubgridDiagram/GridSubgridDiagram.styles";

// x coordinate marking the gap between Card A and Card B within the "without subgrid" panel — used to
// place the dimension-line gap marker between their misaligned button tops.
const NO_SUBGRID_MID_X = NO_SUBGRID_X[0] + CARD_W + CARD_GAP / 2;

/*
  Static SVG diagram comparing two cards with a wrapping title, with and without `subgrid` on their row
  tracks — without it, each card sizes its own rows independently and the button rows drift out of
  alignment; with it, both cards share the parent's row tracks and the buttons line up exactly.
*/
export default function GridSubgridDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 510 240" role="img" aria-labelledby="grid-subgrid-diagram-title grid-subgrid-diagram-desc">
          <title id="grid-subgrid-diagram-title">Subgrid alignment diagram</title>
          <desc id="grid-subgrid-diagram-desc">
            Two panels, each with two cards containing a title, description, and button. In the left panel,
            without subgrid, the second card&apos;s wrapping title pushes its button below the first card&apos;s
            button. In the right panel, with subgrid, both cards share the same row tracks, so their buttons
            line up exactly despite the same wrapping title.
          </desc>

          {/* Panel titles */}
          <text x={NO_SUBGRID_X[0] + (2 * CARD_W + CARD_GAP) / 2} y={30} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">Without subgrid</text>
          <text x={SUBGRID_X[0] + (2 * CARD_W + CARD_GAP) / 2} y={30} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">With subgrid</text>

          {/* Left panel — each card sizes its own rows, so the buttons drift out of alignment. */}
          {NO_SUBGRID_CARDS.map((card) => (
            <GridSubgridCard key={`no-subgrid-${card.x}`} {...card} />
          ))}
          <line
            x1={NO_SUBGRID_X[0] - 6} y1={NO_SUBGRID_BUTTON_TOP[0]} x2={NO_SUBGRID_X[1] + CARD_W + 6} y2={NO_SUBGRID_BUTTON_TOP[0]}
            stroke="var(--color-border-danger-emphasis)" strokeWidth={1.5} strokeDasharray="5 4"
          />
          <line x1={NO_SUBGRID_MID_X - 4} y1={NO_SUBGRID_BUTTON_TOP[0]} x2={NO_SUBGRID_MID_X + 4} y2={NO_SUBGRID_BUTTON_TOP[0]} stroke="var(--color-border-danger-emphasis)" strokeWidth={1.5} />
          <line x1={NO_SUBGRID_MID_X} y1={NO_SUBGRID_BUTTON_TOP[0]} x2={NO_SUBGRID_MID_X} y2={NO_SUBGRID_BUTTON_TOP[1]} stroke="var(--color-border-danger-emphasis)" strokeWidth={1.5} />
          <line x1={NO_SUBGRID_MID_X - 4} y1={NO_SUBGRID_BUTTON_TOP[1]} x2={NO_SUBGRID_MID_X + 4} y2={NO_SUBGRID_BUTTON_TOP[1]} stroke="var(--color-border-danger-emphasis)" strokeWidth={1.5} />
          <text x={NO_SUBGRID_MID_X + 10} y={(NO_SUBGRID_BUTTON_TOP[0] + NO_SUBGRID_BUTTON_TOP[1]) / 2 + 3} fontSize={9} fill="var(--color-fg-danger)">gap</text>
          <text x={NO_SUBGRID_X[0] + (2 * CARD_W + CARD_GAP) / 2} y={218} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">buttons misaligned</text>

          {/* Right panel — both cards share the parent's row tracks, so the buttons line up exactly. */}
          {SUBGRID_CARDS.map((card) => (
            <GridSubgridCard key={`subgrid-${card.x}`} {...card} />
          ))}
          <line
            x1={SUBGRID_X[0] - 6} y1={SUBGRID_BUTTON_TOP} x2={SUBGRID_X[1] + CARD_W + 6} y2={SUBGRID_BUTTON_TOP}
            stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5}
          />
          <text x={SUBGRID_X[1] + CARD_W + 10} y={SUBGRID_BUTTON_TOP + 4} fontSize={11} fill="var(--color-border-accent-emphasis)">✓</text>
          <text x={SUBGRID_X[0] + (2 * CARD_W + CARD_GAP) / 2} y={218} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">buttons aligned</text>
        </Svg>
      </Wrapper>
    </>
  );
}

GridSubgridDiagram.displayName = "GridSubgridDiagram";
