// Square element box shared by every panel — identical for all 5 keyword values, so only the *value* varies.
export const BOX = 120;

// Fixed "photo" dimensions every panel scales/crops from — a landscape image, wider than it is tall.
export const IMG_W = 200;
export const IMG_H = 140;

// Horizontal gap between panels. Wide enough that the dashed intrinsic-bounds outline on the last two
// panels (which overflows the box by up to 40px a side once centered) never overlaps its neighbor.
const GAP = 60;
const PANEL_X_START = 20;
export const PANEL_Y = 30;

/*
  Fixed "photo" colors — a schematic sky/sun/mountains/ground scene. Deliberately plain hex values, not
  theme tokens, since this represents a literal photo rather than UI chrome (same convention as the
  gradient diagrams' SWATCH_FROM/SWATCH_TO constants).
*/
export const SKY_TOP = "#38bdf8";
export const SKY_BOTTOM = "#bae6fd";
export const SUN_COLOR = "#fbbf24";
export const GROUND_COLOR = "#4ade80";
export const MOUNTAIN_COLOR = "#64748b";

// Every panel centers its photo on the box the same way `object-position: center` (the default) would —
// whether the drawn photo ends up smaller or larger than the box, this one rule produces every offset below.
function centeredOffset(drawSize: number): number {
  return (BOX - drawSize) / 2;
}

// `contain` scales by whichever axis needs the *smaller* factor to fit both — that axis lands exactly on
// the box edge, the other leaves empty space (letterboxing).
const containScale = Math.min(BOX / IMG_W, BOX / IMG_H);

// `cover` scales by whichever axis needs the *larger* factor to fill both — that axis lands exactly on the
// box edge, the other overflows past it (cropping).
const coverScale = Math.max(BOX / IMG_W, BOX / IMG_H);

interface FitModeDef {
  // The CSS object-fit keyword this panel demonstrates.
  keyword: string;
  // Short caption rendered under the panel.
  note: string;
  scale: { x: number; y: number };
  /*
    Only "none" and "scale-down" show the photo's true intrinsic size as a dashed outline — "fill",
    "contain", and "cover" always resize the photo to match the box, so there's no hidden size to reveal.
    For "none" the outline exactly traces the visible (clipped) photo. For "scale-down" it traces the
    LARGER size the photo would have been at "none" — the size scale-down rejected in favor of shrinking.
  */
  showIntrinsicOutline?: boolean;
}

const FIT_MODE_DEFS: FitModeDef[] = [
  { keyword: "fill", note: "stretched to fit exactly — distorted", scale: { x: BOX / IMG_W, y: BOX / IMG_H } },
  { keyword: "contain", note: "shrunk to fit whole — letterboxed", scale: { x: containScale, y: containScale } },
  { keyword: "cover", note: "grown to fill whole — cropped", scale: { x: coverScale, y: coverScale } },
  { keyword: "none", note: "true size — mostly clipped", scale: { x: 1, y: 1 }, showIntrinsicOutline: true },
  {
    keyword: "scale-down",
    note: "= contain here (photo is bigger than box)",
    scale: { x: containScale, y: containScale },
    showIntrinsicOutline: true
  }
];

// The photo's true, unscaled size and position, centered on the box — what "none" actually draws, and the
// size "scale-down" rejects in favor of contain's smaller result.
export const INTRINSIC_OFFSET_X = centeredOffset(IMG_W);
export const INTRINSIC_OFFSET_Y = centeredOffset(IMG_H);

// Fully resolved per-panel geometry — the component only maps over this array and renders, no inline math.
export const FIT_PANELS = FIT_MODE_DEFS.map((def, index) => ({
  ...def,
  panelX: PANEL_X_START + index * (BOX + GAP),
  drawW: IMG_W * def.scale.x,
  drawH: IMG_H * def.scale.y,
  offsetX: centeredOffset(IMG_W * def.scale.x),
  offsetY: centeredOffset(IMG_H * def.scale.y)
}));

export const CANVAS_W = PANEL_X_START * 2 + FIT_MODE_DEFS.length * BOX + (FIT_MODE_DEFS.length - 1) * GAP;
export const CANVAS_H = PANEL_Y + BOX + 70;
