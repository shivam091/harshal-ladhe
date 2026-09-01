/*
  The 3 nested reference boxes `mask-origin` and `mask-clip` can each be pointed at, outermost first —
  matching CSS's own border-box/padding-box/content-box vocabulary shared with the regular box model.
  Each box insets 20 units further than the one before it, so they nest visibly rather than overlapping flush.
*/
export const MASK_BOX_REGIONS = [
  { key: "border-box", inset: 0, label: "border-box", note: "default reference box" },
  { key: "padding-box", inset: 20, label: "padding-box", note: "excludes the border" },
  { key: "content-box", inset: 40, label: "content-box", note: "excludes border + padding" }
];

// Outer bounds of the outermost (border-box) rectangle before any inset is applied.
export const OUTER_BOX = { x: 20, y: 20, w: 220, h: 140 };
