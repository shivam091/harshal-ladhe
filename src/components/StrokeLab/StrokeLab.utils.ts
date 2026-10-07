import type {
  CornerVerdict,
  DrawOnSettings,
  PathAnalysis,
  PathEnd,
  PathSegment,
  StrokeCorner,
  StrokeLabEditorState,
  StrokeLabShareableState,
  StrokeLinejoin,
  SubjectGeometry,
  Subpath,
  TapeSegment,
  Vec2
} from "@/components/StrokeLab/StrokeLab.types";

/* ------------------------------------------------------------------ */
/* Subjects                                                            */
/* ------------------------------------------------------------------ */

// One shared stage size for every built-in subject, so switching subjects never rescales the cloth.
export const STAGE_VIEWBOX = "0 0 400 260";

// Zig-zag vertices chosen so the corners span ~20° to ~58° — one either side of the default miter limit's ≈ 29° cut-off.
const ZIGZAG_POINTS: Vec2[] = [
  { x: 30, y: 215 },
  { x: 80, y: 75 },
  { x: 120, y: 215 },
  { x: 175, y: 105 },
  { x: 215, y: 215 },
  { x: 250, y: 55 },
  { x: 270, y: 215 },
  { x: 320, y: 125 },
  { x: 370, y: 215 }
];

// Star proportions picked so each tip is ≈ 26.7° — a ratio of 4.32, just over the default limit of 4, so the tips bevel until the limit is nudged up.
const STAR = { cx: 200, cy: 140, outer: 105, inner: 32, points: 5 };

// Smooth open S-curve; the `S` reflects the previous control point, so its middle has no corner and only its two ends matter.
const CURVE_PATH = "M40,200 C90,40 170,40 200,130 S300,230 360,70";

// Text subject placement — a heavy serif, since its sharp serifs show off joins far better than a geometric sans.
export const TEXT_SUBJECT = { x: 200, y: 180, fontSize: 124, fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 800 };

// Rounds for path data and readouts — two decimals is far below what a stroke can show.
export function fmt(value: number, decimals = 2): string {
  const rounded = Number(value.toFixed(decimals));
  return Object.is(rounded, -0) ? "0" : String(rounded);
}

// Polyline vertices into `d` — kept separate so the zig-zag and star share it.
function pointsToPath(points: Vec2[], closed: boolean): string {
  const body = points.map((p, i) => `${i === 0 ? "M" : "L"}${fmt(p.x)},${fmt(p.y)}`).join(" ");
  return closed ? `${body} Z` : body;
}

// Alternating outer/inner radii round a centre, starting at the top tip.
function starPoints(): Vec2[] {
  const { cx, cy, outer, inner, points } = STAR;
  return Array.from({ length: points * 2 }, (_, i) => {
    const angle = -Math.PI / 2 + (i * Math.PI) / points;
    const radius = i % 2 === 0 ? outer : inner;
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  });
}

/*
  Archimedean spiral turned into cubic Béziers through Catmull–Rom tangents, so it is genuinely
  smooth — a polyline would sprout dozens of near-flat "corners" and drown the seam gauge.
*/
function spiralPath(): string {
  const cx = 200;
  const cy = 132;
  const points: Vec2[] = [];
  for (let t = 0.6; t <= Math.PI * 5.6; t += 0.35) {
    const r = 6 + 6.6 * t;
    points.push({ x: cx + r * Math.cos(t), y: cy + r * 0.92 * Math.sin(t) });
  }
  let d = `M${fmt(points[0].x)},${fmt(points[0].y)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C${fmt(c1.x)},${fmt(c1.y)} ${fmt(c2.x)},${fmt(c2.y)} ${fmt(p2.x)},${fmt(p2.y)}`;
  }
  return d;
}

// Built-in subjects' path data, computed once at module load since none of them depend on state.
export const SUBJECT_PATHS: Record<"zigzag" | "star" | "spiral" | "curve", string> = {
  zigzag: pointsToPath(ZIGZAG_POINTS, false),
  star: pointsToPath(starPoints(), true),
  spiral: spiralPath(),
  curve: CURVE_PATH
};

// Builds what the stage and exports draw; a custom path's viewBox is fitted to its own bounds (plus room for the stroke) so any coordinate range lands in view.
export function getSubjectGeometry(state: StrokeLabEditorState, analysis: PathAnalysis): SubjectGeometry {
  if (state.subject === "text") {
    return { kind: "text", text: state.text, viewBox: STAGE_VIEWBOX, x: TEXT_SUBJECT.x, y: TEXT_SUBJECT.y, fontSize: TEXT_SUBJECT.fontSize };
  }
  if (state.subject === "custom") {
    const b = analysis.bounds;
    if (!b) return { kind: "path", d: state.customPath, viewBox: STAGE_VIEWBOX };
    const pad = Math.max(16, state.strokeWidth * 1.5);
    const width = Math.max(1, b.maxX - b.minX) + pad * 2;
    const height = Math.max(1, b.maxY - b.minY) + pad * 2;
    return { kind: "path", d: state.customPath, viewBox: `${fmt(b.minX - pad)} ${fmt(b.minY - pad)} ${fmt(width)} ${fmt(height)}` };
  }
  return { kind: "path", d: SUBJECT_PATHS[state.subject], viewBox: STAGE_VIEWBOX };
}

// The viewBox centre, which the scale demo scales about so the subject grows in place rather than off the top-left.
export function viewBoxCentre(viewBox: string): Vec2 {
  const [x, y, w, h] = viewBox.split(/\s+/).map(Number);
  return { x: x + w / 2, y: y + h / 2 };
}

/* ------------------------------------------------------------------ */
/* Vector maths                                                        */
/* ------------------------------------------------------------------ */

// Below this a length counts as zero — path data is rarely more precise than a hundredth of a unit.
const EPSILON = 1e-6;

// Smaller turns than this are treated as smooth — Catmull–Rom joins and `S` reflections land a hair off exact.
const SMOOTH_TURN_DEGREES = 2;

// The basic vector helpers the corner and cap maths are written in.
const sub = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x - b.x, y: a.y - b.y });
const add = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x + b.x, y: a.y + b.y });
const scale = (a: Vec2, k: number): Vec2 => ({ x: a.x * k, y: a.y * k });
const dot = (a: Vec2, b: Vec2): number => a.x * b.x + a.y * b.y;
const length = (a: Vec2): number => Math.hypot(a.x, a.y);

// Unit vector, or the zero vector for a degenerate input so callers can test for "no direction".
function normalise(a: Vec2): Vec2 {
  const len = length(a);
  return len < EPSILON ? { x: 0, y: 0 } : { x: a.x / len, y: a.y / len };
}

// True when a tangent is the zero vector — a degenerate segment with nothing to join.
function isZero(a: Vec2): boolean {
  return Math.abs(a.x) < EPSILON && Math.abs(a.y) < EPSILON;
}

// The first candidate direction that isn't zero — how a Bézier's end tangent survives a control point sitting on its endpoint.
function firstDirection(candidates: Vec2[]): Vec2 {
  for (const candidate of candidates) {
    const n = normalise(candidate);
    if (!isZero(n)) return n;
  }
  return { x: 0, y: 0 };
}

// Exposed so the stage can place overlay geometry with the same arithmetic the analysis used.
export const vec = { sub, add, scale, dot, length, normalise };

/* ------------------------------------------------------------------ */
/* Path data parsing                                                   */
/* ------------------------------------------------------------------ */

// How many numbers each command consumes per repetition.
const COMMAND_ARITY: Record<string, number> = { m: 2, l: 2, h: 1, v: 1, c: 6, s: 4, q: 4, t: 2, a: 7, z: 0 };

// Arc samples per segment when estimating bounds — enough that a fitted custom path's arcs never poke out of view.
const ARC_SAMPLES = 16;

/*
  Cursor-based scanner rather than a split-on-regex tokeniser, because arc flags may be written with
  no separator at all (`a5 5 0 105 5` is two flags then 5) and only a reader that knows it wants a
  single 0/1 digit at that position can tell.
*/
function createScanner(d: string) {
  let index = 0;
  const numberPattern = /[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/y;

  const skip = () => {
    while (index < d.length && /[\s,]/.test(d[index])) index++;
  };

  return {
    done: () => {
      skip();
      return index >= d.length;
    },
    command: (): string | null => {
      skip();
      const char = d[index];
      if (char && /[MmLlHhVvCcSsQqTtAaZz]/.test(char)) {
        index++;
        return char;
      }
      return null;
    },
    number: (): number | null => {
      skip();
      numberPattern.lastIndex = index;
      const match = numberPattern.exec(d);
      if (!match) return null;
      index = numberPattern.lastIndex;
      return parseFloat(match[0]);
    },
    flag: (): number | null => {
      skip();
      const char = d[index];
      if (char === "0" || char === "1") {
        index++;
        return Number(char);
      }
      return null;
    },
    position: () => index
  };
}

// A straight segment's tangents are just its direction, at both ends.
function lineSegment(from: Vec2, to: Vec2): PathSegment {
  const t = normalise(sub(to, from));
  return { from, to, startTangent: t, endTangent: t };
}

// Cubic Bézier tangents, falling back along the control polygon when a control point coincides with its endpoint.
function cubicSegment(p0: Vec2, c1: Vec2, c2: Vec2, p3: Vec2): PathSegment {
  return {
    from: p0,
    to: p3,
    startTangent: firstDirection([sub(c1, p0), sub(c2, p0), sub(p3, p0)]),
    endTangent: firstDirection([sub(p3, c2), sub(p3, c1), sub(p3, p0)])
  };
}

// Quadratic Bézier tangents, with the same coincident-control fallback.
function quadSegment(p0: Vec2, c: Vec2, p2: Vec2): PathSegment {
  return { from: p0, to: p2, startTangent: firstDirection([sub(c, p0), sub(p2, p0)]), endTangent: firstDirection([sub(p2, c), sub(p2, p0)]) };
}

// Signed angle from u to v, the building block of the SVG spec's arc endpoint-to-centre conversion.
function vectorAngle(u: Vec2, v: Vec2): number {
  return Math.atan2(u.x * v.y - u.y * v.x, u.x * v.x + u.y * v.y);
}

/*
  Elliptical arc via the SVG spec's endpoint → centre conversion (Implementation Notes B.2.4),
  which is the only way to get true tangents at the ends — the chord direction is wrong for any
  arc deeper than a sliver. Returns sample points too, for bounds.
*/
function arcSegment(from: Vec2, rxIn: number, ryIn: number, rotation: number, largeArc: number, sweep: number, to: Vec2): { segment: PathSegment; samples: Vec2[] } {
  let rx = Math.abs(rxIn);
  let ry = Math.abs(ryIn);
  if (rx < EPSILON || ry < EPSILON) return { segment: lineSegment(from, to), samples: [] };

  const phi = (rotation * Math.PI) / 180;
  const cos = Math.cos(phi);
  const sin = Math.sin(phi);
  const dx = (from.x - to.x) / 2;
  const dy = (from.y - to.y) / 2;
  const x1 = cos * dx + sin * dy;
  const y1 = -sin * dx + cos * dy;

  const lambda = (x1 * x1) / (rx * rx) + (y1 * y1) / (ry * ry);
  if (lambda > 1) {
    rx *= Math.sqrt(lambda);
    ry *= Math.sqrt(lambda);
  }

  const numerator = rx * rx * ry * ry - rx * rx * y1 * y1 - ry * ry * x1 * x1;
  const denominator = rx * rx * y1 * y1 + ry * ry * x1 * x1;
  const coef = (largeArc !== sweep ? 1 : -1) * Math.sqrt(Math.max(0, numerator / (denominator || 1)));
  const cxp = (coef * rx * y1) / ry;
  const cyp = (-coef * ry * x1) / rx;
  const cx = cos * cxp - sin * cyp + (from.x + to.x) / 2;
  const cy = sin * cxp + cos * cyp + (from.y + to.y) / 2;

  const theta1 = vectorAngle({ x: 1, y: 0 }, { x: (x1 - cxp) / rx, y: (y1 - cyp) / ry });
  let delta = vectorAngle({ x: (x1 - cxp) / rx, y: (y1 - cyp) / ry }, { x: (-x1 - cxp) / rx, y: (-y1 - cyp) / ry });
  if (!sweep && delta > 0) delta -= Math.PI * 2;
  if (sweep && delta < 0) delta += Math.PI * 2;

  const direction = Math.sign(delta) || 1;
  const tangentAt = (theta: number): Vec2 =>
    normalise(scale({ x: -rx * cos * Math.sin(theta) - ry * sin * Math.cos(theta), y: -rx * sin * Math.sin(theta) + ry * cos * Math.cos(theta) }, direction));
  const pointAt = (theta: number): Vec2 => ({
    x: cx + rx * cos * Math.cos(theta) - ry * sin * Math.sin(theta),
    y: cy + rx * sin * Math.cos(theta) + ry * cos * Math.sin(theta)
  });

  const samples = Array.from({ length: ARC_SAMPLES + 1 }, (_, i) => pointAt(theta1 + (delta * i) / ARC_SAMPLES));
  return { segment: { from, to, startTangent: tangentAt(theta1), endTangent: tangentAt(theta1 + delta) }, samples };
}

// Reflection of a control point through the current point — how S and T continue a curve smoothly.
function reflect(control: Vec2, about: Vec2): Vec2 {
  return { x: 2 * about.x - control.x, y: 2 * about.y - control.y };
}

/*
  Parses SVG path data into subpaths of tangent-carrying segments. Handles every command in both
  cases, implicit repeats, implicit lineto after moveto, and S/T reflections; reports the first
  problem in plain words rather than throwing, since the input is whatever someone pasted.
*/
export function parsePathData(d: string): { subpaths: Subpath[]; hull: Vec2[]; error: string | null } {
  const scanner = createScanner(d);
  const subpaths: Subpath[] = [];
  const hull: Vec2[] = [];
  let current: Subpath | null = null;
  let point: Vec2 = { x: 0, y: 0 };
  let start: Vec2 = { x: 0, y: 0 };
  let lastControl: Vec2 | null = null;
  let lastCommand = "";
  let command: string | null = null;

  if (!d.trim()) return { subpaths, hull, error: "The path is empty — type some path data, starting with M." };

  // Starts a fresh subpath at the current point when drawing resumes after a Z without a new M.
  const ensureSubpath = (): Subpath => {
    if (!current || current.closed) {
      current = { start: point, segments: [], closed: false };
      start = point;
      subpaths.push(current);
    }
    return current;
  };

  while (!scanner.done()) {
    const letter = scanner.command();
    if (letter) command = letter;
    else if (!command) return { subpaths, hull, error: "Path data must start with a moveto command (M or m)." };
    else if (command === "z" || command === "Z") return { subpaths, hull, error: `Unexpected number at character ${scanner.position() + 1} — Z takes no numbers.` };

    const lower: string = command.toLowerCase();
    const relative: boolean = command !== command.toUpperCase();
    if (subpaths.length === 0 && lower !== "m") return { subpaths, hull, error: "Path data must start with a moveto command (M or m)." };

    if (lower === "z") {
      const open = current as Subpath | null;
      if (open && !open.closed) {
        if (length(sub(point, start)) > EPSILON) open.segments.push(lineSegment(point, start));
        open.closed = true;
      }
      point = start;
      lastControl = null;
      lastCommand = "z";
      continue;
    }

    const values: number[] = [];
    for (let i = 0; i < COMMAND_ARITY[lower]; i++) {
      const value = lower === "a" && (i === 3 || i === 4) ? scanner.flag() : scanner.number();
      if (value === null) return { subpaths, hull, error: `${command} needs ${COMMAND_ARITY[lower]} numbers — ran out at character ${scanner.position() + 1}.` };
      values.push(value);
    }

    const origin = relative ? point : { x: 0, y: 0 };
    const at = (i: number): Vec2 => ({ x: origin.x + values[i], y: origin.y + values[i + 1] });

    if (lower === "m") {
      point = at(0);
      start = point;
      current = { start: point, segments: [], closed: false };
      subpaths.push(current);
      hull.push(point);
      lastControl = null;
      // Any further pairs after a moveto are implicit linetos, in the same case.
      command = relative ? "l" : "L";
      lastCommand = "m";
      continue;
    }

    const subpath = ensureSubpath();
    let next: Vec2;

    if (lower === "l" || lower === "h" || lower === "v") {
      if (lower === "l") next = at(0);
      else if (lower === "h") next = { x: relative ? point.x + values[0] : values[0], y: point.y };
      else next = { x: point.x, y: relative ? point.y + values[0] : values[0] };
      subpath.segments.push(lineSegment(point, next));
      lastControl = null;
    } else if (lower === "c" || lower === "s") {
      const c1: Vec2 = lower === "c" ? at(0) : lastControl && (lastCommand === "c" || lastCommand === "s") ? reflect(lastControl, point) : point;
      const c2 = lower === "c" ? at(2) : at(0);
      next = lower === "c" ? at(4) : at(2);
      subpath.segments.push(cubicSegment(point, c1, c2, next));
      hull.push(c1, c2);
      lastControl = c2;
    } else if (lower === "q" || lower === "t") {
      const c: Vec2 = lower === "q" ? at(0) : lastControl && (lastCommand === "q" || lastCommand === "t") ? reflect(lastControl, point) : point;
      next = lower === "q" ? at(2) : at(0);
      subpath.segments.push(quadSegment(point, c, next));
      hull.push(c);
      lastControl = c;
    } else {
      next = at(5);
      const { segment, samples } = arcSegment(point, values[0], values[1], values[2], values[3], values[4], next);
      if (length(sub(next, point)) > EPSILON) subpath.segments.push(segment);
      hull.push(...samples);
      lastControl = null;
    }

    hull.push(next);
    point = next;
    lastCommand = lower;
  }

  return { subpaths, hull, error: null };
}

/* ------------------------------------------------------------------ */
/* Corners, ends and the miter ratio                                   */
/* ------------------------------------------------------------------ */

// A, B, … Z, A2, B2 … — short enough to print beside a corner without crowding it.
function cornerLabel(index: number): string {
  const letter = String.fromCharCode(65 + (index % 26));
  return index < 26 ? letter : `${letter}${Math.floor(index / 26) + 1}`;
}

// Caps on how many corners get analysed and annotated, so a pasted 2,000-node path can't freeze the stage.
const MAX_CORNERS = 80;

// The miter ratio for an interior angle: miter length ÷ stroke-width = 1 / sin(θ / 2), as in the MiterLimitDiagram.
export function miterRatio(angleDegrees: number): number {
  const half = (angleDegrees * Math.PI) / 360;
  const s = Math.sin(half);
  return s < EPSILON ? Infinity : 1 / s;
}

// The sharpest interior angle a given limit still allows as a full miter: θ = 2·asin(1 / limit).
export function limitAngle(miterLimit: number): number {
  return (2 * Math.asin(Math.min(1, 1 / Math.max(1, miterLimit))) * 180) / Math.PI;
}

// One join between an arriving and a departing tangent, or null when the path carries straight on (no corner to stroke).
function makeCorner(index: number, point: Vec2, tangentIn: Vec2, tangentOut: Vec2): StrokeCorner | null {
  const cosTurn = Math.max(-1, Math.min(1, dot(tangentIn, tangentOut)));
  const turn = (Math.acos(cosTurn) * 180) / Math.PI;
  if (turn < SMOOTH_TURN_DEGREES) return null;
  const angle = 180 - turn;
  const bisector = normalise(sub(tangentIn, tangentOut));
  const orient = (t: Vec2): Vec2 => {
    const n = { x: -t.y, y: t.x };
    return dot(n, bisector) < 0 ? scale(n, -1) : n;
  };
  return { id: cornerLabel(index), point, angle, ratio: miterRatio(angle), bisector, inNormal: orient(tangentIn), outNormal: orient(tangentOut) };
}

/*
  Turns parsed subpaths into the two things strokes care about: corners (where joins and the miter
  limit apply) and open ends (where caps apply). A closed subpath also joins its last segment back
  to its first, and has no ends.
*/
export function analysePath(d: string): PathAnalysis {
  const { subpaths, hull, error } = parsePathData(d);
  const corners: StrokeCorner[] = [];
  const ends: PathEnd[] = [];

  subpaths.forEach((subpath, s) => {
    const segments = subpath.segments.filter((seg) => !isZero(seg.startTangent) && !isZero(seg.endTangent));
    if (segments.length === 0) return;

    const pairs: [PathSegment, PathSegment][] = [];
    for (let i = 0; i < segments.length - 1; i++) pairs.push([segments[i], segments[i + 1]]);
    if (subpath.closed && segments.length > 1) pairs.push([segments[segments.length - 1], segments[0]]);

    for (const [a, b] of pairs) {
      if (corners.length >= MAX_CORNERS) break;
      const corner = makeCorner(corners.length, a.to, a.endTangent, b.startTangent);
      if (corner) corners.push(corner);
    }

    if (!subpath.closed) {
      const first = segments[0];
      const last = segments[segments.length - 1];
      ends.push({ id: `start-${s}`, point: first.from, direction: scale(first.startTangent, -1) });
      ends.push({ id: `end-${s}`, point: last.to, direction: last.endTangent });
    }
  });

  const bounds =
    hull.length > 0
      ? {
          minX: Math.min(...hull.map((p) => p.x)),
          minY: Math.min(...hull.map((p) => p.y)),
          maxX: Math.max(...hull.map((p) => p.x)),
          maxY: Math.max(...hull.map((p) => p.y))
        }
      : null;

  return { ok: error === null, error, subpaths, corners, ends, bounds };
}

// The analysis for text — glyph outlines come from the font, so there is no geometry the lab can measure.
export const EMPTY_ANALYSIS: PathAnalysis = { ok: true, error: null, subpaths: [], corners: [], ends: [], bounds: null };

// The join a browser will actually draw — an unsupported SVG 2 keyword is dropped as invalid, leaving the initial value, miter.
export function effectiveLinejoin(linejoin: StrokeLinejoin, supported: Record<StrokeLinejoin, boolean>): StrokeLinejoin {
  return supported[linejoin] ? linejoin : "miter";
}

// What one corner ends up as under the effective join and limit — the seam gauge's verdict.
export function cornerVerdict(corner: StrokeCorner, linejoin: StrokeLinejoin, miterLimit: number): CornerVerdict {
  if (linejoin === "round") return "round";
  if (linejoin === "bevel") return "bevel";
  if (corner.ratio <= miterLimit) return "miter";
  return linejoin === "miter" ? "bevel" : "clipped";
}

// Outer stroke corners and miter tip for a corner at a stroke width — the spike the limit decides whether to draw.
export function miterSpike(corner: StrokeCorner, strokeWidth: number): { outerIn: Vec2; outerOut: Vec2; tip: Vec2 } {
  const half = strokeWidth / 2;
  const tipDistance = Number.isFinite(corner.ratio) ? (corner.ratio * strokeWidth) / 2 : strokeWidth * 50;
  return {
    outerIn: add(corner.point, scale(corner.inNormal, half)),
    outerOut: add(corner.point, scale(corner.outNormal, half)),
    tip: add(corner.point, scale(corner.bisector, tipDistance))
  };
}

/*
  The polygon SVG 2's miter-clip specifies once the limit is exceeded: the miter is cut square
  across its bisector at limit × w/2 from the vertex, instead of falling all the way back to a bevel.
*/
export function miterClipPolygon(corner: StrokeCorner, strokeWidth: number, miterLimit: number): Vec2[] {
  const { outerIn, outerOut, tip } = miterSpike(corner, strokeWidth);
  const clipDistance = (miterLimit * strokeWidth) / 2;
  const along = (p: Vec2) => dot(sub(p, corner.point), corner.bisector);
  const cut = (p: Vec2): Vec2 => {
    const from = along(p);
    const to = along(tip);
    const t = to - from < EPSILON ? 0 : Math.max(0, Math.min(1, (clipDistance - from) / (to - from)));
    return add(p, scale(sub(tip, p), t));
  };
  return [outerIn, cut(outerIn), cut(outerOut), outerOut];
}

// Points to an SVG `points` attribute.
export function toPoints(points: Vec2[]): string {
  return points.map((p) => `${fmt(p.x)},${fmt(p.y)}`).join(" ");
}

/* ------------------------------------------------------------------ */
/* Dashes                                                              */
/* ------------------------------------------------------------------ */

// The pattern a renderer actually repeats — an odd-length list is repeated once to make it even, so `5 3 2` stitches as `5 3 2 5 3 2`.
export function effectiveDashes(dashes: number[]): number[] {
  return dashes.length % 2 === 1 ? [...dashes, ...dashes] : dashes;
}

// One full repeat of the effective pattern, in user units — the distance a march has to travel to loop seamlessly.
export function dashPatternLength(dashes: number[]): number {
  return effectiveDashes(dashes).reduce((sum, n) => sum + n, 0);
}

// An all-zero or empty list draws a solid line — the dasharray is ignored outright rather than drawing nothing.
export function dashesAreActive(dashes: number[]): boolean {
  return dashes.length > 0 && dashPatternLength(dashes) > 0;
}

// The stroke-dasharray value as written, `none` when there's nothing to stitch.
export function dashArrayValue(dashes: number[]): string {
  return dashesAreActive(dashes) ? dashes.map((n) => fmt(n)).join(" ") : "none";
}

// Seconds for one full pattern repeat at the march speed — floored so a tiny pattern doesn't strobe.
export function marchDuration(dashes: number[], speed: number): number {
  return Math.max(0.2, dashPatternLength(dashes) / Math.max(1, speed));
}

/*
  Lays the effective pattern end to end for the measuring tape. Dash and gap roles alternate through
  the doubled list, so an odd list's repeat starts on a gap where the original started on a dash —
  which is exactly why the doubling rule exists, and why the tape marks the repeat.
*/
export function tapeSegments(dashes: number[]): TapeSegment[] {
  const pattern = effectiveDashes(dashes);
  let start = 0;
  return pattern.map((length, i) => {
    const segment: TapeSegment = { kind: i % 2 === 0 ? "dash" : "gap", length, start, repeat: i >= dashes.length };
    start += length;
    return segment;
  });
}

// A 1–2–5 tick spacing that keeps tape ticks at least `minGap` units apart at the current zoom.
export function niceTickStep(minGap: number): number {
  const magnitude = 10 ** Math.floor(Math.log10(Math.max(minGap, 0.001)));
  for (const multiple of [1, 2, 5, 10]) {
    if (multiple * magnitude >= minGap) return multiple * magnitude;
  }
  return 10 * magnitude;
}

/* ------------------------------------------------------------------ */
/* Draw-on timing                                                      */
/* ------------------------------------------------------------------ */

// Named timing functions for the draw-on export; each is valid in CSS, the SVG <style> and WAAPI alike.
export const DRAW_ON_EASINGS: Record<string, { label: string; css: string }> = {
  "ease-in-out": { label: "Ease in-out", css: "ease-in-out" },
  linear: { label: "Linear", css: "linear" },
  ease: { label: "Ease", css: "ease" },
  "ease-in": { label: "Ease in", css: "ease-in" },
  "ease-out": { label: "Ease out", css: "ease-out" },
  "needle-pull": { label: "Needle pull", css: "cubic-bezier(0.65, 0, 0.35, 1)" },
  "stitch-by-stitch": { label: "Stitch by stitch", css: "steps(14, end)" }
};

// Falls back to ease-in-out so a stale preset key can never emit an invalid timing function.
export function drawOnEasing(key: string): string {
  return (DRAW_ON_EASINGS[key] ?? DRAW_ON_EASINGS["ease-in-out"]).css;
}

// pathLength can't go on <text>, so text draws against a generous fixed length instead — honest about being an estimate.
export const TEXT_DRAW_LENGTH = 600;

// The `animation` shorthand for a draw-on run, in the spec's canonical order.
export function drawOnAnimation(settings: DrawOnSettings, name = "draw-on"): string {
  const iterations = settings.loop === "once" ? "1" : "infinite";
  const direction = settings.loop === "alternate" ? "alternate" : "normal";
  return `${name} ${fmt(settings.duration)}s ${drawOnEasing(settings.easing)} ${fmt(settings.delay)}s ${iterations} ${direction} ${settings.fill}`;
}

/* ------------------------------------------------------------------ */
/* Permalink                                                           */
/* ------------------------------------------------------------------ */

// Plain JSON → base64 → URL-safe character swap, the same encoding every goodie's permalink uses.
export function encodeShareableState(state: StrokeLabShareableState): string {
  const json = JSON.stringify(state);
  const base64 = btoa(unescape(encodeURIComponent(json)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Reverses encodeShareableState, returning null on any malformed value; the result is still untrusted and must be sanitised.
export function decodeShareableState(encoded: string): unknown {
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(base64)));
    return JSON.parse(json) as unknown;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Export snippets                                                     */
/* ------------------------------------------------------------------ */

// Markup-safe text for attribute values and element content.
export function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// The SVG 2 joins that need a fallback note wherever they're exported.
function isSvg2Join(linejoin: StrokeLinejoin): boolean {
  return linejoin === "miter-clip" || linejoin === "arcs";
}

/*
  The stroke properties worth writing out, as [css-property, value] pairs. Defaults are left out
  (offset 0, limit 4, opacity 1, paint-order normal) so a snippet only says what's different —
  except width, cap and join, which are the whole point of copying it.
*/
export function strokeDeclarations(state: StrokeLabEditorState): [string, string][] {
  const declarations: [string, string][] = [
    ["fill", state.fillEnabled ? state.fillColour : "none"],
    ["stroke", state.strokeColour],
    ["stroke-width", fmt(state.strokeWidth)]
  ];
  if (dashesAreActive(state.dashes)) declarations.push(["stroke-dasharray", dashArrayValue(state.dashes)]);
  if (dashesAreActive(state.dashes) && state.dashOffset !== 0) declarations.push(["stroke-dashoffset", fmt(state.dashOffset)]);
  declarations.push(["stroke-linecap", state.linecap], ["stroke-linejoin", state.linejoin]);
  if (state.miterLimit !== 4) declarations.push(["stroke-miterlimit", fmt(state.miterLimit)]);
  if (state.strokeOpacity !== 1) declarations.push(["stroke-opacity", fmt(state.strokeOpacity)]);
  if (state.paintOrder !== "normal") declarations.push(["paint-order", state.paintOrder]);
  if (state.nonScalingStroke) declarations.push(["vector-effect", "non-scaling-stroke"]);
  return declarations;
}

// kebab-case → camelCase for JSX props and style keys.
function camel(property: string): string {
  return property.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

// The subject element's own geometry attributes, before any stroke attributes.
function geometryAttributes(geometry: SubjectGeometry): string {
  if (geometry.kind === "path") return `d="${escapeXml(geometry.d)}"`;
  return `x="${geometry.x}" y="${geometry.y}" text-anchor="middle" font-family="${escapeXml(TEXT_SUBJECT.fontFamily)}" font-size="${geometry.fontSize}" font-weight="${TEXT_SUBJECT.fontWeight}"`;
}

// Opening and closing tags for the subject in markup, so path and text exports share every other line.
function elementTags(geometry: SubjectGeometry, attributes: string[], indent: string): string {
  const lines = attributes.map((a) => `${indent}  ${a}`).join("\n");
  return geometry.kind === "path" ? `${indent}<path\n${lines}\n${indent}/>` : `${indent}<text\n${lines}\n${indent}>${escapeXml(geometry.text)}</text>`;
}

// The current stroke as presentation attributes on a ready-to-paste <svg>.
export function toSvgAttributesSnippet(state: StrokeLabEditorState, geometry: SubjectGeometry): string {
  const attributes = [geometryAttributes(geometry), ...strokeDeclarations(state).map(([k, v]) => `${k}="${escapeXml(v)}"`)];
  const notes: string[] = [];
  if (isSvg2Join(state.linejoin)) notes.push(`  <!-- ${state.linejoin} is SVG 2: renderers that don't support it drop the attribute and fall back to miter. -->`);
  if (state.march) notes.push("  <!-- Marching ants need a CSS animation — see the CSS tab. -->");
  return [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${geometry.viewBox}">`, ...notes, elementTags(geometry, attributes, "  "), "</svg>"].join("\n");
}

// The current stroke as CSS properties, with the march animation and its reduced-motion opt-out when marching is on.
export function toCssSnippet(state: StrokeLabEditorState): string {
  const lines = strokeDeclarations(state).flatMap(([k, v]) => {
    if (k === "stroke-linejoin" && isSvg2Join(state.linejoin)) {
      return ["  stroke-linejoin: miter;", `  stroke-linejoin: ${v}; /* SVG 2 — ignored where unsupported, so the miter above wins */`];
    }
    return [`  ${k}: ${v};`];
  });
  const marching = state.march && dashesAreActive(state.dashes);
  if (marching) lines.push(`  animation: stitch-march ${fmt(marchDuration(state.dashes, state.marchSpeed))}s linear infinite;`);

  const blocks = [`.stitched {\n${lines.join("\n")}\n}`];
  if (marching) {
    const from = state.dashOffset;
    const to = from - dashPatternLength(state.dashes);
    blocks.push(
      `/* One full pattern repeat per loop, so the seam never jumps. */\n@keyframes stitch-march {\n  from {\n    stroke-dashoffset: ${fmt(from)};\n  }\n  to {\n    stroke-dashoffset: ${fmt(to)};\n  }\n}`,
      `@media (prefers-reduced-motion: reduce) {\n  .stitched {\n    animation: none;\n  }\n}`
    );
  }
  return blocks.join("\n\n");
}

// The current stroke as a JSX element — SVG 2 joins and paint-order go through style, since React's attribute types only know the SVG 1.1 keywords.
export function toJsxSnippet(state: StrokeLabEditorState, geometry: SubjectGeometry): string {
  const style: string[] = [];
  const props = strokeDeclarations(state).flatMap(([k, v]): string[] => {
    if (k === "stroke-linejoin" && isSvg2Join(state.linejoin)) {
      style.push(`strokeLinejoin: "${v}"`);
      return [];
    }
    const numeric = ["stroke-width", "stroke-dashoffset", "stroke-miterlimit", "stroke-opacity"].includes(k);
    return [numeric ? `${camel(k)}={${v}}` : `${camel(k)}="${v}"`];
  });
  if (style.length > 0) props.push(`style={{ ${style.join(", ")} }}`);
  const attributes =
    geometry.kind === "path"
      ? [`d="${escapeXml(geometry.d)}"`, ...props]
      : [`x={${geometry.x}}`, `y={${geometry.y}}`, `textAnchor="middle"`, `fontFamily="${TEXT_SUBJECT.fontFamily}"`, `fontSize={${geometry.fontSize}}`, `fontWeight={${TEXT_SUBJECT.fontWeight}}`, ...props];
  const body = attributes.map((a) => `    ${a}`).join("\n");
  const element = geometry.kind === "path" ? `  <path\n${body}\n  />` : `  <text\n${body}\n  >\n    {${JSON.stringify(geometry.text)}}\n  </text>`;
  return `<svg viewBox="${geometry.viewBox}" role="img" aria-label="Stitched outline">\n${element}\n</svg>`;
}

// The dash length and starting offset for the draw-on: exactly 1 on a pathLength="1" path, or the fixed estimate on text.
function drawOnLength(geometry: SubjectGeometry): number {
  return geometry.kind === "path" ? 1 : TEXT_DRAW_LENGTH;
}

// The draw-on rule block shared by the CSS and SVG variants.
function drawOnRules(state: StrokeLabEditorState, geometry: SubjectGeometry, indent: string): string {
  const total = drawOnLength(geometry);
  const lines = [
    `.draw-on {`,
    `  fill: none;`,
    `  stroke: ${state.strokeColour};`,
    `  stroke-width: ${fmt(state.strokeWidth)};`,
    `  stroke-linecap: ${state.linecap};`,
    `  stroke-linejoin: ${isSvg2Join(state.linejoin) ? "miter" : state.linejoin};`,
    `  stroke-dasharray: ${total};`,
    `  stroke-dashoffset: ${total};`,
    `  animation: ${drawOnAnimation(state.drawOn)};`,
    `}`,
    ``,
    `@keyframes draw-on {`,
    `  to {`,
    `    stroke-dashoffset: 0;`,
    `  }`,
    `}`,
    ``,
    `/* Skip the motion and show the finished line, not the hidden starting state. */`,
    `@media (prefers-reduced-motion: reduce) {`,
    `  .draw-on {`,
    `    animation: none;`,
    `    stroke-dashoffset: 0;`,
    `  }`,
    `}`
  ];
  return lines.map((line) => (line ? `${indent}${line}` : line)).join("\n");
}

// The explanation that rides along with every path-based draw-on export.
const PATH_LENGTH_NOTE =
  'pathLength="1" makes the browser treat the path as exactly 1 unit long for every dash calculation, so a dasharray of 1 is one dash the length of the whole path and an offset of 1 hides it completely. No getTotalLength() call, and nothing goes stale when the path or viewBox changes.';

// pathLength isn't allowed on <text>, so its draw-on note admits the length is an estimate.
const TEXT_LENGTH_NOTE = `pathLength isn't allowed on <text>, so this draws against a fixed ${TEXT_DRAW_LENGTH}-unit dash. Convert the text to outlines (a <path>) for an exact draw.`;

// The draw-on line as a stylesheet plus the one attribute the markup needs.
export function toDrawOnCss(state: StrokeLabEditorState, geometry: SubjectGeometry): string {
  const markup = geometry.kind === "path" ? `<path class="draw-on" pathLength="1" d="…" />` : `<text class="draw-on" …>…</text>`;
  const note = geometry.kind === "path" ? PATH_LENGTH_NOTE : TEXT_LENGTH_NOTE;
  return `/*\n  Markup: ${markup}\n\n  ${note}\n*/\n${drawOnRules(state, geometry, "")}`;
}

// The draw-on line as a self-contained SVG file — an embedded <style> rather than SMIL, so the reduced-motion query still applies.
export function toDrawOnSvg(state: StrokeLabEditorState, geometry: SubjectGeometry): string {
  const attributes = geometry.kind === "path" ? [`class="draw-on"`, `pathLength="1"`, geometryAttributes(geometry)] : [`class="draw-on"`, geometryAttributes(geometry)];
  const note = geometry.kind === "path" ? PATH_LENGTH_NOTE : TEXT_LENGTH_NOTE;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${geometry.viewBox}" role="img" aria-label="A line drawing itself on">`,
    `  <!-- ${note} -->`,
    `  <style>`,
    drawOnRules(state, geometry, "    "),
    `  </style>`,
    elementTags(geometry, attributes, "  "),
    `</svg>`
  ].join("\n");
}

// The draw-on line as a React component driven by the Web Animations API, checking reduced motion before it ever starts.
export function toDrawOnReact(state: StrokeLabEditorState, geometry: SubjectGeometry): string {
  const total = drawOnLength(geometry);
  const { duration, delay, easing, fill, loop } = state.drawOn;
  const elementType = geometry.kind === "path" ? "SVGPathElement" : "SVGTextElement";
  const options = [
    `duration: ${Math.round(duration * 1000)}`,
    `delay: ${Math.round(delay * 1000)}`,
    `easing: "${drawOnEasing(easing)}"`,
    `fill: "${fill}"`,
    `iterations: ${loop === "once" ? 1 : "Infinity"}`,
    `direction: "${loop === "alternate" ? "alternate" : "normal"}"`
  ].join(",\n        ");
  const strokeProps = [
    `fill="none"`,
    `stroke="${state.strokeColour}"`,
    `strokeWidth={${fmt(state.strokeWidth)}}`,
    `strokeLinecap="${state.linecap}"`,
    `strokeLinejoin="${isSvg2Join(state.linejoin) ? "miter" : state.linejoin}"`,
    `strokeDasharray={${total}}`,
    `strokeDashoffset={${total}}`
  ];
  const element =
    geometry.kind === "path"
      ? [`      <path`, `        ref={ref}`, `        d="${escapeXml(geometry.d)}"`, `        pathLength={1}`, ...strokeProps.map((p) => `        ${p}`), `      />`]
      : [
          `      <text`,
          `        ref={ref}`,
          `        x={${geometry.x}}`,
          `        y={${geometry.y}}`,
          `        textAnchor="middle"`,
          `        fontFamily="${TEXT_SUBJECT.fontFamily}"`,
          `        fontSize={${geometry.fontSize}}`,
          `        fontWeight={${TEXT_SUBJECT.fontWeight}}`,
          ...strokeProps.map((p) => `        ${p}`),
          `      >`,
          `        {${JSON.stringify(geometry.text)}}`,
          `      </text>`
        ];
  const note = geometry.kind === "path" ? PATH_LENGTH_NOTE : TEXT_LENGTH_NOTE;
  return [
    `import { useEffect, useRef } from "react";`,
    ``,
    `/*`,
    `  ${note}`,
    `*/`,
    `export function DrawOn() {`,
    `  const ref = useRef<${elementType}>(null);`,
    ``,
    `  useEffect(() => {`,
    `    const element = ref.current;`,
    `    if (!element) return;`,
    `    // Reduced motion: skip straight to the finished line.`,
    `    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {`,
    `      element.style.strokeDashoffset = "0";`,
    `      return;`,
    `    }`,
    `    const animation = element.animate(`,
    `      [{ strokeDashoffset: ${total} }, { strokeDashoffset: 0 }],`,
    `      {`,
    `        ${options}`,
    `      }`,
    `    );`,
    `    return () => animation.cancel();`,
    `  }, []);`,
    ``,
    `  return (`,
    `    <svg viewBox="${geometry.viewBox}" role="img" aria-label="A line drawing itself on">`,
    ...element,
    `    </svg>`,
    `  );`,
    `}`
  ].join("\n");
}
