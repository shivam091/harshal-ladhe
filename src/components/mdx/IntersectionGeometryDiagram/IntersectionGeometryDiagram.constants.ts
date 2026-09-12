// Left x coordinate of the root box (the viewport or scrolling container being watched).
export const ROOT_X = 40;
// Top y coordinate of the root box.
export const ROOT_Y = 20;
// Width of the root box.
export const ROOT_W = 220;
// Height of the root box, before any rootMargin is applied.
export const ROOT_H = 220;

/*
  The example rootMargin from the post's Scrollspy Navigation section is "0px 0px -50% 0px" — a
  negative bottom margin that shrinks the effective root upward from the bottom edge. EFFECTIVE_ROOT_H
  stands in for that shrink (roughly 40% shorter than ROOT_H) so the diagram matches the code example.
*/
export const EFFECTIVE_ROOT_H = 130;
// Bottom y coordinate of the effective (post-rootMargin) root — this is the "strike zone" boundary.
export const EFFECTIVE_ROOT_BOTTOM = ROOT_Y + EFFECTIVE_ROOT_H;
// Bottom y coordinate of the unshrunk root box, for the excluded-margin shading between the two.
export const ROOT_BOTTOM = ROOT_Y + ROOT_H;

// Left x coordinate of the target element, straddling the effective root's bottom boundary.
export const TARGET_X = 140;
// Width of the target element.
export const TARGET_W = 90;
// Height of the target element.
export const TARGET_H = 60;
// Top y coordinate of the target — positioned so it's bisected evenly by EFFECTIVE_ROOT_BOTTOM.
export const TARGET_Y = EFFECTIVE_ROOT_BOTTOM - TARGET_H / 2;
