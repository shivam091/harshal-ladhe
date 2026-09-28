/*
  The 2 target shapes, sized 2.5× apart in both directions so the difference between "tile count fixed" and
  "tile size fixed" is unmistakable at a glance. Both are top-aligned within a row.
*/
export const SHAPES = [
  { key: "small", x: 200, width: 80, height: 48, heading: "small shape · 80 × 48" },
  { key: "large", x: 360, width: 200, height: 120, heading: "large shape · 200 × 120" }
];

/*
  The 2 compared patternUnits modes. `tileFor` returns the tile size a given shape actually gets, which is the
  entire difference between the modes: a fraction of the shape's bbox vs. a literal user-space length.
*/
export const MODES = [
  {
    key: "objectBoundingBox",
    top: 50,
    label: "objectBoundingBox",
    attributes: "width=\"0.25\" height=\"0.25\"",
    rule: "tile count stays fixed",
    tileFor: (width: number, height: number) => ({ width: width * 0.25, height: height * 0.25 })
  },
  {
    key: "userSpaceOnUse",
    top: 220,
    label: "userSpaceOnUse",
    attributes: "width=\"20\" height=\"20\"",
    rule: "tile size stays fixed",
    tileFor: () => ({ width: 20, height: 20 })
  }
];

// Vertical distance from a row's top to its cell captions — clears the tallest (large) shape with room to spare.
export const CAPTION_OFFSET = 138;
