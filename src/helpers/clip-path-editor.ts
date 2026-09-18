import { clamp } from "@/utils/number";
import { matchTopology } from "@/utils/clip-path-animation";
import { generateRandomPolygon } from "@/data/clip-path-presets";
import type {
  ClipPathCircleShape,
  ClipPathEditorState,
  ClipPathEllipseShape,
  ClipPathInsetShape,
  ClipPathPoint,
  ClipPathShape,
  ClipPathShapeFamily,
  ClipPathShareableState,
  ClipPathVertex
} from "@/interfaces/clip-path";

// Keeps every point inside the shape's own 0-100 percentage space — a drag can otherwise report a raw pointer position outside the preview bounds.
function clampPoint(point: ClipPathPoint): ClipPathPoint {
  return { x: clamp(point.x, 0, 100), y: clamp(point.y, 0, 100) };
}
function translate(point: ClipPathPoint, dx: number, dy: number): ClipPathPoint {
  return { x: point.x + dx, y: point.y + dy };
}
// Reflects `point` through `center` — how a mirrored curve vertex's opposite handle is derived from the one actually being dragged.
function reflectThrough(point: ClipPathPoint, center: ClipPathPoint): ClipPathPoint {
  return { x: 2 * center.x - point.x, y: 2 * center.y - point.y };
}
function replaceAt<T>(list: T[], index: number, value: T): T[] {
  const next = [...list];
  next[index] = value;
  return next;
}

// A regular N-gon centered at (50, 50) — used only as the polygon family's neutral starting shape (distinct from generateRandomPolygon, which backs the Shuffle action).
function regularPolygon(count: number, radius: number): ClipPathVertex[] {
  const angleStep = (Math.PI * 2) / count;
  return Array.from({ length: count }, (_, i) => {
    const angle = i * angleStep - Math.PI / 2;
    return { type: "straight", point: { x: 50 + Math.cos(angle) * radius, y: 50 + Math.sin(angle) * radius } };
  });
}

// One neutral default shape per family — what a fresh page load and the "Reset" action both fall back to.
export function defaultShapeForFamily(family: ClipPathShapeFamily): ClipPathShape {
  switch (family) {
    case "polygon":
      return { family: "polygon", vertices: regularPolygon(5, 45) };
    case "circle":
      return { family: "circle", center: { x: 50, y: 50 }, radius: 35 };
    case "ellipse":
      return { family: "ellipse", center: { x: 50, y: 50 }, rx: 40, ry: 30 };
    case "inset":
      return { family: "inset", top: 15, right: 15, bottom: 15, left: 15, cornerRadius: 0 };
  }
}

// Picks the fields that round-trip through both localStorage autosave and the permalink — `selection` is deliberately excluded (pure UI state, and irrelevant to what a shared link should restore).
export function toShareableState(state: ClipPathEditorState): ClipPathShareableState {
  const { shape, morph, previewSubject, previewColor, previewImageId, previewText } = state;
  return { shape, morph, previewSubject, previewColor, previewImageId, previewText };
}

export function createDefaultEditorState(): ClipPathEditorState {
  return {
    shape: defaultShapeForFamily("polygon"),
    morph: null,
    selection: null,
    previewSubject: "color",
    previewColor: "#6366f1",
    previewImageId: "hl-standing",
    previewText: "Clip Path"
  };
}

export function applyFamily(state: ClipPathEditorState, family: ClipPathShapeFamily): ClipPathEditorState {
  if (state.shape.family === family) return state;
  // A new family's shape has no meaningful relationship to the old one's vertices/handles, so morph's Shape B (defined against the old shape) is cleared rather than left silently stale.
  return { ...state, shape: defaultShapeForFamily(family), selection: null, morph: null };
}

export function updateVertexPoint(state: ClipPathEditorState, index: number, rawPoint: ClipPathPoint): ClipPathEditorState {
  if (state.shape.family !== "polygon") return state;
  const vertex = state.shape.vertices[index];
  if (!vertex) return state;

  const point = clampPoint(rawPoint);
  const dx = point.x - vertex.point.x;
  const dy = point.y - vertex.point.y;
  // Dragging a curve vertex's anchor carries its handles along with it (same relative offset) — otherwise the curve's shape distorts every time its anchor moves, which reads as broken rather than intentional.
  const nextVertex: ClipPathVertex =
    vertex.type === "curve"
      ? { ...vertex, point, handleIn: translate(vertex.handleIn, dx, dy), handleOut: translate(vertex.handleOut, dx, dy) }
      : { ...vertex, point };

  return { ...state, shape: { family: "polygon", vertices: replaceAt(state.shape.vertices, index, nextVertex) } };
}

export function updateVertexHandle(
  state: ClipPathEditorState,
  index: number,
  which: "handleIn" | "handleOut",
  rawPoint: ClipPathPoint,
  altKey: boolean
): ClipPathEditorState {
  if (state.shape.family !== "polygon") return state;
  const vertex = state.shape.vertices[index];
  if (!vertex || vertex.type !== "curve") return state;

  const point = clampPoint(rawPoint);
  // First Alt-drag on a mirrored handle breaks the symmetry permanently (Illustrator/Figma's "corner anchor" convention) rather than being a momentary per-drag override.
  const mirrored = altKey ? false : vertex.mirrored;
  const opposite = which === "handleOut" ? "handleIn" : "handleOut";

  const nextVertex: ClipPathVertex = {
    ...vertex,
    mirrored,
    [which]: point,
    [opposite]: mirrored ? reflectThrough(point, vertex.point) : vertex[opposite]
  };

  return { ...state, shape: { family: "polygon", vertices: replaceAt(state.shape.vertices, index, nextVertex) } };
}

export function toggleVertexCurve(state: ClipPathEditorState, index: number): ClipPathEditorState {
  if (state.shape.family !== "polygon") return state;
  const vertices = state.shape.vertices;
  const vertex = vertices[index];
  if (!vertex) return state;

  let nextVertex: ClipPathVertex;
  if (vertex.type === "curve") {
    nextVertex = { type: "straight", point: vertex.point };
  } else {
    // Handle direction is derived from the prev→next chord (a standard pen-tool smoothing heuristic) so a freshly-converted vertex starts tangent to its neighbors instead of pointing in an arbitrary direction.
    const n = vertices.length;
    const prev = vertices[(index - 1 + n) % n].point;
    const next = vertices[(index + 1) % n].point;
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

  return { ...state, shape: { family: "polygon", vertices: replaceAt(vertices, index, nextVertex) } };
}

// Inserts a new straight vertex right after `index` — the "click an edge midpoint to add a point" gesture.
export function insertVertexAfter(state: ClipPathEditorState, index: number, rawPoint: ClipPathPoint): ClipPathEditorState {
  if (state.shape.family !== "polygon") return state;
  const vertices = [...state.shape.vertices];
  vertices.splice(index + 1, 0, { type: "straight", point: clampPoint(rawPoint) });
  return { ...state, shape: { family: "polygon", vertices }, selection: null };
}

// Floors at 3 vertices — fewer than that isn't a polygon any more, and every clip-path CSS function needs at least a triangle's worth of points to describe an area.
export function deleteVertex(state: ClipPathEditorState, index: number): ClipPathEditorState {
  if (state.shape.family !== "polygon") return state;
  const vertices = state.shape.vertices;
  if (vertices.length <= 3 || !vertices[index]) return state;
  return { ...state, shape: { family: "polygon", vertices: vertices.filter((_, i) => i !== index) }, selection: null };
}

export function updateCircle(state: ClipPathEditorState, patch: Partial<Omit<ClipPathCircleShape, "family">>): ClipPathEditorState {
  if (state.shape.family !== "circle") return state;
  return { ...state, shape: { ...state.shape, ...patch } };
}
export function updateEllipse(state: ClipPathEditorState, patch: Partial<Omit<ClipPathEllipseShape, "family">>): ClipPathEditorState {
  if (state.shape.family !== "ellipse") return state;
  return { ...state, shape: { ...state.shape, ...patch } };
}
export function updateInset(state: ClipPathEditorState, patch: Partial<Omit<ClipPathInsetShape, "family">>): ClipPathEditorState {
  if (state.shape.family !== "inset") return state;
  return { ...state, shape: { ...state.shape, ...patch } };
}

export function applyPreset(state: ClipPathEditorState, shape: ClipPathShape): ClipPathEditorState {
  return { ...state, shape: structuredClone(shape), selection: null, morph: null };
}

export function shuffleShape(state: ClipPathEditorState): ClipPathEditorState {
  return { ...state, shape: generateRandomPolygon(), selection: null, morph: null };
}

export function resetShape(state: ClipPathEditorState): ClipPathEditorState {
  return { ...state, shape: defaultShapeForFamily(state.shape.family), selection: null };
}

/*
  Turning morph on for the first time seeds Shape B as a clone of the current shape (so the user
  edits a copy forward from a known-compatible starting point, rather than an unrelated shape that's
  immediately flagged incompatible) and picks a reasonable default duration/easing pulled from this
  site's own transitions content. Turning it off keeps the ClipPathMorphState object around (just
  `enabled: false`) so re-enabling doesn't discard whatever the user had set up for Shape B.
*/
export function toggleMorph(state: ClipPathEditorState, enabled: boolean): ClipPathEditorState {
  if (!state.morph) {
    return { ...state, morph: { shapeB: structuredClone(state.shape), enabled, t: 0, duration: "600ms", easing: "cubic-bezier(0.65, 0, 0.35, 1)" } };
  }
  return { ...state, morph: { ...state.morph, enabled } };
}
export function setMorphShapeB(state: ClipPathEditorState, shape: ClipPathShape): ClipPathEditorState {
  if (!state.morph) return state;
  return { ...state, morph: { ...state.morph, shapeB: structuredClone(shape) } };
}
export function setMorphT(state: ClipPathEditorState, t: number): ClipPathEditorState {
  if (!state.morph) return state;
  return { ...state, morph: { ...state.morph, t: clamp(t, 0, 1) } };
}
export function setMorphDuration(state: ClipPathEditorState, duration: string): ClipPathEditorState {
  if (!state.morph) return state;
  return { ...state, morph: { ...state.morph, duration } };
}
export function setMorphEasing(state: ClipPathEditorState, easing: string): ClipPathEditorState {
  if (!state.morph) return state;
  return { ...state, morph: { ...state.morph, easing } };
}
export function syncMorphTopology(state: ClipPathEditorState): ClipPathEditorState {
  if (!state.morph) return state;
  return { ...state, morph: { ...state.morph, shapeB: matchTopology(state.shape, state.morph.shapeB) } };
}
