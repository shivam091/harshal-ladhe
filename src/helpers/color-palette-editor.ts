import { isValidHex } from "@/utils/oklch";
import type { ColorPaletteEditorState, ColorPalettePresetMeta, ColorPaletteShareableState, RampMode } from "@/interfaces/color-palette";

export function toShareableState(state: ColorPaletteEditorState): ColorPaletteShareableState {
  return state;
}

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

export function swapContrastPair(state: ColorPaletteEditorState): ColorPaletteEditorState {
  return { ...state, foreground: state.background, background: state.foreground };
}

export function setRampMode(state: ColorPaletteEditorState, mode: RampMode): ColorPaletteEditorState {
  return { ...state, rampMode: mode };
}

export function useAsBackground(state: ColorPaletteEditorState, hex: string): ColorPaletteEditorState {
  return { ...state, background: hex };
}

export function applyPreset(state: ColorPaletteEditorState, preset: ColorPalettePresetMeta): ColorPaletteEditorState {
  return { ...state, seedColor: preset.seedColor, foreground: preset.foreground, background: preset.background, rampMode: preset.rampMode };
}

export function resetPalette(): ColorPaletteEditorState {
  return createDefaultEditorState();
}
