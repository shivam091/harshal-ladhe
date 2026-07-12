// Width of every numbered box, in both panels.
export const BOX_W = 70;

// Height of every numbered box, in both panels.
export const BOX_H = 50;

// Gap between adjacent boxes within a row.
export const BOX_GAP = 24;

// Left x coordinate of the first box in either row.
export const ROW_X_START = 24;

// Left x coordinate of each of the 4 boxes in a row.
export const BOX_X = [0, 1, 2, 3].map((index) => ROW_X_START + index * (BOX_W + BOX_GAP));

// Horizontal center of each of the 4 boxes — arrows and labels anchor to these.
export const BOX_CX = BOX_X.map((x) => x + BOX_W / 2);

// Top y coordinate of the in-sync panel's row of boxes.
export const PANEL1_BOX_TOP = 50;

/*
  y coordinate of the in-sync panel's forward tab-order arrow, just below its boxes — safe to route below
  since this panel has no backward jump to route around.
*/
export const PANEL1_ARROW_Y = PANEL1_BOX_TOP + BOX_H + 20;

/*
  Top y coordinate of the reordered panel's row of boxes — pushed down to leave room above for the
  tab-order path, so the backward loop can arc over the row instead of cutting through it.
*/
export const PANEL2_BOX_TOP = 230;

// y coordinate of the reordered panel's forward tab-order segments, just above its boxes.
export const PANEL2_LANE_Y = PANEL2_BOX_TOP - 15;

// y coordinate of the reordered panel's peak arc, further above, for the backward tab jump back to Item 4.
export const PANEL2_ARC_PEAK_Y = PANEL2_BOX_TOP - 40;

/*
  Visual order of item labels in the reordered panel — Item 4 has been moved to appear first on screen
  (e.g. via `grid-column: 1`), while Items 1-3 keep their original relative order.
*/
export const PANEL2_VISUAL_LABELS = ["Item 4", "Item 1", "Item 2", "Item 3"];
