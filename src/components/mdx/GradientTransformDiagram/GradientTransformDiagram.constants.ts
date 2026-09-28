// Side length of both bounding boxes — square on purpose, since only on a square box is rotate(45) a true 45°.
export const BOX_SIZE = 160;

// Shared top edge of both boxes, low enough that the right panel's vector (which starts above its box) clears the heading.
export const BOX_Y = 90;

/*
  The two panels. All geometry is the default vector (0,0) → (1,0) in bounding-box units, rotated 45° about
  the pivot, then scaled by BOX_SIZE: `vector` is where that rotated vector lands, and `stop0`/`stop1` are the
  dashed isolines (x + y = constant) where the 0% and 100% stops fall, pre-clipped to the box.
  Corner pivot: vector (0,0) → (0.707,0.707); isolines x+y = 0 (the corner itself) and x+y = 1.414.
  Center pivot: vector (0.5,-0.207) → (1.207,0.5); isolines x+y = 0.293 and x+y = 1.707.
*/
export const PANELS = [
  {
    key: "corner",
    boxX: 60,
    heading: "rotate(45)",
    pivot: { x: 60, y: 90 },
    vector: { x1: 60, y1: 90, x2: 173.1, y2: 203.1 },
    stop0: null,
    stop1: { x1: 220, y1: 156.3, x2: 126.3, y2: 250 },
    captions: ["pivots on the bbox corner (0, 0)", "ramp ends early; bottom-right is padded"]
  },
  {
    key: "center",
    boxX: 380,
    heading: "rotate(45 .5 .5)",
    pivot: { x: 460, y: 170 },
    vector: { x1: 460, y1: 56.9, x2: 573.1, y2: 170 },
    stop0: { x1: 426.9, y1: 90, x2: 380, y2: 136.9 },
    stop1: { x1: 540, y1: 203.1, x2: 493.1, y2: 250 },
    captions: ["pivots on the bbox center (.5, .5)", "ramp stays centered in the box"]
  }
];
