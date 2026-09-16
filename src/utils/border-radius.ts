import { toFixed } from "@/utils/number";
import type { BorderRadiusEditorState, CornerRadius } from "@/interfaces/border-radius";

// Formats one radius value as a CSS length.
function px(value: number): string {
  return `${toFixed(value, 1)}px`;
}

/*
  Plain CSS `border-radius`. Shorthand omits the "/ v1 v2 v3 v4" half entirely whenever every
  corner's v equals its own h — the common "just round the corners" case — so an untouched shape
  compiles to the same simple 1-4-value form a developer would hand-write, rather than always
  emitting the full 8-value form regardless of whether the ellipse split is actually in use.
*/
export function compileRoundedValue(state: BorderRadiusEditorState): string {
  const { topLeft, topRight, bottomRight, bottomLeft } = state.corners;
  const horizontals = [topLeft.h, topRight.h, bottomRight.h, bottomLeft.h].map(px).join(" ");
  const isCircular = [topLeft, topRight, bottomRight, bottomLeft].every((corner) => corner.h === corner.v);
  if (isCircular) return horizontals;

  const verticals = [topLeft.v, topRight.v, bottomRight.v, bottomLeft.v].map(px).join(" ");
  return `${horizontals} / ${verticals}`;
}

// One point on a quarter-superellipse (Lamé curve), centered at (cx, cy), swept by t ∈ [0, π/2]. `flipX`/`flipY` mirror the canonical (bulges toward +x, +y) curve for the three corners that aren't bottom-right — see compileSquirclePath for the per-corner sign/traversal table this implements.
function superellipsePoint(cx: number, cy: number, h: number, v: number, t: number, flipX: boolean, flipY: boolean, exponent: number): { x: number; y: number } {
  const power = 2 / exponent;
  const dx = h * Math.cos(t) ** power;
  const dy = v * Math.sin(t) ** power;
  return { x: cx + (flipX ? -dx : dx), y: cy + (flipY ? -dy : dy) };
}

const CORNER_SAMPLES = 16;

/*
  Samples one corner's quarter-superellipse into a small polyline (a formula-generated curve has no
  natural small set of Bezier control points the way a hand-dragged clip-path vertex does, so this
  tool bakes it to enough straight segments to read as smooth instead — 16 per corner is well past
  the point of visible faceting at any preview size this tool renders).

  Each corner's raw t:0→π/2 sweep and flip signs are chosen so the samples run in CLOCKWISE
  traversal order once optionally reversed:
    bottom-right: no flip,        natural order  (east → south)
    top-left:     flip x and y,   natural order  (west → north)
    top-right:    flip y only,    REVERSED       (north → east)
    bottom-left:  flip x only,    REVERSED       (south → west)
  That table is what makes each corner's sample array end exactly where the next one's begins, so
  the full path is just those four arrays concatenated with straight "L" edges connecting them —
  no separate edge-point bookkeeping needed.
*/
function sampleCorner(cx: number, cy: number, corner: CornerRadius, flipX: boolean, flipY: boolean, reverse: boolean, exponent: number): Array<{ x: number; y: number }> {
  const points = Array.from({ length: CORNER_SAMPLES + 1 }, (_, i) => {
    const t = (i / CORNER_SAMPLES) * (Math.PI / 2);
    return superellipsePoint(cx, cy, corner.h, corner.v, t, flipX, flipY, exponent);
  });
  return reverse ? points.reverse() : points;
}

// Formats one path coordinate to 2 decimal places — plenty of precision for a clip-path at any preview size this tool renders, without emitting long floating-point tails.
function coord(value: number): number {
  return toFixed(value, 2);
}

/*
  Builds the squircle's `path()` clip-path value — a true continuous-curvature corner that
  `border-radius`'s own elliptical arc can only approximate at a fixed n=2. Assumes a square box
  (state.size × state.size): squircles are conventionally authored against a square reference (app
  icons, avatar frames), and that assumption is what keeps a single `size` field — rather than
  separate width/height — sufficient for this tool.
*/
export function compileSquirclePath(state: BorderRadiusEditorState): string {
  const { corners, curvature, size } = state;
  const exponent = Math.max(curvature, 2);

  const topLeft = sampleCorner(corners.topLeft.h, corners.topLeft.v, corners.topLeft, true, true, false, exponent);
  const topRight = sampleCorner(size - corners.topRight.h, corners.topRight.v, corners.topRight, false, true, true, exponent);
  const bottomRight = sampleCorner(size - corners.bottomRight.h, size - corners.bottomRight.v, corners.bottomRight, false, false, false, exponent);
  const bottomLeft = sampleCorner(corners.bottomLeft.h, size - corners.bottomLeft.v, corners.bottomLeft, true, false, true, exponent);

  const allPoints = [...topLeft, ...topRight, ...bottomRight, ...bottomLeft];
  const [first, ...rest] = allPoints;
  const commands = [`M ${coord(first.x)} ${coord(first.y)}`, ...rest.map((point) => `L ${coord(point.x)} ${coord(point.y)}`), "Z"];

  return `path("${commands.join(" ")}")`;
}

// Single entry point every export format and every preview calls — one source of truth for "what does this state compile to," dispatching to a distinct CSS property per family since a squircle isn't expressible through border-radius at all.
export function compileBlobValue(state: BorderRadiusEditorState): { property: "border-radius" | "clip-path"; value: string } {
  return state.family === "rounded"
    ? { property: "border-radius", value: compileRoundedValue(state) }
    : { property: "clip-path", value: compileSquirclePath(state) };
}
