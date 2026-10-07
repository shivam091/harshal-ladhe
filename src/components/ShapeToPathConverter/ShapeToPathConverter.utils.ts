import { toFixed } from "@/utils/number";
import type {
  CircleShape,
  EllipseShape,
  LineShape,
  PasteConversion,
  PastedShapeResult,
  PathCoordinateMode,
  PathStep,
  PointsShape,
  RectShape,
  Shape,
  ShapeBounds,
  ShapeConversion,
  ShapeKind,
  ShapePoint
} from "@/components/ShapeToPathConverter/ShapeToPathConverter.types";

// Explanations quote coordinates at a fixed, readable precision, independent of the output precision setting.
const EXPLANATION_DECIMALS = 2;

// Enough samples per arc that a quarter-ellipse's extreme lands within a hair of its true value.
const ARC_SAMPLES = 48;

// Every tag the converter rewrites — the six basic shapes, and nothing that already is a path.
export const SHAPE_KINDS: ShapeKind[] = ["rect", "circle", "ellipse", "line", "polyline", "polygon"];

// The geometry attributes each tag owns; everything else (fill, stroke, class, transform…) carries over to the `<path>`.
const GEOMETRY_ATTRIBUTES: Record<ShapeKind, string[]> = {
  rect: ["x", "y", "width", "height", "rx", "ry"],
  circle: ["cx", "cy", "r"],
  ellipse: ["cx", "cy", "rx", "ry"],
  line: ["x1", "y1", "x2", "y2"],
  polyline: ["points"],
  polygon: ["points"]
};

/*
  Rounds to the chosen precision and prints without trailing zeros. Also folds -0 into 0, which
  rounding a tiny negative produces and which would otherwise print as a confusing "-0".
*/
export function formatNumber(value: number, precision: number): string {
  const rounded = toFixed(value, precision);
  return String(Object.is(rounded, -0) ? 0 : rounded);
}

// Readable "(x, y)" for the explanation text.
function formatPoint(point: ShapePoint): string {
  return `(${formatNumber(point.x, EXPLANATION_DECIMALS)}, ${formatNumber(point.y, EXPLANATION_DECIMALS)})`;
}

// Short alias for the explanation text, which quotes a lot of numbers.
function n(value: number): string {
  return formatNumber(value, EXPLANATION_DECIMALS);
}

// Whether two points coincide closely enough that a segment between them would be invisible.
function samePoint(a: ShapePoint, b: ShapePoint): boolean {
  return Math.abs(a.x - b.x) < 1e-9 && Math.abs(a.y - b.y) < 1e-9;
}

/*
  Picks H or V when a straight segment runs along an axis (the shorter command a hand-written path
  would use), and L otherwise — each with its own explanation tail.
*/
function straightStep(from: ShapePoint, to: ShapePoint, explanation: string): PathStep {
  if (from.y === to.y && from.x !== to.x) return { command: "H", from, to, explanation };
  if (from.x === to.x && from.y !== to.y) return { command: "V", from, to, explanation };
  return { command: "L", from, to, explanation };
}

/*
  Applies the SVG 2 rules for a rect's corner radii in spec order: an absent (or negative, which
  is invalid) radius mirrors the other one, two absent radii mean square corners, and then each
  radius is clamped to half the rect's own size on its own axis. Returns the working-out lines too,
  so the breakdown can show every rule that actually fired.
*/
export function resolveRectRadii(rect: RectShape): { rx: number; ry: number; working: string[] } {
  const working: string[] = [];
  let rx = rect.rx;
  let ry = rect.ry;

  if (rx !== null && rx < 0) {
    working.push(`rx = ${n(rx)} is negative, which is invalid geometry, so it is treated as auto.`);
    rx = null;
  }
  if (ry !== null && ry < 0) {
    working.push(`ry = ${n(ry)} is negative, which is invalid geometry, so it is treated as auto.`);
    ry = null;
  }

  if (rx === null && ry === null) {
    working.push("Neither rx nor ry is set, so both are 0 and the corners stay square.");
    return { rx: 0, ry: 0, working };
  }
  if (rx === null && ry !== null) {
    rx = ry;
    working.push(`rx is auto, so it mirrors ry: rx = ${n(rx)}.`);
  } else if (ry === null && rx !== null) {
    ry = rx;
    working.push(`ry is auto, so it mirrors rx: ry = ${n(ry)}.`);
  }

  const halfWidth = rect.width / 2;
  const halfHeight = rect.height / 2;
  let resolvedRx = rx ?? 0;
  let resolvedRy = ry ?? 0;

  if (resolvedRx > halfWidth) {
    working.push(`rx = ${n(resolvedRx)} is more than width / 2 = ${n(halfWidth)}, so it is clamped to ${n(halfWidth)}.`);
    resolvedRx = halfWidth;
  } else {
    working.push(`rx ≤ width / 2 = ${n(halfWidth)}, so rx stays ${n(resolvedRx)}.`);
  }
  if (resolvedRy > halfHeight) {
    working.push(`ry = ${n(resolvedRy)} is more than height / 2 = ${n(halfHeight)}, so it is clamped to ${n(halfHeight)}.`);
    resolvedRy = halfHeight;
  } else {
    working.push(`ry ≤ height / 2 = ${n(halfHeight)}, so ry stays ${n(resolvedRy)}.`);
  }

  if (resolvedRx === 0 || resolvedRy === 0) {
    working.push("One radius is 0, so a corner has nothing to curve round: the corners stay square.");
    return { rx: 0, ry: 0, working };
  }
  return { rx: resolvedRx, ry: resolvedRy, working };
}

/*
  A rect becomes four edges, with a quarter-arc at each corner when it is rounded. Starts on the
  top edge, rx in from the top-left corner, and runs clockwise, the same order the SVG 2 spec uses
  for a rect's equivalent path, so the result matches what the browser itself would draw.
*/
function convertRect(rect: RectShape): ShapeConversion {
  const given = `Given: x = ${n(rect.x)}, y = ${n(rect.y)}, width = ${n(rect.width)}, height = ${n(rect.height)}, rx = ${rect.rx === null ? "auto" : n(rect.rx)}, ry = ${rect.ry === null ? "auto" : n(rect.ry)}.`;

  if (rect.width < 0 || rect.height < 0) {
    return { steps: [], working: [given], warning: "A negative width or height is invalid geometry, so the rect is not rendered and there is no path to draw." };
  }
  if (rect.width === 0 || rect.height === 0) {
    return { steps: [], working: [given], warning: "A width or height of 0 disables rendering, so the rect draws nothing and there is no path to draw." };
  }

  const { rx, ry, working } = resolveRectRadii(rect);
  const { x, y, width: w, height: h } = rect;
  const right = x + w;
  const bottom = y + h;

  if (rx === 0) {
    const tl = { x, y };
    const tr = { x: right, y };
    const br = { x: right, y: bottom };
    const bl = { x, y: bottom };
    return {
      working: [given, ...working],
      warning: null,
      steps: [
        { command: "M", from: { x: 0, y: 0 }, to: tl, explanation: `Move to the top-left corner ${formatPoint(tl)}, the rect's own (x, y).` },
        straightStep(tl, tr, `Horizontal line along the top edge to the top-right corner, x + width = ${n(right)}.`),
        straightStep(tr, br, `Vertical line down the right edge to the bottom-right corner, y + height = ${n(bottom)}.`),
        straightStep(br, bl, `Horizontal line back along the bottom edge to the bottom-left corner, x = ${n(x)}.`),
        { command: "Z", from: bl, to: tl, explanation: "Close the path: Z draws the left edge back up to the top-left corner and joins the stroke there." }
      ]
    };
  }

  const p0 = { x: x + rx, y };
  const p1 = { x: right - rx, y };
  const p2 = { x: right, y: y + ry };
  const p3 = { x: right, y: bottom - ry };
  const p4 = { x: right - rx, y: bottom };
  const p5 = { x: x + rx, y: bottom };
  const p6 = { x, y: bottom - ry };
  const p7 = { x, y: y + ry };
  const arc = { rx, ry, largeArc: 0 as const, sweep: 1 as const };
  const arcTail = `${n(rx)} × ${n(ry)} radii, no x-axis rotation (0), the small arc (0), clockwise sweep (1)`;

  const steps: PathStep[] = [
    { command: "M", from: { x: 0, y: 0 }, to: p0, explanation: `Move to ${formatPoint(p0)}: the top-left corner, moved rx = ${n(rx)} along the top edge so the straight run starts after the rounded corner.` }
  ];
  // A radius of exactly half the size leaves no straight run on that edge, so its H or V is dropped rather than written as a zero-length line.
  if (!samePoint(p0, p1)) steps.push(straightStep(p0, p1, `Horizontal line along the top edge to x = ${n(p1.x)}, stopping rx short of the top-right corner.`));
  steps.push({ command: "A", from: p1, to: p2, arc, explanation: `Quarter-arc round the top-right corner: ${arcTail}, landing ry down the right edge at ${formatPoint(p2)}.` });
  if (!samePoint(p2, p3)) steps.push(straightStep(p2, p3, `Vertical line down the right edge to y = ${n(p3.y)}, stopping ry short of the bottom-right corner.`));
  steps.push({ command: "A", from: p3, to: p4, arc, explanation: `Quarter-arc round the bottom-right corner, landing rx in from the right on the bottom edge at ${formatPoint(p4)}.` });
  if (!samePoint(p4, p5)) steps.push(straightStep(p4, p5, `Horizontal line back along the bottom edge to x = ${n(p5.x)}, stopping rx short of the bottom-left corner.`));
  steps.push({ command: "A", from: p5, to: p6, arc, explanation: `Quarter-arc round the bottom-left corner, landing ry up the left edge at ${formatPoint(p6)}.` });
  if (!samePoint(p6, p7)) steps.push(straightStep(p6, p7, `Vertical line up the left edge to y = ${n(p7.y)}, stopping ry short of the top-left corner.`));
  steps.push({ command: "A", from: p7, to: p0, arc, explanation: `Quarter-arc round the top-left corner, landing back on the start point ${formatPoint(p0)}.` });
  steps.push({ command: "Z", from: p0, to: p0, explanation: "Close the path. The last arc already landed on the start point, so Z adds no visible edge, but it joins the stroke there instead of leaving two loose ends." });

  if (samePoint(p0, p1) || samePoint(p2, p3)) {
    working.push("A radius equal to half the size leaves no straight run on that edge, so its line command is left out.");
  }

  return { steps, working: [given, ...working], warning: null };
}

/*
  Shared by circle and ellipse: two half-arcs, split at the leftmost and rightmost points. One arc
  cannot do it, because an A command whose end point equals its start point is dropped entirely.
*/
function convertOval(cx: number, cy: number, rx: number, ry: number, label: "circle" | "ellipse"): PathStep[] {
  const start = { x: cx + rx, y: cy };
  const opposite = { x: cx - rx, y: cy };
  const arc = { rx, ry, largeArc: 1 as const, sweep: 1 as const };
  const radii = label === "circle" ? `radius r = ${n(rx)} on both axes` : `radii rx = ${n(rx)} and ry = ${n(ry)}`;
  const rightLabel = label === "circle" ? "(cx + r, cy)" : "(cx + rx, cy)";
  const leftLabel = label === "circle" ? "(cx − r, cy)" : "(cx − rx, cy)";

  return [
    { command: "M", from: { x: 0, y: 0 }, to: start, explanation: `Move to the rightmost point ${rightLabel} = ${formatPoint(start)}, where the first half begins.` },
    {
      command: "A",
      from: start,
      to: opposite,
      arc,
      explanation: `Half-arc clockwise (sweep 1) through the bottom to the leftmost point ${leftLabel} = ${formatPoint(opposite)}, ${radii}. For an exact half, either large-arc flag draws the same curve; 1 is written by convention.`
    },
    { command: "A", from: opposite, to: start, arc, explanation: `Second half-arc, still clockwise, back over the top to the start point ${formatPoint(start)}.` },
    { command: "Z", from: start, to: start, explanation: "Close the path so the stroke joins cleanly where the two halves meet, rather than leaving two butt ends." }
  ];
}

// Why a full ring needs two arcs; shown in the working for both oval shapes.
const TWO_ARCS_NOTE =
  "Why two arcs? An A command draws from the pen's current point to an end point. A full loop would end exactly where it started, and SVG skips any arc whose end point equals its start point, so it would draw nothing. Splitting the loop at its leftmost and rightmost points gives two half-arcs with distinct ends.";

// A circle is an ellipse with one radius, so it shares the oval steps.
function convertCircle(circle: CircleShape): ShapeConversion {
  const given = `Given: cx = ${n(circle.cx)}, cy = ${n(circle.cy)}, r = ${n(circle.r)}.`;
  if (circle.r < 0) return { steps: [], working: [given], warning: "A negative r is invalid geometry, so the circle is not rendered." };
  if (circle.r === 0) return { steps: [], working: [given], warning: "r = 0 disables rendering, so the circle draws nothing and there is no path to draw." };
  return { steps: convertOval(circle.cx, circle.cy, circle.r, circle.r, "circle"), working: [given, TWO_ARCS_NOTE], warning: null };
}

// Same two half-arcs as a circle, with separate horizontal and vertical radii.
function convertEllipse(ellipse: EllipseShape): ShapeConversion {
  const given = `Given: cx = ${n(ellipse.cx)}, cy = ${n(ellipse.cy)}, rx = ${n(ellipse.rx)}, ry = ${n(ellipse.ry)}.`;
  if (ellipse.rx < 0 || ellipse.ry < 0) return { steps: [], working: [given], warning: "A negative radius is invalid geometry, so the ellipse is not rendered." };
  if (ellipse.rx === 0 || ellipse.ry === 0) return { steps: [], working: [given], warning: "A radius of 0 disables rendering, so the ellipse draws nothing and there is no path to draw." };
  return { steps: convertOval(ellipse.cx, ellipse.cy, ellipse.rx, ellipse.ry, "ellipse"), working: [given, TWO_ARCS_NOTE], warning: null };
}

// A line is the smallest path there is: one move, one straight segment.
function convertLine(line: LineShape): ShapeConversion {
  const start = { x: line.x1, y: line.y1 };
  const end = { x: line.x2, y: line.y2 };
  const given = `Given: (x1, y1) = ${formatPoint(start)}, (x2, y2) = ${formatPoint(end)}.`;
  const segment = straightStep(start, end, "");
  const tail =
    segment.command === "H"
      ? "y1 equals y2, so the shorter H command only needs the new x."
      : segment.command === "V"
        ? "x1 equals x2, so the shorter V command only needs the new y."
        : "Two points define one straight segment.";
  return {
    working: [given, "A <line> is two points, so its path is one move and one line. It is never closed, so there is no Z."],
    warning: null,
    steps: [
      { command: "M", from: { x: 0, y: 0 }, to: start, explanation: `Move to the starting point (x1, y1) = ${formatPoint(start)}.` },
      { ...segment, explanation: `Line to the end point (x2, y2) = ${formatPoint(end)}. ${tail}` }
    ]
  };
}

// A points list becomes a move to its first X/Y pair and a line to each one after it, plus a Z when it is a polygon.
function convertPoints(shape: PointsShape): ShapeConversion {
  const isPolygon = shape.kind === "polygon";
  const given = `Given: ${shape.points.length} point${shape.points.length === 1 ? "" : "s"} in the points list.`;
  if (shape.points.length === 0) return { steps: [], working: [given], warning: "An empty points list draws nothing, so there is no path." };

  const [first, ...rest] = shape.points;
  const steps: PathStep[] = [{ command: "M", from: { x: 0, y: 0 }, to: first, explanation: `Move to the first X/Y pair ${formatPoint(first)}.` }];
  let pen = first;
  rest.forEach((point, index) => {
    const ordinal = index + 2;
    steps.push(straightStep(pen, point, `Line to point ${ordinal}, ${formatPoint(point)}${pen.y === point.y ? ", horizontal, so H" : pen.x === point.x ? ", vertical, so V" : ""}.`));
    pen = point;
  });

  if (isPolygon) {
    steps.push({
      command: "Z",
      from: pen,
      to: first,
      explanation: `Close the path: Z draws the closing edge from the last point back to the first, ${formatPoint(first)}. This is the automatic closure a <polygon> gives you.`
    });
  }

  return {
    steps,
    working: [given, isPolygon ? "A <polygon> connects its points and closes automatically, so the path ends with Z." : "A <polyline> connects its points but stays open, so the path has no Z."],
    warning: shape.points.length === 1 ? "A single point has nothing to connect to, so the path only moves and draws nothing visible." : null
  };
}

// Single entry point that turns any supported shape into its numbered working.
export function convertShape(shape: Shape): ShapeConversion {
  switch (shape.kind) {
    case "rect":
      return convertRect(shape);
    case "circle":
      return convertCircle(shape);
    case "ellipse":
      return convertEllipse(shape);
    case "line":
      return convertLine(shape);
    default:
      return convertPoints(shape);
  }
}

// Rounds a point to the output precision, so relative offsets are worked out from what an absolute path would actually say.
function roundPoint(point: ShapePoint, precision: number): ShapePoint {
  return { x: toFixed(point.x, precision), y: toFixed(point.y, precision) };
}

/*
  Prints each step as its own command string. Relative offsets are taken between rounded absolute
  points, not raw ones, so a relative path lands on exactly the same corners as the absolute one
  instead of drifting by the accumulated rounding error.
*/
export function formatSteps(steps: PathStep[], mode: PathCoordinateMode, precision: number): string[] {
  const f = (value: number) => formatNumber(value, precision);
  const relative = mode === "relative";
  let pen: ShapePoint = { x: 0, y: 0 };
  let subpathStart: ShapePoint = { x: 0, y: 0 };

  return steps.map((step) => {
    const to = roundPoint(step.to, precision);
    const dx = to.x - pen.x;
    const dy = to.y - pen.y;
    let text: string;

    switch (step.command) {
      case "M":
        text = relative ? `m ${f(dx)} ${f(dy)}` : `M ${f(to.x)} ${f(to.y)}`;
        subpathStart = to;
        break;
      case "H":
        text = relative ? `h ${f(dx)}` : `H ${f(to.x)}`;
        break;
      case "V":
        text = relative ? `v ${f(dy)}` : `V ${f(to.y)}`;
        break;
      case "L":
        text = relative ? `l ${f(dx)} ${f(dy)}` : `L ${f(to.x)} ${f(to.y)}`;
        break;
      case "A": {
        const arc = step.arc ?? { rx: 0, ry: 0, largeArc: 0, sweep: 0 };
        const head = `${f(arc.rx)} ${f(arc.ry)} 0 ${arc.largeArc} ${arc.sweep}`;
        text = relative ? `a ${head} ${f(dx)} ${f(dy)}` : `A ${head} ${f(to.x)} ${f(to.y)}`;
        break;
      }
      default:
        text = relative ? "z" : "Z";
        pen = subpathStart;
        return text;
    }

    pen = to;
    return text;
  });
}

// The `d` attribute for the first `count` steps (all of them by default) — the scrubber's progressive drawing reuses this.
export function buildPathData(steps: PathStep[], mode: PathCoordinateMode, precision: number, count = steps.length): string {
  return formatSteps(steps, mode, precision).slice(0, count).join(" ");
}

/*
  A stand-alone absolute `d` for a single step, so hovering a line of working can trace exactly
  that segment in red. A move has no length, so it gets none; Z draws its closing edge as a line.
*/
export function stepSegmentData(step: PathStep): string {
  const { from, to } = step;
  const start = `M ${from.x} ${from.y}`;
  switch (step.command) {
    case "M":
      return "";
    case "A": {
      const arc = step.arc ?? { rx: 0, ry: 0, largeArc: 0, sweep: 0 };
      return `${start} A ${arc.rx} ${arc.ry} 0 ${arc.largeArc} ${arc.sweep} ${to.x} ${to.y}`;
    }
    default:
      return `${start} L ${to.x} ${to.y}`;
  }
}

// Exact extents straight from a shape's attributes — the "answer" the generated path is checked against.
export function shapeBounds(shape: Shape): ShapeBounds | null {
  switch (shape.kind) {
    case "rect":
      return shape.width > 0 && shape.height > 0 ? { minX: shape.x, minY: shape.y, maxX: shape.x + shape.width, maxY: shape.y + shape.height } : null;
    case "circle":
      return shape.r > 0 ? { minX: shape.cx - shape.r, minY: shape.cy - shape.r, maxX: shape.cx + shape.r, maxY: shape.cy + shape.r } : null;
    case "ellipse":
      return shape.rx > 0 && shape.ry > 0 ? { minX: shape.cx - shape.rx, minY: shape.cy - shape.ry, maxX: shape.cx + shape.rx, maxY: shape.cy + shape.ry } : null;
    case "line":
      return { minX: Math.min(shape.x1, shape.x2), minY: Math.min(shape.y1, shape.y2), maxX: Math.max(shape.x1, shape.x2), maxY: Math.max(shape.y1, shape.y2) };
    default:
      return extendBounds(null, shape.points);
  }
}

// Grows a running bounding box to take in more points; null means nothing has been seen yet.
function extendBounds(bounds: ShapeBounds | null, points: ShapePoint[]): ShapeBounds | null {
  return points.reduce<ShapeBounds | null>(
    (acc, p) =>
      acc
        ? { minX: Math.min(acc.minX, p.x), minY: Math.min(acc.minY, p.y), maxX: Math.max(acc.maxX, p.x), maxY: Math.max(acc.maxY, p.y) }
        : { minX: p.x, minY: p.y, maxX: p.x, maxY: p.y },
    bounds
  );
}

// Signed angle between two vectors, the building block of the spec's arc centre conversion.
function vectorAngle(ux: number, uy: number, vx: number, vy: number): number {
  return Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
}

/*
  Samples points along an unrotated elliptical arc using the SVG spec's endpoint-to-centre
  conversion (implementation notes F.6.5), including its scale-up of radii too small to span the
  two ends. Lets the path's extents be measured from the path itself rather than assumed.
*/
export function sampleArc(from: ShapePoint, to: ShapePoint, rxIn: number, ryIn: number, largeArc: 0 | 1, sweep: 0 | 1, samples = ARC_SAMPLES): ShapePoint[] {
  let rx = Math.abs(rxIn);
  let ry = Math.abs(ryIn);
  if (rx === 0 || ry === 0 || samePoint(from, to)) return [from, to];

  const x1p = (from.x - to.x) / 2;
  const y1p = (from.y - to.y) / 2;
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
  const cx = cxp + (from.x + to.x) / 2;
  const cy = cyp + (from.y + to.y) / 2;

  const ux = (x1p - cxp) / rx;
  const uy = (y1p - cyp) / ry;
  const vx = (-x1p - cxp) / rx;
  const vy = (-y1p - cyp) / ry;
  const theta1 = vectorAngle(1, 0, ux, uy);
  let delta = vectorAngle(ux, uy, vx, vy);
  if (sweep === 0 && delta > 0) delta -= 2 * Math.PI;
  if (sweep === 1 && delta < 0) delta += 2 * Math.PI;

  return Array.from({ length: samples + 1 }, (_, i) => {
    const theta = theta1 + (delta * i) / samples;
    return { x: cx + rx * Math.cos(theta), y: cy + ry * Math.sin(theta) };
  });
}

/*
  The steps as the output actually writes them, every coordinate and radius rounded to the chosen
  precision, so the bounds check judges the path someone copies rather than the exact maths.
*/
export function roundSteps(steps: PathStep[], precision: number): PathStep[] {
  const r = (value: number) => toFixed(value, precision);
  return steps.map((step) => ({
    ...step,
    from: roundPoint(step.from, precision),
    to: roundPoint(step.to, precision),
    arc: step.arc ? { ...step.arc, rx: r(step.arc.rx), ry: r(step.arc.ry) } : undefined
  }));
}

// Extents measured by walking the generated steps, so the check proves the path, not the maths that produced it.
export function pathBounds(steps: PathStep[]): ShapeBounds | null {
  return steps.reduce<ShapeBounds | null>((bounds, step) => {
    if (step.command === "M") return extendBounds(bounds, [step.to]);
    if (step.command === "A" && step.arc) return extendBounds(bounds, sampleArc(step.from, step.to, step.arc.rx, step.arc.ry, step.arc.largeArc, step.arc.sweep));
    return extendBounds(bounds, [step.from, step.to]);
  }, null);
}

// The largest gap between two bounding boxes' matching edges; null when either shape draws nothing.
export function boundsDifference(a: ShapeBounds | null, b: ShapeBounds | null): number | null {
  if (!a || !b) return null;
  return Math.max(Math.abs(a.minX - b.minX), Math.abs(a.minY - b.minY), Math.abs(a.maxX - b.maxX), Math.abs(a.maxY - b.maxY));
}

// Whether two bounding boxes agree to within a tolerance — the teacher's tick on the canvas.
export function boundsMatch(a: ShapeBounds | null, b: ShapeBounds | null, tolerance = 0.01): boolean {
  if (!a || !b) return a === b;
  return (boundsDifference(a, b) ?? Infinity) <= tolerance;
}

/*
  Reads a points list the way the post describes it: numbers separated by whitespace, commas or
  both, taken in X/Y pairs. An odd count is an error for the whole element, as in the browser.
*/
export function parsePointsList(text: string): { points: ShapePoint[]; error: string | null } {
  const trimmed = text.trim();
  if (trimmed === "") return { points: [], error: null };
  const numbers = trimmed.split(/[\s,]+/).map(Number);
  if (numbers.some((value) => !Number.isFinite(value))) return { points: [], error: "Every entry in a points list must be a number." };
  if (numbers.length % 2 !== 0) return { points: [], error: "An odd number of coordinates leaves a trailing value with no partner, so the browser treats the whole element as in error." };
  const points: ShapePoint[] = [];
  for (let i = 0; i < numbers.length; i += 2) points.push({ x: numbers[i], y: numbers[i + 1] });
  return { points, error: null };
}

// Writes points back as "x,y x,y", the pairing style the post recommends for readability.
export function formatPointsList(points: ShapePoint[], precision = EXPLANATION_DECIMALS): string {
  return points.map((p) => `${formatNumber(p.x, precision)},${formatNumber(p.y, precision)}`).join(" ");
}

// The shape as its own element, for the side-by-side "before" in the export panel.
export function shapeToMarkup(shape: Shape): string {
  const f = (value: number) => formatNumber(value, EXPLANATION_DECIMALS);
  switch (shape.kind) {
    case "rect": {
      const radii = `${shape.rx !== null ? ` rx="${f(shape.rx)}"` : ""}${shape.ry !== null ? ` ry="${f(shape.ry)}"` : ""}`;
      return `<rect x="${f(shape.x)}" y="${f(shape.y)}" width="${f(shape.width)}" height="${f(shape.height)}"${radii} />`;
    }
    case "circle":
      return `<circle cx="${f(shape.cx)}" cy="${f(shape.cy)}" r="${f(shape.r)}" />`;
    case "ellipse":
      return `<ellipse cx="${f(shape.cx)}" cy="${f(shape.cy)}" rx="${f(shape.rx)}" ry="${f(shape.ry)}" />`;
    case "line":
      return `<line x1="${f(shape.x1)}" y1="${f(shape.y1)}" x2="${f(shape.x2)}" y2="${f(shape.y2)}" />`;
    default:
      return `<${shape.kind} points="${formatPointsList(shape.points)}" />`;
  }
}

// Matches one attribute, quoted either way, keeping the raw text so untouched attributes are copied over byte for byte.
const ATTRIBUTE_PATTERN = /([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;

// Every opening or closing tag of a basic shape; closing tags are tracked so `<rect></rect>` becomes `<path></path>`.
const SHAPE_TAG_PATTERN = /<(\/?)(rect|circle|ellipse|line|polyline|polygon)\b((?:[^>"']|"[^"]*"|'[^']*')*)>/g;

// Reads a plain user-unit length. Percentages and units need a viewport to resolve, so they return null and the tag is left alone.
function parseLength(raw: string | undefined): number | null | "invalid" {
  if (raw === undefined || raw.trim() === "" || raw.trim() === "auto") return null;
  const match = /^\s*([+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)(px)?\s*$/i.exec(raw);
  return match ? Number(match[1]) : "invalid";
}

/*
  Builds a Shape from one tag's attributes. Missing geometry defaults to 0, as in the browser,
  except a rect's radii, which stay null so the auto rules can mirror them.
*/
function shapeFromAttributes(kind: ShapeKind, attributes: Record<string, string>): { shape: Shape | null; warning: string | null } {
  if (kind === "polyline" || kind === "polygon") {
    const { points, error } = parsePointsList(attributes.points ?? "");
    return error ? { shape: null, warning: error } : { shape: { kind, points }, warning: null };
  }

  const values: Record<string, number | null> = {};
  for (const name of GEOMETRY_ATTRIBUTES[kind]) {
    const value = parseLength(attributes[name]);
    if (value === "invalid") return { shape: null, warning: `${name}="${attributes[name]}" uses a percentage or unit, which needs the viewport to resolve, so this tag is left as it is.` };
    values[name] = value;
  }
  const v = (name: string) => values[name] ?? 0;

  switch (kind) {
    case "rect":
      return { shape: { kind, x: v("x"), y: v("y"), width: v("width"), height: v("height"), rx: values.rx ?? null, ry: values.ry ?? null }, warning: null };
    case "circle":
      return { shape: { kind, cx: v("cx"), cy: v("cy"), r: v("r") }, warning: null };
    case "ellipse":
      return { shape: { kind, cx: v("cx"), cy: v("cy"), rx: v("rx"), ry: v("ry") }, warning: null };
    default:
      return { shape: { kind: "line", x1: v("x1"), y1: v("y1"), x2: v("x2"), y2: v("y2") }, warning: null };
  }
}

/*
  Rewrites every basic shape in pasted markup as a `<path>`, keeping its presentation attributes
  (fill, stroke, class, transform…) and dropping only the geometry the `d` now carries. A regex
  tokeniser rather than DOMParser so the output keeps the author's own formatting and attribute
  order, and so it runs outside the browser too.
*/
export function convertMarkup(markup: string, mode: PathCoordinateMode, precision: number): PasteConversion {
  const results: PastedShapeResult[] = [];
  // One stack per tag name, recording whether each still-open tag was rewritten, so its closing tag can follow suit.
  const openTags: Record<string, boolean[]> = {};

  const output = markup.replace(SHAPE_TAG_PATTERN, (tag: string, closing: string, kindName: string, rest: string) => {
    const kind = kindName as ShapeKind;
    if (closing) return openTags[kind]?.pop() ? "</path>" : tag;

    const attributes: Record<string, string> = {};
    const kept: string[] = [];
    for (const match of rest.matchAll(ATTRIBUTE_PATTERN)) {
      const name = match[1];
      attributes[name] = match[2] ?? match[3] ?? "";
      if (!GEOMETRY_ATTRIBUTES[kind].includes(name)) kept.push(match[0]);
    }

    const selfClosing = /\/\s*$/.test(rest);
    const { shape, warning } = shapeFromAttributes(kind, attributes);
    const conversion = shape ? convertShape(shape) : null;
    const d = conversion && conversion.steps.length > 0 ? buildPathData(conversion.steps, mode, precision) : null;
    results.push({ kind, source: tag, shape, d, warning: warning ?? conversion?.warning ?? null });

    if (!selfClosing) (openTags[kind] ??= []).push(d !== null);
    if (d === null) return tag;
    return `<path d="${d}"${kept.length > 0 ? ` ${kept.join(" ")}` : ""}${selfClosing ? " />" : ">"}`;
  });

  return { output, results };
}
