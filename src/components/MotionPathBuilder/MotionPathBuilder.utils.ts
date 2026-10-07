import { clamp, toFixed } from "@/utils/number";
import { solveBezierY } from "@/utils/bezier";
import { compilePathData, incomingControlPoint, outgoingControlPoint, pointOnCubicBezier } from "@/utils/svg-path";
import type {
  DraftVertex,
  MotionPathBezier,
  MotionPathDirection,
  MotionPathEasingKeyword,
  MotionPathEditorState,
  MotionPathFlattened,
  MotionPathGlyph,
  MotionPathGlyphShape,
  MotionPathParseResult,
  MotionPathPoint,
  MotionPathSample,
  MotionPathVertex
} from "@/components/MotionPathBuilder/MotionPathBuilder.types";

// The baseboard's drawing space — small enough that an exported offset-path still fits a typical content column at 1:1.
export const STAGE_WIDTH = 480;
export const STAGE_HEIGHT = 300;

// Every glyph is drawn nose-to-the-right in this box, so `offset-rotate: auto` points it along the track without a correction angle.
export const GLYPH_WIDTH = 48;
export const GLYPH_HEIGHT = 28;

// Keyframe name used by every export — descriptive enough to survive being pasted into a larger stylesheet.
export const KEYFRAMES_NAME = "follow-track";

// Each CSS timing keyword as the cubic-bezier it is defined to be, so the curve preview and SMIL's keySplines can both draw it.
export const EASING_BEZIERS: Record<Exclude<MotionPathEasingKeyword, "custom">, MotionPathBezier> = {
  linear: [0, 0, 1, 1],
  ease: [0.25, 0.1, 0.25, 1],
  "ease-in": [0.42, 0, 1, 1],
  "ease-out": [0, 0, 0.58, 1],
  "ease-in-out": [0.42, 0, 0.58, 1]
};

// Human names for the rolling-stock picker and the moving element's accessible label.
export const GLYPH_LABELS: Record<MotionPathGlyph, string> = {
  loco: "Locomotive",
  arrow: "Arrow",
  plane: "Plane",
  dot: "Dot",
  car: "Car",
  custom: "Custom"
};

/*
  Each glyph as a handful of primitives in the 48 × 28 box rather than an icon component, so the
  preview, the SMIL export and the React export all draw exactly the same silhouette from one source.
*/
export const GLYPH_SHAPES: Record<Exclude<MotionPathGlyph, "custom">, MotionPathGlyphShape[]> = {
  loco: [
    { tag: "rect", attrs: { x: 15, y: 8, width: 25, height: 12, rx: 3 } },
    { tag: "rect", attrs: { x: 4, y: 3, width: 13, height: 17, rx: 1.5 } },
    { tag: "rect", attrs: { x: 32, y: 2, width: 5, height: 7, rx: 1 } },
    { tag: "path", attrs: { d: "M40 18 L46 24 L40 24 Z" } },
    { tag: "rect", attrs: { x: 7, y: 6, width: 7, height: 6, rx: 1 }, detail: true },
    { tag: "circle", attrs: { cx: 10, cy: 22, r: 5 }, detail: true },
    { tag: "circle", attrs: { cx: 24, cy: 23, r: 4 }, detail: true },
    { tag: "circle", attrs: { cx: 35, cy: 23, r: 4 }, detail: true }
  ],
  arrow: [{ tag: "path", attrs: { d: "M3 10 H29 V3 L46 14 L29 25 V18 H3 Z" } }],
  plane: [
    {
      tag: "path",
      attrs: {
        d: "M46 14 C46 12.2 44.4 11.5 42 11.5 H30 L20 2 H15 L21 11.5 H10 L6.5 6 H3 L5 14 L3 22 H6.5 L10 16.5 H21 L15 26 H20 L30 16.5 H42 C44.4 16.5 46 15.8 46 14 Z"
      }
    }
  ],
  dot: [
    { tag: "circle", attrs: { cx: 24, cy: 14, r: 11 } },
    { tag: "circle", attrs: { cx: 29, cy: 14, r: 4 }, detail: true }
  ],
  car: [
    { tag: "path", attrs: { d: "M4 19 V13 C4 11.5 5 10.5 6.5 10.5 H13 L18 4.5 H31 L37 10.5 H42 C44 10.5 45 11.5 45 13 V19 Z" } },
    { tag: "path", attrs: { d: "M19.5 6.5 H24 V10.5 H16.2 Z M26 6.5 H30.2 L34 10.5 H26 Z" }, detail: true },
    { tag: "circle", attrs: { cx: 13, cy: 20, r: 4.5 }, detail: true },
    { tag: "circle", attrs: { cx: 36, cy: 20, r: 4.5 }, detail: true }
  ]
};

// Opacity applied to a glyph's detail parts — light enough to read as wheels and windows, heavy enough to stay visible on felt.
export const GLYPH_DETAIL_OPACITY = 0.55;

// Curves are flattened into this many chords each — plenty for ghost markers to sit on the rail by eye, cheap enough to redo on every drag frame.
const FLATTEN_STEPS = 32;

// Margin left round a pasted path when it has to be scaled down to fit the baseboard.
const FIT_MARGIN = 24;

// Hard ceiling on pasted pins — a traced logo with hundreds of nodes would make the editor unusable and the permalink enormous.
const MAX_PARSED_VERTICES = 120;

// Rounds for display and export: two decimals is sub-pixel precise without float noise like 0.30000000000000004.
export function formatNumber(value: number, decimals = 2): string {
  return String(toFixed(value, decimals));
}

// Pins can't leave the baseboard — a drag reporting a pointer outside it would otherwise lay track off the edge of the table.
export function clampToStage(point: MotionPathPoint): MotionPathPoint {
  return { x: clamp(point.x, 0, STAGE_WIDTH), y: clamp(point.y, 0, STAGE_HEIGHT) };
}

// The track's `d` string, built by the SVG Path Generator's own compiler so both tools agree on how a mixed straight/curve vertex list is written.
export function buildPathData(vertices: MotionPathVertex[], closed: boolean): string {
  return compilePathData(vertices, closed);
}

// The timing function as CSS writes it — a keyword when one is chosen, otherwise the explicit cubic-bezier().
export function resolveEasingCss(easing: MotionPathEasingKeyword, bezier: MotionPathBezier): string {
  if (easing !== "custom") return easing;
  return `cubic-bezier(${bezier.map((n) => formatNumber(n)).join(", ")})`;
}

// The control points actually in force, so a keyword and its equivalent cubic-bezier always draw the same curve.
export function resolveBezier(easing: MotionPathEasingKeyword, bezier: MotionPathBezier): MotionPathBezier {
  return easing === "custom" ? bezier : EASING_BEZIERS[easing];
}

// Eased progress for a time fraction, using the same solver the Easing Curve Editor runs — keeps ghost markers bunching exactly where the browser slows down.
export function easeProgress(t: number, bezier: MotionPathBezier): number {
  return solveBezierY(t, [bezier[0], bezier[1]], [bezier[2], bezier[3]]);
}

// The offset-rotate value — CSS spells "follow the tangent backwards" as `reverse`, not `auto reverse`.
export function resolveOffsetRotate(state: Pick<MotionPathEditorState, "rotateMode" | "rotateAngle">): string {
  if (state.rotateMode === "auto") return "auto";
  if (state.rotateMode === "auto-reverse") return "reverse";
  return `${formatNumber(state.rotateAngle, 1)}deg`;
}

// The heading the element actually shows at a point whose tangent is `tangent` degrees — what ghost markers draw.
export function resolveHeading(tangent: number, state: Pick<MotionPathEditorState, "rotateMode" | "rotateAngle">): number {
  if (state.rotateMode === "auto") return tangent;
  if (state.rotateMode === "auto-reverse") return tangent + 180;
  return state.rotateAngle;
}

// How long the scrubber's timeline is, in ms — an endless run scrubs over one full cycle (two legs when it alternates).
export function timelineMs(state: Pick<MotionPathEditorState, "delay" | "duration" | "iterations" | "infinite" | "direction">): number {
  const cycles = state.infinite ? (state.direction === "alternate" ? 2 : 1) : state.iterations;
  return (state.delay + state.duration * cycles) * 1000;
}

/*
  Flattens the track into a polyline with cumulative lengths. Ghost markers and direction
  chevrons need points at equal fractions of the journey, which no Bézier gives you directly —
  arc length has no closed form, so sampling chords is the honest approximation (and the same one
  browsers make internally for offset-distance).
*/
export function flattenPath(vertices: MotionPathVertex[], closed: boolean): MotionPathFlattened {
  if (vertices.length === 0) return { points: [], lengths: [], total: 0 };

  const points: MotionPathPoint[] = [vertices[0].point];
  const lengths = [0];
  let total = 0;
  const edgeCount = closed ? vertices.length : vertices.length - 1;

  for (let i = 0; i < edgeCount; i++) {
    const current = vertices[i];
    const next = vertices[(i + 1) % vertices.length];
    const c1 = outgoingControlPoint(current);
    const c2 = incomingControlPoint(next);
    const steps = current.type === "straight" && next.type === "straight" ? 1 : FLATTEN_STEPS;

    for (let s = 1; s <= steps; s++) {
      const point = pointOnCubicBezier(current.point, c1, c2, next.point, s / steps);
      const previous = points[points.length - 1];
      total += Math.hypot(point.x - previous.x, point.y - previous.y);
      points.push(point);
      lengths.push(total);
    }
  }

  return { points, lengths, total };
}

// The point and tangent heading a given fraction of the way along the track — a binary search over the running lengths keeps it cheap for dozens of calls per frame.
export function pointAtFraction(flat: MotionPathFlattened, fraction: number): MotionPathSample {
  const { points, lengths, total } = flat;
  if (points.length === 0) return { x: 0, y: 0, angle: 0 };
  if (points.length === 1 || total === 0) return { ...points[0], angle: 0 };

  const target = clamp(fraction, 0, 1) * total;
  let lo = 1;
  let hi = lengths.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (lengths[mid] < target) lo = mid + 1;
    else hi = mid;
  }

  const a = points[lo - 1];
  const b = points[lo];
  const span = lengths[lo] - lengths[lo - 1];
  const t = span > 0 ? (target - lengths[lo - 1]) / span : 0;
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    angle: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI
  };
}

// offset-distance wraps round a closed path but clamps on an open one — mirrored here so the ghosts match what the browser will do.
export function distanceToFraction(percent: number, closed: boolean): number {
  if (!closed) return clamp(percent / 100, 0, 1);
  return (((percent % 100) + 100) % 100) / 100;
}

/*
  Ghost trail: where the element will be at evenly spaced moments of one forward run. Spacing by
  time rather than distance is the point — markers crowd together where the easing dawdles and
  spread out where it hurries, so the timing is visible on the track without pressing play.
*/
export function ghostTrail(flat: MotionPathFlattened, state: MotionPathEditorState, count = 7): MotionPathSample[] {
  const bezier = resolveBezier(state.easing, state.bezier);
  return Array.from({ length: count }, (_, i) => {
    const progress = easeProgress(i / (count - 1), bezier);
    const percent = state.startDistance + (state.endDistance - state.startDistance) * progress;
    const sample = pointAtFraction(flat, distanceToFraction(percent, state.closed));
    return { ...sample, angle: resolveHeading(sample.angle, state) };
  });
}

// Chevrons painted along the track at a steady spacing, pointing the way offset-distance counts up.
export function directionMarkers(flat: MotionPathFlattened, spacing = 64): MotionPathSample[] {
  if (flat.total < spacing / 2) return [];
  const markers: MotionPathSample[] = [];
  for (let distance = spacing / 2; distance < flat.total; distance += spacing) {
    markers.push(pointAtFraction(flat, distance / flat.total));
  }
  return markers;
}

// Commands and numbers in one pass; numbers like "1.5.5" split into 1.5 and .5, which is how browsers read them too.
const PATH_TOKEN_PATTERN = /[MmLlHhVvCcSsQqTtZzAa]|[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/g;

// How many numbers each command consumes per repetition.
const PARAM_COUNTS: Record<string, number> = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7 };

// Mirror of a control point through an anchor — what S and T use to continue the previous curve smoothly.
function reflect(point: MotionPathPoint, centre: MotionPathPoint): MotionPathPoint {
  return { x: 2 * centre.x - point.x, y: 2 * centre.y - point.y };
}

// Signed angle between two vectors, in radians — the building block of the SVG spec's arc centre parameterisation.
function vectorAngle(ux: number, uy: number, vx: number, vy: number): number {
  return Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
}

/*
  Converts an elliptical arc into cubic Béziers (SVG 1.1 appendix F.6.5 endpoint-to-centre
  conversion, then quarter-turn pieces). The pin model only knows cubics, and offset-path follows
  an arc no differently from its cubic approximation, so nothing is lost in the motion.
*/
function arcToCubics(
  from: MotionPathPoint,
  rxIn: number,
  ryIn: number,
  rotation: number,
  largeArc: boolean,
  sweep: boolean,
  to: MotionPathPoint
): [MotionPathPoint, MotionPathPoint, MotionPathPoint][] {
  let rx = Math.abs(rxIn);
  let ry = Math.abs(ryIn);
  if (rx === 0 || ry === 0) return [[from, to, to]];

  const phi = (rotation * Math.PI) / 180;
  const cos = Math.cos(phi);
  const sin = Math.sin(phi);
  const dx = (from.x - to.x) / 2;
  const dy = (from.y - to.y) / 2;
  const x1p = cos * dx + sin * dy;
  const y1p = -sin * dx + cos * dy;

  const lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lambda > 1) {
    rx *= Math.sqrt(lambda);
    ry *= Math.sqrt(lambda);
  }

  const numerator = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
  const denominator = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
  let coefficient = denominator === 0 ? 0 : Math.sqrt(Math.max(0, numerator / denominator));
  if (largeArc === sweep) coefficient = -coefficient;
  const cxp = (coefficient * rx * y1p) / ry;
  const cyp = (-coefficient * ry * x1p) / rx;
  const cx = cos * cxp - sin * cyp + (from.x + to.x) / 2;
  const cy = sin * cxp + cos * cyp + (from.y + to.y) / 2;

  const startAngle = vectorAngle(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry);
  let sweepAngle = vectorAngle((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry);
  if (!sweep && sweepAngle > 0) sweepAngle -= 2 * Math.PI;
  if (sweep && sweepAngle < 0) sweepAngle += 2 * Math.PI;

  const pieces = Math.max(1, Math.ceil(Math.abs(sweepAngle) / (Math.PI / 2)));
  const delta = sweepAngle / pieces;
  const k = (4 / 3) * Math.tan(delta / 4);
  const map = (ux: number, uy: number): MotionPathPoint => ({
    x: cx + rx * ux * cos - ry * uy * sin,
    y: cy + rx * ux * sin + ry * uy * cos
  });

  const result: [MotionPathPoint, MotionPathPoint, MotionPathPoint][] = [];
  for (let i = 0; i < pieces; i++) {
    const a1 = startAngle + i * delta;
    const a2 = a1 + delta;
    const c1 = map(Math.cos(a1) - k * Math.sin(a1), Math.sin(a1) + k * Math.cos(a1));
    const c2 = map(Math.cos(a2) + k * Math.sin(a2), Math.sin(a2) - k * Math.cos(a2));
    const end = i === pieces - 1 ? to : map(Math.cos(a2), Math.sin(a2));
    result.push([c1, c2, end]);
  }
  return result;
}

// Two points close enough to call the same pin — how a Z that lands back on the start is folded into the first pin instead of doubling it.
function samePoint(a: MotionPathPoint, b: MotionPathPoint): boolean {
  return Math.hypot(a.x - b.x, a.y - b.y) < 0.01;
}

// Turns parser drafts into real pins; a pin only becomes a curve when a segment actually gave it a handle, and stays smooth when those handles happen to mirror.
function finaliseDrafts(drafts: DraftVertex[]): MotionPathVertex[] {
  return drafts.map(({ point, handleIn, handleOut }) => {
    if (!handleIn && !handleOut) return { type: "straight", point };
    const hIn = handleIn ?? point;
    const hOut = handleOut ?? point;
    const mirrored = Boolean(handleIn && handleOut) && Math.hypot(hIn.x + hOut.x - 2 * point.x, hIn.y + hOut.y - 2 * point.y) < 0.5;
    return { type: "curve", point, handleIn: hIn, handleOut: hOut, mirrored };
  });
}

// Every coordinate a track uses, handles included — what fitting to the baseboard has to keep inside.
function allPoints(vertices: MotionPathVertex[]): MotionPathPoint[] {
  return vertices.flatMap((v) => (v.type === "curve" ? [v.point, v.handleIn, v.handleOut] : [v.point]));
}

/*
  Pasted paths come from anywhere — a 24-unit icon, a 1000-unit illustration — so anything that
  doesn't already sit on the baseboard is scaled uniformly and centred to fit, rather than
  silently laying track off the table. Reports whether it had to, so the UI can say so.
*/
function fitToStage(vertices: MotionPathVertex[]): { vertices: MotionPathVertex[]; fitted: boolean } {
  const points = allPoints(vertices);
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  if (minX >= 0 && minY >= 0 && maxX <= STAGE_WIDTH && maxY <= STAGE_HEIGHT) return { vertices, fitted: false };

  const width = Math.max(maxX - minX, 1);
  const height = Math.max(maxY - minY, 1);
  const scale = Math.min((STAGE_WIDTH - FIT_MARGIN * 2) / width, (STAGE_HEIGHT - FIT_MARGIN * 2) / height);
  const offsetX = (STAGE_WIDTH - width * scale) / 2 - minX * scale;
  const offsetY = (STAGE_HEIGHT - height * scale) / 2 - minY * scale;
  const move = (p: MotionPathPoint): MotionPathPoint => ({ x: toFixed(p.x * scale + offsetX, 2), y: toFixed(p.y * scale + offsetY, 2) });

  return {
    fitted: true,
    vertices: vertices.map((v) => (v.type === "curve" ? { ...v, point: move(v.point), handleIn: move(v.handleIn), handleOut: move(v.handleOut) } : { ...v, point: move(v.point) }))
  };
}

/*
  Parses an SVG path `d` string into editable pins. Every command family is accepted — absolute
  and relative, with quadratics and arcs converted to cubics — but only a single subpath, because
  offset-path along several subpaths jumps between them and there's no honest way to show that as
  one stretch of track.
*/
export function parsePathData(input: string): MotionPathParseResult {
  const tokens = input.match(PATH_TOKEN_PATTERN) ?? [];
  if (tokens.length === 0) return { ok: false, error: "Paste a path's d attribute, such as M 40 150 C 120 40, 360 260, 440 150." };

  const drafts: DraftVertex[] = [];
  let command = "";
  let current: MotionPathPoint = { x: 0, y: 0 };
  let lastCubic: MotionPathPoint | null = null;
  let lastQuad: MotionPathPoint | null = null;
  let closed = false;
  let i = 0;

  const lineTo = (point: MotionPathPoint) => {
    drafts.push({ point, handleIn: null, handleOut: null });
    current = point;
  };
  const curveTo = (c1: MotionPathPoint, c2: MotionPathPoint, point: MotionPathPoint) => {
    drafts[drafts.length - 1].handleOut = c1;
    drafts.push({ point, handleIn: c2, handleOut: null });
    current = point;
  };

  while (i < tokens.length) {
    const token = tokens[i];
    if (/^[A-Za-z]$/.test(token)) {
      command = token;
      i++;
      if (command === "Z" || command === "z") {
        if (drafts.length < 2) return { ok: false, error: "A path needs at least two points before it can close with Z." };
        closed = true;
        current = drafts[0].point;
        continue;
      }
    } else if (!command) {
      return { ok: false, error: "A path has to start with an M (move to) command." };
    }

    if (closed) return { ok: false, error: "Only one subpath is supported — offset-path would jump between separate pieces of track." };

    const upper = command.toUpperCase();
    const relative = command !== upper;
    const count = PARAM_COUNTS[upper];
    const values = tokens.slice(i, i + count).map(Number);
    if (values.length < count || values.some((n) => Number.isNaN(n))) {
      return { ok: false, error: `The ${command} command needs ${count} number${count === 1 ? "" : "s"} each time it's used.` };
    }
    i += count;

    const base = relative ? current : { x: 0, y: 0 };
    const at = (x: number, y: number): MotionPathPoint => ({ x: base.x + x, y: base.y + y });

    switch (upper) {
      case "M": {
        if (drafts.length > 0) return { ok: false, error: "Only one subpath is supported — offset-path would jump between separate pieces of track." };
        lineTo(at(values[0], values[1]));
        // Extra coordinate pairs after an M are implicit line-tos, per the SVG grammar.
        command = relative ? "l" : "L";
        break;
      }
      case "L":
        lineTo(at(values[0], values[1]));
        break;
      case "H":
        lineTo({ x: relative ? current.x + values[0] : values[0], y: current.y });
        break;
      case "V":
        lineTo({ x: current.x, y: relative ? current.y + values[0] : values[0] });
        break;
      case "C": {
        const c2 = at(values[2], values[3]);
        curveTo(at(values[0], values[1]), c2, at(values[4], values[5]));
        lastCubic = c2;
        break;
      }
      case "S": {
        const c1 = lastCubic ? reflect(lastCubic, current) : current;
        const c2 = at(values[0], values[1]);
        curveTo(c1, c2, at(values[2], values[3]));
        lastCubic = c2;
        break;
      }
      case "Q":
      case "T": {
        const control: MotionPathPoint = upper === "Q" ? at(values[0], values[1]) : lastQuad ? reflect(lastQuad, current) : current;
        const end = upper === "Q" ? at(values[2], values[3]) : at(values[0], values[1]);
        const start = current;
        curveTo(
          { x: start.x + (2 / 3) * (control.x - start.x), y: start.y + (2 / 3) * (control.y - start.y) },
          { x: end.x + (2 / 3) * (control.x - end.x), y: end.y + (2 / 3) * (control.y - end.y) },
          end
        );
        lastQuad = control;
        break;
      }
      case "A": {
        const end = at(values[5], values[6]);
        if (samePoint(current, end)) break;
        for (const [c1, c2, point] of arcToCubics(current, values[0], values[1], values[2], values[3] !== 0, values[4] !== 0, end)) {
          curveTo(c1, c2, point);
        }
        break;
      }
    }

    // S and T only reflect a control from the immediately preceding curve of their own family.
    if (upper !== "C" && upper !== "S") lastCubic = null;
    if (upper !== "Q" && upper !== "T") lastQuad = null;
    if (drafts.length > MAX_PARSED_VERTICES) return { ok: false, error: `That path has more than ${MAX_PARSED_VERTICES} points — simplify it first.` };
  }

  if (drafts.length < 2) return { ok: false, error: "A path needs at least two points to lay any track." };

  // A closing segment that lands exactly on the start folds its incoming handle into the first pin rather than leaving a duplicate pin there.
  if (closed && drafts.length > 2 && samePoint(drafts[drafts.length - 1].point, drafts[0].point)) {
    const last = drafts.pop() as DraftVertex;
    drafts[0].handleIn = last.handleIn;
  }

  const { vertices, fitted } = fitToStage(finaliseDrafts(drafts));
  return { ok: true, vertices, closed, fitted };
}

// XML-escapes a custom glyph so an ampersand or angle bracket typed into the custom field can't break the SVG export.
function escapeXml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// SVG markup for a glyph's parts, one line each at the given indent — custom text is centred in the same 48 × 28 box.
function glyphSvgLines(glyph: MotionPathGlyph, customGlyph: string, indent: string): string[] {
  if (glyph === "custom") {
    return [`${indent}<text x="24" y="15" font-size="22" text-anchor="middle" dominant-baseline="central">${escapeXml(customGlyph || "?")}</text>`];
  }
  return GLYPH_SHAPES[glyph].map(({ tag, attrs, detail }) => {
    const attributes = Object.entries(attrs).map(([key, value]) => `${key}="${value}"`);
    if (detail) attributes.push(`opacity="${GLYPH_DETAIL_OPACITY}"`);
    return `${indent}<${tag} ${attributes.join(" ")} />`;
  });
}

// JSX for a glyph's parts — identical to the SVG lines except for React's camelCased text attributes.
function glyphJsxLines(glyph: MotionPathGlyph, customGlyph: string, indent: string): string[] {
  if (glyph === "custom") {
    return [`${indent}<text x="24" y="15" fontSize="22" textAnchor="middle" dominantBaseline="central">{${JSON.stringify(customGlyph || "?")}}</text>`];
  }
  return GLYPH_SHAPES[glyph].map(({ tag, attrs, detail }) => {
    const attributes = Object.entries(attrs).map(([key, value]) => (typeof value === "number" ? `${key}={${value}}` : `${key}="${value}"`));
    if (detail) attributes.push(`opacity={${GLYPH_DETAIL_OPACITY}}`);
    return `${indent}<${tag} ${attributes.join(" ")} />`;
  });
}

// The iteration count as the animation shorthand writes it.
function iterationCss(state: MotionPathEditorState): string {
  return state.infinite ? "infinite" : String(state.iterations);
}

// The full `animation` shorthand, in the order the spec recommends so nothing is mistaken for the wrong longhand.
export function animationShorthand(state: MotionPathEditorState): string {
  const easing = resolveEasingCss(state.easing, state.bezier);
  return `${KEYFRAMES_NAME} ${formatNumber(state.duration)}s ${easing} ${formatNumber(state.delay)}s ${iterationCss(state)} ${state.direction} both`;
}

// offset-anchor as the percentage pair the export and preview both use.
export function offsetAnchorCss(state: MotionPathEditorState): string {
  return `${formatNumber(state.anchorX, 1)}% ${formatNumber(state.anchorY, 1)}%`;
}

// Stylesheet export: a sized positioned parent, the moving element pinned to its top-left, and keyframes on offset-distance.
export function buildCssExport(state: MotionPathEditorState): string {
  const d = buildPathData(state.vertices, state.closed);
  return [
    "/*",
    "  offset-path: path() coordinates are CSS pixels measured from the top-left of the moving",
    "  element's containing block — they do not scale. Keep .track the size the path was drawn at",
    `  (${STAGE_WIDTH} × ${STAGE_HEIGHT}) and pin .loco to its top-left corner.`,
    "*/",
    ".track {",
    "  position: relative;",
    `  width: ${STAGE_WIDTH}px;`,
    `  height: ${STAGE_HEIGHT}px;`,
    "}",
    "",
    ".loco {",
    "  position: absolute;",
    "  top: 0;",
    "  left: 0;",
    `  width: ${GLYPH_WIDTH}px;`,
    `  height: ${GLYPH_HEIGHT}px;`,
    `  offset-path: path("${d}");`,
    `  offset-rotate: ${resolveOffsetRotate(state)};`,
    `  offset-anchor: ${offsetAnchorCss(state)};`,
    `  animation: ${animationShorthand(state)};`,
    "}",
    "",
    `@keyframes ${KEYFRAMES_NAME} {`,
    "  from {",
    `    offset-distance: ${formatNumber(state.startDistance, 1)}%;`,
    "  }",
    "  to {",
    `    offset-distance: ${formatNumber(state.endDistance, 1)}%;`,
    "  }",
    "}",
    "",
    "@media (prefers-reduced-motion: reduce) {",
    "  .loco {",
    "    animation: none;",
    `    offset-distance: ${formatNumber(state.startDistance, 1)}%;`,
    "  }",
    "}"
  ].join("\n");
}

// keySplines' four numbers for one leg.
function splineText(bezier: MotionPathBezier): string {
  return bezier.map((n) => formatNumber(n)).join(" ");
}

// The same curve run backwards in time — what a CSS reverse or alternate leg applies, rotated 180° about the curve's centre.
function reversedBezier([x1, y1, x2, y2]: MotionPathBezier): MotionPathBezier {
  return [1 - x2, 1 - y2, 1 - x1, 1 - y1];
}

/*
  Translates the CSS timing model into animateMotion attributes. SMIL has no animation-direction,
  so reverse swaps keyPoints and runs the spline backwards, and alternate becomes one doubled
  cycle (out and back) with half as many repeats — the only way to express it with keyTimes.
*/
function smilTiming(state: MotionPathEditorState, direction: MotionPathDirection): string[] {
  const s = formatNumber(clamp(state.startDistance / 100, 0, 1), 3);
  const e = formatNumber(clamp(state.endDistance / 100, 0, 1), 3);
  const bezier = resolveBezier(state.easing, state.bezier);
  const linear = state.easing === "linear";
  const alternate = direction === "alternate";
  const dur = alternate ? state.duration * 2 : state.duration;
  const repeat = state.infinite ? "indefinite" : formatNumber(alternate ? state.iterations / 2 : state.iterations, 3);

  let keyPoints = `${s};${e}`;
  let keyTimes = "0;1";
  let splines = splineText(bezier);
  if (direction === "reverse") {
    keyPoints = `${e};${s}`;
    splines = splineText(reversedBezier(bezier));
  } else if (alternate) {
    keyPoints = `${s};${e};${s}`;
    keyTimes = "0;0.5;1";
    splines = `${splineText(bezier)}; ${splineText(reversedBezier(bezier))}`;
  }

  const rotate = state.rotateMode === "fixed" ? formatNumber(state.rotateAngle, 1) : state.rotateMode;
  const attributes = [
    `dur="${formatNumber(dur)}s"`,
    `begin="${formatNumber(state.delay)}s"`,
    `repeatCount="${repeat}"`,
    `rotate="${rotate}"`,
    `keyPoints="${keyPoints}"`,
    `keyTimes="${keyTimes}"`,
    `calcMode="${linear ? "linear" : "spline"}"`
  ];
  if (!linear) attributes.push(`keySplines="${splines}"`);
  attributes.push('fill="freeze"');
  return attributes;
}

/*
  SMIL export. The glyph sits in a group that animateMotion moves; an inner translate puts the
  chosen anchor at the group's origin, because SMIL has no offset-anchor and always pins (0, 0) to
  the path. `inlinePath` picks between animateMotion's own path attribute and an <mpath> pointing
  at the visible track.
*/
export function buildSmilExport(state: MotionPathEditorState, inlinePath: boolean): string {
  const d = buildPathData(state.vertices, state.closed);
  const anchorX = formatNumber((state.anchorX / 100) * GLYPH_WIDTH);
  const anchorY = formatNumber((state.anchorY / 100) * GLYPH_HEIGHT);
  const timing = smilTiming(state, state.direction).map((attr) => `      ${attr}`);

  const motion = inlinePath
    ? [`    <animateMotion`, `      path="${d}"`, ...timing.slice(0, -1), `${timing[timing.length - 1]} />`]
    : [`    <animateMotion`, ...timing.slice(0, -1), `${timing[timing.length - 1]}>`, `      <mpath href="#motion-track" />`, `    </animateMotion>`];

  return [
    "<!--",
    "  SMIL coordinates live in the SVG's user space (the viewBox), so unlike CSS offset-path this",
    "  whole drawing scales together when the <svg> is resized.",
    "-->",
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${STAGE_WIDTH} ${STAGE_HEIGHT}" width="${STAGE_WIDTH}" height="${STAGE_HEIGHT}">`,
    `  <path id="motion-track" d="${d}" fill="none" stroke="currentColor" stroke-opacity="0.3" stroke-width="2" />`,
    `  <g fill="currentColor">`,
    `    <g transform="translate(-${anchorX} -${anchorY})">`,
    ...glyphSvgLines(state.glyph, state.customGlyph, "      "),
    "    </g>",
    ...motion,
    "  </g>",
    "</svg>"
  ].join("\n");
}

// React export: the CSS version as one self-contained component, with keyframes and the reduced-motion opt-out shipped in a <style> tag.
export function buildReactExport(state: MotionPathEditorState): string {
  const d = buildPathData(state.vertices, state.closed);
  return [
    "// offset-path coordinates are CSS pixels from the wrapper's top-left corner (its containing block), so the wrapper keeps the size the track was drawn at.",
    `const TRACK = "${d}";`,
    "",
    "const LOCO_STYLE = {",
    '  position: "absolute",',
    "  top: 0,",
    "  left: 0,",
    `  width: ${GLYPH_WIDTH},`,
    `  height: ${GLYPH_HEIGHT},`,
    "  offsetPath: `path(\"${TRACK}\")`,",
    `  offsetRotate: "${resolveOffsetRotate(state)}",`,
    `  offsetAnchor: "${offsetAnchorCss(state)}",`,
    `  animation: "${animationShorthand(state)}"`,
    "};",
    "",
    "const KEYFRAMES = `",
    `@keyframes ${KEYFRAMES_NAME} {`,
    `  from { offset-distance: ${formatNumber(state.startDistance, 1)}%; }`,
    `  to { offset-distance: ${formatNumber(state.endDistance, 1)}%; }`,
    "}",
    "@media (prefers-reduced-motion: reduce) {",
    "  .motion-path-loco { animation: none !important; }",
    "}`;",
    "",
    "export default function MotionPathTrack() {",
    "  return (",
    `    <div style={{ position: "relative", width: ${STAGE_WIDTH}, height: ${STAGE_HEIGHT} }}>`,
    "      <style>{KEYFRAMES}</style>",
    `      <svg width={${STAGE_WIDTH}} height={${STAGE_HEIGHT}} viewBox="0 0 ${STAGE_WIDTH} ${STAGE_HEIGHT}" aria-hidden="true" style={{ position: "absolute", inset: 0 }}>`,
    "        <path d={TRACK} fill=\"none\" stroke=\"currentColor\" strokeOpacity={0.3} strokeWidth={2} />",
    "      </svg>",
    '      <div className="motion-path-loco" style={LOCO_STYLE}>',
    `        <svg width={${GLYPH_WIDTH}} height={${GLYPH_HEIGHT}} viewBox="0 0 ${GLYPH_WIDTH} ${GLYPH_HEIGHT}" fill="currentColor" aria-hidden="true">`,
    ...glyphJsxLines(state.glyph, state.customGlyph, "          "),
    "        </svg>",
    "      </div>",
    "    </div>",
    "  );",
    "}"
  ].join("\n");
}
