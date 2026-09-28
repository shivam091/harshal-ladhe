/* The role a vertex plays, which decides the marker property that paints there. "start-end" is the closed-shape case. */
export type VertexRole = "start" | "mid" | "end" | "start-end";

// One labelled vertex — its coordinate, role, and where its label sits so labels never collide with the line.
export interface Vertex {
  x: number;
  y: number;
  role: VertexRole;
  label: string;
  labelX: number;
  labelY: number;
}

/*
  The open 4-point polyline. Labels alternate above and below the zig-zag so each one sits in open space
  on the outside of its corner.
*/
export const POLYLINE: Vertex[] = [
  { x: 50, y: 200, role: "start", label: "1 · start", labelX: 50, labelY: 224 },
  { x: 120, y: 80, role: "mid", label: "2 · mid", labelX: 120, labelY: 64 },
  { x: 210, y: 180, role: "mid", label: "3 · mid", labelX: 210, labelY: 204 },
  { x: 290, y: 60, role: "end", label: "4 · end", labelX: 290, labelY: 44 }
];

/*
  The closed 4-point polygon. Point 1 carries both start and end because the implicit closing segment adds a final
  vertex back on it, which also demotes point 4 from "end" to an ordinary mid vertex.
*/
export const POLYGON: Vertex[] = [
  { x: 390, y: 200, role: "start-end", label: "1 · start + end", labelX: 400, labelY: 226 },
  { x: 430, y: 80, role: "mid", label: "2 · mid", labelX: 430, labelY: 64 },
  { x: 570, y: 70, role: "mid", label: "3 · mid", labelX: 570, labelY: 54 },
  { x: 610, y: 190, role: "mid", label: "4 · mid", labelX: 610, labelY: 214 }
];

// Legend entries along the bottom, spaced so each swatch + label pair fits without overlap.
export const LEGEND = [
  { role: "start" as const, label: "marker-start", x: 200 },
  { role: "mid" as const, label: "marker-mid", x: 320 },
  { role: "end" as const, label: "marker-end", x: 430 }
];
