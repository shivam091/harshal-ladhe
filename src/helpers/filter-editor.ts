import { clamp } from "@/utils/number";
import { FILTER_FUNCTION_ORDER } from "@/interfaces/filter";
import type { DropShadowState, FilterEditorState, FilterFunctionName, FilterFunctionState, FilterPresetMeta } from "@/interfaces/filter";
import { FUNCTION_META } from "@/utils/filter";

// Every function starts disabled at its own CSS-neutral default (see FUNCTION_META) — enabling one later never jumps the preview, it just starts contributing from its identity value.
function defaultFunctions(): Record<FilterFunctionName, FilterFunctionState> {
  return Object.fromEntries(FILTER_FUNCTION_ORDER.map((name) => [name, { enabled: false, value: FUNCTION_META[name].default }])) as Record<
    FilterFunctionName,
    FilterFunctionState
  >;
}

// A disabled drop-shadow's own starting values — a small, soft, dark shadow close to the box-shadow tool's own defaultLayer, so enabling it never looks jarring.
function defaultDropShadow(): DropShadowState {
  return { enabled: false, offsetX: 0, offsetY: 4, blur: 8, color: "#000000", opacity: 40 };
}

// The tool's starting state on a fresh visit — nothing enabled yet, target set to plain "filter", and the vivid reference gradient as the preview subject.
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

// Flips which CSS property the compiled stack applies to — also what PreviewPane reads to decide whether to show the translucent panel at all.
export function setTarget(state: FilterEditorState, target: FilterEditorState["target"]): FilterEditorState {
  return { ...state, target };
}

// Turns one lens slot on/off in the rack without touching its own dialed-in value, so re-enabling a function restores whatever it was last set to.
export function toggleFunction(state: FilterEditorState, name: FilterFunctionName, enabled: boolean): FilterEditorState {
  return { ...state, functions: { ...state.functions, [name]: { ...state.functions[name], enabled } } };
}

// Live slider update for one function — clamped to that function's own FUNCTION_META bounds so a permalink/autosave value from a future wider range can never compile an out-of-spec CSS argument.
export function setFunctionValue(state: FilterEditorState, name: FilterFunctionName, value: number): FilterEditorState {
  const meta = FUNCTION_META[name];
  return { ...state, functions: { ...state.functions, [name]: { ...state.functions[name], value: clamp(value, meta.min, meta.max) } } };
}

// Turns the drop-shadow slot on/off, independent of the 9 filter functions above.
export function toggleDropShadow(state: FilterEditorState, enabled: boolean): FilterEditorState {
  return { ...state, dropShadow: { ...state.dropShadow, enabled } };
}

// Patches whichever drop-shadow fields changed — the single mutation every one of its sliders/color field funnels through.
export function updateDropShadow(state: FilterEditorState, patch: Partial<Omit<DropShadowState, "enabled">>): FilterEditorState {
  return { ...state, dropShadow: { ...state.dropShadow, ...patch } };
}

// Swaps what the viewfinder is looking at — the vivid reference gradient or one of the site's own photos.
export function setPreviewSubject(state: FilterEditorState, subject: FilterEditorState["previewSubject"]): FilterEditorState {
  return { ...state, previewSubject: subject };
}

// Picks which photo renders when previewSubject is "photo".
export function setPreviewImageId(state: FilterEditorState, id: string): FilterEditorState {
  return { ...state, previewImageId: id };
}

// Sets the translucent panel's own tint — only visually relevant in backdropFilter mode.
export function setPanelColor(state: FilterEditorState, color: string): FilterEditorState {
  return { ...state, panelColor: color };
}

// Clamped 0-100 — the panel's own color-mix alpha has no meaning outside that range.
export function setPanelOpacity(state: FilterEditorState, opacity: number): FilterEditorState {
  return { ...state, panelOpacity: clamp(opacity, 0, 100) };
}

// Swaps in a curated preset's whole state at once — deep-cloned so editing afterward never mutates the shared presets array.
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

// Discards every customization and returns to the tool's fresh starting state.
export function resetFilter(): FilterEditorState {
  return createDefaultEditorState();
}
