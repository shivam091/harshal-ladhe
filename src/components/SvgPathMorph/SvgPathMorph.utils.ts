import { pointOnCubicBezier } from "@/utils/svg-path";
import type {
  CubicSegment,
  CubicShape,
  CubicSubpath,
  KeyframeReadResult,
  KeyframeReport,
  MorphAnchor,
  MorphBounds,
  MorphEasingId,
  MorphEasingMeta,
  MorphMatchOptions,
  MorphMatchResult,
  MorphOutcome,
  MorphPoint,
  MorphStep,
  MorphViewBox,
  NormalisedPath,
  ParsedPathCommand,
  PathConversionTally,
  PathParseResult,
  SubpathAlignment,
  SubpathSignature,
  SvgPathMorphState
} from "@/components/SvgPathMorph/SvgPathMorph.types";

// How many numbers each command consumes per group — the parser needs this to split implicit repeats like `L 0 0 10 10`.
const COMMAND_ARITY: Record<string, number> = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 };

// SVG's number grammar: sign, digits, optional fraction, optional exponent — sticky so `1.5.5` and `10-5` split the way browsers split them.
const NUMBER_PATTERN = /[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/y;

// Points closer than this are treated as coincident — wide enough to swallow float noise from arcs, tight enough never to merge real geometry.
const EPSILON = 1e-6;

// Above this many subpaths the exhaustive slot assignment would explode factorially, so the matcher falls back to source order.
const MAX_BRUTE_FORCE_SUBPATHS = 7;

// Samples per segment when measuring length — plenty for distributing splits fairly without making the matcher sluggish on big icons.
const LENGTH_SAMPLES = 24;

// Decimal places in every generated `d` string — crisp at any realistic size without float noise bloating the export.
export const PATH_PRECISION = 2;

// The fewest keyframes a morph needs, and a ceiling that keeps the astrolabe's tick ring and the permalink readable.
export const MIN_KEYFRAMES = 2;
// The ceiling that keeps the astrolabe rim and the permalink readable.
export const MAX_KEYFRAMES = 6;

/*
  Easing presets, each spelled for every dialect the exports speak. All stay inside [0, 1] on both
  axes because SMIL keySplines reject overshoot; the react-spring names are the closest built-in
  curve, since a snippet that needs a custom bezier solver defeats the point of a copyable snippet.
*/
export const MORPH_EASINGS: MorphEasingMeta[] = [
  { id: "linear", label: "Linear", bezier: [0, 0, 1, 1], css: "linear", spring: "easings.linear" },
  { id: "ease", label: "Ease", bezier: [0.25, 0.1, 0.25, 1], css: "ease", spring: "easings.easeOutQuad" },
  { id: "ease-in", label: "Ease in", bezier: [0.42, 0, 1, 1], css: "ease-in", spring: "easings.easeInCubic" },
  { id: "ease-out", label: "Ease out", bezier: [0, 0, 0.58, 1], css: "ease-out", spring: "easings.easeOutCubic" },
  { id: "ease-in-out", label: "Ease in-out", bezier: [0.42, 0, 0.58, 1], css: "ease-in-out", spring: "easings.easeInOutCubic" },
  { id: "sine", label: "Sine in-out", bezier: [0.37, 0, 0.63, 1], css: "cubic-bezier(0.37, 0, 0.63, 1)", spring: "easings.easeInOutSine" },
  { id: "expo", label: "Expo in-out", bezier: [0.87, 0, 0.13, 1], css: "cubic-bezier(0.87, 0, 0.13, 1)", spring: "easings.easeInOutExpo" },
  { id: "quint-out", label: "Quint out", bezier: [0.22, 1, 0.36, 1], css: "cubic-bezier(0.22, 1, 0.36, 1)", spring: "easings.easeOutQuint" }
];

// Looks an easing up by id, falling back to ease-in-out so a stale permalink with a retired id still plays.
export function getEasingMeta(id: MorphEasingId): MorphEasingMeta {
  return MORPH_EASINGS.find((easing) => easing.id === id) ?? MORPH_EASINGS[4];
}

// Keyframe letters (A, B, C…) — the name every flask, label and report line uses for a keyframe.
export function keyframeLabel(index: number): string {
  return String.fromCharCode(65 + index);
}

// Rounds for output and normalises `-0`, so generated paths never contain `-0` or `1.000000001`.
export function formatNumber(value: number, decimals: number = PATH_PRECISION): string {
  const rounded = Number(value.toFixed(decimals));
  return Object.is(rounded, -0) ? "0" : String(rounded);
}

/*
  Tokenises a `d` string into command groups, splitting implicit repeats (and the implicit lineto
  after a moveto) into their own entries. Arc flags are read as single characters because minified
  paths pack them (`a5 5 0 016 0`), which a plain number regex would swallow as `016`.
*/
export function parsePathData(d: string): PathParseResult {
  const commands: ParsedPathCommand[] = [];
  const length = d.length;
  let index = 0;

  const skipSeparators = () => {
    while (index < length && /[\s,]/.test(d[index])) index++;
  };

  const readNumber = (): number | null => {
    NUMBER_PATTERN.lastIndex = index;
    const match = NUMBER_PATTERN.exec(d);
    if (!match) return null;
    index += match[0].length;
    return Number(match[0]);
  };

  const readFlag = (): number | null => {
    const char = d[index];
    if (char !== "0" && char !== "1") return null;
    index++;
    return Number(char);
  };

  while (true) {
    skipSeparators();
    if (index >= length) break;
    const char = d[index];
    const upper = char.toUpperCase();

    if (!/[a-zA-Z]/.test(char)) {
      return commands.length === 0
        ? { ok: false, error: "A path has to start with a moveto (M or m).", position: index }
        : { ok: false, error: `Unexpected "${char}" — numbers after Z need a command letter first.`, position: index };
    }
    if (!(upper in COMMAND_ARITY)) return { ok: false, error: `"${char}" isn't an SVG path command.`, position: index };
    if (commands.length === 0 && upper !== "M") return { ok: false, error: "A path has to start with a moveto (M or m).", position: index };

    const commandStart = index;
    index++;
    const arity = COMMAND_ARITY[upper];
    if (arity === 0) {
      commands.push({ letter: char, values: [] });
      continue;
    }

    let groupLetter = char;
    let groups = 0;
    while (true) {
      skipSeparators();
      if (index >= length || !/[+\-.\d]/.test(d[index])) break;
      const values: number[] = [];
      for (let k = 0; k < arity; k++) {
        skipSeparators();
        const value = upper === "A" && (k === 3 || k === 4) ? readFlag() : readNumber();
        if (value === null || !Number.isFinite(value)) {
          return { ok: false, error: `"${char}" expects ${arity} number${arity === 1 ? "" : "s"} per group but ran short.`, position: index };
        }
        values.push(value);
      }
      commands.push({ letter: groupLetter, values });
      groups++;
      // Coordinate pairs after a moveto are implicit linetos, relative if the moveto was.
      if (upper === "M") groupLetter = char === "M" ? "L" : "l";
    }
    if (groups === 0) return { ok: false, error: `"${char}" needs ${arity} number${arity === 1 ? "" : "s"} after it.`, position: commandStart };
  }

  if (commands.length === 0) return { ok: false, error: "The path is empty.", position: 0 };
  return { ok: true, commands };
}

// A straight line as a cubic with its handles on the thirds — unlike handles pinned to the endpoints, these interpolate smoothly into real curves.
function lineToCubic(x0: number, y0: number, x: number, y: number): CubicSegment {
  return { x1: x0 + (x - x0) / 3, y1: y0 + (y - y0) / 3, x2: x0 + ((x - x0) * 2) / 3, y2: y0 + ((y - y0) * 2) / 3, x, y };
}

// Exact degree elevation of a quadratic — every Q/T becomes a C with no loss of shape.
function quadToCubic(x0: number, y0: number, qx: number, qy: number, x: number, y: number): CubicSegment {
  return { x1: x0 + ((qx - x0) * 2) / 3, y1: y0 + ((qy - y0) * 2) / 3, x2: x + ((qx - x) * 2) / 3, y2: y + ((qy - y) * 2) / 3, x, y };
}

// Signed angle between two vectors — the arc conversion needs the sign to know which way the sweep runs.
function vectorAngle(ux: number, uy: number, vx: number, vy: number): number {
  return Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
}

/*
  SVG's endpoint-parameterised arc (spec appendix B.2.4) converted to centre form and then to
  cubics, one per quarter turn or less — the standard 4/3·tan(θ/4) handle length keeps each piece
  within a fraction of a pixel of the true ellipse. Radii too small to reach are scaled up, as browsers do.
*/
function arcToCubics(
  x0: number,
  y0: number,
  rxIn: number,
  ryIn: number,
  angleDeg: number,
  largeArc: number,
  sweep: number,
  x: number,
  y: number
): CubicSegment[] {
  if (Math.abs(x0 - x) < EPSILON && Math.abs(y0 - y) < EPSILON) return [];
  let rx = Math.abs(rxIn);
  let ry = Math.abs(ryIn);
  if (rx < EPSILON || ry < EPSILON) return [lineToCubic(x0, y0, x, y)];

  const phi = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(phi);
  const sin = Math.sin(phi);
  const dx2 = (x0 - x) / 2;
  const dy2 = (y0 - y) / 2;
  const x1p = cos * dx2 + sin * dy2;
  const y1p = -sin * dx2 + cos * dy2;

  const lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lambda > 1) {
    rx *= Math.sqrt(lambda);
    ry *= Math.sqrt(lambda);
  }

  const numerator = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
  const denominator = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
  const coefficient = (largeArc !== sweep ? 1 : -1) * Math.sqrt(Math.max(0, numerator / denominator));
  const cxp = (coefficient * rx * y1p) / ry;
  const cyp = (-coefficient * ry * x1p) / rx;
  const cx = cos * cxp - sin * cyp + (x0 + x) / 2;
  const cy = sin * cxp + cos * cyp + (y0 + y) / 2;

  const ux = (x1p - cxp) / rx;
  const uy = (y1p - cyp) / ry;
  const theta1 = vectorAngle(1, 0, ux, uy);
  let deltaTheta = vectorAngle(ux, uy, (-x1p - cxp) / rx, (-y1p - cyp) / ry);
  if (!sweep && deltaTheta > 0) deltaTheta -= Math.PI * 2;
  if (sweep && deltaTheta < 0) deltaTheta += Math.PI * 2;

  const pieces = Math.max(1, Math.ceil(Math.abs(deltaTheta) / (Math.PI / 2) - EPSILON));
  const step = deltaTheta / pieces;
  const handle = (4 / 3) * Math.tan(step / 4);
  const map = (px: number, py: number) => ({ x: cx + rx * px * cos - ry * py * sin, y: cy + rx * px * sin + ry * py * cos });

  const segments: CubicSegment[] = [];
  for (let i = 0; i < pieces; i++) {
    const a = theta1 + i * step;
    const b = a + step;
    const c1 = map(Math.cos(a) - handle * Math.sin(a), Math.sin(a) + handle * Math.cos(a));
    const c2 = map(Math.cos(b) + handle * Math.sin(b), Math.sin(b) - handle * Math.cos(b));
    const end = i === pieces - 1 ? { x, y } : map(Math.cos(b), Math.sin(b));
    segments.push({ x1: c1.x, y1: c1.y, x2: c2.x, y2: c2.y, x: end.x, y: end.y });
  }
  return segments;
}

// Fresh zeroed tally, so normalisePath can count conversions without guarding every increment.
function emptyTally(): PathConversionTally {
  return { relative: 0, lines: 0, quadratics: 0, arcs: 0, smooth: 0, closingLines: 0, emptySubpaths: 0 };
}

/*
  Rewrites parsed commands as absolute cubics grouped by subpath: relative coordinates resolved,
  H/V/L lifted to cubics, S/T reflections made explicit, Q elevated, arcs split into quarter-turn
  cubics, and Z turned into an explicit closing segment whenever the pen isn't already home — so a
  closed subpath always ends exactly where it began, which start-point rotation depends on.
*/
export function normalisePath(commands: ParsedPathCommand[]): NormalisedPath {
  const subpaths: CubicSubpath[] = [];
  const commandCounts: Record<string, number> = {};
  const conversions = emptyTally();
  let current: CubicSubpath | null = null;
  let x = 0;
  let y = 0;
  let startX = 0;
  let startY = 0;
  let lastCubicControl: MorphPoint | null = null;
  let lastQuadControl: MorphPoint | null = null;

  const ensureSubpath = (): CubicSubpath => {
    if (!current) {
      current = { startX: x, startY: y, segments: [], closed: false };
      startX = x;
      startY = y;
      subpaths.push(current);
    }
    return current;
  };

  for (const { letter, values: v } of commands) {
    const upper = letter.toUpperCase();
    const relative = letter !== upper;
    commandCounts[letter] = (commandCounts[letter] ?? 0) + 1;
    if (relative && upper !== "Z") conversions.relative++;
    const ox = relative ? x : 0;
    const oy = relative ? y : 0;
    let nextCubicControl: MorphPoint | null = null;
    let nextQuadControl: MorphPoint | null = null;

    switch (upper) {
      case "M": {
        x = ox + v[0];
        y = oy + v[1];
        current = null;
        ensureSubpath();
        break;
      }
      case "Z": {
        if (current) {
          const subpath: CubicSubpath = current;
          if (Math.hypot(x - startX, y - startY) > EPSILON) {
            subpath.segments.push(lineToCubic(x, y, startX, startY));
            conversions.closingLines++;
          } else if (subpath.segments.length > 0) {
            // Snap float drift so rotation can rely on a closed subpath ending exactly at its start.
            const last = subpath.segments[subpath.segments.length - 1];
            last.x = startX;
            last.y = startY;
          }
          subpath.closed = true;
        }
        x = startX;
        y = startY;
        current = null;
        break;
      }
      case "L":
      case "H":
      case "V": {
        const nx = upper === "V" ? x : ox + v[0];
        const ny = upper === "H" ? y : upper === "V" ? oy + v[0] : oy + v[1];
        ensureSubpath().segments.push(lineToCubic(x, y, nx, ny));
        conversions.lines++;
        x = nx;
        y = ny;
        break;
      }
      case "C":
      case "S": {
        let c1x: number;
        let c1y: number;
        let rest: number[];
        if (upper === "C") {
          c1x = ox + v[0];
          c1y = oy + v[1];
          rest = v.slice(2);
        } else {
          c1x = lastCubicControl ? 2 * x - lastCubicControl.x : x;
          c1y = lastCubicControl ? 2 * y - lastCubicControl.y : y;
          rest = v;
          conversions.smooth++;
        }
        const segment = { x1: c1x, y1: c1y, x2: ox + rest[0], y2: oy + rest[1], x: ox + rest[2], y: oy + rest[3] };
        ensureSubpath().segments.push(segment);
        nextCubicControl = { x: segment.x2, y: segment.y2 };
        x = segment.x;
        y = segment.y;
        break;
      }
      case "Q":
      case "T": {
        let qx: number;
        let qy: number;
        let end: number[];
        if (upper === "Q") {
          qx = ox + v[0];
          qy = oy + v[1];
          end = v.slice(2);
        } else {
          qx = lastQuadControl ? 2 * x - lastQuadControl.x : x;
          qy = lastQuadControl ? 2 * y - lastQuadControl.y : y;
          end = v;
          conversions.smooth++;
        }
        const nx = ox + end[0];
        const ny = oy + end[1];
        ensureSubpath().segments.push(quadToCubic(x, y, qx, qy, nx, ny));
        conversions.quadratics++;
        nextQuadControl = { x: qx, y: qy };
        x = nx;
        y = ny;
        break;
      }
      case "A": {
        const nx = ox + v[5];
        const ny = oy + v[6];
        ensureSubpath().segments.push(...arcToCubics(x, y, v[0], v[1], v[2], v[3], v[4], nx, ny));
        conversions.arcs++;
        x = nx;
        y = ny;
        break;
      }
    }

    lastCubicControl = nextCubicControl;
    lastQuadControl = nextQuadControl;
  }

  const drawn = subpaths.filter((subpath) => subpath.segments.length > 0);
  conversions.emptySubpaths = subpaths.length - drawn.length;
  const commandTotal = Object.values(commandCounts).reduce((sum, count) => sum + count, 0);
  return { shape: drawn, commandCounts, commandTotal, conversions };
}

// Parse and normalise in one go, refusing paths that draw nothing — there's nothing to morph from a lone moveto.
export function readKeyframe(d: string): KeyframeReadResult {
  const parsed = parsePathData(d);
  if (!parsed.ok) return { ok: false, error: `${parsed.error} (at character ${parsed.position + 1})` };
  const path = normalisePath(parsed.commands);
  if (path.shape.length === 0) return { ok: false, error: "This path never draws anything — it needs at least one segment after its moveto." };
  return { ok: true, path };
}

// De Casteljau split at t — exact, so subdividing never changes the drawing.
function splitSegment(x0: number, y0: number, s: CubicSegment, t: number): [CubicSegment, CubicSegment] {
  const lerp = (a: number, b: number) => a + (b - a) * t;
  const ax = lerp(x0, s.x1);
  const ay = lerp(y0, s.y1);
  const bx = lerp(s.x1, s.x2);
  const by = lerp(s.y1, s.y2);
  const cx = lerp(s.x2, s.x);
  const cy = lerp(s.y2, s.y);
  const dx = lerp(ax, bx);
  const dy = lerp(ay, by);
  const ex = lerp(bx, cx);
  const ey = lerp(by, cy);
  const mx = lerp(dx, ex);
  const my = lerp(dy, ey);
  return [
    { x1: ax, y1: ay, x2: dx, y2: dy, x: mx, y: my },
    { x1: ex, y1: ey, x2: cx, y2: cy, x: s.x, y: s.y }
  ];
}

// Cumulative arc length at evenly spaced t — measured by sampling because cubics have no closed-form length.
function lengthTable(x0: number, y0: number, s: CubicSegment): number[] {
  const p0 = { x: x0, y: y0 };
  const c1 = { x: s.x1, y: s.y1 };
  const c2 = { x: s.x2, y: s.y2 };
  const p3 = { x: s.x, y: s.y };
  const table = [0];
  let previous = p0;
  for (let i = 1; i <= LENGTH_SAMPLES; i++) {
    const point = pointOnCubicBezier(p0, c1, c2, p3, i / LENGTH_SAMPLES);
    table.push(table[i - 1] + Math.hypot(point.x - previous.x, point.y - previous.y));
    previous = point;
  }
  return table;
}

// Each segment's start point, which the segment type leaves implicit.
function segmentStarts(subpath: CubicSubpath): MorphPoint[] {
  return subpath.segments.map((_, i) => (i === 0 ? { x: subpath.startX, y: subpath.startY } : { x: subpath.segments[i - 1].x, y: subpath.segments[i - 1].y }));
}

/*
  Cuts one segment into `pieces` parts of roughly equal arc length (not equal t, which bunches
  points where a curve moves slowly) — each cut is made on the remainder, so its t is rescaled.
*/
function splitByLength(x0: number, y0: number, segment: CubicSegment, pieces: number): CubicSegment[] {
  if (pieces <= 1) return [segment];
  const table = lengthTable(x0, y0, segment);
  const total = table[LENGTH_SAMPLES];
  const cutTs: number[] = [];
  for (let j = 1; j < pieces; j++) {
    const target = (total * j) / pieces;
    let i = 1;
    while (i < LENGTH_SAMPLES && table[i] < target) i++;
    const span = table[i] - table[i - 1];
    const local = span > EPSILON ? (target - table[i - 1]) / span : 0;
    cutTs.push(total > EPSILON ? (i - 1 + local) / LENGTH_SAMPLES : j / pieces);
  }

  const result: CubicSegment[] = [];
  let remainder = segment;
  let rx = x0;
  let ry = y0;
  let consumed = 0;
  for (const t of cutTs) {
    const [left, right] = splitSegment(rx, ry, remainder, (t - consumed) / (1 - consumed));
    result.push(left);
    rx = left.x;
    ry = left.y;
    remainder = right;
    consumed = t;
  }
  result.push(remainder);
  return result;
}

/*
  Raises a subpath to exactly `target` segments, handing each extra split to whichever segment is
  currently longest per piece — so new points land where the outline has the most room, and a long
  edge beside a tiny one doesn't get an equal share. A collapsed subpath becomes a stack of points.
*/
function subdivideTo(subpath: CubicSubpath, target: number): CubicSubpath {
  const count = subpath.segments.length;
  if (count === 0) {
    const { startX: x, startY: y } = subpath;
    return { ...subpath, segments: Array.from({ length: target }, () => ({ x1: x, y1: y, x2: x, y2: y, x, y })) };
  }
  if (count >= target) return subpath;

  const starts = segmentStarts(subpath);
  const lengths = subpath.segments.map((segment, i) => lengthTable(starts[i].x, starts[i].y, segment)[LENGTH_SAMPLES]);
  const pieces = subpath.segments.map(() => 1);
  for (let extra = target - count; extra > 0; extra--) {
    let best = 0;
    for (let i = 1; i < count; i++) {
      if (lengths[i] / pieces[i] > lengths[best] / pieces[best]) best = i;
    }
    pieces[best]++;
  }
  const segments = subpath.segments.flatMap((segment, i) => splitByLength(starts[i].x, starts[i].y, segment, pieces[i]));
  return { ...subpath, segments };
}

// Every on-curve point in order — the points the morph moves, and what travel distance is measured over.
function anchors(subpath: CubicSubpath): MorphPoint[] {
  return [{ x: subpath.startX, y: subpath.startY }, ...subpath.segments.map((segment) => ({ x: segment.x, y: segment.y }))];
}

// Total straight-line distance corresponding points cover between two subpaths — the quantity alignment minimises.
function travelBetween(a: CubicSubpath, b: CubicSubpath): number {
  const pa = anchors(a);
  const pb = anchors(b);
  let total = 0;
  for (let i = 0; i < Math.min(pa.length, pb.length); i++) total += Math.hypot(pa[i].x - pb[i].x, pa[i].y - pb[i].y);
  return total;
}

// Starts a closed subpath `steps` segments further along — the drawing is unchanged, only which point leads.
function rotateSubpath(subpath: CubicSubpath, steps: number): CubicSubpath {
  const count = subpath.segments.length;
  if (count === 0) return subpath;
  const r = ((steps % count) + count) % count;
  if (r === 0) return subpath;
  const pivot = subpath.segments[r - 1];
  return { ...subpath, startX: pivot.x, startY: pivot.y, segments: [...subpath.segments.slice(r), ...subpath.segments.slice(0, r)] };
}

// Walks the same outline backwards — each segment's handles swap and the anchor sequence runs the other way.
function reverseSubpath(subpath: CubicSubpath): CubicSubpath {
  const starts = segmentStarts(subpath);
  const count = subpath.segments.length;
  if (count === 0) return subpath;
  const last = subpath.segments[count - 1];
  const segments: CubicSegment[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const segment = subpath.segments[i];
    segments.push({ x1: segment.x2, y1: segment.y2, x2: segment.x1, y2: segment.y1, x: starts[i].x, y: starts[i].y });
  }
  return { ...subpath, startX: last.x, startY: last.y, segments };
}

// Bounding box of a subpath's anchors and handles — handles bound the curve, so this is conservative but never too small.
function subpathBox(subpath: CubicSubpath): MorphBounds {
  let minX = subpath.startX;
  let maxX = subpath.startX;
  let minY = subpath.startY;
  let maxY = subpath.startY;
  for (const s of subpath.segments) {
    minX = Math.min(minX, s.x1, s.x2, s.x);
    maxX = Math.max(maxX, s.x1, s.x2, s.x);
    minY = Math.min(minY, s.y1, s.y2, s.y);
    maxY = Math.max(maxY, s.y1, s.y2, s.y);
  }
  return { minX, minY, maxX, maxY };
}

// Centre and diagonal of a subpath's box — enough to judge which subpaths "belong together" across keyframes.
function subpathSignature(subpath: CubicSubpath): SubpathSignature {
  const box = subpathBox(subpath);
  return { cx: (box.minX + box.maxX) / 2, cy: (box.minY + box.maxY) / 2, size: Math.hypot(box.maxX - box.minX, box.maxY - box.minY) };
}

// How unlike two subpaths are: distance between centres plus half the size gap, so a small dot prefers to pair with a small dot nearby.
function pairingCost(a: CubicSubpath, b: CubicSubpath): number {
  const sa = subpathSignature(a);
  const sb = subpathSignature(b);
  return Math.hypot(sa.cx - sb.cx, sa.cy - sb.cy) + 0.5 * Math.abs(sa.size - sb.size);
}

/*
  Places one keyframe's subpaths into the shared slots, trying every injective assignment (cheap
  for icon-sized paths) and keeping the first strictly cheapest — enumeration starts at source
  order, so ties fall back to the order the author wrote them in.
*/
function assignSlots(references: (CubicSubpath | null)[], subpaths: CubicSubpath[]): number[] {
  const slotCount = references.length;
  if (slotCount > MAX_BRUTE_FORCE_SUBPATHS) return subpaths.map((_, i) => i);

  const costs = subpaths.map((subpath) => references.map((reference) => (reference ? pairingCost(reference, subpath) : 0)));
  let best: number[] = subpaths.map((_, i) => i);
  let bestCost = Infinity;
  const used = new Array<boolean>(slotCount).fill(false);
  const chosen: number[] = [];

  const search = (index: number, running: number) => {
    if (running >= bestCost - 1e-9 * (1 + Math.abs(bestCost))) return;
    if (index === subpaths.length) {
      best = [...chosen];
      bestCost = running;
      return;
    }
    for (let slot = 0; slot < slotCount; slot++) {
      if (used[slot]) continue;
      used[slot] = true;
      chosen.push(slot);
      search(index + 1, running + costs[index][slot]);
      chosen.pop();
      used[slot] = false;
    }
  };
  search(0, 0);
  return best;
}

// Total point travel across every consecutive keyframe pair — the before/after figure the report quotes.
function totalTravel(shapes: CubicShape[]): number {
  let total = 0;
  for (let i = 1; i < shapes.length; i++) {
    shapes[i].forEach((subpath, slot) => {
      total += travelBetween(shapes[i - 1][slot], subpath);
    });
  }
  return total;
}

/*
  The cheapest rotation (closed subpaths only) and direction for `subpath` against `reference`,
  measured as total anchor travel. Open subpaths can only be reversed: rotating them would move
  their gap.
*/
function bestAlignment(reference: CubicSubpath, subpath: CubicSubpath, allowReverse: boolean): SubpathAlignment {
  const count = subpath.segments.length;
  let best = { rotation: 0, reversed: false };
  let bestCost = travelBetween(reference, subpath);
  const directions = allowReverse ? [false, true] : [false];
  for (const reversed of directions) {
    const base = reversed ? reverseSubpath(subpath) : subpath;
    const rotations = subpath.closed ? count : 1;
    for (let rotation = 0; rotation < rotations; rotation++) {
      if (!reversed && rotation === 0) continue;
      const cost = travelBetween(reference, rotateSubpath(base, rotation));
      if (cost < bestCost - EPSILON) {
        bestCost = cost;
        best = { rotation, reversed };
      }
    }
  }
  return best;
}

// Serialises a cubic shape back to a `d` string — every keyframe runs through this one function, so matched outputs share one exact command sequence.
export function shapeToPathData(shape: CubicShape, decimals: number = PATH_PRECISION): string {
  const n = (value: number) => formatNumber(value, decimals);
  return shape
    .map((subpath) => {
      const parts = [`M ${n(subpath.startX)} ${n(subpath.startY)}`];
      for (const s of subpath.segments) parts.push(`C ${n(s.x1)} ${n(s.y1)} ${n(s.x2)} ${n(s.y2)} ${n(s.x)} ${n(s.y)}`);
      if (subpath.closed) parts.push("Z");
      return parts.join(" ");
    })
    .join(" ");
}

// A square viewBox around every keyframe with a margin, so the preview never crops a shape mid-morph and the flasks share one scale.
function computeViewBox(shapes: CubicShape[]): MorphViewBox {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const shape of shapes) {
    for (const subpath of shape) {
      const box = subpathBox(subpath);
      minX = Math.min(minX, box.minX);
      minY = Math.min(minY, box.minY);
      maxX = Math.max(maxX, box.maxX);
      maxY = Math.max(maxY, box.maxY);
    }
  }
  if (!Number.isFinite(minX)) return { x: 0, y: 0, width: 100, height: 100 };
  const span = Math.max(maxX - minX, maxY - minY, 1);
  const size = span * 1.16;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  return { x: cx - size / 2, y: cy - size / 2, width: size, height: size };
}

// The viewBox attribute string, rounded like the paths so exports stay tidy.
export function viewBoxToString(viewBox: MorphViewBox): string {
  return [viewBox.x, viewBox.y, viewBox.width, viewBox.height].map((value) => formatNumber(value)).join(" ");
}

// Stroke width for line-art morphs, scaled to the viewBox so presets drawn at any size look the same weight.
export function strokeWidthFor(viewBox: MorphViewBox): number {
  return Number(formatNumber(viewBox.width * 0.06, 1));
}

// "M 1 · L 4 · Z 1" style tally, in a fixed command order so two keyframes' reports line up by eye.
export function describeCommandCounts(counts: Record<string, number>): string {
  const order = "MmLlHhVvCcSsQqTtAaZz";
  return Object.entries(counts)
    .sort(([a], [b]) => order.indexOf(a) - order.indexOf(b))
    .map(([letter, count]) => `${letter}×${count}`)
    .join(" ");
}

// Turns a conversion tally into one readable sentence, or null when the path was already pure absolute cubics.
function describeConversions(label: string, tally: PathConversionTally, segments: number): string | null {
  const parts: string[] = [];
  if (tally.relative > 0) parts.push(`resolved ${tally.relative} relative command${tally.relative === 1 ? "" : "s"}`);
  const lifted: string[] = [];
  if (tally.lines > 0) lifted.push(`${tally.lines} line${tally.lines === 1 ? "" : "s"}`);
  if (tally.quadratics > 0) lifted.push(`${tally.quadratics} quadratic${tally.quadratics === 1 ? "" : "s"}`);
  if (tally.arcs > 0) lifted.push(`${tally.arcs} arc${tally.arcs === 1 ? "" : "s"}`);
  if (lifted.length > 0) parts.push(`turned ${lifted.join(", ")} into cubics`);
  if (tally.smooth > 0) parts.push(`made ${tally.smooth} smooth (S/T) reflection${tally.smooth === 1 ? "" : "s"} explicit`);
  if (tally.closingLines > 0) parts.push(`spelled out ${tally.closingLines} implicit Z closing line${tally.closingLines === 1 ? "" : "s"}`);
  if (tally.emptySubpaths > 0) parts.push(`dropped ${tally.emptySubpaths} empty moveto${tally.emptySubpaths === 1 ? "" : "s"}`);
  if (parts.length === 0) return null;
  return `${label}: ${parts.join("; ")} — ${segments} cubic segment${segments === 1 ? "" : "s"} in all.`;
}

/*
  The whole matching pipeline, for two or more keyframes at once: normalise, share subpath slots
  (padding gaps with collapsed subpaths that grow from their partner's centre), agree open/closed
  per slot, subdivide every slot to its longest member's segment count, then chain-align each
  keyframe to the one before it. Every keyframe ends up with one identical command sequence.
*/
export function matchKeyframes(paths: NormalisedPath[], options: MorphMatchOptions): MorphMatchResult {
  const steps: MorphStep[] = [];
  const labels = paths.map((_, i) => keyframeLabel(i));

  paths.forEach((path, i) => {
    const segments = path.shape.reduce((sum, subpath) => sum + subpath.segments.length, 0);
    const text = describeConversions(labels[i], path.conversions, segments);
    if (text) steps.push({ kind: "normalise", text });
  });

  // Slots: one row per shared subpath position, one column per keyframe.
  const slotCount = Math.max(...paths.map((path) => path.shape.length));
  const slots: (CubicSubpath | null)[][] = Array.from({ length: slotCount }, () => paths.map(() => null));
  paths[0].shape.forEach((subpath, slot) => {
    slots[slot][0] = subpath;
  });
  for (let k = 1; k < paths.length; k++) {
    const references = slots.map((row) => {
      for (let j = k - 1; j >= 0; j--) if (row[j]) return row[j];
      return null;
    });
    assignSlots(references, paths[k].shape).forEach((slot, subIndex) => {
      slots[slot][k] = paths[k].shape[subIndex];
    });
  }

  // Fill gaps with a collapsed subpath at the centre of the nearest keyframe that has something there.
  slots.forEach((row, slot) => {
    row.forEach((entry, k) => {
      if (entry) return;
      let donor = -1;
      for (let distance = 1; distance < paths.length && donor < 0; distance++) {
        if (row[k - distance]) donor = k - distance;
        else if (row[k + distance]) donor = k + distance;
      }
      const source = row[donor] as CubicSubpath;
      const { cx, cy } = subpathSignature(source);
      row[k] = { startX: cx, startY: cy, segments: [], closed: source.closed };
      steps.push({
        kind: "pad",
        text: `${labels[k]}: added a collapsed subpath in slot ${slot + 1}, so ${labels[donor]}'s subpath ${slot + 1} grows from (or shrinks to) its own centre.`
      });
    });
  });

  // Every member of a slot must agree on Z, or the command sequences differ.
  slots.forEach((row, slot) => {
    const real = row.filter((entry, k) => entry && paths[k].shape.includes(entry)) as CubicSubpath[];
    const allClosed = real.every((entry) => entry.closed);
    const anyClosed = real.some((entry) => entry.closed);
    if (anyClosed && !allClosed) {
      steps.push({ kind: "close", text: `Slot ${slot + 1} mixes open and closed subpaths, so Z was dropped there (closing lines stay as explicit segments).` });
    }
    row.forEach((entry, k) => {
      row[k] = { ...(entry as CubicSubpath), closed: allClosed };
    });
  });

  // Subdivide each slot to its longest member.
  slots.forEach((row, slot) => {
    const target = Math.max(1, ...row.map((entry) => (entry as CubicSubpath).segments.length));
    row.forEach((entry, k) => {
      const subpath = entry as CubicSubpath;
      const before = subpath.segments.length;
      if (before > 0 && before < target) {
        steps.push({ kind: "subdivide", text: `${labels[k]} · subpath ${slot + 1}: split ${before} segment${before === 1 ? "" : "s"} into ${target}, placing new points by length.` });
      }
      row[k] = subdivideTo(subpath, target);
    });
  });

  const unaligned: CubicShape[] = paths.map((_, k) => slots.map((row) => row[k] as CubicSubpath));
  const travelBefore = totalTravel(unaligned);

  // Chain-align each keyframe to the already-aligned one before it, then twist by the manual offset.
  const aligned: CubicShape[] = [unaligned[0]];
  for (let k = 1; k < unaligned.length; k++) {
    aligned.push(
      unaligned[k].map((subpath, slot) => {
        let result = subpath;
        let rotation = 0;
        let reversed = false;
        if (options.autoAlign) {
          ({ rotation, reversed } = bestAlignment(aligned[k - 1][slot], subpath, options.allowReverse));
          if (reversed) result = reverseSubpath(result);
          result = rotateSubpath(result, rotation);
        }
        if (reversed) steps.push({ kind: "reverse", text: `${labels[k]} · subpath ${slot + 1}: reversed direction so its points don't cross over.` });
        if (rotation !== 0) {
          steps.push({ kind: "rotate", text: `${labels[k]} · subpath ${slot + 1}: moved the start point ${rotation} segment${rotation === 1 ? "" : "s"} along to shorten travel.` });
        }
        return result;
      })
    );
  }
  const twisted = aligned.map((shape, k) =>
    k === 0 || options.startOffset === 0 ? shape : shape.map((subpath) => (subpath.closed ? rotateSubpath(subpath, options.startOffset * k) : subpath))
  );
  if (options.startOffset !== 0 && twisted.some((shape) => shape.some((subpath) => subpath.closed))) {
    steps.push({ kind: "rotate", text: `Manual offset: twisted each keyframe's start point ${options.startOffset} segment${Math.abs(options.startOffset) === 1 ? "" : "s"} relative to the one before.` });
  }

  const keyframes: KeyframeReport[] = paths.map((path, k) => ({
    label: labels[k],
    commandCounts: path.commandCounts,
    commandTotal: path.commandTotal,
    normalisedSubpaths: path.shape.length,
    normalisedSegments: path.shape.reduce((sum, subpath) => sum + subpath.segments.length, 0),
    matchedSubpaths: twisted[k].length,
    matchedSegments: twisted[k].reduce((sum, subpath) => sum + subpath.segments.length, 0)
  }));

  return {
    shapes: twisted,
    strings: twisted.map((shape) => shapeToPathData(shape)),
    viewBox: computeViewBox(twisted),
    report: { keyframes, steps, travelBefore, travelAfter: totalTravel(twisted) }
  };
}

// Reads every keyframe and, only if all of them parse, matches them — the preview and exports need the whole set at once.
export function buildMorph(state: Pick<SvgPathMorphState, "keyframes" | "autoAlign" | "allowReverse" | "startOffset">): MorphOutcome {
  const paths: NormalisedPath[] = [];
  for (let i = 0; i < state.keyframes.length; i++) {
    const read = readKeyframe(state.keyframes[i]);
    if (!read.ok) return { ok: false, keyframeIndex: i, error: read.error };
    paths.push(read.path);
  }
  return { ok: true, result: matchKeyframes(paths, state) };
}

// Number-by-number blend of two structurally identical shapes — the preview's whole morph, no library needed.
export function interpolateShape(a: CubicShape, b: CubicShape, t: number): CubicShape {
  const lerp = (p: number, q: number) => p + (q - p) * t;
  return a.map((subpath, i) => {
    const other = b[i];
    return {
      startX: lerp(subpath.startX, other.startX),
      startY: lerp(subpath.startY, other.startY),
      closed: subpath.closed,
      segments: subpath.segments.map((s, j) => {
        const o = other.segments[j];
        return { x1: lerp(s.x1, o.x1), y1: lerp(s.y1, o.y1), x2: lerp(s.x2, o.x2), y2: lerp(s.y2, o.y2), x: lerp(s.x, o.x), y: lerp(s.y, o.y) };
      })
    };
  });
}

/*
  A CSS-style cubic-bezier timing function: Newton steps to invert x(t), bisection as the fallback
  when the slope flattens — the same approach browsers use, so the preview eases like the exports.
*/
export function cubicBezierEasing([x1, y1, x2, y2]: [number, number, number, number]): (progress: number) => number {
  const ax = 3 * x1 - 3 * x2 + 1;
  const bx = 3 * x2 - 6 * x1;
  const cx = 3 * x1;
  const ay = 3 * y1 - 3 * y2 + 1;
  const by = 3 * y2 - 6 * y1;
  const cy = 3 * y1;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const slopeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  return (progress: number) => {
    if (progress <= 0) return 0;
    if (progress >= 1) return 1;
    let t = progress;
    for (let i = 0; i < 8; i++) {
      const error = sampleX(t) - progress;
      if (Math.abs(error) < 1e-6) return sampleY(t);
      const slope = slopeX(t);
      if (Math.abs(slope) < 1e-6) break;
      t -= error / slope;
    }
    let low = 0;
    let high = 1;
    t = progress;
    for (let i = 0; i < 30; i++) {
      const x = sampleX(t);
      if (Math.abs(x - progress) < 1e-6) break;
      if (x < progress) low = t;
      else high = t;
      t = (low + high) / 2;
    }
    return sampleY(t);
  };
}

/*
  The shape at overall progress p (0 → 1 across every keyframe), easing each keyframe-to-keyframe
  leg separately — matching CSS, where animation-timing-function applies per keyframe interval.
*/
export function sampleMorph(shapes: CubicShape[], progress: number, ease: (t: number) => number): CubicShape {
  const legs = shapes.length - 1;
  const scaled = Math.min(Math.max(progress, 0), 1) * legs;
  const leg = Math.min(Math.floor(scaled), legs - 1);
  return interpolateShape(shapes[leg], shapes[leg + 1], ease(scaled - leg));
}

// The anchor points of a shape, flattened across subpaths with the subpath each came from — what the flasks draw as matched-point markers.
export function shapeAnchors(shape: CubicShape): MorphAnchor[] {
  return shape.flatMap((subpath, s) => {
    const points = anchors(subpath);
    // A closed subpath's final anchor sits on its start; drawing it twice would double the start marker.
    const unique = subpath.closed ? points.slice(0, -1) : points;
    return unique.map((point, i) => ({ ...point, subpath: s, first: i === 0 }));
  });
}

// Seconds with no trailing zeros — CSS and SMIL both read `1.2s` more naturally than `1200ms` in a long shorthand.
function seconds(ms: number): string {
  return `${formatNumber(ms / 1000, 3)}s`;
}

// Fill or stroke presentation attributes for the exported markup, matching what the preview draws.
function presentationAttributes(state: SvgPathMorphState, result: MorphMatchResult): string {
  return state.renderMode === "stroke"
    ? `fill="none" stroke="currentColor" stroke-width="${strokeWidthFor(result.viewBox)}" stroke-linecap="round" stroke-linejoin="round"`
    : `fill="currentColor"`;
}

// The @keyframes export: one stop per keyframe, ping-ponging forever, with the browser-support caveat up front where it can't be missed.
export function toCssKeyframesExport(state: SvgPathMorphState, result: MorphMatchResult): string {
  const easing = getEasingMeta(state.easing);
  const legs = result.strings.length - 1;
  const stops = result.strings
    .map((d, i) => `  ${formatNumber((i / legs) * 100)}% {\n    d: path("${d}");\n  }`)
    .join("\n\n");
  return `/*
  Morphing \`d\` with CSS works in Chromium and Firefox. Safari doesn't support path() for the d
  property, so it keeps showing the markup's own d — use the SMIL export if Safari has to morph too.

  <svg viewBox="${viewBoxToString(result.viewBox)}" aria-hidden="true">
    <path class="path-morph" d="…keyframe A…" ${presentationAttributes(state, result)} />
  </svg>
*/
.path-morph {
  d: path("${result.strings[0]}");
  animation: path-morph ${seconds(state.durationMs * legs)} ${easing.css} infinite alternate;
}

@keyframes path-morph {
${stops}
}

@media (prefers-reduced-motion: reduce) {
  .path-morph {
    animation: none;
  }
}
`;
}

// The transition export: hover/class-toggled, so it only knows two states — A and B — and says so when there are more.
export function toCssTransitionExport(state: SvgPathMorphState, result: MorphMatchResult): string {
  const easing = getEasingMeta(state.easing);
  const note =
    result.strings.length > 2
      ? `\n  A transition only knows two states, so this pairs A with B — the @keyframes export\n  plays all ${result.strings.length} keyframes.\n`
      : "";
  return `/*
  Hover the icon (or toggle .is-morphed from script) to morph. CSS \`d\` transitions run in
  Chromium and Firefox; Safari doesn't support path() for d and simply shows the markup's d.
${note}
  <svg class="morph-icon" viewBox="${viewBoxToString(result.viewBox)}" aria-hidden="true">
    <path class="path-morph" d="…keyframe A…" ${presentationAttributes(state, result)} />
  </svg>
*/
.path-morph {
  d: path("${result.strings[0]}");
  transition: d ${state.durationMs}ms ${easing.css};
}

.morph-icon:hover .path-morph,
.morph-icon.is-morphed .path-morph {
  d: path("${result.strings[1]}");
}

@media (prefers-reduced-motion: reduce) {
  .path-morph {
    transition: none;
  }
}
`;
}

/*
  The SMIL export — values run A → … → last → … → A so the loop ping-pongs like the preview, with
  one keySplines entry per leg because calcMode="spline" eases each interval separately.
*/
export function toSmilExport(state: SvgPathMorphState, result: MorphMatchResult): string {
  const easing = getEasingMeta(state.easing);
  const sequence = [...result.strings, ...result.strings.slice(0, -1).reverse()];
  const intervals = sequence.length - 1;
  const keyTimes = sequence.map((_, i) => formatNumber(i / intervals, 4)).join("; ");
  const spline = easing.bezier.map((value) => formatNumber(value)).join(" ");
  const keySplines = Array.from({ length: intervals }, () => spline).join("; ");
  const values = sequence.map((d) => `        ${d}`).join(";\n");
  return `<!-- SMIL animates d everywhere, Safari included. It can't see prefers-reduced-motion, so pause it from script if that matters. -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBoxToString(result.viewBox)}" width="96" height="96" aria-hidden="true">
  <path d="${result.strings[0]}" ${presentationAttributes(state, result)}>
    <animate
      attributeName="d"
      dur="${seconds(state.durationMs * intervals)}"
      repeatCount="indefinite"
      calcMode="spline"
      keyTimes="${keyTimes}"
      keySplines="${keySplines}"
      values="
${values}"
    />
  </path>
</svg>
`;
}

// The react-spring export: one numeric spring driven through the matched strings, which react-spring's string interpolation tweens number by number.
export function toReactSpringExport(state: SvgPathMorphState, result: MorphMatchResult): string {
  const easing = getEasingMeta(state.easing);
  const paths = result.strings.map((d) => `  "${d}"`).join(",\n");
  const presentation =
    state.renderMode === "stroke"
      ? `fill="none" stroke="currentColor" strokeWidth={${strokeWidthFor(result.viewBox)}} strokeLinecap="round" strokeLinejoin="round"`
      : `fill="currentColor"`;
  return `// npm install @react-spring/web
import { useState } from "react";
import { animated, easings, useSpring } from "@react-spring/web";

// Matched keyframes — every one shares the same command sequence, so react-spring can tween each number.
const PATHS = [
${paths}
];

export default function PathMorph() {
  const [index, setIndex] = useState(0);
  const { progress } = useSpring({
    progress: index,
    config: { duration: ${state.durationMs}, easing: ${easing.spring} }
  });

  return (
    <button type="button" onClick={() => setIndex((i) => (i + 1) % PATHS.length)} aria-label="Morph the icon">
      <svg viewBox="${viewBoxToString(result.viewBox)}" width={96} height={96} aria-hidden="true">
        <animated.path
          d={progress.to({ range: PATHS.map((_, i) => i), output: PATHS })}
          ${presentation}
        />
      </svg>
    </button>
  );
}
`;
}

// Just the matched pair (or set) as data — for anyone wiring the strings into their own animation code.
export function toPathsExport(result: MorphMatchResult): string {
  return `${JSON.stringify({ viewBox: viewBoxToString(result.viewBox), paths: result.strings }, null, 2)}\n`;
}

// One elixir colour per keyframe, all theme tokens, so each flask's contents and its parchment label share a colour in every theme.
const ELIXIR_TONES = [
  "var(--color-fg-accent)",
  "var(--color-fg-danger)",
  "var(--color-fg-success)",
  "var(--color-fg-attention)",
  "color-mix(in oklab, var(--color-fg-danger) 50%, var(--color-fg-accent))",
  "color-mix(in oklab, var(--color-fg-success) 50%, var(--color-fg-accent))"
];

// The elixir colour for a keyframe, wrapping round if there are ever more keyframes than tones.
export function elixirTone(index: number): string {
  return ELIXIR_TONES[((index % ELIXIR_TONES.length) + ELIXIR_TONES.length) % ELIXIR_TONES.length];
}

// The mid-morph colour: the two neighbouring elixirs mixed by eased progress, so the alembic's contents visibly transmute.
export function blendedElixir(progress: number, keyframeCount: number, ease: (t: number) => number): string {
  const legs = Math.max(1, keyframeCount - 1);
  const scaled = Math.min(Math.max(progress, 0), 1) * legs;
  const leg = Math.min(Math.floor(scaled), legs - 1);
  const mix = Math.round(ease(scaled - leg) * 100);
  return `color-mix(in oklab, ${elixirTone(leg + 1)} ${mix}%, ${elixirTone(leg)})`;
}

// Matched-point colours stepped through four theme hues by index — the same index gets the same colour in both flasks, which is the whole point.
export function pointTone(index: number, count: number): string {
  const stops = ["var(--color-fg-accent)", "var(--color-fg-success)", "var(--color-fg-attention)", "var(--color-fg-danger)"];
  const position = count <= 1 ? 0 : (index / (count - 1)) * (stops.length - 1);
  const from = Math.min(Math.floor(position), stops.length - 2);
  const mix = Math.round((position - from) * 100);
  return `color-mix(in oklab, ${stops[from + 1]} ${mix}%, ${stops[from]})`;
}

// The astrolabe's scale runs through 270°, leaving a gap at the bottom so the start and end of the pass never share a mark.
export const DIAL_SWEEP_DEG = 270;

// Progress (0–1) as a dial angle in degrees clockwise from twelve o'clock.
export function progressToDialAngle(progress: number): number {
  return -DIAL_SWEEP_DEG / 2 + Math.min(Math.max(progress, 0), 1) * DIAL_SWEEP_DEG;
}

// The inverse — a pointer's angle round the dial back to progress, clamping the bottom gap to whichever end is nearer.
export function dialAngleToProgress(angleDeg: number): number {
  return Math.min(Math.max((angleDeg + DIAL_SWEEP_DEG / 2) / DIAL_SWEEP_DEG, 0), 1);
}

// A point on the dial at an angle (clockwise from twelve o'clock) and radius.
export function dialPoint(cx: number, cy: number, radius: number, angleDeg: number): MorphPoint {
  const radians = (angleDeg * Math.PI) / 180;
  return { x: cx + radius * Math.sin(radians), y: cy - radius * Math.cos(radians) };
}

// An SVG arc along the dial between two angles — the brass fill that shows how far through the pass the playhead is.
export function dialArc(cx: number, cy: number, radius: number, fromDeg: number, toDeg: number): string {
  const start = dialPoint(cx, cy, radius, fromDeg);
  const end = dialPoint(cx, cy, radius, toDeg);
  const large = toDeg - fromDeg > 180 ? 1 : 0;
  return `M ${formatNumber(start.x)} ${formatNumber(start.y)} A ${radius} ${radius} 0 ${large} 1 ${formatNumber(end.x)} ${formatNumber(end.y)}`;
}
