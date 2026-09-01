// Shared side length of each stacked layer square.
export const LAYER_SIZE = 120;

// How far the back (further-back) layer is offset down-right, so its corner peeks out from behind the front one.
export const LAYER_OFFSET = 18;

// Top-left corner of the frontmost (first-listed) layer square.
const STACK_ORIGIN = { x: 40, y: 40 };

/*
  The 2 layers in a typical hero `background-image` stack, front-to-back in the same order they're listed
  in the CSS — the gradient tint is listed first (and renders on top), the photo is listed second (and
  renders underneath). Getting this order backwards is the single most common gradient-overlay bug.
*/
export const OVERLAY_LAYERS = [
  { badge: "①", x: STACK_ORIGIN.x, y: STACK_ORIGIN.y, label: "gradient tint — listed first" },
  { badge: "②", x: STACK_ORIGIN.x + LAYER_OFFSET, y: STACK_ORIGIN.y + LAYER_OFFSET, label: "photo — listed second" }
];

// Bounds of the composited "hero" result swatch on the right.
export const RESULT = { x: 270, y: 30, size: 160 };

// Start/end colors of the decorative "photo" stand-in used in both the back layer and the composited result.
export const PHOTO_FROM = "#0ea5e9";
export const PHOTO_TO = "#a855f7";
