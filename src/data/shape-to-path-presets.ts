import type { ShapePresetMeta } from "@/components/ShapeToPathConverter/ShapeToPathConverter.types";

/*
  Worked examples for the exercise book, one or more per shape, each picked to make a particular
  rule show up in the working: auto radii, clamping, the two-arc circle, H/V shortcuts and Z.
  Geometry is in the same 0–100 user units the post's own examples use.
*/
export const shapeToPathPresets: ShapePresetMeta[] = [
  { slug: "square-corners", name: "Plain rect", shape: { kind: "rect", x: 15, y: 15, width: 70, height: 50, rx: null, ry: null } },
  { slug: "card", name: "Rounded card", shape: { kind: "rect", x: 15, y: 20, width: 70, height: 60, rx: 8, ry: null } },
  { slug: "squircle-ish", name: "Uneven radii", shape: { kind: "rect", x: 20, y: 25, width: 60, height: 50, rx: 20, ry: 8 } },
  { slug: "pill", name: "Pill (clamped)", shape: { kind: "rect", x: 10, y: 35, width: 80, height: 30, rx: 50, ry: null } },
  { slug: "post-rounded", name: "Post example", shape: { kind: "rect", x: 15, y: 15, width: 70, height: 50, rx: 35, ry: 25 } },
  { slug: "circle", name: "Circle", shape: { kind: "circle", cx: 50, cy: 50, r: 30 } },
  { slug: "ellipse", name: "Ellipse", shape: { kind: "ellipse", cx: 50, cy: 50, rx: 40, ry: 25 } },
  { slug: "diagonal", name: "Diagonal line", shape: { kind: "line", x1: 10, y1: 10, x2: 90, y2: 90 } },
  {
    slug: "zigzag",
    name: "Zig-zag",
    shape: {
      kind: "polyline",
      points: [
        { x: 10, y: 70 },
        { x: 30, y: 30 },
        { x: 50, y: 70 },
        { x: 70, y: 30 },
        { x: 90, y: 70 }
      ]
    }
  },
  {
    slug: "steps",
    name: "Staircase",
    shape: {
      kind: "polyline",
      points: [
        { x: 15, y: 85 },
        { x: 15, y: 65 },
        { x: 35, y: 65 },
        { x: 35, y: 45 },
        { x: 55, y: 45 },
        { x: 55, y: 25 },
        { x: 75, y: 25 },
        { x: 75, y: 15 }
      ]
    }
  },
  {
    slug: "triangle",
    name: "Triangle",
    shape: {
      kind: "polygon",
      points: [
        { x: 50, y: 15 },
        { x: 85, y: 85 },
        { x: 15, y: 85 }
      ]
    }
  },
  {
    slug: "star",
    name: "Star",
    shape: {
      kind: "polygon",
      points: [
        { x: 50, y: 10 },
        { x: 61, y: 38 },
        { x: 90, y: 38 },
        { x: 67, y: 56 },
        { x: 76, y: 85 },
        { x: 50, y: 68 },
        { x: 24, y: 85 },
        { x: 33, y: 56 },
        { x: 10, y: 38 },
        { x: 39, y: 38 }
      ]
    }
  }
];
