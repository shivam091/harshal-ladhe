import { clamp } from "@/utils/number";
import { generateId } from "@/utils/random";
import type { GradientFillConfig, GradientFillStop, GradientFillType, TextEffectsEditorState, TextEffectsPresetMeta, TextEffectsShareableState, TextShadowLayer } from "@/interfaces/text-effects";

/*
  A fresh shadow layer's starting values — a small, soft, 40%-opaque drop shadow, close enough to a
  plausible starting point that adding one never looks jarring against whatever's already stacked.
  `id` defaults to a fresh generateId() for addShadowLayer's own use (client-only, triggered by a
  click, so randomness is safe), but createDefaultEditorState below passes a fixed id explicitly —
  that function backs the lazy initializer that runs once during SSR and again during the client's
  own hydration render, and two independent generateId() calls there would leak a different random
  string into ShareControls' rendered permalink text, causing a hydration mismatch on every fresh visit.
*/
function defaultShadowLayer(id: string = generateId()): TextShadowLayer {
  return { id, offsetX: 2, offsetY: 2, blur: 4, color: "#000000", opacity: 40 };
}

// A fresh gradient fill's starting values — off by default (a plain solid textColor is the more common starting look), with a violet-to-pink two-stop ramp ready the moment it's switched on. Fixed stop IDs for the same reason defaultShadowLayer's own id defaults to a param above — this only ever gets called from createDefaultEditorState.
function defaultGradientFill(): GradientFillConfig {
  return {
    enabled: false,
    type: "linear",
    angle: 90,
    stops: [
      { id: "fill-stop-1", color: "#6366f1", position: 0 },
      { id: "fill-stop-2", color: "#ec4899", position: 100 }
    ]
  };
}

// Picks the fields that round-trip through both localStorage autosave and the permalink — `selectedLayerId` is deliberately excluded (pure UI state, and irrelevant to what a shared link should restore).
export function toShareableState(state: TextEffectsEditorState): TextEffectsShareableState {
  const { text, fontSize, fontWeight, textColor, shadowLayers, gradientFill, pageColor } = state;
  return { text, fontSize, fontWeight, textColor, shadowLayers, gradientFill, pageColor };
}

// The tool's starting state on a fresh visit — a friendly sample sentence, a bold 64px weight, one soft shadow layer, and the gradient fill left off.
export function createDefaultEditorState(): TextEffectsEditorState {
  const layer = defaultShadowLayer("shadow-layer-1");
  return {
    text: "Hello World",
    fontSize: 64,
    fontWeight: 800,
    textColor: "#0f172a",
    shadowLayers: [layer],
    gradientFill: defaultGradientFill(),
    pageColor: "#f8fafc",
    selectedLayerId: layer.id
  };
}

// Replaces the subject text verbatim — free text, so there's nothing to validate or clamp.
export function setText(state: TextEffectsEditorState, text: string): TextEffectsEditorState {
  return { ...state, text };
}

// Clamped to a range that stays legible on the stage at one extreme and printable in an export snippet at the other.
export function setFontSize(state: TextEffectsEditorState, size: number): TextEffectsEditorState {
  return { ...state, fontSize: clamp(size, 12, 160) };
}

// Clamped to CSS's own valid font-weight range (100-900).
export function setFontWeight(state: TextEffectsEditorState, weight: number): TextEffectsEditorState {
  return { ...state, fontWeight: clamp(weight, 100, 900) };
}

// Sets the glyphs' own solid color — retained even while the gradient fill is on, so switching the gradient back off restores a deliberate color rather than an unstyled default.
export function setTextColor(state: TextEffectsEditorState, color: string): TextEffectsEditorState {
  return { ...state, textColor: color };
}

// Appends a new layer at the FRONT of the array — CSS renders the first-listed shadow closest to the viewer, same reasoning box-shadow's own addLayer already applies to its list.
export function addShadowLayer(state: TextEffectsEditorState): TextEffectsEditorState {
  const layer = defaultShadowLayer();
  return { ...state, shadowLayers: [layer, ...state.shadowLayers], selectedLayerId: layer.id };
}

// Clones a layer in place (same position, a fresh id) and selects the copy — a quick way to nudge one value off an already-tuned layer rather than rebuilding it from scratch.
export function duplicateShadowLayer(state: TextEffectsEditorState, id: string): TextEffectsEditorState {
  const index = state.shadowLayers.findIndex((layer) => layer.id === id);
  if (index === -1) return state;
  const copy: TextShadowLayer = { ...state.shadowLayers[index], id: generateId() };
  const shadowLayers = [...state.shadowLayers];
  shadowLayers.splice(index, 0, copy);
  return { ...state, shadowLayers, selectedLayerId: copy.id };
}

// No floor on layer count — an empty shadow list is valid CSS (`text-shadow: none`), same reasoning box-shadow's own removeLayer already applies.
export function removeShadowLayer(state: TextEffectsEditorState, id: string): TextEffectsEditorState {
  const shadowLayers = state.shadowLayers.filter((layer) => layer.id !== id);
  const selectedLayerId = state.selectedLayerId === id ? (shadowLayers[0]?.id ?? null) : state.selectedLayerId;
  return { ...state, shadowLayers, selectedLayerId };
}

// Marks which layer's sliders ShadowLayerControls should show — pure UI state, never pushed onto the undo stack.
export function selectLayer(state: TextEffectsEditorState, id: string | null): TextEffectsEditorState {
  return { ...state, selectedLayerId: id };
}

// Patches whichever fields changed on one layer — the single mutation every slider/color field in ShadowLayerControls funnels through.
export function updateShadowLayer(state: TextEffectsEditorState, id: string, patch: Partial<Omit<TextShadowLayer, "id">>): TextEffectsEditorState {
  return { ...state, shadowLayers: state.shadowLayers.map((layer) => (layer.id === id ? { ...layer, ...patch } : layer)) };
}

// Flips the gradient fill on/off — its own action rather than a plain patch call site so GradientFillControls' checkbox handler reads as intent-revealing.
export function toggleGradientFill(state: TextEffectsEditorState, enabled: boolean): TextEffectsEditorState {
  return { ...state, gradientFill: { ...state.gradientFill, enabled } };
}

// Switches which CSS gradient function the fill compiles to (linear/radial/conic).
export function setGradientType(state: TextEffectsEditorState, type: GradientFillType): TextEffectsEditorState {
  return { ...state, gradientFill: { ...state.gradientFill, type } };
}

// Wraps the angle into [0, 360) with a double modulo (JS's `%` can return a negative remainder for a negative dividend) rather than clamping, since an angle is circular — 370deg and 10deg are the same direction, not an out-of-range value to reject.
export function setGradientAngle(state: TextEffectsEditorState, angle: number): TextEffectsEditorState {
  return { ...state, gradientFill: { ...state.gradientFill, angle: ((angle % 360) + 360) % 360 } };
}

// Stops are kept in position order so the compiled gradient's own comma-separated stop list always reads left-to-right/inside-out, regardless of the order stops were added or dragged in.
function sortStops(stops: GradientFillStop[]): GradientFillStop[] {
  return [...stops].sort((a, b) => a.position - b.position);
}

// Adds a stop at the widest gap's midpoint, copying the nearest existing stop's color — same no-color-math approach GradientGenerator's own addStop uses, since this tool has no color-conversion library either.
export function addGradientStop(state: TextEffectsEditorState): TextEffectsEditorState {
  const sorted = sortStops(state.gradientFill.stops);
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

  const stop: GradientFillStop = { id: generateId(), color: bestNeighbor.color, position: bestMidpoint };
  return { ...state, gradientFill: { ...state.gradientFill, stops: sortStops([...state.gradientFill.stops, stop]) } };
}

// Floors at 2 stops — fewer than that isn't a gradient any more.
export function removeGradientStop(state: TextEffectsEditorState, id: string): TextEffectsEditorState {
  if (state.gradientFill.stops.length <= 2) return state;
  return { ...state, gradientFill: { ...state.gradientFill, stops: state.gradientFill.stops.filter((stop) => stop.id !== id) } };
}

// Patches one stop's color/position — a changed position is clamped to [0, 100] and the list is re-sorted so drag/type edits can't silently reorder the compiled gradient's stop list out of position order.
export function updateGradientStop(state: TextEffectsEditorState, id: string, patch: Partial<Omit<GradientFillStop, "id">>): TextEffectsEditorState {
  const stops = sortStops(state.gradientFill.stops.map((stop) => (stop.id === id ? { ...stop, ...patch, position: patch.position !== undefined ? clamp(patch.position, 0, 100) : stop.position } : stop)));
  return { ...state, gradientFill: { ...state.gradientFill, stops } };
}

// Sets the color of the page/backdrop the effect is judged against — kept separate from the stage's own fixed spotlight backdrop (PreviewPane), this is only what preset thumbnails and exported context imply the text sits on.
export function setPageColor(state: TextEffectsEditorState, color: string): TextEffectsEditorState {
  return { ...state, pageColor: color };
}

// Swaps in a curated preset's shadow/gradient/colors (deep-cloned with fresh ids, so editing one instance never mutates the shared presets array) — deliberately leaves `text` untouched, since a preset is about the effect, not forcing specific wording onto whatever the user already typed.
export function applyPreset(state: TextEffectsEditorState, preset: TextEffectsPresetMeta): TextEffectsEditorState {
  const shadowLayers = structuredClone(preset.shadowLayers).map((layer) => ({ ...layer, id: generateId() }));
  const gradientFill = structuredClone(preset.gradientFill);
  gradientFill.stops = gradientFill.stops.map((stop) => ({ ...stop, id: generateId() }));

  return {
    ...state,
    fontSize: preset.fontSize,
    fontWeight: preset.fontWeight,
    textColor: preset.textColor,
    shadowLayers,
    gradientFill,
    pageColor: preset.pageColor,
    selectedLayerId: shadowLayers[0]?.id ?? null
  };
}

// Discards every font/shadow/gradient/color customization but keeps whatever the user has typed — unlike box-shadow's resetShadow (which has no comparable "subject" to preserve), clearing someone's actual sentence back to "Hello World" on a stray reset click would be a much more disruptive loss.
export function resetEffects(state: TextEffectsEditorState): TextEffectsEditorState {
  const defaults = createDefaultEditorState();
  return { ...defaults, text: state.text };
}
