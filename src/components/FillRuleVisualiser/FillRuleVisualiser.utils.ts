import { toFixed } from "@/utils/number";
import type {
  FillRuleCrossing,
  FillRuleDirectionArrow,
  FillRuleExportFormat,
  FillRuleFlatSubpath,
  FillRuleGeometry,
  FillRuleName,
  FillRuleNode,
  FillRuleParseResult,
  FillRulePoint,
  FillRuleProbe,
  FillRuleRayResult,
  FillRuleSubpath,
  FillRuleWindingBucket,
  FillRuleWindingMap
} from "@/components/FillRuleVisualiser/FillRuleVisualiser.types";

// The light table's side length in viewBox units — big enough for whole-number coordinates to feel precise.
export const CANVAS_SIZE = 400;

// Margin kept clear when a pasted path is scaled onto the table, so its came never touches the frame.
const FIT_MARGIN = 40;

// Scanline height for the winding map — fine enough that the stair-step edges hide under the came stroke.
const MAP_ROW_HEIGHT = 2;

// Roughly how far apart direction chevrons sit along the came, in viewBox units.
const ARROW_SPACING = 95;

// Rounds a coordinate to one decimal place — precise enough to drag with, short enough to read in a d string.
export function round(value: number): number {
  return toFixed(value, 1);
}

// Prints a number without float noise or a trailing ".0", for compact d strings and readouts.
export function formatNumber(value: number): string {
  const rounded = round(value);
  return Object.is(rounded, -0) ? "0" : String(rounded);
}

// Normalises any angle into [0, 360) so the slider, the readout and the permalink all agree.
export function normaliseAngle(degrees: number): number {
  return ((degrees % 360) + 360) % 360;
}

// Sign-aware label for a winding contribution or total, using a true minus sign so it reads like maths.
export function formatSigned(value: number): string {
  if (value > 0) return `+${value}`;
  if (value < 0) return `−${Math.abs(value)}`;
  return "0";
}

// Point on a cubic Bézier at t, via the Bernstein form — the one curve type every pasted command reduces to.
function cubicPoint(p0: FillRulePoint, c1: FillRulePoint, c2: FillRulePoint, p3: FillRulePoint, t: number): FillRulePoint {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return { x: a * p0.x + b * c1.x + c * c2.x + d * p3.x, y: a * p0.y + b * c1.y + c * c2.y + d * p3.y };
}

// Plain distance between two points.
function distance(a: FillRulePoint, b: FillRulePoint): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

// Signed angle from vector u to vector v — the building block of the spec's arc centre parameterisation.
function vectorAngle(ux: number, uy: number, vx: number, vy: number): number {
  return Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
}

/*
  Converts an SVG elliptical arc (endpoint form) into cubic segments of at most 90° each, following
  the SVG spec's centre-parameterisation steps. Arcs are converted on paste so the rest of the tool
  only ever has to flatten, drag and reverse cubics.
*/
export function arcToCubics(
  from: FillRulePoint,
  rxIn: number,
  ryIn: number,
  rotationDeg: number,
  largeArc: boolean,
  sweep: boolean,
  to: FillRulePoint
): FillRuleNode[] {
  if (from.x === to.x && from.y === to.y) return [];
  let rx = Math.abs(rxIn);
  let ry = Math.abs(ryIn);
  if (rx === 0 || ry === 0) return [{ x: to.x, y: to.y }];

  const phi = (rotationDeg * Math.PI) / 180;
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
  const coefficient = (largeArc !== sweep ? 1 : -1) * Math.sqrt(Math.max(0, numerator / denominator));
  const cxp = (coefficient * rx * y1p) / ry;
  const cyp = (-coefficient * ry * x1p) / rx;
  const cx = cos * cxp - sin * cyp + (from.x + to.x) / 2;
  const cy = sin * cxp + cos * cyp + (from.y + to.y) / 2;

  const startAngle = vectorAngle(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry);
  let sweepAngle = vectorAngle((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry);
  if (!sweep && sweepAngle > 0) sweepAngle -= 2 * Math.PI;
  if (sweep && sweepAngle < 0) sweepAngle += 2 * Math.PI;

  const segments = Math.max(1, Math.ceil(Math.abs(sweepAngle) / (Math.PI / 2) - 1e-9));
  const delta = sweepAngle / segments;
  const handle = (4 / 3) * Math.tan(delta / 4);
  const map = (ux: number, uy: number): FillRulePoint => ({
    x: cx + rx * ux * cos - ry * uy * sin,
    y: cy + rx * ux * sin + ry * uy * cos
  });

  const nodes: FillRuleNode[] = [];
  for (let i = 0; i < segments; i++) {
    const a1 = startAngle + i * delta;
    const a2 = a1 + delta;
    const c1 = map(Math.cos(a1) - handle * Math.sin(a1), Math.sin(a1) + handle * Math.cos(a1));
    const c2 = map(Math.cos(a2) + handle * Math.sin(a2), Math.sin(a2) - handle * Math.cos(a2));
    const end = i === segments - 1 ? to : map(Math.cos(a2), Math.sin(a2));
    nodes.push({ x: end.x, y: end.y, c1, c2 });
  }
  return nodes;
}

// How many numeric arguments each path command consumes per repetition.
const ARG_COUNTS: Record<string, number> = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 };

// Tokenises a d string by hand rather than with a regex, because arc flags may be packed together ("a1 1 0 011 10").
function tokenise(d: string): { tokens: Array<string | number>; error: string | null } {
  const tokens: Array<string | number> = [];
  let i = 0;
  let command = "";
  let argIndex = 0;
  const numberPattern = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/;

  while (i < d.length) {
    const char = d[i];
    if (/[\s,]/.test(char)) {
      i++;
      continue;
    }
    if (/[MmLlHhVvCcSsQqTtAaZz]/.test(char)) {
      tokens.push(char);
      command = char.toUpperCase();
      argIndex = 0;
      i++;
      continue;
    }
    const isFlag = command === "A" && (argIndex % 7 === 3 || argIndex % 7 === 4);
    if (isFlag && (char === "0" || char === "1")) {
      tokens.push(Number(char));
      argIndex++;
      i++;
      continue;
    }
    const match = numberPattern.exec(d.slice(i));
    if (!match) return { tokens, error: `Unexpected “${char}” at character ${i + 1}.` };
    tokens.push(Number(match[0]));
    argIndex++;
    i += match[0].length;
  }
  return { tokens, error: null };
}

/*
  Parses a pasted d string into closed subpaths of line/cubic nodes. Handles every SVG path command,
  relative and absolute, including the implicit repeats after M (extra pairs become L). Quadratics
  are degree-elevated and arcs converted, so nothing downstream needs to know they existed.
*/
export function parsePathData(d: string): FillRuleParseResult {
  const { tokens, error } = tokenise(d);
  if (error) return { ok: false, error };
  if (tokens.length === 0) return { ok: false, error: "The path data is empty." };
  if (typeof tokens[0] !== "string" || tokens[0].toUpperCase() !== "M") {
    return { ok: false, error: "Path data has to start with a moveto (M or m) command." };
  }

  const subpaths: FillRuleSubpath[] = [];
  let current: FillRuleSubpath | null = null;
  let point: FillRulePoint = { x: 0, y: 0 };
  let start: FillRulePoint = { x: 0, y: 0 };
  let lastCubicControl: FillRulePoint | null = null;
  let lastQuadControl: FillRulePoint | null = null;
  let index = 0;

  // A drawing command straight after Z starts a fresh subpath at the old start point, as SVG specifies.
  const ensureSubpath = (): FillRuleSubpath => {
    if (!current) {
      current = { nodes: [{ x: start.x, y: start.y }] };
      subpaths.push(current);
    }
    return current;
  };

  // Closes the open subpath; a final node sitting on the start point is folded into node 0's closing curve.
  const closeSubpath = () => {
    const subpath = current;
    if (subpath && subpath.nodes.length > 1) {
      const last = subpath.nodes[subpath.nodes.length - 1];
      const first = subpath.nodes[0];
      if (Math.abs(last.x - first.x) < 1e-6 && Math.abs(last.y - first.y) < 1e-6) {
        subpath.nodes.pop();
        if (last.c1 && last.c2) subpath.nodes[0] = { ...first, c1: last.c1, c2: last.c2 };
      }
    }
    current = null;
    point = { ...start };
  };

  while (index < tokens.length) {
    const token = tokens[index];
    if (typeof token !== "string") return { ok: false, error: `Found a number where a command letter was expected (token ${index + 1}).` };
    const command = token.toUpperCase();
    const relative = token !== command;
    index++;

    if (command === "Z") {
      closeSubpath();
      lastCubicControl = null;
      lastQuadControl = null;
      continue;
    }

    const argCount = ARG_COUNTS[command];
    let first = true;
    do {
      const args = tokens.slice(index, index + argCount);
      if (args.length < argCount || args.some((arg) => typeof arg !== "number")) {
        return { ok: false, error: `The ${token} command needs ${argCount} numbers.` };
      }
      index += argCount;
      const n = args as number[];
      const ox = relative ? point.x : 0;
      const oy = relative ? point.y : 0;
      let nextCubic: FillRulePoint | null = null;
      let nextQuad: FillRulePoint | null = null;

      if (command === "M" && first) {
        if (current) closeSubpath();
        point = { x: ox + n[0], y: oy + n[1] };
        start = { ...point };
        current = { nodes: [{ ...point }] };
        subpaths.push(current);
      } else if (command === "M" || command === "L") {
        point = { x: ox + n[0], y: oy + n[1] };
        ensureSubpath().nodes.push({ ...point });
      } else if (command === "H") {
        point = { x: ox + n[0], y: point.y };
        ensureSubpath().nodes.push({ ...point });
      } else if (command === "V") {
        point = { x: point.x, y: oy + n[0] };
        ensureSubpath().nodes.push({ ...point });
      } else if (command === "C" || command === "S") {
        const c1: FillRulePoint =
          command === "C"
            ? { x: ox + n[0], y: oy + n[1] }
            : lastCubicControl
              ? { x: 2 * point.x - lastCubicControl.x, y: 2 * point.y - lastCubicControl.y }
              : { ...point };
        const rest = command === "C" ? n.slice(2) : n;
        const c2 = { x: ox + rest[0], y: oy + rest[1] };
        point = { x: ox + rest[2], y: oy + rest[3] };
        ensureSubpath().nodes.push({ ...point, c1, c2 });
        nextCubic = c2;
      } else if (command === "Q" || command === "T") {
        const q: FillRulePoint =
          command === "Q"
            ? { x: ox + n[0], y: oy + n[1] }
            : lastQuadControl
              ? { x: 2 * point.x - lastQuadControl.x, y: 2 * point.y - lastQuadControl.y }
              : { ...point };
        const end = command === "Q" ? { x: ox + n[2], y: oy + n[3] } : { x: ox + n[0], y: oy + n[1] };
        const c1 = { x: point.x + (2 / 3) * (q.x - point.x), y: point.y + (2 / 3) * (q.y - point.y) };
        const c2 = { x: end.x + (2 / 3) * (q.x - end.x), y: end.y + (2 / 3) * (q.y - end.y) };
        point = end;
        ensureSubpath().nodes.push({ ...point, c1, c2 });
        nextQuad = q;
      } else if (command === "A") {
        const end = { x: ox + n[5], y: oy + n[6] };
        ensureSubpath().nodes.push(...arcToCubics(point, n[0], n[1], n[2], n[3] !== 0, n[4] !== 0, end));
        point = end;
      }

      lastCubicControl = nextCubic;
      lastQuadControl = nextQuad;
      first = false;
    } while (argCount > 0 && index < tokens.length && typeof tokens[index] === "number");
  }
  closeSubpath();

  const kept = subpaths.filter((subpath) => subpath.nodes.length > 0);
  if (kept.length === 0) return { ok: false, error: "The path data doesn’t contain any points." };
  return { ok: true, subpaths: kept };
}

// The cubic (or straight line) arriving at node i, as start/control/control/end — the one place that knows node 0 carries the closing edge.
function segmentInto(nodes: FillRuleNode[], i: number): { from: FillRulePoint; to: FillRuleNode } {
  const from = nodes[(i - 1 + nodes.length) % nodes.length];
  return { from, to: nodes[i] };
}

// Serialises subpaths back into a compact absolute d string; every subpath ends in Z because fill closes them anyway.
export function serialisePathData(subpaths: FillRuleSubpath[]): string {
  return subpaths
    .filter((subpath) => subpath.nodes.length > 0)
    .map(({ nodes }) => {
      const p = (point: FillRulePoint) => `${formatNumber(point.x)} ${formatNumber(point.y)}`;
      const parts = [`M${p(nodes[0])}`];
      for (let i = 1; i < nodes.length; i++) {
        const node = nodes[i];
        parts.push(node.c1 && node.c2 ? `C${p(node.c1)} ${p(node.c2)} ${p(node)}` : `L${p(node)}`);
      }
      const closing = nodes[0];
      if (nodes.length > 1 && closing.c1 && closing.c2) parts.push(`C${p(closing.c1)} ${p(closing.c2)} ${p(closing)}`);
      parts.push("Z");
      return parts.join(" ");
    })
    .join(" ");
}

/*
  Reverses a subpath's drawing direction while keeping node 0 as its start, swapping each cubic's
  control points as its edge flips. This is the "reverse subpath" button's whole job: every crossing
  on this piece of came changes sign, so a nonzero hole can open or close.
*/
export function reverseSubpath(subpath: FillRuleSubpath): FillRuleSubpath {
  const { nodes } = subpath;
  const n = nodes.length;
  if (n < 2) return subpath;
  const reversed: FillRuleNode[] = [];
  for (let j = 0; j < n; j++) {
    const anchor = nodes[(n - j) % n];
    const carrier = nodes[(n - j + 1) % n];
    const node: FillRuleNode = { x: anchor.x, y: anchor.y };
    if (carrier.c1 && carrier.c2) {
      node.c1 = { ...carrier.c2 };
      node.c2 = { ...carrier.c1 };
    }
    reversed.push(node);
  }
  return { nodes: reversed };
}

// Samples each subpath into a closed polygon — the shared input for ray casting, the winding map and the arrows.
export function flattenSubpaths(subpaths: FillRuleSubpath[]): FillRuleFlatSubpath[] {
  return subpaths.flatMap((subpath, index) => {
    const { nodes } = subpath;
    if (nodes.length < 2) return [];
    const points: FillRulePoint[] = [{ x: nodes[0].x, y: nodes[0].y }];
    for (let k = 1; k <= nodes.length; k++) {
      const i = k % nodes.length;
      const { from, to } = segmentInto(nodes, i);
      if (to.c1 && to.c2) {
        const hull = distance(from, to.c1) + distance(to.c1, to.c2) + distance(to.c2, to);
        const steps = Math.min(64, Math.max(6, Math.ceil(hull / 5)));
        for (let s = 1; s <= steps; s++) points.push(cubicPoint(from, to.c1, to.c2, to, s / steps));
      } else {
        points.push({ x: to.x, y: to.y });
      }
    }
    // The last sample duplicates node 0; dropping it keeps the implicit closing edge from being zero length.
    points.pop();
    return [{ subpath: index, points }];
  });
}

/*
  Casts the plumb line through every flattened edge. Each edge is moved into the ray's own frame
  (u along the ray, v to its clockwise side), so one half-open test works at any angle: an edge
  crossing v = 0 towards +v counts +1, the other way −1. For a rightward ray that is "edge drawn
  downwards scores +1", the same convention as the post's pentagram diagram.
*/
export function castRay(flat: FillRuleFlatSubpath[], probe: FillRuleProbe): FillRuleRayResult {
  const radians = (probe.angle * Math.PI) / 180;
  const dx = Math.cos(radians);
  const dy = Math.sin(radians);
  const hits: Omit<FillRuleCrossing, "running">[] = [];

  for (const { subpath, points } of flat) {
    for (let i = 0; i < points.length; i++) {
      const a = points[i];
      const b = points[(i + 1) % points.length];
      const ax = a.x - probe.x;
      const ay = a.y - probe.y;
      const bx = b.x - probe.x;
      const by = b.y - probe.y;
      const av = -ax * dy + ay * dx;
      const bv = -bx * dy + by * dx;
      let sign: 1 | -1;
      if (av <= 0 && bv > 0) sign = 1;
      else if (bv <= 0 && av > 0) sign = -1;
      else continue;
      const t = av / (av - bv);
      const au = ax * dx + ay * dy;
      const bu = bx * dx + by * dy;
      const u = au + t * (bu - au);
      if (u <= 0) continue;
      hits.push({
        x: a.x + t * (b.x - a.x),
        y: a.y + t * (b.y - a.y),
        distance: u,
        sign,
        subpath,
        tangent: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI
      });
    }
  }

  hits.sort((p, q) => p.distance - q.distance);
  let running = 0;
  const crossings = hits.map((hit) => {
    running += hit.sign;
    return { ...hit, running };
  });
  return {
    crossings,
    winding: running,
    count: crossings.length,
    nonzeroInside: running !== 0,
    evenoddInside: crossings.length % 2 === 1
  };
}

// Folds a winding number into its tint bucket; anything past ±2 shares the outermost glass.
function bucketFor(winding: number): FillRuleWindingBucket {
  if (winding <= -2) return "-2";
  if (winding >= 2) return "2";
  return winding < 0 ? "-1" : "1";
}

/*
  Builds the winding map by scanline: each row's edge crossings are sorted left to right and the
  winding number stepped across them, so every run between two crossings is exact horizontally and
  only quantised vertically. Far cheaper than testing a grid of points, and cheap enough to rerun on
  every frame of a drag.
*/
export function buildWindingMap(flat: FillRuleFlatSubpath[]): FillRuleWindingMap {
  const tints: Record<FillRuleWindingBucket, string[]> = { "-2": [], "-1": [], "1": [], "2": [] };
  const evenEnclosed: string[] = [];

  for (let top = 0; top < CANVAS_SIZE; top += MAP_ROW_HEIGHT) {
    const y = top + MAP_ROW_HEIGHT / 2;
    const row: Array<{ x: number; sign: number }> = [];
    for (const { points } of flat) {
      for (let i = 0; i < points.length; i++) {
        const a = points[i];
        const b = points[(i + 1) % points.length];
        if (a.y <= y && b.y > y) row.push({ x: a.x + ((y - a.y) / (b.y - a.y)) * (b.x - a.x), sign: 1 });
        else if (b.y <= y && a.y > y) row.push({ x: a.x + ((y - a.y) / (b.y - a.y)) * (b.x - a.x), sign: -1 });
      }
    }
    if (row.length < 2) continue;
    row.sort((p, q) => p.x - q.x);

    let winding = 0;
    for (let i = 0; i < row.length - 1; i++) {
      winding -= row[i].sign;
      const x0 = Math.max(0, row[i].x);
      const x1 = Math.min(CANVAS_SIZE, row[i + 1].x);
      if (winding === 0 || x1 <= x0) continue;
      const rect = `M${formatNumber(x0)} ${top}h${formatNumber(x1 - x0)}v${MAP_ROW_HEIGHT}h${formatNumber(x0 - x1)}z`;
      tints[bucketFor(winding)].push(rect);
      if (winding % 2 === 0) evenEnclosed.push(rect);
    }
  }

  return {
    tints: { "-2": tints["-2"].join(""), "-1": tints["-1"].join(""), "1": tints["1"].join(""), "2": tints["2"].join("") },
    evenEnclosed: evenEnclosed.join("")
  };
}

// Places direction chevrons evenly along each subpath's flattened length, so short subpaths still get at least two.
export function buildDirectionArrows(flat: FillRuleFlatSubpath[]): FillRuleDirectionArrow[] {
  const arrows: FillRuleDirectionArrow[] = [];
  for (const { subpath, points } of flat) {
    const lengths = points.map((point, i) => distance(point, points[(i + 1) % points.length]));
    const total = lengths.reduce((sum, length) => sum + length, 0);
    if (total === 0) continue;
    const count = Math.max(2, Math.round(total / ARROW_SPACING));
    let edge = 0;
    let walked = 0;
    for (let k = 0; k < count; k++) {
      const target = ((k + 0.5) / count) * total;
      while (edge < lengths.length - 1 && walked + lengths[edge] < target) {
        walked += lengths[edge];
        edge++;
      }
      const a = points[edge];
      const b = points[(edge + 1) % points.length];
      const t = lengths[edge] === 0 ? 0 : (target - walked) / lengths[edge];
      arrows.push({
        x: a.x + t * (b.x - a.x),
        y: a.y + t * (b.y - a.y),
        angle: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI,
        subpath
      });
    }
  }
  return arrows;
}

// Shoelace area of a flattened polygon — positive means clockwise on screen, the direction nonzero counts as +1.
export function signedArea(points: FillRulePoint[]): number {
  let sum = 0;
  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    sum += a.x * b.y - b.x * a.y;
  }
  return sum / 2;
}

// Derives everything the panels draw from the raw subpaths in one pass, so each change flattens once.
export function buildGeometry(subpaths: FillRuleSubpath[]): FillRuleGeometry {
  const flat = flattenSubpaths(subpaths);
  const areas = subpaths.map((_, index) => {
    const entry = flat.find((item) => item.subpath === index);
    return entry ? signedArea(entry.points) : 0;
  });
  return {
    d: serialisePathData(subpaths),
    flat,
    map: buildWindingMap(flat),
    arrows: buildDirectionArrows(flat),
    areas
  };
}

// Applies one affine map to every anchor and control point, so fitting a pasted path keeps its curves intact.
function transformSubpaths(subpaths: FillRuleSubpath[], map: (point: FillRulePoint) => FillRulePoint): FillRuleSubpath[] {
  return subpaths.map(({ nodes }) => ({
    nodes: nodes.map((node) => {
      const anchor = map(node);
      const next: FillRuleNode = { x: round(anchor.x), y: round(anchor.y) };
      if (node.c1 && node.c2) {
        const c1 = map(node.c1);
        const c2 = map(node.c2);
        next.c1 = { x: round(c1.x), y: round(c1.y) };
        next.c2 = { x: round(c2.x), y: round(c2.y) };
      }
      return next;
    })
  }));
}

/*
  Scales and centres a pasted path onto the light table when it would otherwise spill off it or be
  too small to drag (24-unit icon paths are the usual case). A path that already fits is left
  exactly as pasted, so its d string round-trips unchanged.
*/
export function fitToCanvas(subpaths: FillRuleSubpath[]): { subpaths: FillRuleSubpath[]; fitted: boolean } {
  const xs: number[] = [];
  const ys: number[] = [];
  for (const { nodes } of subpaths) {
    for (const node of nodes) {
      for (const point of [node, node.c1, node.c2]) {
        if (!point) continue;
        xs.push(point.x);
        ys.push(point.y);
      }
    }
  }
  if (xs.length === 0) return { subpaths, fitted: false };
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const width = maxX - minX;
  const height = maxY - minY;
  const fits = minX >= 0 && minY >= 0 && maxX <= CANVAS_SIZE && maxY <= CANVAS_SIZE && Math.max(width, height) >= 60;
  if (fits) return { subpaths: transformSubpaths(subpaths, (point) => point), fitted: false };

  const available = CANVAS_SIZE - FIT_MARGIN * 2;
  const scale = available / Math.max(width, height, 1e-6);
  const offsetX = (CANVAS_SIZE - width * scale) / 2;
  const offsetY = (CANVAS_SIZE - height * scale) / 2;
  return {
    subpaths: transformSubpaths(subpaths, (point) => ({ x: offsetX + (point.x - minX) * scale, y: offsetY + (point.y - minY) * scale })),
    fitted: true
  };
}

// Plain-English compass direction for an edge's drawing angle, so screen readers hear more than a number.
export function describeDirection(degrees: number): string {
  const names = ["right", "down-right", "down", "down-left", "left", "up-left", "up", "up-right"];
  return names[Math.round(normaliseAngle(degrees) / 45) % 8];
}

// One-sentence verdict for a ray, shared by the visual readout's heading and the polite live region.
export function describeRay(probe: FillRuleProbe, ray: FillRuleRayResult): string {
  const origin = `Ray from ${formatNumber(probe.x)}, ${formatNumber(probe.y)} at ${formatNumber(normaliseAngle(probe.angle))}°`;
  const crossings = `crosses ${ray.count} ${ray.count === 1 ? "edge" : "edges"}`;
  const nonzero = `nonzero: winding ${formatSigned(ray.winding)}, ${ray.nonzeroInside ? "inside, filled" : "outside, empty"}`;
  const evenodd = `evenodd: ${ray.count % 2 === 1 ? "odd" : "even"}, ${ray.evenoddInside ? "inside, filled" : "outside, empty"}`;
  return `${origin} ${crossings}. ${nonzero}. ${evenodd}.`;
}

// Standalone SVG export — the attribute form of fill-rule on a plain <path>.
export function toSvgMarkup(d: string, rule: FillRuleName): string {
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}" width="${CANVAS_SIZE}" height="${CANVAS_SIZE}">`,
    `  <path d="${d}" fill="currentColor" fill-rule="${rule}" />`,
    "</svg>"
  ].join("\n");
}

// The CSS property forms: fill-rule for painting, clip-rule for when the same path sits inside a <clipPath>.
export function toCssRules(_d: string, rule: FillRuleName): string {
  return [
    "/* Painting: the property form of the fill-rule attribute */",
    ".glass-pane path {",
    `  fill-rule: ${rule};`,
    "}",
    "",
    "/* Clipping: inside a <clipPath>, the region follows clip-rule instead */",
    "clipPath path {",
    `  clip-rule: ${rule};`,
    "}"
  ].join("\n");
}

// clip-path: path() takes the rule as its optional first argument — the only way to choose evenodd without any SVG markup.
export function toClipPathCss(d: string, rule: FillRuleName): string {
  return [".glass-pane {", `  inline-size: ${CANVAS_SIZE}px;`, `  block-size: ${CANVAS_SIZE}px;`, `  clip-path: path(${rule}, '${d}');`, "}"].join("\n");
}

// A drop-in React component — the camelCased fillRule prop is the one JSX detail people trip over.
export function toJsx(d: string, rule: FillRuleName): string {
  return [
    'import type { SVGProps } from "react";',
    "",
    "export function GlassPane(props: SVGProps<SVGSVGElement>) {",
    "  return (",
    `    <svg viewBox="0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}" width={${CANVAS_SIZE}} height={${CANVAS_SIZE}} {...props}>`,
    `      <path d="${d}" fill="currentColor" fillRule="${rule}" />`,
    "    </svg>",
    "  );",
    "}"
  ].join("\n");
}

// The export tabs in display order, each pairing a formatter with the Shiki grammar that highlights it.
export const EXPORT_FORMATS: FillRuleExportFormat[] = [
  { id: "svg", label: "SVG", language: "xml", build: toSvgMarkup },
  { id: "css", label: "CSS", language: "css", build: toCssRules },
  { id: "clip-path", label: "clip-path", language: "css", build: toClipPathCss },
  { id: "jsx", label: "JSX", language: "tsx", build: toJsx }
];
