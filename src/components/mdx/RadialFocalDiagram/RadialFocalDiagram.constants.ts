// The outer (end) circle — cx, cy, r — where the 100% stop lands.
export const OUTER = { cx: 200, cy: 165, r: 130 };

/*
  The focal (start) circle — fx, fy, fr — pushed up and left of center so the two circles are visibly distinct;
  when they coincide (the default) there's nothing to tell apart.
*/
export const FOCAL = { cx: 150, cy: 120, r: 22 };

// Right-hand legend rows — `bold` rows are headings, the rest are the plain-language explanation beneath each.
export const LEGEND = [
  { text: "Outer circle: cx, cy, r", y: 70, bold: true },
  { text: "the 100% stop lands on its edge", y: 88, bold: false },
  { text: "Focal circle: fx, fy, fr", y: 124, bold: true },
  { text: "the 0% stop starts here", y: 142, bold: false },
  { text: "fx / fy default to cx / cy", y: 158, bold: false },
  { text: "fr is a radius (SVG 2)", y: 194, bold: true },
  { text: "default 0 — a single point", y: 212, bold: false },
  { text: "Stops interpolate between", y: 248, bold: true },
  { text: "the focal circle and the outer one", y: 266, bold: false }
];
