import { svgOptimiserPresets } from "@/data/svg-optimiser-presets";
import { PASS_META } from "@/components/SvgOptimiser/SvgOptimiser.utils";
import type { PassId, PassToggles, SvgOptimiserEditorState, SvgOptimiserPresetMeta, SvgOptimiserShareableState } from "@/components/SvgOptimiser/SvgOptimiser.types";

// SVGO's own default — three decimal places is invisible at any sensible zoom yet trims most editor output noticeably.
export const DEFAULT_PRECISION = 3;

// Whole units — the coarsest rounding that still makes sense for pixel-grid icons.
export const MIN_PRECISION = 0;

// Beyond five places nothing visible changes, so the slider stops there.
export const MAX_PRECISION = 5;

// Each pass's default switch, read from the catalogue so the defaults can't drift from the stamps.
export const DEFAULT_PASSES: PassToggles = Object.fromEntries(PASS_META.map((meta) => [meta.id, meta.defaultOn])) as PassToggles;

// Clamps any precision (from a hand-edited link, say) into the slider's range.
function clampPrecision(value: unknown): number {
  const number = typeof value === "number" && Number.isFinite(value) ? Math.round(value) : DEFAULT_PRECISION;
  return Math.min(MAX_PRECISION, Math.max(MIN_PRECISION, number));
}

// The whole state is shareable — kept as a function so call sites read the same as every other goodie's.
export function toShareableState(state: SvgOptimiserEditorState): SvgOptimiserShareableState {
  return state;
}

// Opens on the first preset, since its Inkscape cruft lights up nearly every stamp on first load.
export function createDefaultEditorState(): SvgOptimiserEditorState {
  const preset = svgOptimiserPresets[0];
  return { source: preset.source, fileName: preset.fileName, passes: { ...DEFAULT_PASSES }, precision: DEFAULT_PRECISION };
}

/*
  Merges a decoded permalink or autosave over the defaults, keeping only known pass ids with
  boolean values — so a link saved before a pass existed still loads, and a tampered one can't
  smuggle odd values into state.
*/
export function hydrateState(partial: Partial<SvgOptimiserEditorState> | null | undefined): SvgOptimiserEditorState {
  const defaults = createDefaultEditorState();
  if (!partial || typeof partial !== "object") return defaults;
  const passes: PassToggles = { ...DEFAULT_PASSES };
  if (partial.passes && typeof partial.passes === "object") {
    for (const meta of PASS_META) {
      const value = (partial.passes as Partial<Record<PassId, unknown>>)[meta.id];
      if (typeof value === "boolean") passes[meta.id] = value;
    }
  }
  return {
    source: typeof partial.source === "string" ? partial.source : defaults.source,
    fileName: typeof partial.fileName === "string" ? partial.fileName : defaults.fileName,
    passes,
    precision: clampPrecision(partial.precision)
  };
}

// Plain JSON → base64 → URL-safe characters, matching every other goodie's permalink format.
export function encodeShareableState(state: SvgOptimiserShareableState): string {
  const json = JSON.stringify(state);
  const base64 = btoa(unescape(encodeURIComponent(json)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Reverses encodeShareableState; null (rather than a throw) on a malformed link so the page falls back to the default parcel.
export function decodeShareableState(encoded: string): SvgOptimiserShareableState | null {
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(base64)));
    return hydrateState(JSON.parse(json) as Partial<SvgOptimiserShareableState>);
  } catch {
    return null;
  }
}

// Typing over the source keeps the file name — it's still the same parcel being repacked.
export function setSource(state: SvgOptimiserEditorState, source: string): SvgOptimiserEditorState {
  return { ...state, source };
}

// A dropped or uploaded file is a new parcel, so its name becomes the download's name.
export function loadFile(state: SvgOptimiserEditorState, fileName: string, source: string): SvgOptimiserEditorState {
  return { ...state, source, fileName };
}

// One pass on or off.
export function togglePass(state: SvgOptimiserEditorState, id: PassId, enabled: boolean): SvgOptimiserEditorState {
  return { ...state, passes: { ...state.passes, [id]: enabled } };
}

// Every pass on or off at once — handy for seeing what a single pass does on its own.
export function setAllPasses(state: SvgOptimiserEditorState, enabled: boolean): SvgOptimiserEditorState {
  return { ...state, passes: Object.fromEntries(PASS_META.map((meta) => [meta.id, enabled])) as PassToggles };
}

// Precision from the slider, clamped so a stray value can't escape the range.
export function setPrecision(state: SvgOptimiserEditorState, precision: number): SvgOptimiserEditorState {
  return { ...state, precision: clampPrecision(precision) };
}

// Swaps the parcel but keeps the current passes, so comparing presets under the same settings is one click each.
export function applyPreset(state: SvgOptimiserEditorState, preset: SvgOptimiserPresetMeta): SvgOptimiserEditorState {
  return loadFile(state, preset.fileName, preset.source);
}

// Back to the default parcel and default passes in one undoable step.
export function resetOptimiser(): SvgOptimiserEditorState {
  return createDefaultEditorState();
}
