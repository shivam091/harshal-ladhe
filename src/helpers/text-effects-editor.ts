import { clamp } from "@/utils/number";
import { generateId } from "@/utils/random";
import type { GradientFillConfig, GradientFillStop, GradientFillType, TextEffectsEditorState, TextEffectsPresetMeta, TextEffectsShareableState, TextShadowLayer } from "@/interfaces/text-effects";

function defaultShadowLayer(): TextShadowLayer {
  return { id: generateId(), offsetX: 2, offsetY: 2, blur: 4, color: "#000000", opacity: 40 };
}

function defaultGradientFill(): GradientFillConfig {
  return {
    enabled: false,
    type: "linear",
    angle: 90,
    stops: [
      { id: generateId(), color: "#6366f1", position: 0 },
      { id: generateId(), color: "#ec4899", position: 100 }
    ]
  };
}

export function toShareableState(state: TextEffectsEditorState): TextEffectsShareableState {
  const { text, fontSize, fontWeight, textColor, shadowLayers, gradientFill, pageColor } = state;
  return { text, fontSize, fontWeight, textColor, shadowLayers, gradientFill, pageColor };
}

export function createDefaultEditorState(): TextEffectsEditorState {
  const layer = defaultShadowLayer();
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

export function setText(state: TextEffectsEditorState, text: string): TextEffectsEditorState {
  return { ...state, text };
}
export function setFontSize(state: TextEffectsEditorState, size: number): TextEffectsEditorState {
  return { ...state, fontSize: clamp(size, 12, 160) };
}
export function setFontWeight(state: TextEffectsEditorState, weight: number): TextEffectsEditorState {
  return { ...state, fontWeight: clamp(weight, 100, 900) };
}
export function setTextColor(state: TextEffectsEditorState, color: string): TextEffectsEditorState {
  return { ...state, textColor: color };
}

// Appends a new layer at the FRONT of the array — CSS renders the first-listed shadow closest to the viewer, same reasoning box-shadow's own addLayer already applies to its list.
export function addShadowLayer(state: TextEffectsEditorState): TextEffectsEditorState {
  const layer = defaultShadowLayer();
  return { ...state, shadowLayers: [layer, ...state.shadowLayers], selectedLayerId: layer.id };
}

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

export function selectLayer(state: TextEffectsEditorState, id: string | null): TextEffectsEditorState {
  return { ...state, selectedLayerId: id };
}

export function updateShadowLayer(state: TextEffectsEditorState, id: string, patch: Partial<Omit<TextShadowLayer, "id">>): TextEffectsEditorState {
  return { ...state, shadowLayers: state.shadowLayers.map((layer) => (layer.id === id ? { ...layer, ...patch } : layer)) };
}

export function toggleGradientFill(state: TextEffectsEditorState, enabled: boolean): TextEffectsEditorState {
  return { ...state, gradientFill: { ...state.gradientFill, enabled } };
}
export function setGradientType(state: TextEffectsEditorState, type: GradientFillType): TextEffectsEditorState {
  return { ...state, gradientFill: { ...state.gradientFill, type } };
}
export function setGradientAngle(state: TextEffectsEditorState, angle: number): TextEffectsEditorState {
  return { ...state, gradientFill: { ...state.gradientFill, angle: ((angle % 360) + 360) % 360 } };
}

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

export function updateGradientStop(state: TextEffectsEditorState, id: string, patch: Partial<Omit<GradientFillStop, "id">>): TextEffectsEditorState {
  const stops = sortStops(state.gradientFill.stops.map((stop) => (stop.id === id ? { ...stop, ...patch, position: patch.position !== undefined ? clamp(patch.position, 0, 100) : stop.position } : stop)));
  return { ...state, gradientFill: { ...state.gradientFill, stops } };
}

export function setPageColor(state: TextEffectsEditorState, color: string): TextEffectsEditorState {
  return { ...state, pageColor: color };
}

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

export function resetEffects(state: TextEffectsEditorState): TextEffectsEditorState {
  const defaults = createDefaultEditorState();
  return { ...defaults, text: state.text };
}
