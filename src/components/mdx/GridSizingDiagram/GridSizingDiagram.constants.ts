// Width shared by both panels — the whole point is that auto-fit and auto-fill split identical space differently.
export const PANEL_W = 340;

// Top y coordinate of both panels' track rows.
export const PANEL_TOP = 60;

// Height of both panels' track rows.
export const PANEL_H = 140;

// Left x coordinate of the auto-fit panel.
export const FIT_LEFT = 20;

// Width of each of the 3 real items in the auto-fit panel — they stretch to fill the row, so each is wide.
export const FIT_ITEM_W = 104;

// Gutter between adjacent items in the auto-fit panel.
export const FIT_GAP = 14;

// Left x coordinate of each of the 3 items in the auto-fit panel.
export const FIT_X = [FIT_LEFT, FIT_LEFT + FIT_ITEM_W + FIT_GAP, FIT_LEFT + 2 * (FIT_ITEM_W + FIT_GAP)];

// Left x coordinate of the auto-fill panel.
export const FILL_LEFT = 400;

// Width of each of the 5 tracks in the auto-fill panel — narrower, since 2 stay reserved and empty.
export const FILL_TRACK_W = 60;

// Gutter between adjacent tracks in the auto-fill panel.
export const FILL_GAP = 10;

// Left x coordinate of each of the 5 tracks (3 real items plus 2 reserved-empty ones) in the auto-fill panel.
export const FILL_X = [0, 1, 2, 3, 4].map((index) => FILL_LEFT + index * (FILL_TRACK_W + FILL_GAP));
