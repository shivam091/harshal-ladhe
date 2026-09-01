import { toFixed } from "@/utils/number";
import type {
  ClipPathCircleShape,
  ClipPathEllipseShape,
  ClipPathInsetShape,
  ClipPathPoint,
  ClipPathShape,
  ClipPathStraightVertex,
  ClipPathVertex
} from "@/interfaces/clip-path";

// Rounds a shape coordinate to 2 decimal places — enough precision for a pixel-accurate clip on any realistic viewport without cluttering the generated CSS with float noise.
function coord(value: number): number {
  return toFixed(value, 2);
}

// `polygon()` only ever describes straight edges — the caller (compileClipPathValue) is what decides whether a shape qualifies.
export function compilePolygonFunction(vertices: ClipPathStraightVertex[]): string {
  const points = vertices.map((vertex) => `${coord(vertex.point.x)}% ${coord(vertex.point.y)}%`).join(", ");
  return `polygon(${points})`;
}

/*
  Evaluates a point on a cubic Bezier at t∈[0,1] via De Casteljau. Straight edges are modeled as a
  degenerate cubic (c1=p0, c2=p3) so this one function serves both edge-midpoint-insert (t=0.5) and
  the morph scrub preview, regardless of whether the edge it's evaluating is actually curved.
*/
export function pointOnCubicBezier(p0: ClipPathPoint, c1: ClipPathPoint, c2: ClipPathPoint, p3: ClipPathPoint, t: number): ClipPathPoint {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return {
    x: a * p0.x + b * c1.x + c * c2.x + d * p3.x,
    y: a * p0.y + b * c1.y + c * c2.y + d * p3.y
  };
}

// Resolves the effective outgoing/incoming control point for an edge's endpoint — a curve vertex contributes its own handle; a straight vertex contributes its own point (the "degenerate cubic" reduction). Exported so ShapeOverlay can build the exact same per-edge Bezier segments it renders as draggable hit-targets.
export function outgoingControlPoint(vertex: ClipPathVertex): ClipPathPoint {
  return vertex.type === "curve" ? vertex.handleOut : vertex.point;
}
export function incomingControlPoint(vertex: ClipPathVertex): ClipPathPoint {
  return vertex.type === "curve" ? vertex.handleIn : vertex.point;
}

/*
  Builds a raw SVG path `d` string ("M x y L x y / C c1 c2 x y ... Z") for a mixed straight/curve
  vertex list — NOT wrapped in path(...); callers decide whether they need the bare `d` (SVG export)
  or the CSS-wrapped form (compilePathFunction). An edge renders as a plain "L" line only when BOTH
  endpoints are straight; otherwise it renders as "C" so a single curve vertex still bends its edges.
*/
export function compilePathData(vertices: ClipPathVertex[]): string {
  if (vertices.length === 0) return "";

  const commands = [`M ${coord(vertices[0].point.x)} ${coord(vertices[0].point.y)}`];

  for (let i = 0; i < vertices.length; i++) {
    const current = vertices[i];
    const next = vertices[(i + 1) % vertices.length];
    const isLastEdge = i === vertices.length - 1;

    if (current.type === "straight" && next.type === "straight") {
      commands.push(isLastEdge ? "Z" : `L ${coord(next.point.x)} ${coord(next.point.y)}`);
      continue;
    }

    const c1 = outgoingControlPoint(current);
    const c2 = incomingControlPoint(next);
    const endpoint = isLastEdge ? "" : `${coord(next.point.x)} ${coord(next.point.y)}`;
    commands.push(`C ${coord(c1.x)} ${coord(c1.y)} ${coord(c2.x)} ${coord(c2.y)} ${endpoint}`.trim());
    if (isLastEdge) commands.push("Z");
  }

  return commands.join(" ");
}

// Wraps compilePathData as the modern `path()` clip-path function. fillRule defaults to "nonzero" to match polygon()'s always-nonzero fill behavior, so switching a shape between straight and curved vertices doesn't silently change which side of a self-overlapping shape gets clipped.
export function compilePathFunction(vertices: ClipPathVertex[], fillRule: "nonzero" | "evenodd" = "nonzero"): string {
  const prefix = fillRule === "evenodd" ? "evenodd, " : "";
  return `path(${prefix}"${compilePathData(vertices)}")`;
}

export function compileCircleFunction(shape: ClipPathCircleShape): string {
  return `circle(${coord(shape.radius)}% at ${coord(shape.center.x)}% ${coord(shape.center.y)}%)`;
}

export function compileEllipseFunction(shape: ClipPathEllipseShape): string {
  return `ellipse(${coord(shape.rx)}% ${coord(shape.ry)}% at ${coord(shape.center.x)}% ${coord(shape.center.y)}%)`;
}

export function compileInsetFunction(shape: ClipPathInsetShape): string {
  const round = shape.cornerRadius > 0 ? ` round ${coord(shape.cornerRadius)}%` : "";
  return `inset(${coord(shape.top)}% ${coord(shape.right)}% ${coord(shape.bottom)}% ${coord(shape.left)}%${round})`;
}

/*
  Single entry point every export format (CSS/Tailwind/React/SVG) and every preview (main pane,
  preset thumbnails) calls — one source of truth for "what does this shape compile to." For
  "polygon" it dispatches to compilePolygonFunction when every vertex is straight, or
  compilePathFunction the moment any vertex is a curve vertex — this branch is the mechanism that
  makes bezier points a real CSS output, not just editor sugar.
*/
export function compileClipPathValue(shape: ClipPathShape): string {
  switch (shape.family) {
    case "polygon": {
      const hasCurve = shape.vertices.some((vertex) => vertex.type === "curve");
      return hasCurve
        ? compilePathFunction(shape.vertices)
        : compilePolygonFunction(shape.vertices as ClipPathStraightVertex[]);
    }
    case "circle":
      return compileCircleFunction(shape);
    case "ellipse":
      return compileEllipseFunction(shape);
    case "inset":
      return compileInsetFunction(shape);
  }
}
