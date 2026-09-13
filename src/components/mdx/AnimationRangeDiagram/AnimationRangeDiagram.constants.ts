// Left x coordinate of the viewport box — the fixed window the page scrolls content through.
export const VIEWPORT_X = 40;
// Top y coordinate of the viewport box.
export const VIEWPORT_Y = 70;
// Width of the viewport box.
export const VIEWPORT_W = 140;
// Height of the viewport box.
export const VIEWPORT_H = 110;
// Bottom y coordinate of the viewport box, derived for readability at each call site.
export const VIEWPORT_BOTTOM = VIEWPORT_Y + VIEWPORT_H;

/*
  Width of the animated target element. Kept smaller than VIEWPORT_H so "contain" has a
  non-zero span — the phase where the target sits fully inside the viewport as it scrolls.
*/
export const TARGET_W = 90;
// Height of the animated target element.
export const TARGET_H = 40;
// Left x coordinate of the target, horizontally centred within the viewport box.
export const TARGET_X = VIEWPORT_X + (VIEWPORT_W - TARGET_W) / 2;

/*
  The four boundary positions of the target's top edge as it travels through the viewport
  (top edge decreasing = target moving upward on screen while the user scrolls down the page):
    B0 — first pixel enters at the viewport's bottom edge (start of "entry", 0% overall)
    B1 — target fully inside, still touching the bottom edge (end of "entry", start of "contain")
    B2 — target fully inside, now touching the top edge (end of "contain", start of "exit")
    B3 — last pixel leaves at the viewport's top edge (end of "exit", 100% overall)
  "cover" spans the full B0 → B3 range, the union of all three named phases.
*/
export const BOUNDARY_ENTRY_START = VIEWPORT_BOTTOM;
export const BOUNDARY_ENTRY_END = VIEWPORT_BOTTOM - TARGET_H;
export const BOUNDARY_EXIT_START = VIEWPORT_Y;
export const BOUNDARY_EXIT_END = VIEWPORT_Y - TARGET_H;

// X position where the sequential entry/contain/exit brackets are drawn, right of the viewport.
export const RANGE_BRACKET_X = 210;
// X position of the outer "cover" bracket, spanning all three inner ranges.
export const COVER_BRACKET_X = 285;
// X position of the ghost-trail direction arrow, left of the viewport.
export const TRAIL_ARROW_X = 24;
