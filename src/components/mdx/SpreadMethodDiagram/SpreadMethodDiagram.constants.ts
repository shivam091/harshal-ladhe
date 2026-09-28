// Horizontal extent shared by all three bars — long relative to the vector, so the spread region dominates.
export const BAR = { x: 150, width: 460, height: 44 };

/*
  The gradient vector: a quarter of the bar's width. Kept short on purpose — spreadMethod only has anything
  to do once the shape extends past the vector's end, which is why a full-width vector makes all three identical.
*/
export const VECTOR = { x1: 150, x2: 265 };

/*
  The three spread methods, top to bottom. `note` marks the default, because forgetting that pad is the
  default is the usual reason someone's "repeating" gradient looks like a flat smear.
*/
export const ROWS = [
  { method: "pad", y: 44, note: "(default)" },
  { method: "reflect", y: 114, note: "" },
  { method: "repeat", y: 184, note: "" }
];
