// A point (or vector) in 3D model space, before any rotation/projection is applied.
export interface Point3D {
  x: number;
  y: number;
  z: number;
}

// One flat-shaded face of a shape: the vertex indices it spans (in winding order) plus a base color.
export interface Face {
  indices: number[];
  color: string;
}

export interface Shape {
  vertices: Point3D[];
  faces: Face[];
}

export type ShapeName = "cube" | "pyramid" | "octahedron";

// Rotates a point around the X axis by the given angle (radians), returning a new point.
export function rotateX(point: Point3D, angle: number): Point3D {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return { x: point.x, y: point.y * cos - point.z * sin, z: point.y * sin + point.z * cos };
}

// Rotates a point around the Y axis by the given angle (radians), returning a new point.
export function rotateY(point: Point3D, angle: number): Point3D {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return { x: point.x * cos + point.z * sin, y: point.y, z: -point.x * sin + point.z * cos };
}

// Normalizes a 3D vector to unit length (falls back to the zero vector if it has none).
export function normalize(v: Point3D): Point3D {
  const length = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / length, y: v.y / length, z: v.z / length };
}

function subtract(a: Point3D, b: Point3D): Point3D {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

function cross(a: Point3D, b: Point3D): Point3D {
  return { x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x };
}

// A fixed "light" direction faces normals are compared against to fake flat shading.
export const LIGHT_DIR = normalize({ x: -0.5, y: -0.7, z: -0.6 });

/*
  The octahedron's 8 triangular faces are every combination of one +/-X vertex, one +/-Y vertex
  and one +/-Z vertex, so it's generated here instead of hand-listed like the cube and pyramid.
*/
function buildOctahedron(): Shape {
  const vertices: Point3D[] = [
    { x: 1, y: 0, z: 0 },
    { x: -1, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: 0, y: -1, z: 0 },
    { x: 0, y: 0, z: 1 },
    { x: 0, y: 0, z: -1 },
  ];
  const colors = ["#818cf8", "#22d3ee", "#f472b6", "#facc15", "#4ade80", "#a78bfa", "#fb923c", "#f87171"];
  const faces: Face[] = [];
  let colorIndex = 0;
  for (const xi of [0, 1]) {
    for (const yi of [2, 3]) {
      for (const zi of [4, 5]) {
        faces.push({ indices: [xi, yi, zi], color: colors[colorIndex] });
        colorIndex += 1;
      }
    }
  }
  return { vertices, faces };
}

// The three selectable solids. Wireframe edges are derived from these faces (see getEdges) rather
// than hand-maintained separately, so there's only one source of truth per shape.
export const SHAPES: Record<ShapeName, Shape> = {
  cube: {
    vertices: [
      { x: -1, y: -1, z: -1 },
      { x: 1, y: -1, z: -1 },
      { x: 1, y: 1, z: -1 },
      { x: -1, y: 1, z: -1 },
      { x: -1, y: -1, z: 1 },
      { x: 1, y: -1, z: 1 },
      { x: 1, y: 1, z: 1 },
      { x: -1, y: 1, z: 1 },
    ],
    faces: [
      { indices: [0, 1, 2, 3], color: "#818cf8" },
      { indices: [5, 4, 7, 6], color: "#22d3ee" },
      { indices: [4, 0, 3, 7], color: "#f472b6" },
      { indices: [1, 5, 6, 2], color: "#facc15" },
      { indices: [4, 5, 1, 0], color: "#4ade80" },
      { indices: [3, 2, 6, 7], color: "#a78bfa" },
    ],
  },
  pyramid: {
    vertices: [
      { x: -1, y: 0.6, z: -1 },
      { x: 1, y: 0.6, z: -1 },
      { x: 1, y: 0.6, z: 1 },
      { x: -1, y: 0.6, z: 1 },
      { x: 0, y: -1.2, z: 0 },
    ],
    faces: [
      { indices: [0, 1, 2, 3], color: "#818cf8" },
      { indices: [0, 1, 4], color: "#22d3ee" },
      { indices: [1, 2, 4], color: "#f472b6" },
      { indices: [2, 3, 4], color: "#facc15" },
      { indices: [3, 0, 4], color: "#4ade80" },
    ],
  },
  octahedron: buildOctahedron(),
};

// Collects every unique edge implied by a shape's faces (as vertex-index pairs), so wireframe mode
// doesn't need its own hand-maintained edge list alongside the face list.
export function getEdges(shape: Shape): [number, number][] {
  const seen = new Set<string>();
  const edges: [number, number][] = [];
  for (const face of shape.faces) {
    const { indices } = face;
    for (let i = 0; i < indices.length; i++) {
      const a = indices[i];
      const b = indices[(i + 1) % indices.length];
      const key = a < b ? `${a}-${b}` : `${b}-${a}`;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push([a, b]);
      }
    }
  }
  return edges;
}

// The outward-facing normal of a face, from its first three (already-rotated) vertices.
export function faceNormal(rotated: Point3D[], face: Face): Point3D {
  const [i0, i1, i2] = face.indices;
  return normalize(cross(subtract(rotated[i1], rotated[i0]), subtract(rotated[i2], rotated[i0])));
}

// Parses a "#rrggbb" color and scales its channels by `factor` (floored at 0.25 so faces never go
// fully black) to fake flat shading without a real lighting pipeline.
export function shadeColor(hex: string, factor: number): string {
  const value = Math.max(0.25, Math.min(1, factor));
  const r = Math.round(parseInt(hex.slice(1, 3), 16) * value);
  const g = Math.round(parseInt(hex.slice(3, 5), 16) * value);
  const b = Math.round(parseInt(hex.slice(5, 7), 16) * value);
  return `rgb(${r}, ${g}, ${b})`;
}
