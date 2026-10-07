import { clamp } from "@/utils/number";
import { SHAPE_KINDS } from "@/components/ShapeToPathConverter/ShapeToPathConverter.utils";
import type {
  CanvasHandle,
  PathCoordinateMode,
  RectShape,
  Shape,
  ShapeKind,
  ShapeLibrary,
  ShapePoint,
  ShapePresetMeta,
  ShapeToPathEditorState,
  ShapeToPathShareableState
} from "@/components/ShapeToPathConverter/ShapeToPathConverter.types";

// Decimal places the output offers, from whole user units up to four places.
export const MIN_PRECISION = 0;
export const MAX_PRECISION = 4;

// Fewest points each points shape may be trimmed to: a polyline still needs a segment, a polygon still needs an area.
export const MIN_POINTS: Record<"polyline" | "polygon", number> = { polyline: 2, polygon: 3 };

/*
  The opening exercise for each shape, mostly lifted from the post's own examples so the numbers
  look familiar. The rect starts rounded with ry left on auto, so the very first working already
  shows the mirroring rule.
*/
export function createDefaultShapes(): ShapeLibrary {
  return {
    rect: { kind: "rect", x: 15, y: 15, width: 70, height: 50, rx: 12, ry: null },
    circle: { kind: "circle", cx: 50, cy: 50, r: 30 },
    ellipse: { kind: "ellipse", cx: 50, cy: 50, rx: 40, ry: 25 },
    line: { kind: "line", x1: 10, y1: 10, x2: 90, y2: 90 },
    polyline: {
      kind: "polyline",
      points: [
        { x: 20, y: 80 },
        { x: 50, y: 20 },
        { x: 80, y: 80 }
      ]
    },
    polygon: {
      kind: "polygon",
      points: [
        { x: 50, y: 15 },
        { x: 85, y: 85 },
        { x: 15, y: 85 }
      ]
    }
  };
}

// Opens on the rounded rect: it has the most to explain, so it shows the breakdown off best.
export function createDefaultEditorState(): ShapeToPathEditorState {
  return { kind: "rect", shapes: createDefaultShapes(), mode: "absolute", precision: 2 };
}

// Deep-copied so the permalink encoder and autosave never hold the live undo-stack object by reference.
export function toShareableState(state: ShapeToPathEditorState): ShapeToPathShareableState {
  return JSON.parse(JSON.stringify(state)) as ShapeToPathShareableState;
}

// Plain JSON, then base64, then a URL-safe character swap, the same scheme every other goodie's permalink uses.
export function encodeShareableState(state: ShapeToPathShareableState): string {
  const json = JSON.stringify(state);
  const base64 = btoa(unescape(encodeURIComponent(json)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Accepts only real, finite numbers, so a tampered link cannot slip NaN or a string into the geometry.
function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

// Validates a stored points list, dropping it entirely if any pair is malformed.
function readPoints(value: unknown): ShapePoint[] | null {
  if (!Array.isArray(value)) return null;
  const points = value.filter((p): p is ShapePoint => typeof p === "object" && p !== null && isFiniteNumber((p as ShapePoint).x) && isFiniteNumber((p as ShapePoint).y));
  return points.length === value.length ? points.map((p) => ({ x: p.x, y: p.y })) : null;
}

/*
  Validates one stored shape against the kind it is filed under, falling back to that kind's
  default when anything is off. One broken tab then costs only that tab, not the whole saved state.
*/
function readShape<K extends ShapeKind>(kind: K, value: unknown, fallback: ShapeLibrary[K]): ShapeLibrary[K] {
  if (typeof value !== "object" || value === null) return fallback;
  const v = value as Record<string, unknown>;
  const nums = (...keys: string[]) => keys.every((key) => isFiniteNumber(v[key]));
  const radius = (key: string) => (v[key] === null || v[key] === undefined ? null : isFiniteNumber(v[key]) ? (v[key] as number) : undefined);

  switch (kind) {
    case "rect": {
      const rx = radius("rx");
      const ry = radius("ry");
      if (!nums("x", "y", "width", "height") || rx === undefined || ry === undefined) return fallback;
      return { kind: "rect", x: v.x as number, y: v.y as number, width: v.width as number, height: v.height as number, rx, ry } as ShapeLibrary[K];
    }
    case "circle":
      return (nums("cx", "cy", "r") ? { kind: "circle", cx: v.cx, cy: v.cy, r: v.r } : fallback) as ShapeLibrary[K];
    case "ellipse":
      return (nums("cx", "cy", "rx", "ry") ? { kind: "ellipse", cx: v.cx, cy: v.cy, rx: v.rx, ry: v.ry } : fallback) as ShapeLibrary[K];
    case "line":
      return (nums("x1", "y1", "x2", "y2") ? { kind: "line", x1: v.x1, y1: v.y1, x2: v.x2, y2: v.y2 } : fallback) as ShapeLibrary[K];
    default: {
      const points = readPoints(v.points);
      return (points ? { kind, points } : fallback) as ShapeLibrary[K];
    }
  }
}

/*
  Rebuilds a full editor state from anything parsed out of a link or localStorage, field by field,
  so old or hand-edited saves still load whatever parts of them are valid.
*/
export function sanitiseState(value: unknown): ShapeToPathEditorState | null {
  if (typeof value !== "object" || value === null) return null;
  const raw = value as Partial<Record<keyof ShapeToPathEditorState, unknown>>;
  const defaults = createDefaultEditorState();
  const storedShapes = (typeof raw.shapes === "object" && raw.shapes !== null ? raw.shapes : {}) as Record<string, unknown>;

  const shapes = Object.fromEntries(SHAPE_KINDS.map((kind) => [kind, readShape(kind, storedShapes[kind], defaults.shapes[kind])])) as unknown as ShapeLibrary;

  return {
    kind: SHAPE_KINDS.includes(raw.kind as ShapeKind) ? (raw.kind as ShapeKind) : defaults.kind,
    shapes,
    mode: raw.mode === "relative" ? "relative" : "absolute",
    precision: isFiniteNumber(raw.precision) ? clamp(Math.round(raw.precision), MIN_PRECISION, MAX_PRECISION) : defaults.precision
  };
}

// Reverses encodeShareableState; returns null on any malformed or tampered `?state=` so the page falls back instead of crashing.
export function decodeShareableState(encoded: string): ShapeToPathShareableState | null {
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(base64)));
    return sanitiseState(JSON.parse(json));
  } catch {
    return null;
  }
}

// Switching tabs only changes which stored shape is on the page; nothing is converted or lost.
export function setKind(state: ShapeToPathEditorState, kind: ShapeKind): ShapeToPathEditorState {
  return { ...state, kind };
}

// Files a shape under its own kind and brings that tab forward, so a pasted or preset shape is the one being worked on.
export function setShape(state: ShapeToPathEditorState, shape: Shape): ShapeToPathEditorState {
  return { ...state, kind: shape.kind, shapes: { ...state.shapes, [shape.kind]: shape } };
}

// Absolute and relative are two spellings of the same path; flipping between them changes only the output text.
export function setMode(state: ShapeToPathEditorState, mode: PathCoordinateMode): ShapeToPathEditorState {
  return { ...state, mode };
}

// Clamped here as well as on the control, since keyboard steppers and stored states can both overshoot.
export function setPrecision(state: ShapeToPathEditorState, precision: number): ShapeToPathEditorState {
  return { ...state, precision: clamp(Math.round(precision), MIN_PRECISION, MAX_PRECISION) };
}

// A preset copies its shape in rather than sharing the object, so later drags never mutate the gallery's data.
export function applyPreset(state: ShapeToPathEditorState, preset: ShapePresetMeta): ShapeToPathEditorState {
  return setShape(state, JSON.parse(JSON.stringify(preset.shape)) as Shape);
}

// Puts only the current tab's shape back to its opening exercise, leaving the other tabs and output settings alone.
export function resetShape(state: ShapeToPathEditorState): ShapeToPathEditorState {
  return setShape(state, createDefaultShapes()[state.kind]);
}

// How far the radius rulers sit outside a rect's edges, in user units, so their handles never stack on the corner.
export const RADIUS_RULER_OFFSET = 5;

// A rect's radius as authored, or mirrored from the other one when it is auto, the length its ruler handle sits at.
export function authoredRadius(rect: RectShape, axis: "rx" | "ry"): number {
  const own = rect[axis];
  const other = rect[axis === "rx" ? "ry" : "rx"];
  return Math.max(0, own ?? other ?? 0);
}

/*
  The handles each shape offers. A rect is moved from its centre, not its top-left corner, so the
  corner stays free for the rx/ry rulers that run alongside its top and left edges.
*/
export function listHandles(shape: Shape): CanvasHandle[] {
  switch (shape.kind) {
    case "rect": {
      const rx = authoredRadius(shape, "rx");
      const ry = authoredRadius(shape, "ry");
      return [
        { id: "rect-move", point: { x: shape.x + shape.width / 2, y: shape.y + shape.height / 2 }, label: `Move the rect, top-left corner at (${shape.x}, ${shape.y})`, variant: "centre" },
        { id: "rect-size", point: { x: shape.x + shape.width, y: shape.y + shape.height }, label: `Bottom-right corner, width ${shape.width} by height ${shape.height}`, variant: "square" },
        { id: "rect-rx", point: { x: shape.x + rx, y: shape.y - RADIUS_RULER_OFFSET }, label: `Corner radius rx, ${shape.rx === null ? "auto, " : ""}${rx}`, variant: "diamond" },
        { id: "rect-ry", point: { x: shape.x - RADIUS_RULER_OFFSET, y: shape.y + ry }, label: `Corner radius ry, ${shape.ry === null ? "auto, " : ""}${ry}`, variant: "diamond" }
      ];
    }
    case "circle":
      return [
        { id: "circle-centre", point: { x: shape.cx, y: shape.cy }, label: `Centre (${shape.cx}, ${shape.cy})`, variant: "centre" },
        { id: "circle-r", point: { x: shape.cx + shape.r, y: shape.cy }, label: `Radius r, ${shape.r}`, variant: "diamond" }
      ];
    case "ellipse":
      return [
        { id: "ellipse-centre", point: { x: shape.cx, y: shape.cy }, label: `Centre (${shape.cx}, ${shape.cy})`, variant: "centre" },
        { id: "ellipse-rx", point: { x: shape.cx + shape.rx, y: shape.cy }, label: `Horizontal radius rx, ${shape.rx}`, variant: "diamond" },
        { id: "ellipse-ry", point: { x: shape.cx, y: shape.cy + shape.ry }, label: `Vertical radius ry, ${shape.ry}`, variant: "diamond" }
      ];
    case "line":
      return [
        { id: "line-start", point: { x: shape.x1, y: shape.y1 }, label: `Start point (x1, y1) at (${shape.x1}, ${shape.y1})`, variant: "square" },
        { id: "line-end", point: { x: shape.x2, y: shape.y2 }, label: `End point (x2, y2) at (${shape.x2}, ${shape.y2})`, variant: "square" }
      ];
    default:
      return shape.points.map((point, index) => ({ id: `point-${index}`, point, label: `Point ${index + 1} at (${point.x}, ${point.y})`, variant: "square" }));
  }
}

// Rounds a dragged position for display-friendly attributes: whole user units, or tenths when finer control is asked for.
export function snapValue(value: number, fine: boolean): number {
  return fine ? Math.round(value * 10) / 10 : Math.round(value);
}

/*
  Applies a handle moved to `point` back onto the shape's attributes. Radii are measured as
  distances, so dragging a radius handle past the centre never produces a negative radius, while
  a rect's rx/ry may run past half its size on purpose, to show clamping happen in the working.
*/
export function moveHandle(shape: Shape, id: string, point: ShapePoint): Shape {
  switch (shape.kind) {
    case "rect":
      if (id === "rect-move") return { ...shape, x: point.x - shape.width / 2, y: point.y - shape.height / 2 };
      if (id === "rect-size") return { ...shape, width: Math.max(0, point.x - shape.x), height: Math.max(0, point.y - shape.y) };
      if (id === "rect-rx") return { ...shape, rx: Math.max(0, point.x - shape.x) };
      if (id === "rect-ry") return { ...shape, ry: Math.max(0, point.y - shape.y) };
      return shape;
    case "circle":
      if (id === "circle-centre") return { ...shape, cx: point.x, cy: point.y };
      return { ...shape, r: Math.round(Math.hypot(point.x - shape.cx, point.y - shape.cy) * 10) / 10 };
    case "ellipse":
      if (id === "ellipse-centre") return { ...shape, cx: point.x, cy: point.y };
      if (id === "ellipse-rx") return { ...shape, rx: Math.abs(point.x - shape.cx) };
      return { ...shape, ry: Math.abs(point.y - shape.cy) };
    case "line":
      return id === "line-start" ? { ...shape, x1: point.x, y1: point.y } : { ...shape, x2: point.x, y2: point.y };
    default: {
      const index = Number(id.slice("point-".length));
      return { ...shape, points: shape.points.map((p, i) => (i === index ? point : p)) };
    }
  }
}
