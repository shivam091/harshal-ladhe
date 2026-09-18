import { compileClipPathValue, compilePathData } from "@/utils/clip-path";
import { toFixed } from "@/utils/number";
import type { ClipPathShape, ClipPathVertex } from "@/interfaces/clip-path";

// Rounds an SVG objectBoundingBox fraction to 4 decimal places — that space is 0-1 rather than 0-100, so 2 decimals (good enough for a percentage) would visibly round-trip badly.
function fraction(value: number): number {
  return toFixed(value / 100, 4);
}

export function toCssDeclaration(shape: ClipPathShape): string {
  return `clip-path: ${compileClipPathValue(shape)};`;
}

/*
  Tailwind's arbitrary-value syntax requires spaces inside the bracket escaped to underscores
  (its own class-name tokenizer would otherwise split on them) — this project has no Tailwind
  dependency itself; it's purely a string formatter for people pasting the shape into a Tailwind project.
*/
export function toTailwindClass(shape: ClipPathShape): string {
  return `clip-path-[${compileClipPathValue(shape).replace(/\s+/g, "_")}]`;
}

export function toReactStyleObject(shape: ClipPathShape): string {
  return `{ clipPath: "${compileClipPathValue(shape)}" }`;
}

// Scales every point/handle in a vertex list by `factor` — used to convert the editor's 0-100 percentage space into SVG's 0-1 objectBoundingBox fractions without duplicating compilePathData's edge logic.
function scaleVertices(vertices: ClipPathVertex[], factor: number): ClipPathVertex[] {
  const scalePoint = (point: { x: number; y: number }) => ({ x: point.x * factor, y: point.y * factor });
  return vertices.map((vertex) =>
    vertex.type === "curve"
      ? { ...vertex, point: scalePoint(vertex.point), handleIn: scalePoint(vertex.handleIn), handleOut: scalePoint(vertex.handleOut) }
      : { ...vertex, point: scalePoint(vertex.point) }
  );
}

/*
  Builds a standalone `<clipPath>` fragment for pasting directly into an SVG document (e.g. to clip
  an <img> where CSS clip-path support/perf differs from a native SVG clipPath). `clipPathUnits`
  MUST be "objectBoundingBox" with unitless 0-1 fractions here, NOT "%" — objectBoundingBox mode
  doesn't accept percent units at all, unlike the CSS clip-path functions this editor otherwise
  targets. That conversion happens only at this export boundary; the rest of the model stays in
  0-100 space.
*/
export function toSvgClipPathMarkup(shape: ClipPathShape, id: string = "clip-path-generator"): string {
  let inner: string;

  switch (shape.family) {
    case "polygon": {
      const hasCurve = shape.vertices.some((vertex) => vertex.type === "curve");
      inner = hasCurve
        ? `<path d="${compilePathData(scaleVertices(shape.vertices, 0.01))}" />`
        : `<polygon points="${shape.vertices.map((v) => `${fraction(v.point.x)},${fraction(v.point.y)}`).join(" ")}" />`;
      break;
    }
    case "circle":
      inner = `<circle cx="${fraction(shape.center.x)}" cy="${fraction(shape.center.y)}" r="${fraction(shape.radius)}" />`;
      break;
    case "ellipse":
      inner = `<ellipse cx="${fraction(shape.center.x)}" cy="${fraction(shape.center.y)}" rx="${fraction(shape.rx)}" ry="${fraction(shape.ry)}" />`;
      break;
    case "inset":
      inner = `<rect x="${fraction(shape.left)}" y="${fraction(shape.top)}" width="${fraction(100 - shape.left - shape.right)}" height="${fraction(100 - shape.top - shape.bottom)}" rx="${fraction(shape.cornerRadius)}" />`;
      break;
  }

  return `<clipPath id="${id}" clipPathUnits="objectBoundingBox">\n  ${inner}\n</clipPath>\n<!-- apply with: clip-path: url(#${id}); -->`;
}
