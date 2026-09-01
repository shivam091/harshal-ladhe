import type { GridSubgridCardProps } from "@/components/mdx/GridSubgridDiagram/GridSubgridCard/GridSubgridCard.types";

// Width of every card, in both panels.
export const CARD_W = 96;

// Gap between the two cards within a single panel.
export const CARD_GAP = 14;

// Top y coordinate of every card, in both panels.
export const CARD_TOP = 50;

// Height of the title band for a short, single-line title.
export const TITLE_SHORT_H = 30;

// Height of the title band for a longer title that wraps onto 2 lines.
export const TITLE_LONG_H = 54;

// Height of the description band, shared by every card.
export const DESC_H = 56;

// Height of the button band, shared by every card.
export const BUTTON_H = 36;

// Left x coordinate of Card A and Card B in the "without subgrid" panel.
export const NO_SUBGRID_X = [24, 24 + CARD_W + CARD_GAP];

// Left x coordinate of Card A and Card B in the "with subgrid" panel.
export const SUBGRID_X = [280, 280 + CARD_W + CARD_GAP];

/*
  Cards in the "without subgrid" panel — Card B's longer title makes its own rows taller, independent
  of Card A, since each card sizes its own grid tracks with no shared reference point.
*/
export const NO_SUBGRID_CARDS: GridSubgridCardProps[] = [
  { x: NO_SUBGRID_X[0], titleLabel: "Title", titleH: TITLE_SHORT_H },
  { x: NO_SUBGRID_X[1], titleLabel: "Title (wraps)", titleH: TITLE_LONG_H }
];

/*
  Cards in the "with subgrid" panel — both cards inherit the parent's row tracks, so Card A's title band
  is forced to match Card B's taller title, keeping every band boundary identical across both cards.
*/
export const SUBGRID_CARDS: GridSubgridCardProps[] = [
  { x: SUBGRID_X[0], titleLabel: "Title", titleH: TITLE_LONG_H },
  { x: SUBGRID_X[1], titleLabel: "Title (wraps)", titleH: TITLE_LONG_H }
];

// Button band top for each "without subgrid" card — the two differ, which is exactly the misalignment being shown.
export const NO_SUBGRID_BUTTON_TOP = [
  CARD_TOP + TITLE_SHORT_H + DESC_H,
  CARD_TOP + TITLE_LONG_H + DESC_H
];

// Button band top shared by both "with subgrid" cards — identical, since their row tracks are shared.
export const SUBGRID_BUTTON_TOP = CARD_TOP + TITLE_LONG_H + DESC_H;
