// One "element card" drawn inside a row — its opacity, vertical offset, and whether it's rendered as a
// dashed/faint placeholder (unrendered/starting state) or a solid box (rendered/final state).
export interface StartingStyleCard {
  // x coordinate of the card's center.
  x: number;
  // y coordinate of the card's center.
  y: number;
  // Vertical offset applied on top of `y`, mimicking a `translateY` entrance.
  offsetY: number;
  // Fill/stroke opacity, mimicking an `opacity` entrance.
  opacity: number;
  // Dashed outline for a card that isn't really "there" yet (the starting-style state).
  dashed: boolean;
  // Label rendered above the card.
  label: string;
}
