import { compileClipPathValue } from "@/utils/clip-path";
import type { ClipPathShape, ClipPathVertex } from "@/interfaces/clip-path";

/*
  `polygon()`/`path()` only interpolate smoothly in a native CSS `@keyframes`/`transition` when both
  shapes share the exact same command sequence — equal vertex count, and for polygons, matching
  straight/curve type at each index. Anything less and the browser jump-cuts instead of animating,
  so this gate exists to catch that BEFORE export, not after a user pastes broken-looking CSS.
*/
export function shapesAreTopologyCompatible(a: ClipPathShape, b: ClipPathShape): boolean {
  if (a.family !== b.family) return false;
  if (a.family !== "polygon" || b.family !== "polygon") return true;
  if (a.vertices.length !== b.vertices.length) return false;
  return a.vertices.every((vertex, index) => vertex.type === b.vertices[index].type);
}

// Converts a vertex to the opposite type while preserving its point — curve→straight just drops the handles; straight→curve grows short handles along the vertex's own point (a neutral, visually stable default when there's no neighboring edge context to derive a tangent from, unlike the ShapeOverlay's own toggle which does have that context).
function coerceVertexType(vertex: ClipPathVertex, type: ClipPathVertex["type"]): ClipPathVertex {
  if (vertex.type === type) return vertex;
  if (type === "straight") return { type: "straight", point: vertex.point };
  return {
    type: "curve",
    point: vertex.point,
    handleIn: { x: vertex.point.x - 5, y: vertex.point.y },
    handleOut: { x: vertex.point.x + 5, y: vertex.point.y },
    mirrored: true
  };
}

/*
  Reshapes `target` so it becomes topology-compatible with `source` — the "Sync topology" action.
  Same family as source is enforced outright (a differing family has no sensible partial fix, so it's
  replaced with a fresh default of source's family); for polygon, target's vertex list is padded
  (cloning its own last vertex, not source's, so the user's edits to target survive) or truncated to
  source's length, then each vertex's type is coerced to match source's at that index.
*/
export function matchTopology(source: ClipPathShape, target: ClipPathShape): ClipPathShape {
  if (source.family !== "polygon") return structuredClone(source);
  if (target.family !== "polygon") {
    return { family: "polygon", vertices: source.vertices.map((vertex) => coerceVertexType(structuredClone(vertex), vertex.type)) };
  }

  const vertices = [...target.vertices];
  while (vertices.length < source.vertices.length) vertices.push(structuredClone(vertices[vertices.length - 1]));
  vertices.length = source.vertices.length;

  return {
    family: "polygon",
    vertices: vertices.map((vertex, index) => coerceVertexType(vertex, source.vertices[index].type))
  };
}

// Linear interpolation for two plain numbers.
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
function lerpPoint(a: { x: number; y: number }, b: { x: number; y: number }, t: number) {
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) };
}

/*
  JS-side interpolation for the editor's own live scrub slider preview ONLY — the exported
  @keyframes rely on the browser's native path()/polygon() interpolation, not this function. Falls
  back to a hard snap at t=0.5 when the two shapes aren't topology-compatible, since there's no
  sensible per-vertex blend to compute in that case (this should only be reachable transiently,
  before "Sync topology" is applied).
*/
export function interpolateShape(a: ClipPathShape, b: ClipPathShape, t: number): ClipPathShape {
  if (!shapesAreTopologyCompatible(a, b)) return t < 0.5 ? a : b;

  switch (a.family) {
    case "polygon": {
      const bVertices = (b as typeof a).vertices;
      return {
        family: "polygon",
        vertices: a.vertices.map((vertex, index) => {
          const other = bVertices[index];
          if (vertex.type === "straight" || other.type === "straight") {
            return { type: "straight", point: lerpPoint(vertex.point, other.point, t) };
          }
          return {
            type: "curve",
            point: lerpPoint(vertex.point, other.point, t),
            handleIn: lerpPoint(vertex.handleIn, other.handleIn, t),
            handleOut: lerpPoint(vertex.handleOut, other.handleOut, t),
            mirrored: vertex.mirrored && other.mirrored
          };
        })
      };
    }
    case "circle": {
      const other = b as typeof a;
      return { family: "circle", center: lerpPoint(a.center, other.center, t), radius: lerp(a.radius, other.radius, t) };
    }
    case "ellipse": {
      const other = b as typeof a;
      return { family: "ellipse", center: lerpPoint(a.center, other.center, t), rx: lerp(a.rx, other.rx, t), ry: lerp(a.ry, other.ry, t) };
    }
    case "inset": {
      const other = b as typeof a;
      return {
        family: "inset",
        top: lerp(a.top, other.top, t),
        right: lerp(a.right, other.right, t),
        bottom: lerp(a.bottom, other.bottom, t),
        left: lerp(a.left, other.left, t),
        cornerRadius: lerp(a.cornerRadius, other.cornerRadius, t)
      };
    }
  }
}

// Ready-to-paste `@keyframes` block toggling between the two shapes — relies entirely on the browser's own native clip-path interpolation.
export function toKeyframesBlock(name: string, shapeA: ClipPathShape, shapeB: ClipPathShape): string {
  return `@keyframes ${name} {\n  from { clip-path: ${compileClipPathValue(shapeA)}; }\n  to { clip-path: ${compileClipPathValue(shapeB)}; }\n}`;
}

export function toTransitionDeclaration(duration: string, easing: string): string {
  return `transition: clip-path ${duration} ${easing};`;
}
