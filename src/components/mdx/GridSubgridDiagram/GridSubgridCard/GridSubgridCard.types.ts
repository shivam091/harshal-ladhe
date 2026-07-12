// Props for GridSubgridCard — one card's title/description/button bands, sized by the given title height.
export interface GridSubgridCardProps {
  // Left x coordinate of the card.
  x: number;
  // Text shown in the title band.
  titleLabel: string;
  // Height of the title band — taller for the card whose title wraps onto 2 lines.
  titleH: number;
}
