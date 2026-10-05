import { svgToReactPresets } from "@/data/svg-to-react-presets";
import { toComponentName } from "@/utils/svg-to-react";
import type { SvgToReactEditorState, SvgToReactOptions, SvgToReactPresetMeta, SvgToReactShareableState } from "@/components/SvgToReactConverter/SvgToReactConverter.types";

// The whole state is shareable — kept as a function anyway so the call sites read the same as every other goodie's.
export function toShareableState(state: SvgToReactEditorState): SvgToReactShareableState {
  return state;
}

// SVGR-like defaults: every cleanup on, currentColor only for one-colour icons, and the props wiring a design-system icon usually wants.
export const DEFAULT_OPTIONS: SvgToReactOptions = {
  camelCaseProps: true,
  stripCruft: true,
  inlineStyles: true,
  removeDimensions: true,
  currentColor: "single",
  spreadProps: true,
  titleProp: true,
  sizeProp: true,
  forwardRef: false,
  memo: false,
  typescript: true,
  exportStyle: "default",
  reactNative: false
};

// Opens on the Inkscape preset, since its cruft shows off the most transforms in the log on first load.
export function createDefaultEditorState(): SvgToReactEditorState {
  const preset = svgToReactPresets[0];
  return { source: preset.source, fileName: preset.fileName, componentName: toComponentName(preset.fileName), options: { ...DEFAULT_OPTIONS } };
}

// Merges a decoded permalink or autosave over the defaults, so a link saved before an option existed still loads with that option at its default.
export function hydrateState(partial: Partial<SvgToReactEditorState>): SvgToReactEditorState {
  const defaults = createDefaultEditorState();
  return {
    source: typeof partial.source === "string" ? partial.source : defaults.source,
    fileName: typeof partial.fileName === "string" ? partial.fileName : defaults.fileName,
    componentName: typeof partial.componentName === "string" ? partial.componentName : defaults.componentName,
    options: { ...DEFAULT_OPTIONS, ...(partial.options ?? {}) }
  };
}

// Typing over the source keeps the existing name — the user is editing the same artwork, not starting a new file.
export function setSource(state: SvgToReactEditorState, source: string): SvgToReactEditorState {
  return { ...state, source };
}

// A dropped or uploaded file is new artwork, so its file name re-derives the component name.
export function loadFile(state: SvgToReactEditorState, fileName: string, source: string): SvgToReactEditorState {
  return { ...state, source, fileName, componentName: toComponentName(fileName) };
}

// Stored exactly as typed (the transform reports any adjustment it makes), so a half-typed name isn't rewritten under the cursor.
export function setComponentName(state: SvgToReactEditorState, componentName: string): SvgToReactEditorState {
  return { ...state, componentName };
}

// One generic setter for every toggle — the options are all flat scalars, so a per-option function would only repeat this line.
export function setOption<K extends keyof SvgToReactOptions>(state: SvgToReactEditorState, key: K, value: SvgToReactOptions[K]): SvgToReactEditorState {
  return { ...state, options: { ...state.options, [key]: value } };
}

// Swaps the artwork but keeps the current options, so comparing presets under the same settings is one click each.
export function applyPreset(state: SvgToReactEditorState, preset: SvgToReactPresetMeta): SvgToReactEditorState {
  return loadFile(state, preset.fileName, preset.source);
}

// Back to the default artwork and default options in one undoable step.
export function resetConverter(): SvgToReactEditorState {
  return createDefaultEditorState();
}
