// The outer <svg> canvas, drawn as a frame so the region's x/y can be measured from a visible (0, 0) corner.
export const CANVAS = { x: 20, y: 30, width: 620, height: 280 };

// The <foreignObject> region itself — its x/y/width/height are the four numbers the diagram is labelling.
export const REGION = { x: 180, y: 90, width: 300, height: 140 };

/*
  The HTML <div> laid out inside the region. Deliberately taller than the region so part of it spills past the
  bottom edge — the default overflow clipping is the behaviour readers most often trip over.
*/
export const HTML_BOX = { x: 196, y: 106, width: 268, height: 174 };

/*
  Stand-in "lines of wrapped text" inside the div, as bar widths. Ragged right edges read as real paragraph flow,
  which is the one thing foreignObject gives you that native <text> can't.
*/
export const TEXT_LINE_WIDTHS = [236, 248, 212, 240, 228, 186, 244, 220, 132];

// Baseline of the first wrapped-text bar, just under the div's two heading lines.
export const TEXT_LINE_START_Y = 154;

// Vertical rhythm between wrapped-text bars — a stand-in for CSS line-height.
export const TEXT_LINE_STEP = 14;
