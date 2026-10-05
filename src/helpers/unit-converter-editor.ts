import { clamp } from "@/utils/number";
import { fromPx } from "@/utils/unit-converter";
import { UNIT_ORDER } from "@/data/unit-converter-units";
import type { CssUnit, UnitContext, UnitConverterEditorState, UnitConverterPresetMeta, UnitConverterShareableState } from "@/components/UnitConverter/UnitConverter.types";

// Bounds for each context field — wide enough for a 4K screen or a tiny widget, narrow enough that a stray keystroke can't produce a 0 basis or a ruler millions of px long.
const CONTEXT_LIMITS: Record<keyof UnitContext, [number, number]> = {
  rootFontSize: [4, 64],
  parentFontSize: [4, 96],
  viewportWidth: [200, 3840],
  viewportHeight: [200, 2160],
  containerInlineSize: [40, 2400],
  parentWidth: [40, 3840]
};

// Keeps any typed length inside a range the tape can still draw sensibly.
const VALUE_LIMIT_PX = 10000;

// Past six decimals the extra digits are below anything a browser rounds to on screen.
const PRECISION_MAX = 6;

// The spacing scale most design systems start from — a 4px grid with the usual doubling steps.
const DEFAULT_BATCH = "4, 8, 12, 16, 24, 32, 48, 64";

// Reads the real window when there is one, so the vw/vh rows answer for the screen the person is actually looking at.
function defaultContext(): UnitContext {
  const hasWindow = typeof window !== "undefined";
  return {
    rootFontSize: 16,
    parentFontSize: 16,
    viewportWidth: hasWindow ? clamp(window.innerWidth, ...CONTEXT_LIMITS.viewportWidth) : 1440,
    viewportHeight: hasWindow ? clamp(window.innerHeight, ...CONTEXT_LIMITS.viewportHeight) : 900,
    containerInlineSize: 320,
    parentWidth: 960
  };
}

// Kept as a separate step (rather than spreading state) so a future UI-only field can't leak into the permalink unnoticed.
export function toShareableState(state: UnitConverterEditorState): UnitConverterShareableState {
  const { context, value, sourceUnit, precision, batchInput, batchUnit, batchPrefix } = state;
  return { context, value, sourceUnit, precision, batchInput, batchUnit, batchPrefix };
}

// A 24px length is a common spacing/heading value, so the first thing on screen is a conversion people actually look up.
export function createDefaultEditorState(): UnitConverterEditorState {
  return {
    context: defaultContext(),
    value: 24,
    sourceUnit: "px",
    precision: 4,
    batchInput: DEFAULT_BATCH,
    batchUnit: "rem",
    batchPrefix: "space"
  };
}

// Clamps every context field into CONTEXT_LIMITS — the one guard both live edits and decoded permalinks go through.
function boundContext(context: UnitContext): UnitContext {
  const bounded = { ...context };
  for (const key of Object.keys(CONTEXT_LIMITS) as Array<keyof UnitContext>) {
    const [min, max] = CONTEXT_LIMITS[key];
    const raw = Number(bounded[key]);
    bounded[key] = Number.isFinite(raw) ? clamp(raw, min, max) : min;
  }
  return bounded;
}

// Narrows a stored string to a known unit, so an old or hand-edited permalink can't select a unit with no conversion ratio.
function isCssUnit(unit: unknown): unit is CssUnit {
  return typeof unit === "string" && (UNIT_ORDER as string[]).includes(unit);
}

/*
  Rebuilds a full, valid editor state from whatever a permalink or old autosave held — missing fields
  take their defaults and out-of-range numbers are clamped, so a partially valid link still opens on
  the parts that survived instead of falling all the way back to the default.
*/
export function normaliseState(raw: Partial<UnitConverterShareableState> | null | undefined): UnitConverterEditorState {
  const base = createDefaultEditorState();
  if (!raw || typeof raw !== "object") return base;
  const value = Number(raw.value);
  return {
    context: boundContext({ ...base.context, ...(raw.context ?? {}) }),
    value: Number.isFinite(value) ? value : base.value,
    sourceUnit: isCssUnit(raw.sourceUnit) ? raw.sourceUnit : base.sourceUnit,
    precision: clamp(Math.round(Number(raw.precision ?? base.precision)) || 0, 0, PRECISION_MAX),
    batchInput: typeof raw.batchInput === "string" ? raw.batchInput : base.batchInput,
    batchUnit: isCssUnit(raw.batchUnit) ? raw.batchUnit : base.batchUnit,
    batchPrefix: typeof raw.batchPrefix === "string" ? raw.batchPrefix : base.batchPrefix
  };
}

// Whichever row was typed in becomes the source of truth, so a later context change keeps that number and moves the others.
export function setValue(state: UnitConverterEditorState, unit: CssUnit, value: number): UnitConverterEditorState {
  if (!Number.isFinite(value)) return state;
  const limit = fromPx(VALUE_LIMIT_PX, unit, state.context);
  return { ...state, sourceUnit: unit, value: clamp(value, -limit, limit) };
}

// The tape is dragged in px but the reading stays in the source unit, so dragging after typing "2rem" keeps the rem row in charge.
export function setLengthPx(state: UnitConverterEditorState, px: number): UnitConverterEditorState {
  const bounded = clamp(px, 0, VALUE_LIMIT_PX);
  return { ...state, value: fromPx(bounded, state.sourceUnit, state.context) };
}

// Merges a partial patch so each slider only has to know about its own field.
export function setContext(state: UnitConverterEditorState, patch: Partial<UnitContext>): UnitConverterEditorState {
  return { ...state, context: boundContext({ ...state.context, ...patch }) };
}

// Whole decimals only — toFixed-style rounding has no meaning for 2.5 places.
export function setPrecision(state: UnitConverterEditorState, decimals: number): UnitConverterEditorState {
  return { ...state, precision: clamp(Math.round(decimals), 0, PRECISION_MAX) };
}

// Stored as raw text rather than parsed numbers, so a half-typed "12," isn't rewritten under the cursor.
export function setBatchInput(state: UnitConverterEditorState, text: string): UnitConverterEditorState {
  return { ...state, batchInput: text };
}

// The batch target is independent of the single converter's source unit, so a rem scale can sit beside a vw lookup.
export function setBatchUnit(state: UnitConverterEditorState, unit: CssUnit): UnitConverterEditorState {
  return { ...state, batchUnit: unit };
}

// Left unslugified here so typing a space or capital doesn't fight the person; the export util cleans it at output time.
export function setBatchPrefix(state: UnitConverterEditorState, prefix: string): UnitConverterEditorState {
  return { ...state, batchPrefix: prefix };
}

// Presets only swap the surroundings — the length being measured stays put, so the effect of the new context is the thing that changes on screen.
export function applyPreset(state: UnitConverterEditorState, preset: UnitConverterPresetMeta): UnitConverterEditorState {
  return { ...state, context: boundContext(preset.context) };
}

// Re-reads the window too, so a reset after resizing picks up the new viewport.
export function resetConverter(): UnitConverterEditorState {
  return createDefaultEditorState();
}
