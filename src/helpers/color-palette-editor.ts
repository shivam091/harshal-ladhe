import { isValidHex } from "@/utils/oklch";
import type { ColorPaletteEditorState, ColorPalettePresetMeta, ColorPaletteShareableState, RampMode } from "@/interfaces/color-palette";

// Every field in this tool's state is already shareable — see ColorPaletteShareableState's own comment — so this is an identity pass-through kept only so the root component's persistence code reads the same as every other goodie's own toShareableState call.
export function toShareableState(state: ColorPaletteEditorState): ColorPaletteShareableState {
  return state;
}

// The palette a fresh visit (and Reset) starts from — an indigo seed against a dark-on-light contrast pair, generated with the perceptually-uniform OKLCH ramp mode.
export function createDefaultEditorState(): ColorPaletteEditorState {
  return { seedColor: "#6366f1", foreground: "#0f172a", background: "#f8fafc", rampMode: "oklch" };
}

// Silently ignores a malformed hex rather than storing it — every caller (a color <input> and a validated text field) only ever passes a value already known to be a full 6-digit hex, so this is a defensive floor rather than a path any real interaction hits.
export function setSeedColor(state: ColorPaletteEditorState, hex: string): ColorPaletteEditorState {
  return isValidHex(hex) ? { ...state, seedColor: hex } : state;
}

export function setForeground(state: ColorPaletteEditorState, hex: string): ColorPaletteEditorState {
  return isValidHex(hex) ? { ...state, foreground: hex } : state;
}

export function setBackground(state: ColorPaletteEditorState, hex: string): ColorPaletteEditorState {
  return isValidHex(hex) ? { ...state, background: hex } : state;
}

// Trades the foreground and background hexes — the one-click way to re-check a pair "the other way around" without retyping either value.
export function swapContrastPair(state: ColorPaletteEditorState): ColorPaletteEditorState {
  return { ...state, foreground: state.background, background: state.foreground };
}

export function setRampMode(state: ColorPaletteEditorState, mode: RampMode): ColorPaletteEditorState {
  return { ...state, rampMode: mode };
}

// A ramp swatch's own "try this as the background" affordance.
export function useAsBackground(state: ColorPaletteEditorState, hex: string): ColorPaletteEditorState {
  return { ...state, background: hex };
}

// Applies a whole curated combination at once — seed, contrast pair, and ramp mode.
export function applyPreset(state: ColorPaletteEditorState, preset: ColorPalettePresetMeta): ColorPaletteEditorState {
  return { ...state, seedColor: preset.seedColor, foreground: preset.foreground, background: preset.background, rampMode: preset.rampMode };
}

export function resetPalette(): ColorPaletteEditorState {
  return createDefaultEditorState();
}
