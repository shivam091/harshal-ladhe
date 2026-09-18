import { clamp } from "@/utils/number";
import { random } from "@/utils/random";
import type { SvgPathCurveVertex, SvgPathPoint, SvgPathPresetMeta, SvgPathStraightVertex, SvgPathVertex } from "@/interfaces/svg-path";

function straight(x: number, y: number): SvgPathStraightVertex {
  return { type: "straight", point: { x, y } };
}
function curve(point: SvgPathPoint, handleOut: SvgPathPoint, handleIn: SvgPathPoint): SvgPathCurveVertex {
  // Every curated preset's handles are hand-placed for a specific asymmetric look (e.g. the heart's
  // lobes), not a reflection of one another — mirrored starts false so applying the preset doesn't
  // silently "fix" that asymmetry the moment the user drags one handle.
  return { type: "curve", point, handleIn, handleOut, mirrored: false };
}

function starPoints(spikes: number, outerRadius: number, innerRadius: number): SvgPathVertex[] {
  const step = Math.PI / spikes;
  return Array.from({ length: spikes * 2 }, (_, i) => {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = i * step - Math.PI / 2;
    return straight(50 + Math.cos(angle) * radius, 50 + Math.sin(angle) * radius);
  });
}

/*
  Hand-tuned per-vertex radii (rather than a single uniform radius) so the outline reads as an
  organic blob instead of a perfect scalloped circle — the asymmetry is what sells the shape.
  Handle length uses the standard 4-point-circle Bezier constant (kappa ≈ 0.552), scaled down for
  this shape's wider angular spacing between vertices.
*/
function blobVertices(): SvgPathVertex[] {
  const radii = [40, 33, 43, 30, 41, 34];
  const angleStep = (Math.PI * 2) / radii.length;
  const kappa = 0.552;

  return radii.map((radius, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const point: SvgPathPoint = { x: 50 + Math.cos(angle) * radius, y: 50 + Math.sin(angle) * radius };
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
}

/*
  A well-tested 4-vertex heart outline: a sharp bottom tip (straight, since both edges meeting there
  are already curved by its neighbors' own handles) plus two rounded lobes and the center dip between
  them — each handle placed by hand for the lobe's specific roundness, not mirrored from its neighbor.
*/
function heartVertices(): SvgPathVertex[] {
  return [
    straight(50, 88),
    curve({ x: 10, y: 35 }, { x: 10, y: 15 }, { x: 10, y: 60 }),
    curve({ x: 50, y: 25 }, { x: 70, y: 5 }, { x: 30, y: 5 }),
    curve({ x: 90, y: 35 }, { x: 90, y: 60 }, { x: 90, y: 15 })
  ];
}

// Curated starting paths — a mix of open strokes and closed shapes, so the gallery demonstrates both closure modes at a glance rather than only ever handing back a closed loop like clip-path's own presets do.
export const svgPathPresets: SvgPathPresetMeta[] = [
  {
    slug: "wave",
    name: "Wave",
    closed: false,
    vertices: [
      curve({ x: 0, y: 50 }, { x: 17, y: 25 }, { x: -17, y: 75 }),
      curve({ x: 50, y: 50 }, { x: 67, y: 75 }, { x: 33, y: 25 }),
      curve({ x: 100, y: 50 }, { x: 117, y: 25 }, { x: 83, y: 75 })
    ]
  },
  {
    slug: "zigzag",
    name: "Zigzag",
    closed: false,
    vertices: [straight(0, 20), straight(25, 80), straight(50, 20), straight(75, 80), straight(100, 20)]
  },
  {
    slug: "underline",
    name: "Underline",
    closed: false,
    vertices: [curve({ x: 5, y: 60 }, { x: 30, y: 40 }, { x: -10, y: 75 }), curve({ x: 95, y: 55 }, { x: 115, y: 50 }, { x: 65, y: 45 })]
  },
  { slug: "heart", name: "Heart", closed: true, vertices: heartVertices() },
  { slug: "star", name: "Star", closed: true, vertices: starPoints(5, 46, 19) },
  { slug: "blob", name: "Blob", closed: true, vertices: blobVertices() }
];

/*
  Generates a random path for the "Shuffle" action, matching the current closure mode. Closed paths
  use clip-path-presets.ts's own radial-jitter technique (angles kept in monotonically increasing
  order around the center, so the loop never self-intersects regardless of how the radius is
  jittered). Open paths instead space points left-to-right at increasing x with jittered y — the same
  monotonic-order guarantee, just along a line instead of a circle, so the stroke never doubles back
  on itself either.
*/
export function generateRandomPath(closed: boolean, pointCount: number = random(4, 7)): SvgPathVertex[] {
  if (closed) {
    const angleStep = (Math.PI * 2) / pointCount;
    return Array.from({ length: pointCount }, (_, i) => {
      const jitter = random(-angleStep / 2.2, angleStep / 2.2, { rounded: false });
      const angle = i * angleStep + jitter - Math.PI / 2;
      const radius = 42 * random(0.55, 1, { rounded: false });
      return straight(clamp(50 + Math.cos(angle) * radius, 2, 98), clamp(50 + Math.sin(angle) * radius, 2, 98));
    });
  }

  const stepX = 100 / (pointCount - 1);
  return Array.from({ length: pointCount }, (_, i) => straight(clamp(i * stepX, 2, 98), clamp(random(20, 80, { rounded: false }), 2, 98)));
}
