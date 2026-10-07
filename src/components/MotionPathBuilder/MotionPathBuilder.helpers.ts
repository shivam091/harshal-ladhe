import { clamp } from "@/utils/number";
import { motionPathPresets } from "@/data/motion-path-builder-presets";
import { EASING_BEZIERS, STAGE_HEIGHT, STAGE_WIDTH, clampToStage } from "@/components/MotionPathBuilder/MotionPathBuilder.utils";
import type {
  MotionPathBezier,
  MotionPathEasingKeyword,
  MotionPathEditorState,
  MotionPathPenMode,
  MotionPathPoint,
  MotionPathPresetMeta,
  MotionPathSettings,
  MotionPathShareableState,
  MotionPathVertex
} from "@/components/MotionPathBuilder/MotionPathBuilder.types";

// How far beyond the last pin "Extend track" lays the next one, in baseboard units.
const EXTEND_STEP = 60;

// Shifts a point by a delta — how a pin's handles travel with it when the pin is dragged.
function translate(point: MotionPathPoint, dx: number, dy: number): MotionPathPoint {
  return { x: point.x + dx, y: point.y + dy };
}

// Reflects `point` through `centre` — how a smooth pin's opposite handle follows the one being dragged.
function reflectThrough(point: MotionPathPoint, centre: MotionPathPoint): MotionPathPoint {
  return { x: 2 * centre.x - point.x, y: 2 * centre.y - point.y };
}

// Immutable single-item replacement, so every edit hands the undo stack a fresh array.
function replaceAt<T>(list: T[], index: number, value: T): T[] {
  const next = [...list];
  next[index] = value;
  return next;
}

// Unit vector from a to b, falling back to +x when the two coincide so a handle never ends up NaN.
function direction(a: MotionPathPoint, b: MotionPathPoint): MotionPathPoint {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.hypot(dx, dy);
  return length > 0 ? { x: dx / length, y: dy / length } : { x: 1, y: 0 };
}

// The timetable a fresh layout runs to — a gentle, endlessly shuttling loco, so the tool demonstrates itself before anyone touches a control.
const DEFAULT_SETTINGS: MotionPathSettings = {
  glyph: "loco",
  customGlyph: "🚂",
  duration: 4,
  delay: 0,
  iterations: 1,
  infinite: true,
  direction: "alternate",
  rotateMode: "auto",
  rotateAngle: 0,
  easing: "ease-in-out",
  bezier: EASING_BEZIERS["ease-in-out"],
  anchorX: 50,
  anchorY: 50,
  startDistance: 0,
  endDistance: 100
};

// Opens on the wave preset — a curvy open track shows off auto-rotation better than a straight line would.
export function createDefaultEditorState(): MotionPathEditorState {
  const preset = motionPathPresets.find((p) => p.slug === "wave") ?? motionPathPresets[0];
  return { ...DEFAULT_SETTINGS, vertices: preset.vertices, closed: preset.closed, penMode: "smooth", selection: null };
}

// Drops the UI-only selection — a shared link shouldn't depend on which pin the sender last clicked.
export function toShareableState(state: MotionPathEditorState): MotionPathShareableState {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { selection, ...rest } = state;
  return rest;
}

// A finite number, or nothing — the first gate every untrusted field passes.
function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

// A {x, y} pair of finite numbers.
function isPoint(value: unknown): value is MotionPathPoint {
  if (!value || typeof value !== "object") return false;
  const { x, y } = value as Record<string, unknown>;
  return isNumber(x) && isNumber(y);
}

// One structurally sound pin — anything else in a tampered permalink is rejected rather than half-rendered.
function isVertex(value: unknown): value is MotionPathVertex {
  if (!value || typeof value !== "object") return false;
  const vertex = value as Record<string, unknown>;
  if (!isPoint(vertex.point)) return false;
  if (vertex.type === "straight") return true;
  return vertex.type === "curve" && isPoint(vertex.handleIn) && isPoint(vertex.handleOut) && typeof vertex.mirrored === "boolean";
}

// Picks `value` when it's one of `options`, otherwise the fallback.
function oneOf<T extends string>(value: unknown, options: readonly T[], fallback: T): T {
  return options.includes(value as T) ? (value as T) : fallback;
}

/*
  Rebuilds a full, valid editor state from anything — a decoded permalink, an old autosave, a
  hand-edited URL. Every field is checked and clamped on its own, so one bad value costs only
  that value, not the whole layout.
*/
export function sanitiseState(input: unknown): MotionPathEditorState {
  const fallback = createDefaultEditorState();
  if (!input || typeof input !== "object") return fallback;
  const raw = input as Record<string, unknown>;

  const vertices = Array.isArray(raw.vertices) && raw.vertices.length >= 2 && raw.vertices.every(isVertex) ? (raw.vertices as MotionPathVertex[]) : fallback.vertices;
  const bezier =
    Array.isArray(raw.bezier) && raw.bezier.length === 4 && raw.bezier.every(isNumber)
      ? (raw.bezier.map((n: number) => clamp(n, 0, 1)) as MotionPathBezier)
      : fallback.bezier;

  return {
    vertices,
    closed: typeof raw.closed === "boolean" && vertices !== fallback.vertices ? raw.closed : fallback.closed,
    penMode: oneOf(raw.penMode, ["smooth", "corner"] as const, fallback.penMode),
    selection: null,
    glyph: oneOf(raw.glyph, ["loco", "arrow", "plane", "dot", "car", "custom"] as const, fallback.glyph),
    customGlyph: typeof raw.customGlyph === "string" ? raw.customGlyph.slice(0, 8) : fallback.customGlyph,
    duration: isNumber(raw.duration) ? clamp(raw.duration, 0.5, 20) : fallback.duration,
    delay: isNumber(raw.delay) ? clamp(raw.delay, 0, 5) : fallback.delay,
    iterations: isNumber(raw.iterations) ? clamp(Math.round(raw.iterations), 1, 20) : fallback.iterations,
    infinite: typeof raw.infinite === "boolean" ? raw.infinite : fallback.infinite,
    direction: oneOf(raw.direction, ["normal", "reverse", "alternate"] as const, fallback.direction),
    rotateMode: oneOf(raw.rotateMode, ["auto", "auto-reverse", "fixed"] as const, fallback.rotateMode),
    rotateAngle: isNumber(raw.rotateAngle) ? clamp(raw.rotateAngle, -180, 180) : fallback.rotateAngle,
    easing: oneOf(raw.easing, ["linear", "ease", "ease-in", "ease-out", "ease-in-out", "custom"] as const, fallback.easing),
    bezier,
    anchorX: isNumber(raw.anchorX) ? clamp(raw.anchorX, 0, 100) : fallback.anchorX,
    anchorY: isNumber(raw.anchorY) ? clamp(raw.anchorY, 0, 100) : fallback.anchorY,
    startDistance: isNumber(raw.startDistance) ? clamp(raw.startDistance, 0, 100) : fallback.startDistance,
    endDistance: isNumber(raw.endDistance) ? clamp(raw.endDistance, 0, 100) : fallback.endDistance
  };
}

// Plain JSON → base64 → URL-safe characters, matching every other goodie's permalink format.
export function encodeShareableState(state: MotionPathShareableState): string {
  const json = JSON.stringify(state);
  const base64 = btoa(unescape(encodeURIComponent(json)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Reverses encodeShareableState; null on anything malformed so the caller falls back instead of crashing.
export function decodeShareableState(encoded: string): MotionPathEditorState | null {
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(base64)));
    return sanitiseState(JSON.parse(json));
  } catch {
    return null;
  }
}

// Moves a pin, carrying its handles with it so the curve keeps its shape instead of kinking.
export function updateVertexPoint(state: MotionPathEditorState, index: number, rawPoint: MotionPathPoint): MotionPathEditorState {
  const vertex = state.vertices[index];
  if (!vertex) return state;
  const point = clampToStage(rawPoint);
  const dx = point.x - vertex.point.x;
  const dy = point.y - vertex.point.y;
  const next: MotionPathVertex =
    vertex.type === "curve" ? { ...vertex, point, handleIn: translate(vertex.handleIn, dx, dy), handleOut: translate(vertex.handleOut, dx, dy) } : { ...vertex, point };
  return { ...state, vertices: replaceAt(state.vertices, index, next) };
}

// Moves one handle; a smooth pin mirrors the other, and an Alt-drag breaks it into a corner for good (the Illustrator/Figma convention).
export function updateVertexHandle(
  state: MotionPathEditorState,
  index: number,
  which: "handleIn" | "handleOut",
  rawPoint: MotionPathPoint,
  altKey: boolean
): MotionPathEditorState {
  const vertex = state.vertices[index];
  if (!vertex || vertex.type !== "curve") return state;
  const point = clampToStage(rawPoint);
  const mirrored = altKey ? false : vertex.mirrored;
  const opposite = which === "handleOut" ? "handleIn" : "handleOut";
  const next: MotionPathVertex = { ...vertex, mirrored, [which]: point, [opposite]: mirrored ? reflectThrough(point, vertex.point) : vertex[opposite] };
  return { ...state, vertices: replaceAt(state.vertices, index, next) };
}

// A smooth pin's handles, aimed along the chord between its neighbours so a converted pin starts tangent to the track rather than pointing anywhere.
function smoothHandles(state: MotionPathEditorState, vertices: MotionPathVertex[], index: number): { handleIn: MotionPathPoint; handleOut: MotionPathPoint } {
  const n = vertices.length;
  const prevIndex = state.closed ? (index - 1 + n) % n : Math.max(index - 1, 0);
  const nextIndex = state.closed ? (index + 1) % n : Math.min(index + 1, n - 1);
  const prev = vertices[prevIndex].point;
  const next = vertices[nextIndex].point;
  const point = vertices[index].point;
  const unit = direction(prev, next);
  const length = Math.max(Math.hypot(next.x - prev.x, next.y - prev.y) / 4, 12);
  return {
    handleIn: clampToStage({ x: point.x - unit.x * length, y: point.y - unit.y * length }),
    handleOut: clampToStage({ x: point.x + unit.x * length, y: point.y + unit.y * length })
  };
}

// Flips a pin between smooth (curved, mirrored handles) and corner (a straight joint).
export function toggleVertexCurve(state: MotionPathEditorState, index: number): MotionPathEditorState {
  const vertex = state.vertices[index];
  if (!vertex) return state;
  const next: MotionPathVertex =
    vertex.type === "curve" ? { type: "straight", point: vertex.point } : { type: "curve", point: vertex.point, ...smoothHandles(state, state.vertices, index), mirrored: true };
  const selection = state.selection?.vertexIndex === index ? { vertexIndex: index, part: "point" as const } : state.selection;
  return { ...state, selection, vertices: replaceAt(state.vertices, index, next) };
}

// Builds a pin in the current pen mode — smooth pins get tangent handles straight away so the new length of track curves into place.
function createVertex(state: MotionPathEditorState, vertices: MotionPathVertex[], index: number): MotionPathVertex {
  const vertex = vertices[index];
  if (state.penMode === "corner") return { type: "straight", point: vertex.point };
  return { type: "curve", point: vertex.point, ...smoothHandles(state, vertices, index), mirrored: true };
}

// Splits an existing length of track — the "click the rail to add a pin" gesture.
export function insertVertexAfter(state: MotionPathEditorState, index: number, rawPoint: MotionPathPoint): MotionPathEditorState {
  const vertices: MotionPathVertex[] = [...state.vertices];
  vertices.splice(index + 1, 0, { type: "straight", point: clampToStage(rawPoint) });
  vertices[index + 1] = createVertex(state, vertices, index + 1);
  return { ...state, vertices, selection: { vertexIndex: index + 1, part: "point" } };
}

// Lays a new pin after the last one — clicking open baseboard keeps drawing, like a pen tool.
export function appendVertex(state: MotionPathEditorState, rawPoint: MotionPathPoint): MotionPathEditorState {
  const vertices: MotionPathVertex[] = [...state.vertices, { type: "straight", point: clampToStage(rawPoint) }];
  const index = vertices.length - 1;
  vertices[index] = createVertex(state, vertices, index);
  return { ...state, vertices, selection: { vertexIndex: index, part: "point" } };
}

// Keyboard route to drawing: continues the track's last heading by a fixed step, turning back inwards if it would run off the baseboard.
export function extendTrack(state: MotionPathEditorState): MotionPathEditorState {
  const { vertices } = state;
  const last = vertices[vertices.length - 1].point;
  const before = vertices.length > 1 ? vertices[vertices.length - 2].point : { x: last.x - 1, y: last.y };
  const unit = direction(before, last);
  let candidate = { x: last.x + unit.x * EXTEND_STEP, y: last.y + unit.y * EXTEND_STEP };
  if (candidate.x < 0 || candidate.x > STAGE_WIDTH || candidate.y < 0 || candidate.y > STAGE_HEIGHT) {
    candidate = { x: last.x - unit.y * EXTEND_STEP, y: last.y + unit.x * EXTEND_STEP };
  }
  return appendVertex(state, candidate);
}

// Pulls a pin; a track can't drop below two, since offset-path needs some length to travel.
export function deleteVertex(state: MotionPathEditorState, index: number): MotionPathEditorState {
  if (state.vertices.length <= 2) return state;
  const vertices = state.vertices.filter((_, i) => i !== index);
  const nextIndex = Math.min(index, vertices.length - 1);
  return { ...state, vertices, selection: { vertexIndex: nextIndex, part: "point" } };
}

// Switches the pen between laying smooth and corner pins.
export function setPenMode(state: MotionPathEditorState, penMode: MotionPathPenMode): MotionPathEditorState {
  return { ...state, penMode };
}

// Joins the last pin back to the first (or breaks the loop again) — a closed track wraps offset-distance round instead of stopping at the end.
export function toggleClosed(state: MotionPathEditorState): MotionPathEditorState {
  return { ...state, closed: !state.closed };
}

// Swaps in a freshly parsed track wholesale, leaving the timetable alone.
export function loadPath(state: MotionPathEditorState, vertices: MotionPathVertex[], closed: boolean): MotionPathEditorState {
  return { ...state, vertices, closed, selection: null };
}

// Writes one timetable or rolling-stock field.
export function setSetting<K extends keyof MotionPathSettings>(state: MotionPathEditorState, key: K, value: MotionPathSettings[K]): MotionPathEditorState {
  return { ...state, [key]: value };
}

// Picking a keyword also loads its curve into the bezier fields, so switching to custom afterwards starts from what was just running.
export function setEasingKeyword(state: MotionPathEditorState, keyword: Exclude<MotionPathEasingKeyword, "custom">): MotionPathEditorState {
  return { ...state, easing: keyword, bezier: [...EASING_BEZIERS[keyword]] as MotionPathBezier };
}

// Editing any control point means the curve is no longer a keyword, so easing flips to custom; values stay in 0–1 so SMIL can still use them.
export function setBezierValue(state: MotionPathEditorState, index: number, value: number): MotionPathEditorState {
  const bezier = [...state.bezier] as MotionPathBezier;
  bezier[index] = clamp(Number.isFinite(value) ? value : 0, 0, 1);
  return { ...state, easing: "custom", bezier };
}

// A preset brings its own track and suggested run; fields it doesn't mention carry over from the current layout.
export function applyPreset(state: MotionPathEditorState, preset: MotionPathPresetMeta): MotionPathEditorState {
  const merged: MotionPathEditorState = { ...state, ...preset.settings, vertices: preset.vertices, closed: preset.closed, selection: null };
  return preset.settings.easing && preset.settings.easing !== "custom" ? setEasingKeyword(merged, preset.settings.easing) : merged;
}

// Back to the opening wave layout — the escape hatch after an experiment has wandered off the baseboard.
export function resetLayout(): MotionPathEditorState {
  return createDefaultEditorState();
}
