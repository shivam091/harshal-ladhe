import { generateId } from "@/utils/random";
import type { BoxShadowEditorState, BoxShadowPresetMeta, BoxShadowShareableState, ShadowLayer } from "@/interfaces/box-shadow";

/*
  A fresh layer's starting values — a small, soft, non-inset drop shadow, close enough to CSS's own
  initial appearance that adding one never looks jarring against whatever's already stacked. `id`
  defaults to a fresh generateId() for addLayer's own use (client-only, triggered by a click, so
  randomness is safe), but createDefaultEditorState below passes a fixed id explicitly — that
  function backs the lazy initializer that runs once during SSR and again during the client's own
  hydration render, and two independent generateId() calls there would leak a different random
  string into ShareControls' rendered permalink text, causing a hydration mismatch on every fresh visit.
*/
function defaultLayer(id: string = generateId()): ShadowLayer {
  return { id, offsetX: 0, offsetY: 4, blur: 12, spread: 0, color: "#000000", opacity: 15, inset: false };
}

// Picks the fields that round-trip through both localStorage autosave and the permalink — `selectedLayerId` is deliberately excluded (pure UI state, and irrelevant to what a shared link should restore).
export function toShareableState(state: BoxShadowEditorState): BoxShadowShareableState {
  const { layers, surfaceColor, pageColor, borderRadius } = state;
  return { layers, surfaceColor, pageColor, borderRadius };
}

// The tool's starting state on a fresh visit — one soft layer, a white surface on a light-slate page, and a moderately rounded corner.
export function createDefaultEditorState(): BoxShadowEditorState {
  const layer = defaultLayer("layer-1");
  return { layers: [layer], selectedLayerId: layer.id, surfaceColor: "#ffffff", pageColor: "#f1f5f9", borderRadius: 16 };
}

// Appends a new layer at the FRONT of the array — CSS renders the first-listed shadow closest to the viewer, so a freshly added layer should sit on top of whatever's already there rather than silently hiding behind it. Selects it immediately so its controls are the ones shown next.
export function addLayer(state: BoxShadowEditorState): BoxShadowEditorState {
  const layer = defaultLayer();
  return { ...state, layers: [layer, ...state.layers], selectedLayerId: layer.id };
}

// Clones a layer in place (same position, a fresh id) and selects the copy — a quick way to nudge one value off an already-tuned layer rather than rebuilding it from scratch.
export function duplicateLayer(state: BoxShadowEditorState, id: string): BoxShadowEditorState {
  const index = state.layers.findIndex((layer) => layer.id === id);
  if (index === -1) return state;
  const copy: ShadowLayer = { ...state.layers[index], id: generateId() };
  const layers = [...state.layers];
  layers.splice(index, 0, copy);
  return { ...state, layers, selectedLayerId: copy.id };
}

/*
  No floor on layer count — unlike a clip-path polygon (which stops being a valid shape below 3
  vertices), an empty shadow list is perfectly valid CSS (`box-shadow: none`), so removing the last
  layer is allowed and just means "no shadow" rather than being blocked. Falls the selection back to
  whatever is now first when the removed layer was the selected one.
*/
export function removeLayer(state: BoxShadowEditorState, id: string): BoxShadowEditorState {
  const layers = state.layers.filter((layer) => layer.id !== id);
  const selectedLayerId = state.selectedLayerId === id ? (layers[0]?.id ?? null) : state.selectedLayerId;
  return { ...state, layers, selectedLayerId };
}

// Marks which layer's sliders LayerControls should show — pure UI state, never pushed onto the undo stack.
export function selectLayer(state: BoxShadowEditorState, id: string | null): BoxShadowEditorState {
  return { ...state, selectedLayerId: id };
}

// Swaps a layer with its immediate neighbor in `direction` — the one primitive moveLayerUp/moveLayerDown both build on. A no-op past either end rather than wrapping around.
function moveLayer(state: BoxShadowEditorState, id: string, direction: -1 | 1): BoxShadowEditorState {
  const index = state.layers.findIndex((layer) => layer.id === id);
  const target = index + direction;
  if (index === -1 || target < 0 || target >= state.layers.length) return state;

  const layers = [...state.layers];
  [layers[index], layers[target]] = [layers[target], layers[index]];
  return { ...state, layers };
}

// Moves a layer one step closer to the viewer (earlier in the array) — CSS's own stacking rule, see ShadowLayer's own comment.
export function moveLayerUp(state: BoxShadowEditorState, id: string): BoxShadowEditorState {
  return moveLayer(state, id, -1);
}

// Moves a layer one step further from the viewer (later in the array).
export function moveLayerDown(state: BoxShadowEditorState, id: string): BoxShadowEditorState {
  return moveLayer(state, id, 1);
}

// Patches whichever fields changed on one layer — the single mutation every slider/color field in LayerControls funnels through.
export function updateLayer(state: BoxShadowEditorState, id: string, patch: Partial<Omit<ShadowLayer, "id">>): BoxShadowEditorState {
  return { ...state, layers: state.layers.map((layer) => (layer.id === id ? { ...layer, ...patch } : layer)) };
}

// Flips a layer between a cast (outer) and inset shadow — its own action rather than a plain updateLayer call site so LayerControls' checkbox handler reads as intent-revealing.
export function toggleInset(state: BoxShadowEditorState, id: string, inset: boolean): BoxShadowEditorState {
  return updateLayer(state, id, { inset });
}

// Sets the color of the element the shadow is cast from/onto.
export function setSurfaceColor(state: BoxShadowEditorState, color: string): BoxShadowEditorState {
  return { ...state, surfaceColor: color };
}

// Sets the color of the page/backdrop behind the surface — kept separate from surfaceColor because neumorphism-style presets need the two to be near-identical.
export function setPageColor(state: BoxShadowEditorState, color: string): BoxShadowEditorState {
  return { ...state, pageColor: color };
}

// Clamped at zero — a negative border radius has no CSS meaning.
export function setBorderRadius(state: BoxShadowEditorState, radius: number): BoxShadowEditorState {
  return { ...state, borderRadius: Math.max(0, radius) };
}

// Swaps in a curated preset's layers (deep-cloned with fresh ids, so editing one instance never mutates the shared presets array) along with its surface/page colors and radius.
export function applyPreset(state: BoxShadowEditorState, preset: BoxShadowPresetMeta): BoxShadowEditorState {
  const layers = structuredClone(preset.layers).map((layer) => ({ ...layer, id: generateId() }));
  return { ...state, layers, surfaceColor: preset.surfaceColor, pageColor: preset.pageColor, borderRadius: preset.borderRadius, selectedLayerId: layers[0]?.id ?? null };
}

// Discards every layer/color/radius customization and returns to the tool's fresh starting state.
export function resetShadow(): BoxShadowEditorState {
  return createDefaultEditorState();
}
