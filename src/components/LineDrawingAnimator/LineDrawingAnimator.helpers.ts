import { lineDrawingPresets } from "@/data/line-drawing-animator-presets";
import { EASINGS, MAX_SHARE_STATE_LENGTH, clamp, encodeShareableState } from "@/components/LineDrawingAnimator/LineDrawingAnimator.utils";
import type {
  LineDrawingEditorState,
  LineDrawingPreset,
  LineDrawingSettings,
  LineDrawingShareableState,
  StrokeOrderMode,
  StrokeOverride
} from "@/components/LineDrawingAnimator/LineDrawingAnimator.types";

// The baseline every preset's partial settings are laid over, so switching presets never inherits a stray loop or colour from the last one.
export const DEFAULT_SETTINGS: LineDrawingSettings = {
  order: "document",
  seed: 7,
  durationMode: "fixed",
  duration: 800,
  speed: 400,
  stagger: 100,
  overlap: 0,
  easing: "ease-in-out",
  overrideColour: false,
  strokeColour: "#1f3a8a",
  overrideWidth: false,
  strokeWidth: 2,
  outlineFills: false,
  fillFade: "off",
  fillDuration: 500,
  loop: "once",
  hold: 1000,
  normalise: true
};

// Valid values for the enum-like settings, so a tampered or outdated permalink can't smuggle in an order the switch statements don't handle.
const ORDER_MODES: StrokeOrderMode[] = ["document", "reverse", "left-right", "top-bottom", "longest", "random", "custom"];

// Settings laid over the defaults with every field checked and clamped — the one gate both permalinks and autosaves pass through.
function sanitiseSettings(partial: Partial<LineDrawingSettings> | undefined): LineDrawingSettings {
  const merged = { ...DEFAULT_SETTINGS, ...(partial ?? {}) };
  const number = (value: unknown, fallback: number, min: number, max: number) => (typeof value === "number" && Number.isFinite(value) ? clamp(value, min, max) : fallback);
  const colour = (value: unknown, fallback: string) => (typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value) ? value : fallback);
  return {
    order: ORDER_MODES.includes(merged.order) ? merged.order : "document",
    seed: Math.round(number(merged.seed, DEFAULT_SETTINGS.seed, 0, 999999)),
    durationMode: merged.durationMode === "proportional" ? "proportional" : "fixed",
    duration: number(merged.duration, DEFAULT_SETTINGS.duration, 50, 10000),
    speed: number(merged.speed, DEFAULT_SETTINGS.speed, 20, 5000),
    stagger: number(merged.stagger, DEFAULT_SETTINGS.stagger, 0, 5000),
    overlap: number(merged.overlap, DEFAULT_SETTINGS.overlap, 0, 100),
    easing: EASINGS.some((easing) => easing.key === merged.easing) ? merged.easing : DEFAULT_SETTINGS.easing,
    overrideColour: Boolean(merged.overrideColour),
    strokeColour: colour(merged.strokeColour, DEFAULT_SETTINGS.strokeColour),
    overrideWidth: Boolean(merged.overrideWidth),
    strokeWidth: number(merged.strokeWidth, DEFAULT_SETTINGS.strokeWidth, 0.25, 40),
    outlineFills: Boolean(merged.outlineFills),
    fillFade: merged.fillFade === "each" || merged.fillFade === "end" ? merged.fillFade : "off",
    fillDuration: number(merged.fillDuration, DEFAULT_SETTINGS.fillDuration, 50, 10000),
    loop: merged.loop === "loop" || merged.loop === "yoyo" ? merged.loop : "once",
    hold: number(merged.hold, DEFAULT_SETTINGS.hold, 0, 10000),
    normalise: merged.normalise !== false
  };
}

// Drops empty or malformed per-stroke tweaks, keeping the permalink as short as the hand-tweaks allow.
function sanitiseOverrides(raw: Record<string, StrokeOverride> | undefined): Record<string, StrokeOverride> {
  const clean: Record<string, StrokeOverride> = {};
  for (const [key, override] of Object.entries(raw ?? {})) {
    if (!/^\d+$/.test(key) || !override || typeof override !== "object") continue;
    const next: StrokeOverride = {};
    if (override.excluded) next.excluded = true;
    if (typeof override.duration === "number" && Number.isFinite(override.duration)) next.duration = clamp(override.duration, 1, 20000);
    if (typeof override.colour === "string" && /^#[0-9a-f]{6}$/i.test(override.colour)) next.colour = override.colour;
    if (typeof override.width === "number" && Number.isFinite(override.width)) next.width = clamp(override.width, 0.25, 40);
    if (Object.keys(next).length > 0) clean[key] = next;
  }
  return clean;
}

// The state a preset produces — its own source, its suggested settings over the defaults, and a clean ledger.
function stateFromPreset(preset: LineDrawingPreset): LineDrawingEditorState {
  return { source: preset.source, settings: sanitiseSettings(preset.settings), overrides: {}, customOrder: null };
}

// The tool's opening drawing: the first preset, the signature, since it shows off the effect best.
export function createDefaultEditorState(): LineDrawingEditorState {
  return stateFromPreset(lineDrawingPresets[0]);
}

// Rebuilds a full editor state from a permalink or autosave, defaulting the source when a too-big drawing was shared as settings alone.
export function hydrateState(shared: Partial<LineDrawingShareableState>): LineDrawingEditorState {
  return {
    source: typeof shared.source === "string" ? shared.source : lineDrawingPresets[0].source,
    settings: sanitiseSettings(shared.settings),
    overrides: sanitiseOverrides(shared.overrides),
    customOrder: Array.isArray(shared.customOrder) ? shared.customOrder.filter((index) => Number.isInteger(index) && index > 0) : null
  };
}

// The whole editor state is shareable; aliased through this function so a future UI-only field has one obvious place to be excluded.
export function toShareableState(state: LineDrawingEditorState): LineDrawingShareableState {
  return { source: state.source, settings: state.settings, overrides: state.overrides, customOrder: state.customOrder };
}

/*
  The `?state=` value for a permalink, plus whether the drawing had to be left out. Past
  MAX_SHARE_STATE_LENGTH the source is dropped and only the settings travel — the recipient sees
  them applied to the default drawing, and the share panel says to send the SVG export instead.
*/
export function toPermalinkState(state: LineDrawingEditorState): { encoded: string; truncated: boolean } {
  const full = encodeShareableState(toShareableState(state));
  if (full.length <= MAX_SHARE_STATE_LENGTH) return { encoded: full, truncated: false };
  return { encoded: encodeShareableState({ settings: state.settings, overrides: {}, customOrder: null }), truncated: true };
}

// A new drawing means new stroke indices, so per-stroke tweaks and the hand-arranged order no longer refer to anything.
export function setSource(state: LineDrawingEditorState, source: string): LineDrawingEditorState {
  if (source === state.source) return state;
  return { ...state, source, overrides: {}, customOrder: null, settings: state.settings.order === "custom" ? { ...state.settings, order: "document" } : state.settings };
}

// One setting changed — reselecting "custom" without a hand-arranged order simply behaves like document order.
export function setSetting<K extends keyof LineDrawingSettings>(state: LineDrawingEditorState, key: K, value: LineDrawingSettings[K]): LineDrawingEditorState {
  return { ...state, settings: { ...state.settings, [key]: value } };
}

// Merges a ledger tweak into one stroke, removing keys set to undefined so "reset this stroke" really empties it.
export function setOverride(state: LineDrawingEditorState, index: number, patch: StrokeOverride): LineDrawingEditorState {
  const key = String(index);
  const merged: StrokeOverride = { ...(state.overrides[key] ?? {}), ...patch };
  for (const field of Object.keys(merged) as Array<keyof StrokeOverride>) {
    if (merged[field] === undefined || merged[field] === false) delete merged[field];
  }
  const overrides = { ...state.overrides };
  if (Object.keys(merged).length === 0) delete overrides[key];
  else overrides[key] = merged;
  return { ...state, overrides };
}

// Moves one stroke within the resolved sequence and pins that sequence as the custom order.
export function moveStroke(state: LineDrawingEditorState, order: number[], from: number, to: number): LineDrawingEditorState {
  if (from === to || from < 0 || to < 0 || from >= order.length || to >= order.length) return state;
  const next = [...order];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return { ...state, customOrder: next, settings: { ...state.settings, order: "custom" } };
}

// Clears the ledger back to the artwork's own strokes and order mode.
export function clearOverrides(state: LineDrawingEditorState): LineDrawingEditorState {
  return { ...state, overrides: {}, customOrder: null, settings: state.settings.order === "custom" ? { ...state.settings, order: "document" } : state.settings };
}

// Loading a preset replaces everything, since its settings are tuned to its own drawing.
export function applyPreset(preset: LineDrawingPreset): LineDrawingEditorState {
  return stateFromPreset(preset);
}

// Back to the opening signature with default pacing.
export function resetAnimator(): LineDrawingEditorState {
  return createDefaultEditorState();
}
