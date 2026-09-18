import { toFixed } from "@/utils/number";
import type { SvgPathPoint, SvgPathVertex } from "@/interfaces/svg-path";

// Rounds a path coordinate to 2 decimal places — enough precision for a crisp render at any realistic viewport without cluttering the generated `d` with float noise.
function coord(value: number): number {
  return toFixed(value, 2);
}

/*
  Evaluates a point on a cubic Bezier at t∈[0,1] via De Casteljau. Straight edges are modeled as a
  degenerate cubic (c1=p0, c2=p3) so this one function serves both edge-midpoint-insert (t=0.5) and
  any future scrub/animation use, regardless of whether the edge it's evaluating is actually curved.
*/
export function pointOnCubicBezier(p0: SvgPathPoint, c1: SvgPathPoint, c2: SvgPathPoint, p3: SvgPathPoint, t: number): SvgPathPoint {
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

// Resolves the effective outgoing/incoming control point for an edge's endpoint — a curve vertex contributes its own handle; a straight vertex contributes its own point (the "degenerate cubic" reduction). Exported so PathOverlay can build the exact same per-edge Bezier segments it renders as draggable hit-targets.
export function outgoingControlPoint(vertex: SvgPathVertex): SvgPathPoint {
  return vertex.type === "curve" ? vertex.handleOut : vertex.point;
}
export function incomingControlPoint(vertex: SvgPathVertex): SvgPathPoint {
  return vertex.type === "curve" ? vertex.handleIn : vertex.point;
}

/*
  Builds a raw SVG path `d` string ("M x y L x y / C c1 c2 x y ... [Z]") for a mixed straight/curve
  vertex list. Unlike clip-path's compilePathData (always a closed polygon), `closed` is a real
  parameter here: open paths walk only the n-1 edges between consecutive vertices and never emit a
  trailing Z, since that's the one shape a clip-path region — always a filled, closed area — never
  needs to represent. An edge renders as a plain "L" line only when BOTH endpoints are straight;
  otherwise it renders as "C" so a single curve vertex still bends its edges.
*/
export function compilePathData(vertices: SvgPathVertex[], closed: boolean): string {
  if (vertices.length === 0) return "";

  const commands = [`M ${coord(vertices[0].point.x)} ${coord(vertices[0].point.y)}`];
  const edgeCount = closed ? vertices.length : vertices.length - 1;

  for (let i = 0; i < edgeCount; i++) {
    const current = vertices[i];
    const next = vertices[(i + 1) % vertices.length];
    const isLastEdge = i === edgeCount - 1;
    const closesLoop = closed && isLastEdge;

    if (current.type === "straight" && next.type === "straight") {
      commands.push(closesLoop ? "Z" : `L ${coord(next.point.x)} ${coord(next.point.y)}`);
      continue;
    }

    /*
      A "C" command always needs its endpoint written out explicitly — even on the closing edge,
      where `next` already wraps to vertices[0] via the modulo above, so this endpoint IS the exact
      point Z would also close back to. Omitting it (leaving Z to "imply" the endpoint) produces
      invalid path syntax: Z takes no coordinates, it just draws a straight line back to the
      subpath's start, so a preceding C left without its final x,y pair is simply malformed.
    */
    const c1 = outgoingControlPoint(current);
    const c2 = incomingControlPoint(next);
    commands.push(`C ${coord(c1.x)} ${coord(c1.y)} ${coord(c2.x)} ${coord(c2.y)} ${coord(next.point.x)} ${coord(next.point.y)}`);
    if (closesLoop) commands.push("Z");
  }

  return commands.join(" ");
}
