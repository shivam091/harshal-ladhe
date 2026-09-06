// Element box shared by every panel — deliberately non-square, and smaller than the photo in BOTH
// dimensions, so `object-position` has genuine room to slide the crop window both horizontally and
// vertically at once (a `cover`-fit box only ever has slack on one axis; this uses `object-fit: none`
// instead, purely to isolate what `object-position` itself is doing).
export const BOX_W = 130;
export const BOX_H = 100;

// Fixed "photo" dimensions — the same schematic landscape used by ObjectFitModesDiagram.
export const IMG_W = 200;
export const IMG_H = 140;

// How far the photo can slide inside the box before either its left/top or right/bottom edge would clear
// the box entirely — 0% pins the photo's start edge to the box's start edge, 100% pins the end edges.
const SLACK_X = IMG_W - BOX_W;
const SLACK_Y = IMG_H - BOX_H;

// Horizontal gap between panels. Wide enough that the dashed full-photo outline (which can overflow the
// box by up to SLACK_X on either side) never overlaps its neighbor.
const GAP = 90;
const PANEL_X_START = 20;
export const PANEL_Y = 30;

// Fixed "photo" colors — same palette and scene as ObjectFitModesDiagram, so the two diagrams read as one
// consistent visual pair even though each file is self-contained.
export const SKY_TOP = "#38bdf8";
export const SKY_BOTTOM = "#bae6fd";
export const SUN_COLOR = "#fbbf24";
export const GROUND_COLOR = "#4ade80";
export const MOUNTAIN_COLOR = "#64748b";

interface PositionPanelDef {
  // The object-position value this panel demonstrates.
  value: string;
  // Short caption rendered under the panel.
  note: string;
  // Horizontal/vertical position as a 0–1 fraction (0 = left/top, 1 = right/bottom, 0.5 = center).
  px: number;
  py: number;
}

const POSITION_DEFS: PositionPanelDef[] = [
  { value: "center", note: "50% 50% — the default", px: 0.5, py: 0.5 },
  { value: "top left", note: "0% 0%", px: 0, py: 0 },
  { value: "bottom right", note: "100% 100%", px: 1, py: 1 },
  { value: "25% 75%", note: "any percentage works", px: 0.25, py: 0.75 }
];

/*
  For each panel: the same point on the box (px% across, py% down) and the matching point on the photo are
  pinned together — that's the whole definition of `object-position`. `offsetX`/`offsetY` place the photo so
  that pin holds; `anchorX`/`anchorY` are that shared pinned point, in box-local coordinates, marked with a
  crosshair on every panel.
*/
export const POSITION_PANELS = POSITION_DEFS.map((def, index) => ({
  ...def,
  panelX: PANEL_X_START + index * (BOX_W + GAP),
  offsetX: -(def.px * SLACK_X),
  offsetY: -(def.py * SLACK_Y),
  anchorX: def.px * BOX_W,
  anchorY: def.py * BOX_H
}));

export const CANVAS_W = PANEL_X_START * 2 + POSITION_DEFS.length * BOX_W + (POSITION_DEFS.length - 1) * GAP;
export const CANVAS_H = PANEL_Y + BOX_H + 70;
