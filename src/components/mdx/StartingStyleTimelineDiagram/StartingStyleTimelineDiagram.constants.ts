import type { StartingStyleCard } from "@/components/mdx/StartingStyleTimelineDiagram/StartingStyleTimelineDiagram.types";

// x coordinate shared by both rows' left ("before") card.
export const CARD_LEFT_X = 120;

// x coordinate shared by both rows' right ("after") card.
export const CARD_RIGHT_X = 300;

// y coordinate of the "without @starting-style" row.
export const ROW_WITHOUT_Y = 66;

// y coordinate of the "with @starting-style" row.
export const ROW_WITH_Y = 176;

// Wide enough to hold the label beneath it without crowding the neighbouring card.
export const CARD_W = 64;
// Tall enough that the translateY offset is visible against the card size.
export const CARD_H = 40;

/*
  "Without @starting-style": both cards render identically solid — there's no distinct prior state, so the
  element simply appears already in its final style within a single style pass.
*/
export const WITHOUT_CARDS: [StartingStyleCard, StartingStyleCard] = [
  { x: CARD_LEFT_X, y: ROW_WITHOUT_Y, offsetY: 0, opacity: 1, dashed: false, label: "computed style" },
  { x: CARD_RIGHT_X, y: ROW_WITHOUT_Y, offsetY: 0, opacity: 1, dashed: false, label: "same frame" }
];

/*
  "With @starting-style": the left card renders faint and shifted down (the `@starting-style` values), the
  right card renders solid and in place (the final style) — a real prior state for the transition to play between.
*/
export const WITH_CARDS: [StartingStyleCard, StartingStyleCard] = [
  { x: CARD_LEFT_X, y: ROW_WITH_Y, offsetY: 10, opacity: 0.3, dashed: true, label: "@starting-style" },
  { x: CARD_RIGHT_X, y: ROW_WITH_Y, offsetY: 0, opacity: 1, dashed: false, label: "final style" }
];
