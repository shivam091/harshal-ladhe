import { generateId } from "@/utils/random";
import type { BoxShadowEditorState, BoxShadowPresetMeta, BoxShadowShareableState, ShadowLayer } from "@/interfaces/box-shadow";

function defaultLayer(): ShadowLayer {
  return { id: generateId(), offsetX: 0, offsetY: 4, blur: 12, spread: 0, color: "#000000", opacity: 15, inset: false };
}

// Picks the fields that round-trip through both localStorage autosave and the permalink — `selectedLayerId` is deliberately excluded (pure UI state, and irrelevant to what a shared link should restore).
export function toShareableState(state: BoxShadowEditorState): BoxShadowShareableState {
  const { layers, surfaceColor, pageColor, borderRadius } = state;
  return { layers, surfaceColor, pageColor, borderRadius };
}

export function createDefaultEditorState(): BoxShadowEditorState {
  const layer = defaultLayer();
  return { layers: [layer], selectedLayerId: layer.id, surfaceColor: "#ffffff", pageColor: "#f1f5f9", borderRadius: 16 };
}

// Appends a new layer at the FRONT of the array — CSS renders the first-listed shadow closest to the viewer, so a freshly added layer should sit on top of whatever's already there rather than silently hiding behind it.
export function addLayer(state: BoxShadowEditorState): BoxShadowEditorState {
  const layer = defaultLayer();
  return { ...state, layers: [layer, ...state.layers], selectedLayerId: layer.id };
}

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
  layer is allowed and just means "no shadow" rather than being blocked.
*/
export function removeLayer(state: BoxShadowEditorState, id: string): BoxShadowEditorState {
  const layers = state.layers.filter((layer) => layer.id !== id);
  const selectedLayerId = state.selectedLayerId === id ? (layers[0]?.id ?? null) : state.selectedLayerId;
  return { ...state, layers, selectedLayerId };
}

export function selectLayer(state: BoxShadowEditorState, id: string | null): BoxShadowEditorState {
  return { ...state, selectedLayerId: id };
}

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
export function moveLayerDown(state: BoxShadowEditorState, id: string): BoxShadowEditorState {
  return moveLayer(state, id, 1);
}

export function updateLayer(state: BoxShadowEditorState, id: string, patch: Partial<Omit<ShadowLayer, "id">>): BoxShadowEditorState {
  return { ...state, layers: state.layers.map((layer) => (layer.id === id ? { ...layer, ...patch } : layer)) };
}

export function toggleInset(state: BoxShadowEditorState, id: string, inset: boolean): BoxShadowEditorState {
  return updateLayer(state, id, { inset });
}

export function setSurfaceColor(state: BoxShadowEditorState, color: string): BoxShadowEditorState {
  return { ...state, surfaceColor: color };
}
export function setPageColor(state: BoxShadowEditorState, color: string): BoxShadowEditorState {
  return { ...state, pageColor: color };
}
export function setBorderRadius(state: BoxShadowEditorState, radius: number): BoxShadowEditorState {
  return { ...state, borderRadius: Math.max(0, radius) };
}

export function applyPreset(state: BoxShadowEditorState, preset: BoxShadowPresetMeta): BoxShadowEditorState {
  const layers = structuredClone(preset.layers).map((layer) => ({ ...layer, id: generateId() }));
  return { ...state, layers, surfaceColor: preset.surfaceColor, pageColor: preset.pageColor, borderRadius: preset.borderRadius, selectedLayerId: layers[0]?.id ?? null };
}

export function resetShadow(): BoxShadowEditorState {
  return createDefaultEditorState();
}
