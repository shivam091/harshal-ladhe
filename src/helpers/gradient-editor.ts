import { clamp } from "@/utils/number";
import { generateId } from "@/utils/random";
import type {
  GradientConfig,
  GradientEditorState,
  GradientPosition,
  GradientPresetMeta,
  GradientRadialShape,
  GradientRadialSize,
  GradientShareableState,
  GradientStop,
  GradientType
} from "@/interfaces/gradient";

// Keeps a stop's position inside the bar's own 0-100 percentage space — a drag can otherwise report a raw pointer position outside the bar's bounds.
function clampPosition(position: number): number {
  return clamp(position, 0, 100);
}

// Every stop-list mutator funnels through this so the array — and therefore both the bar UI and compileGradientValue — always reads left to right.
function sortStops(stops: GradientStop[]): GradientStop[] {
  return [...stops].sort((a, b) => a.position - b.position);
}

// One neutral default per gradient function — what a fresh page load and a type switch both fall back to. Center position starts at the pad's midpoint for radial/conic since that's the most common starting point for either.
export function defaultConfigForType(type: GradientType): GradientConfig {
  switch (type) {
    case "linear":
      return { type: "linear", angle: 90 };
    case "radial":
      return { type: "radial", shape: "circle", size: "farthest-corner", position: { x: 50, y: 50 } };
    case "conic":
      return { type: "conic", angle: 0, position: { x: 50, y: 50 } };
  }
}

/*
  The two-stop indigo-to-pink gradient every fresh session and every "Reset" click starts from.
  Fixed IDs rather than generateId() — this same function backs createDefaultEditorState's lazy
  initializer, which runs once during SSR and again during the client's own hydration render; two
  independent generateId() calls would produce two different random strings, and that difference
  leaks into ShareControls' rendered permalink text (it encodes the full shareable state), causing a
  hydration mismatch on every fresh visit. New stops added after mount (addStop, applyPreset) are
  unaffected — those only ever run from a click, client-side only, so generateId() there is safe.
*/
function defaultStops(): GradientStop[] {
  return [
    { id: "stop-1", color: "#6366f1", position: 0 },
    { id: "stop-2", color: "#ec4899", position: 100 }
  ];
}

// Picks the fields that round-trip through both localStorage autosave and the permalink — `selectedStopId` is deliberately excluded (pure UI state, and irrelevant to what a shared link should restore).
export function toShareableState(state: GradientEditorState): GradientShareableState {
  const { config, stops, colorSpace, hueInterpolation, repeating } = state;
  return { config, stops, colorSpace, hueInterpolation, repeating };
}

// The brand-new-visitor starting point: a linear gradient, the default two-stop palette, OKLCH interpolation, and no selection.
export function createDefaultEditorState(): GradientEditorState {
  return {
    config: defaultConfigForType("linear"),
    stops: defaultStops(),
    colorSpace: "oklch",
    hueInterpolation: "shorter",
    repeating: false,
    selectedStopId: null
  };
}

// Switching type discards the old geometry (an angle has no meaning to a radial gradient) but keeps stops/colorSpace/repeating — changing how a gradient is projected shouldn't touch what colors it's made of.
export function applyType(state: GradientEditorState, type: GradientType): GradientEditorState {
  if (state.config.type === type) return state;
  return { ...state, config: defaultConfigForType(type) };
}

// Updates the angle for linear/conic configs; a no-op for radial, which has no angle field. Always normalized into [0, 360) so the dial and the numeric field never disagree over e.g. -10deg vs 350deg.
export function setAngle(state: GradientEditorState, angle: number): GradientEditorState {
  if (state.config.type !== "linear" && state.config.type !== "conic") return state;
  return { ...state, config: { ...state.config, angle: ((angle % 360) + 360) % 360 } };
}

// Updates the center position for radial/conic configs; a no-op for linear, which has no position field.
export function setPosition(state: GradientEditorState, position: GradientPosition): GradientEditorState {
  if (state.config.type !== "radial" && state.config.type !== "conic") return state;
  return { ...state, config: { ...state.config, position: { x: clampPosition(position.x), y: clampPosition(position.y) } } };
}

// Updates the radial-only shape field; a no-op for any other type.
export function setRadialShape(state: GradientEditorState, shape: GradientRadialShape): GradientEditorState {
  if (state.config.type !== "radial") return state;
  return { ...state, config: { ...state.config, shape } };
}

// Updates the radial-only size keyword; a no-op for any other type.
export function setRadialSize(state: GradientEditorState, size: GradientRadialSize): GradientEditorState {
  if (state.config.type !== "radial") return state;
  return { ...state, config: { ...state.config, size } };
}

// Finds the widest gap between two neighboring stops (including the 0%/100% edges) — where a new stop reads most naturally, since it's the emptiest stretch of the bar rather than crowding an existing cluster.
function widestGapMidpoint(stops: GradientStop[]): { position: number; nearestStop: GradientStop } {
  const sorted = sortStops(stops);
  let bestGap = -1;
  let bestMidpoint = 50;
  let bestNeighbor = sorted[0];

  for (let i = 0; i < sorted.length - 1; i++) {
    const gap = sorted[i + 1].position - sorted[i].position;
    if (gap > bestGap) {
      bestGap = gap;
      bestMidpoint = (sorted[i].position + sorted[i + 1].position) / 2;
      bestNeighbor = sorted[i];
    }
  }

  return { position: bestMidpoint, nearestStop: bestNeighbor };
}

/*
  Adds a new stop at `position` (from a bar double-click) or, when no position is given, at the
  widest gap's midpoint (the "+ Add stop" button). Its starting color is copied from whichever
  existing stop sits closest — a cheap, no-color-math stand-in for "the color that would already be
  showing there," since this tool has no color-conversion library to actually interpolate one.
*/
export function addStop(state: GradientEditorState, position?: number): GradientEditorState {
  const sorted = sortStops(state.stops);
  const { position: fallbackPosition, nearestStop } = widestGapMidpoint(sorted);
  const targetPosition = clampPosition(position ?? fallbackPosition);

  const nearest = sorted.reduce((closest, stop) => (Math.abs(stop.position - targetPosition) < Math.abs(closest.position - targetPosition) ? stop : closest), nearestStop);

  const stop: GradientStop = { id: generateId(), color: nearest.color, position: targetPosition };
  return { ...state, stops: sortStops([...state.stops, stop]), selectedStopId: stop.id };
}

// Live color update for one stop while a color picker is open — pair with commitDrag on blur/close.
export function updateStopColor(state: GradientEditorState, id: string, color: string): GradientEditorState {
  return { ...state, stops: state.stops.map((stop) => (stop.id === id ? { ...stop, color } : stop)) };
}

// Live position update for one stop while dragging its handle along the bar — pair with commitDrag on release.
export function updateStopPosition(state: GradientEditorState, id: string, position: number): GradientEditorState {
  const stops = sortStops(state.stops.map((stop) => (stop.id === id ? { ...stop, position: clampPosition(position) } : stop)));
  return { ...state, stops };
}

// Floors at 2 stops — fewer than that isn't a gradient any more.
export function removeStop(state: GradientEditorState, id: string): GradientEditorState {
  if (state.stops.length <= 2 || !state.stops.some((stop) => stop.id === id)) return state;
  return { ...state, stops: state.stops.filter((stop) => stop.id !== id), selectedStopId: null };
}

// Pure UI state (which stop's row/handle is highlighted) — never itself an undo step.
export function selectStop(state: GradientEditorState, id: string | null): GradientEditorState {
  return { ...state, selectedStopId: id };
}

// Switches which color space the browser interpolates BETWEEN stops in.
export function setColorSpace(state: GradientEditorState, colorSpace: GradientEditorState["colorSpace"]): GradientEditorState {
  return { ...state, colorSpace };
}

// Switches which direction a polar color space's hue travels between stops; meaningless (and ignored by compileGradientValue) when colorSpace is "rgb".
export function setHueInterpolation(state: GradientEditorState, hueInterpolation: GradientEditorState["hueInterpolation"]): GradientEditorState {
  return { ...state, hueInterpolation };
}

// Toggles the repeating-gradient function variant on/off.
export function toggleRepeating(state: GradientEditorState, repeating: boolean): GradientEditorState {
  return { ...state, repeating };
}

// Replaces geometry and stops with a curated preset's own, deep-cloned so later edits never mutate the shared preset data. colorSpace/hueInterpolation/repeating are deliberately left untouched.
export function applyPreset(state: GradientEditorState, preset: GradientPresetMeta): GradientEditorState {
  return { ...state, config: structuredClone(preset.config), stops: structuredClone(preset.stops), selectedStopId: null };
}

// Resets geometry and stops back to their neutral defaults while keeping the current gradient type and interpolation settings.
export function resetGradient(state: GradientEditorState): GradientEditorState {
  return { ...state, config: defaultConfigForType(state.config.type), stops: defaultStops(), selectedStopId: null };
}
