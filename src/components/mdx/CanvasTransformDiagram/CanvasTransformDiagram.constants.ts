import type { Point } from "@/components/mdx/CanvasTransformDiagram/CanvasTransformDiagram.types";

// Code captions read as real code only in monospace.
export const MONO_FONT = "'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

// Two frames this wide fit side by side with captions that never wrap.
export const PANEL_W = 280;

// Tall enough that the swung square in the left frame stays inside it.
export const PANEL_H = 220;

// Leaves room above the frames for each title and the (0,0) label.
export const PANEL_Y = 64;

// Keeps the "rotate() alone" frame centred in the left half of the viewBox.
export const LEFT_PANEL_X = 20;

// Keeps the "translate() → rotate()" frame centred in the right half of the viewBox.
export const RIGHT_PANEL_X = 340;

// A fixed grid lets the displacement read against unmoving coordinates.
export const GRID_STEP = 40;

// Matches the `Math.PI / 6` in the captions, so the picture and the code agree.
export const ANGLE = Math.PI / 6;

// Same square in both frames, so the only difference is the pivot.
export const SQUARE_SIZE = 64;

// Canvas y points down, so a positive angle turns clockwise; computing it keeps the direction honest.
export function rotatePoint(point: Point, pivot: Point, angle: number): Point {
  const dx = point.x - pivot.x;
  const dy = point.y - pivot.y;

  return {
    x: pivot.x + dx * Math.cos(angle) - dy * Math.sin(angle),
    y: pivot.y + dx * Math.sin(angle) + dy * Math.cos(angle)
  };
}

// Consistent corner order keeps rotated copies matching their originals.
function squareCorners(topLeft: Point, size: number): Point[] {
  return [
    { x: topLeft.x, y: topLeft.y },
    { x: topLeft.x + size, y: topLeft.y },
    { x: topLeft.x + size, y: topLeft.y + size },
    { x: topLeft.x, y: topLeft.y + size }
  ];
}

// Keeps coordinate formatting out of the markup.
export function toPoints(corners: Point[]): string {
  return corners.map((corner) => `${corner.x.toFixed(1)},${corner.y.toFixed(1)}`).join(" ");
}

// The pivot `rotate()` uses unless the origin has been moved first.
export const ORIGIN: Point = { x: 0, y: 0 };

// Far enough from the origin that the swing is unmistakable.
const LEFT_SQUARE_TOP_LEFT: Point = { x: 120, y: 36 };

// The "where you expected it" reference the swung square is compared against.
export const LEFT_ORIGINAL = squareCorners(LEFT_SQUARE_TOP_LEFT, SQUARE_SIZE);

// The surprise: the square swings around the canvas origin, not its own centre.
export const LEFT_ROTATED = LEFT_ORIGINAL.map((corner) => rotatePoint(corner, ORIGIN, ANGLE));

// Anchors the start of the swing arc.
export const LEFT_CENTRE: Point = {
  x: LEFT_SQUARE_TOP_LEFT.x + SQUARE_SIZE / 2,
  y: LEFT_SQUARE_TOP_LEFT.y + SQUARE_SIZE / 2
};

// Anchors the end of the swing arc, showing how far the square travelled.
export const LEFT_CENTRE_ROTATED = rotatePoint(LEFT_CENTRE, ORIGIN, ANGLE);

// The square travels along a circle this far from the origin.
export const LEFT_SWING_RADIUS = Math.hypot(LEFT_CENTRE.x, LEFT_CENTRE.y);

// Kept tight so the angle label clears both squares.
export const ORIGIN_WEDGE_RADIUS = 40;

// Pins the angle wedge to the two radial guide lines.
export const ORIGIN_WEDGE = {
  start: {
    x: (LEFT_CENTRE.x / LEFT_SWING_RADIUS) * ORIGIN_WEDGE_RADIUS,
    y: (LEFT_CENTRE.y / LEFT_SWING_RADIUS) * ORIGIN_WEDGE_RADIUS
  },
  end: {
    x: (LEFT_CENTRE_ROTATED.x / LEFT_SWING_RADIUS) * ORIGIN_WEDGE_RADIUS,
    y: (LEFT_CENTRE_ROTATED.y / LEFT_SWING_RADIUS) * ORIGIN_WEDGE_RADIUS
  }
};

// Halfway through the turn, so the label reads as belonging to the wedge.
export const ORIGIN_WEDGE_LABEL = rotatePoint(
  {
    x: (LEFT_CENTRE.x / LEFT_SWING_RADIUS) * (ORIGIN_WEDGE_RADIUS + 16),
    y: (LEFT_CENTRE.y / LEFT_SWING_RADIUS) * (ORIGIN_WEDGE_RADIUS + 16)
  },
  ORIGIN,
  ANGLE / 2
);

// The point `translate(cx, cy)` moves the origin to.
export const RIGHT_CENTRE: Point = { x: 160, y: 124 };

// Reference outline proving the square stays put.
export const RIGHT_ORIGINAL = squareCorners(
  { x: RIGHT_CENTRE.x - SQUARE_SIZE / 2, y: RIGHT_CENTRE.y - SQUARE_SIZE / 2 },
  SQUARE_SIZE
);

// The fix: with the origin at its centre, the square spins in place.
export const RIGHT_ROTATED = RIGHT_ORIGINAL.map((corner) => rotatePoint(corner, RIGHT_CENTRE, ANGLE));

// Just clear of the rotated square's corners, so the arrow never overlaps it.
export const SPIN_RADIUS = Math.SQRT2 * (SQUARE_SIZE / 2) + 12;

// Starts above the square, where the arrow has open space.
const SPIN_START_ANGLE = (-120 * Math.PI) / 180;

// Anchors the start of the spin arrow.
export const SPIN_START: Point = {
  x: RIGHT_CENTRE.x + SPIN_RADIUS * Math.cos(SPIN_START_ANGLE),
  y: RIGHT_CENTRE.y + SPIN_RADIUS * Math.sin(SPIN_START_ANGLE)
};

// Clockwise like the real rotation, and long enough to read as motion.
export const SPIN_END: Point = {
  x: RIGHT_CENTRE.x + SPIN_RADIUS * Math.cos(SPIN_START_ANGLE + ANGLE * 2),
  y: RIGHT_CENTRE.y + SPIN_RADIUS * Math.sin(SPIN_START_ANGLE + ANGLE * 2)
};

// Lets the translate label run along its guide line.
export const TRANSLATE_LINE_DEG = (Math.atan2(RIGHT_CENTRE.y, RIGHT_CENTRE.x) * 180) / Math.PI;
