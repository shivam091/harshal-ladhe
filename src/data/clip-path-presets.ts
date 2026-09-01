import { clamp } from "@/utils/number";
import { random } from "@/utils/random";
import type { ClipPathCurveVertex, ClipPathPoint, ClipPathPresetMeta, ClipPathShape, ClipPathStraightVertex } from "@/interfaces/clip-path";

function straight(x: number, y: number): ClipPathStraightVertex {
  return { type: "straight", point: { x, y } };
}
function polygonOf(points: Array<[number, number]>): ClipPathShape {
  return { family: "polygon", vertices: points.map(([x, y]) => straight(x, y)) };
}

function starPoints(spikes: number, outerRadius: number, innerRadius: number): Array<[number, number]> {
  const step = Math.PI / spikes;
  return Array.from({ length: spikes * 2 }, (_, i) => {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = i * step - Math.PI / 2;
    return [50 + Math.cos(angle) * radius, 50 + Math.sin(angle) * radius] as [number, number];
  });
}

/*
  Hand-tuned per-vertex radii (rather than a single uniform radius) so the outline reads as an
  organic blob instead of a perfect scalloped circle — the asymmetry is what sells the shape.
  Handle length uses the standard 4-point-circle Bezier constant (kappa ≈ 0.552), scaled down for
  this shape's wider angular spacing between vertices.
*/
function blobShape(): ClipPathShape {
  const radii = [42, 37, 45, 35, 44, 38];
  const angleStep = (Math.PI * 2) / radii.length;
  const kappa = 0.552;

  const vertices: ClipPathCurveVertex[] = radii.map((radius, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const point: ClipPathPoint = { x: 50 + Math.cos(angle) * radius, y: 50 + Math.sin(angle) * radius };
    const handleLength = radius * kappa * (angleStep / (Math.PI / 2));
    const tangent = angle + Math.PI / 2;
    const ox = Math.cos(tangent) * handleLength;
    const oy = Math.sin(tangent) * handleLength;
    return {
      type: "curve",
      point,
      handleOut: { x: point.x + ox, y: point.y + oy },
      handleIn: { x: point.x - ox, y: point.y - oy },
      mirrored: true
    };
  });

  return { family: "polygon", vertices };
}

// Curated starting points shown in the preset gallery — each is a plain ClipPathShape, so a thumbnail can render it with the exact same compileClipPathValue call the main preview uses.
export const clipPathPresets: ClipPathPresetMeta[] = [
  { slug: "triangle", name: "Triangle", shape: polygonOf([[50, 0], [100, 100], [0, 100]]) },
  { slug: "hexagon", name: "Hexagon", shape: polygonOf([[25, 0], [75, 0], [100, 50], [75, 100], [25, 100], [0, 50]]) },
  { slug: "arrow", name: "Arrow", shape: polygonOf([[0, 20], [60, 20], [60, 0], [100, 50], [60, 100], [60, 80], [0, 80]]) },
  { slug: "chevron", name: "Chevron", shape: polygonOf([[75, 0], [100, 0], [50, 50], [100, 100], [75, 100], [25, 50]]) },
  { slug: "message-bubble", name: "Message Bubble", shape: polygonOf([[0, 0], [100, 0], [100, 75], [30, 75], [15, 100], [20, 75], [0, 75]]) },
  { slug: "star", name: "Star", shape: polygonOf(starPoints(5, 48, 20)) },
  { slug: "blob", name: "Blob", shape: blobShape() }
];

/*
  Generates a random non-self-intersecting polygon for the "Shuffle" action. Points are placed at
  evenly-spaced angles jittered by less than half the angular gap to a neighbor — that bound
  guarantees the angles stay in monotonically increasing order around the center, which in turn
  guarantees the resulting polygon never self-intersects, regardless of how the radius is jittered.
*/
export function generateRandomPolygon(pointCount: number = random(5, 9)): ClipPathShape {
  const angleStep = (Math.PI * 2) / pointCount;
  const points = Array.from({ length: pointCount }, (_, i) => {
    const jitter = random(-angleStep / 2.2, angleStep / 2.2, { rounded: false });
    const angle = i * angleStep + jitter - Math.PI / 2;
    const radius = 45 * random(0.55, 1, { rounded: false });
    return [clamp(50 + Math.cos(angle) * radius, 2, 98), clamp(50 + Math.sin(angle) * radius, 2, 98)] as [number, number];
  });
  return polygonOf(points);
}
