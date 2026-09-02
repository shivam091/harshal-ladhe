import { clamp } from "@/utils/number";
import { FILTER_FUNCTION_ORDER } from "@/interfaces/filter";
import type { DropShadowState, FilterEditorState, FilterFunctionName, FilterFunctionState, FilterPresetMeta } from "@/interfaces/filter";
import { FUNCTION_META } from "@/utils/filter";

function defaultFunctions(): Record<FilterFunctionName, FilterFunctionState> {
  return Object.fromEntries(FILTER_FUNCTION_ORDER.map((name) => [name, { enabled: false, value: FUNCTION_META[name].default }])) as Record<
    FilterFunctionName,
    FilterFunctionState
  >;
}

function defaultDropShadow(): DropShadowState {
  return { enabled: false, offsetX: 0, offsetY: 4, blur: 8, color: "#000000", opacity: 40 };
}

export function createDefaultEditorState(): FilterEditorState {
  return {
    target: "filter",
    functions: defaultFunctions(),
    dropShadow: defaultDropShadow(),
    previewSubject: "gradient",
    previewImageId: "hl-standing",
    panelColor: "#ffffff",
    panelOpacity: 25
  };
}

export function setTarget(state: FilterEditorState, target: FilterEditorState["target"]): FilterEditorState {
  return { ...state, target };
}

export function toggleFunction(state: FilterEditorState, name: FilterFunctionName, enabled: boolean): FilterEditorState {
  return { ...state, functions: { ...state.functions, [name]: { ...state.functions[name], enabled } } };
}

export function setFunctionValue(state: FilterEditorState, name: FilterFunctionName, value: number): FilterEditorState {
  const meta = FUNCTION_META[name];
  return { ...state, functions: { ...state.functions, [name]: { ...state.functions[name], value: clamp(value, meta.min, meta.max) } } };
}

export function toggleDropShadow(state: FilterEditorState, enabled: boolean): FilterEditorState {
  return { ...state, dropShadow: { ...state.dropShadow, enabled } };
}

export function updateDropShadow(state: FilterEditorState, patch: Partial<Omit<DropShadowState, "enabled">>): FilterEditorState {
  return { ...state, dropShadow: { ...state.dropShadow, ...patch } };
}

export function setPreviewSubject(state: FilterEditorState, subject: FilterEditorState["previewSubject"]): FilterEditorState {
  return { ...state, previewSubject: subject };
}
export function setPreviewImageId(state: FilterEditorState, id: string): FilterEditorState {
  return { ...state, previewImageId: id };
}
export function setPanelColor(state: FilterEditorState, color: string): FilterEditorState {
  return { ...state, panelColor: color };
}
export function setPanelOpacity(state: FilterEditorState, opacity: number): FilterEditorState {
  return { ...state, panelOpacity: clamp(opacity, 0, 100) };
}

export function applyPreset(state: FilterEditorState, preset: FilterPresetMeta): FilterEditorState {
  return {
    ...state,
    target: preset.target,
    functions: structuredClone(preset.functions),
    dropShadow: structuredClone(preset.dropShadow),
    previewSubject: preset.previewSubject,
    previewImageId: preset.previewImageId,
    panelColor: preset.panelColor,
    panelOpacity: preset.panelOpacity
  };
}

export function resetFilter(): FilterEditorState {
  return createDefaultEditorState();
}
