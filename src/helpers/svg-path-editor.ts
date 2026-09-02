import { clamp } from "@/utils/number";
import { generateRandomPath } from "@/data/svg-path-presets";
import type {
  SvgLineCap,
  SvgLineJoin,
  SvgPathEditorState,
  SvgPathPoint,
  SvgPathPresetMeta,
  SvgPathShareableState,
  SvgPathVertex
} from "@/interfaces/svg-path";

// Keeps every point inside the path's own 0-100 percentage space — a drag can otherwise report a raw pointer position outside the preview bounds.
function clampPoint(point: SvgPathPoint): SvgPathPoint {
  return { x: clamp(point.x, 0, 100), y: clamp(point.y, 0, 100) };
}
function translate(point: SvgPathPoint, dx: number, dy: number): SvgPathPoint {
  return { x: point.x + dx, y: point.y + dy };
}
// Reflects `point` through `center` — how a mirrored curve vertex's opposite handle is derived from the one actually being dragged.
function reflectThrough(point: SvgPathPoint, center: SvgPathPoint): SvgPathPoint {
  return { x: 2 * center.x - point.x, y: 2 * center.y - point.y };
}
function replaceAt<T>(list: T[], index: number, value: T): T[] {
  const next = [...list];
  next[index] = value;
  return next;
}

// The neutral starting path a fresh page load and the "Reset" action both fall back to: a gentle open
// S-curve, so it reads immediately as "a pen-tool path," unlike a closed shape which would look
// identical to the clip-path generator's own default polygon.
function defaultVertices(): SvgPathVertex[] {
  return [
    { type: "curve", point: { x: 15, y: 65 }, handleOut: { x: 30, y: 65 }, handleIn: { x: 5, y: 65 }, mirrored: true },
    { type: "curve", point: { x: 85, y: 35 }, handleOut: { x: 95, y: 35 }, handleIn: { x: 70, y: 35 }, mirrored: true }
  ];
}

// Picks the fields that round-trip through both localStorage autosave and the permalink — `selection` is deliberately excluded (pure UI state, and irrelevant to what a shared link should restore).
export function toShareableState(state: SvgPathEditorState): SvgPathShareableState {
  const { vertices, closed, strokeColor, strokeWidth, lineCap, lineJoin, fillEnabled, fillColor } = state;
  return { vertices, closed, strokeColor, strokeWidth, lineCap, lineJoin, fillEnabled, fillColor };
}

export function createDefaultEditorState(): SvgPathEditorState {
  return {
    vertices: defaultVertices(),
    closed: false,
    selection: null,
    strokeColor: "#6366f1",
    strokeWidth: 3,
    lineCap: "round",
    lineJoin: "round",
    fillEnabled: false,
    fillColor: "#6366f1"
  };
}

export function updateVertexPoint(state: SvgPathEditorState, index: number, rawPoint: SvgPathPoint): SvgPathEditorState {
  const vertex = state.vertices[index];
  if (!vertex) return state;

  const point = clampPoint(rawPoint);
  const dx = point.x - vertex.point.x;
  const dy = point.y - vertex.point.y;
  // Dragging a curve vertex's anchor carries its handles along with it (same relative offset) — otherwise the curve's shape distorts every time its anchor moves, which reads as broken rather than intentional.
  const nextVertex: SvgPathVertex =
    vertex.type === "curve"
      ? { ...vertex, point, handleIn: translate(vertex.handleIn, dx, dy), handleOut: translate(vertex.handleOut, dx, dy) }
      : { ...vertex, point };

  return { ...state, vertices: replaceAt(state.vertices, index, nextVertex) };
}

export function updateVertexHandle(
  state: SvgPathEditorState,
  index: number,
  which: "handleIn" | "handleOut",
  rawPoint: SvgPathPoint,
  altKey: boolean
): SvgPathEditorState {
  const vertex = state.vertices[index];
  if (!vertex || vertex.type !== "curve") return state;

  const point = clampPoint(rawPoint);
  // First Alt-drag on a mirrored handle breaks the symmetry permanently (Illustrator/Figma's "corner anchor" convention) rather than being a momentary per-drag override.
  const mirrored = altKey ? false : vertex.mirrored;
  const opposite = which === "handleOut" ? "handleIn" : "handleOut";

  const nextVertex: SvgPathVertex = {
    ...vertex,
    mirrored,
    [which]: point,
    [opposite]: mirrored ? reflectThrough(point, vertex.point) : vertex[opposite]
  };

  return { ...state, vertices: replaceAt(state.vertices, index, nextVertex) };
}

export function toggleVertexCurve(state: SvgPathEditorState, index: number): SvgPathEditorState {
  const vertices = state.vertices;
  const vertex = vertices[index];
  if (!vertex) return state;

  let nextVertex: SvgPathVertex;
  if (vertex.type === "curve") {
    nextVertex = { type: "straight", point: vertex.point };
  } else {
    /*
      Handle direction is derived from the prev→next chord (a standard pen-tool smoothing heuristic)
      so a freshly-converted vertex starts tangent to its neighbors instead of pointing in an
      arbitrary direction. A CLOSED path's endpoints wrap around like clip-path's polygon does; an
      OPEN path's two endpoints have only one real neighbor, so prev/next both collapse onto the
      vertex's single adjacent point instead of wrapping onto a vertex the path isn't actually
      connected to — the resulting zero-length fallback still resolves to the correct tangent
      (pointing from/to that one neighbor), it just isn't reflected on the missing side.
    */
    const n = vertices.length;
    const prevIndex = state.closed ? (index - 1 + n) % n : Math.max(index - 1, 0);
    const nextIndex = state.closed ? (index + 1) % n : Math.min(index + 1, n - 1);
    const prev = vertices[prevIndex].point;
    const next = vertices[nextIndex].point;
    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    const length = Math.hypot(dx, dy) || 1;
    const handleLength = length / 4;
    const ux = dx / length;
    const uy = dy / length;
    nextVertex = {
      type: "curve",
      point: vertex.point,
      handleOut: { x: vertex.point.x + ux * handleLength, y: vertex.point.y + uy * handleLength },
      handleIn: { x: vertex.point.x - ux * handleLength, y: vertex.point.y - uy * handleLength },
      mirrored: true
    };
  }

  return { ...state, vertices: replaceAt(vertices, index, nextVertex) };
}

// Inserts a new straight vertex right after `index`, splitting an EXISTING edge — the "click an edge midpoint to add a point" gesture.
export function insertVertexAfter(state: SvgPathEditorState, index: number, rawPoint: SvgPathPoint): SvgPathEditorState {
  const vertices = [...state.vertices];
  vertices.splice(index + 1, 0, { type: "straight", point: clampPoint(rawPoint) });
  return { ...state, vertices, selection: null };
}

// Extends the path with a new vertex after its LAST point — the "click empty canvas to keep drawing" gesture a closed clip-path shape never needs, since it has no loose end to extend from.
export function appendVertex(state: SvgPathEditorState, rawPoint: SvgPathPoint): SvgPathEditorState {
  return { ...state, vertices: [...state.vertices, { type: "straight", point: clampPoint(rawPoint) }], selection: null };
}

// Floors at 3 vertices for a closed path (fewer isn't an area) or 2 for an open one (fewer isn't a line).
export function deleteVertex(state: SvgPathEditorState, index: number): SvgPathEditorState {
  const vertices = state.vertices;
  const floor = state.closed ? 3 : 2;
  if (vertices.length <= floor || !vertices[index]) return state;
  return { ...state, vertices: vertices.filter((_, i) => i !== index), selection: null };
}

/*
  Toggles between an open stroke and a closed loop. Closing a 2-point path would otherwise collapse
  the new closing edge onto the existing one (a zero-area sliver, not a real shape) — inserting a
  third point offset from their midpoint gives the freshly-closed path actual area to work with.
*/
export function toggleClosed(state: SvgPathEditorState): SvgPathEditorState {
  const nextClosed = !state.closed;
  if (nextClosed && state.vertices.length < 3) {
    const [a, b] = state.vertices;
    const mid = clampPoint({ x: (a.point.x + b.point.x) / 2, y: (a.point.y + b.point.y) / 2 + 15 });
    return { ...state, closed: true, vertices: [...state.vertices, { type: "straight", point: mid }], selection: null };
  }
  return { ...state, closed: nextClosed, selection: null };
}

export function setStrokeColor(state: SvgPathEditorState, strokeColor: string): SvgPathEditorState {
  return { ...state, strokeColor };
}
export function setStrokeWidth(state: SvgPathEditorState, width: number): SvgPathEditorState {
  return { ...state, strokeWidth: clamp(width, 0, 20) };
}
export function setLineCap(state: SvgPathEditorState, lineCap: SvgLineCap): SvgPathEditorState {
  return { ...state, lineCap };
}
export function setLineJoin(state: SvgPathEditorState, lineJoin: SvgLineJoin): SvgPathEditorState {
  return { ...state, lineJoin };
}
export function setFillEnabled(state: SvgPathEditorState, fillEnabled: boolean): SvgPathEditorState {
  return { ...state, fillEnabled };
}
export function setFillColor(state: SvgPathEditorState, fillColor: string): SvgPathEditorState {
  return { ...state, fillColor };
}

export function applyPreset(state: SvgPathEditorState, preset: SvgPathPresetMeta): SvgPathEditorState {
  return { ...state, vertices: structuredClone(preset.vertices), closed: preset.closed, selection: null };
}

export function shuffle(state: SvgPathEditorState): SvgPathEditorState {
  return { ...state, vertices: generateRandomPath(state.closed), selection: null };
}

export function resetPath(state: SvgPathEditorState): SvgPathEditorState {
  return { ...state, vertices: defaultVertices(), closed: false, selection: null };
}
