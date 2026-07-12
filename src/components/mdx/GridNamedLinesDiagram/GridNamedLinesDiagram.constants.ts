// Width of the sidebar track, matching the post's own `250px` sidebar column.
export const SIDEBAR_W = 140;

// Width of the main track, proportionally wider to stand in for the post's own `1fr` main column.
export const MAIN_W = 260;

// Gutter between the sidebar and main tracks, matching the post's own `gap: 1rem`.
export const GAP = 16;

// Height of the single row both tracks share.
export const ROW_H = 130;

// Container padding around the two tracks.
export const PAD = 14;

// Left x coordinate of the sidebar track.
export const ORIGIN_X = 60;

// Top y coordinate of both tracks.
export const ORIGIN_Y = 80;

// Left x coordinate of the main track, right after the sidebar track and the gap between them.
export const MAIN_X = ORIGIN_X + SIDEBAR_W + GAP;

// Left x coordinate of the outer container box.
export const CONTAINER_X = ORIGIN_X - PAD;

// Top y coordinate of the outer container box.
export const CONTAINER_Y = ORIGIN_Y - PAD;

// Width of the outer container box, spanning both tracks and the gap between them.
export const CONTAINER_W = MAIN_X + MAIN_W - ORIGIN_X + 2 * PAD;

// Height of the outer container box.
export const CONTAINER_H = ROW_H + 2 * PAD;

// x coordinate of the `[sidebar-start]` line — the container's left edge.
export const LINE_SIDEBAR_START_X = ORIGIN_X;

/*
  x coordinate of the `[sidebar-end main-start]` line — the midpoint of the gap between the two tracks, since
  a single grid line carries both names where one track ends and the next begins.
*/
export const LINE_SIDEBAR_END_MAIN_START_X = ORIGIN_X + SIDEBAR_W + GAP / 2;

// x coordinate of the `[main-end]` line — the container's right edge.
export const LINE_MAIN_END_X = MAIN_X + MAIN_W;
