import type { StartingStyleCard } from "@/components/mdx/StartingStyleTimelineDiagram/StartingStyleTimelineDiagram.types";
import { CARD_W, CARD_H } from "@/components/mdx/StartingStyleTimelineDiagram/StartingStyleTimelineDiagram.constants";

// SVG rects are positioned by their top-left corner, so a card defined by its centre needs converting.
export function getCardRectOrigin(card: StartingStyleCard): { x: number; y: number } {
  return { x: card.x - CARD_W / 2, y: card.y - CARD_H / 2 + card.offsetY };
}
