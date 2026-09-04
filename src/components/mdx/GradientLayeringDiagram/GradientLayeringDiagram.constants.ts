// Shared side length of each stacked layer square.
export const LAYER_SIZE = 120;

// How far each successive (further-back) layer is offset down-right, so its corner peeks out from behind.
export const LAYER_OFFSET = 18;

// Top-left corner of the frontmost (first-listed) layer square.
const STACK_ORIGIN = { x: 40, y: 40 };

/*
  The 3 layers from the post's own glass-card example, front-to-back in the same order they're listed in
  the CSS `background:` shorthand — CSS paints comma-separated background layers with the FIRST one on top,
  which is the one fact this diagram exists to make unmissable.
*/
export const LAYERS = [
  { badge: "①", x: STACK_ORIGIN.x, y: STACK_ORIGIN.y, label: "light reflection — linear" },
  { badge: "②", x: STACK_ORIGIN.x + LAYER_OFFSET, y: STACK_ORIGIN.y + LAYER_OFFSET, label: "ambient highlight — radial" },
  { badge: "③", x: STACK_ORIGIN.x + LAYER_OFFSET * 2, y: STACK_ORIGIN.y + LAYER_OFFSET * 2, label: "backdrop color — base, no gradient" }
];

// Radius of the numbered badge circle drawn at each layer's exposed (bottom-right) corner.
export const BADGE_R = 11;

// Bounds of the composited "what you actually see" swatch on the right.
export const RESULT = { x: 270, y: 30, size: 160 };

// The card's own base colour, matching the post's `.glass-card` background colour.
export const BACKDROP_COLOR = "#1a1a2e";

// Peak colour of the ambient-highlight glow (layer ②) — matches the post's own glass-card ambient highlight hues.
export const GLOW_COLOR = "225, 29, 72";
