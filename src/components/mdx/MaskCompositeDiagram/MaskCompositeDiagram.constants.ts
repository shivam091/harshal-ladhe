// Shared width/height of each of the 4 operator panels.
export const PANEL_W = 200;
export const PANEL_H = 148;

// Gap between panels in the 2x2 grid.
export const PANEL_GAP = 16;

// Height of the checkerboard/circle area within each panel, leaving room below for the two label lines.
export const CIRCLE_AREA_H = 104;

// Size of one checkerboard tile used to render "hidden" (not visible) areas.
export const CHECKER_TILE = 8;

// Shared circle geometry — identical A/B position and radius in every panel, only the fill logic differs.
export const CIRCLE_A = { cx: 74, cy: 52, r: 30 };
export const CIRCLE_B = { cx: 116, cy: 52, r: 30 };

/*
  The 4 `mask-composite` operators, in the order the spec lists them. `formula` is the plain-English
  description of which region of A and B ends up visible — the one fact each panel exists to make visible
  at a glance, since the keywords alone (add/subtract/intersect/exclude) don't say which shape "wins".
*/
export const MASK_COMPOSITE_PANELS = [
  { key: "add", label: "add", formula: "A ∪ B — everything in either" },
  { key: "subtract", label: "subtract", formula: "A − B — A, minus the overlap" },
  { key: "intersect", label: "intersect", formula: "A ∩ B — only the overlap" },
  { key: "exclude", label: "exclude", formula: "A ⊕ B — either, but not both" }
];
