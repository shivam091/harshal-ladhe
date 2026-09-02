import { clamp, toFixed } from "@/utils/number";
import type { ColorMixEditorState, ColorMixHueMethod, ColorMixPresetMeta, ColorMixShareableState, ColorMixSpace } from "@/interfaces/color-mix";

// Only these four are polar (interpolate around a hue angle) — srgb/lab/oklab are rectangular and have no hue to steer, the same distinction POLAR_COLOR_SPACES draws in utils/gradient.ts for the 2 spaces that tool exposes.
export const POLAR_SPACES: readonly ColorMixSpace[] = ["hsl", "hwb", "lch", "oklch"];

// Every color-mix()-capable space this tool supports, in the order the space picker renders them — rectangular first, then polar, roughly cheapest/most-familiar to most-perceptually-uniform.
export const SPACES: readonly ColorMixSpace[] = ["srgb", "lab", "oklab", "hsl", "hwb", "lch", "oklch"];

function coord(value: number): number {
  return toFixed(value, 1);
}

/*
  Builds the `<color-interpolation-method>` clause both color-mix() and linear-gradient() accept
  ("in oklch shorter hue"). No trailing space, unlike utils/gradient.ts's own interpolationPrefix —
  both of this tool's callers below append a comma or the "to right" keyword right after, not a
  numeric value, so a trailing space here would just leave a stray space before that punctuation.
*/
function interpolationPrefix(space: ColorMixSpace, hueMethod: ColorMixHueMethod): string {
  return POLAR_SPACES.includes(space) ? `in ${space} ${hueMethod} hue` : `in ${space}`;
}

// Single source of truth every preview swatch and export format compiles from — "what does this state's mix actually produce."
export function buildColorMixValue(state: ColorMixEditorState): string {
  return `color-mix(${interpolationPrefix(state.space, state.hueMethod)}, ${state.color1} ${coord(state.ratio)}%, ${state.color2})`;
}

/*
  A left-to-right gradient across the full 0-100% range in one space — lets the browser render the
  true, continuous interpolation instead of this tool sampling discrete color-mix() steps itself,
  which would just be an approximation of the same curve the browser already computes natively.
*/
export function buildRampGradient(color1: string, color2: string, space: ColorMixSpace, hueMethod: ColorMixHueMethod): string {
  return `linear-gradient(${interpolationPrefix(space, hueMethod)} to right, ${color1}, ${color2})`;
}

export function createDefaultEditorState(): ColorMixEditorState {
  return { color1: "#6366f1", color2: "#ec4899", space: "oklch", hueMethod: "shorter", ratio: 50 };
}

// Every field here is shareable — mirrors ColorPaletteEditorState/ColorPaletteShareableState, which is why this is an identity pass rather than an Omit like GradientEditorState -> GradientShareableState.
export function toShareableState(state: ColorMixEditorState): ColorMixShareableState {
  return state;
}

export function setColor1(state: ColorMixEditorState, hex: string): ColorMixEditorState {
  return { ...state, color1: hex };
}

export function setColor2(state: ColorMixEditorState, hex: string): ColorMixEditorState {
  return { ...state, color2: hex };
}

export function swapColors(state: ColorMixEditorState): ColorMixEditorState {
  return { ...state, color1: state.color2, color2: state.color1 };
}

export function setSpace(state: ColorMixEditorState, space: ColorMixSpace): ColorMixEditorState {
  return { ...state, space };
}

export function setHueMethod(state: ColorMixEditorState, hueMethod: ColorMixHueMethod): ColorMixEditorState {
  return { ...state, hueMethod };
}

export function setRatio(state: ColorMixEditorState, ratio: number): ColorMixEditorState {
  return { ...state, ratio: clamp(ratio, 0, 100) };
}

/*
  Curated pairs shown in the preset gallery. "Hue clash" and "Warm -> cool" specifically demonstrate
  how much a color space changes the SAME two colors' midpoint — srgb/hsl produce a muddy, desaturated
  middle for complementary-ish hues, while lch/oklch stay vivid because they travel around the hue
  wheel instead of blending channels directly.
*/
export const PRESETS: ColorMixPresetMeta[] = [
  { slug: "brand-tint", name: "Tint toward white", color1: "#6366f1", color2: "#ffffff", space: "oklch", ratio: 80 },
  { slug: "brand-shade", name: "Shade toward black", color1: "#6366f1", color2: "#000000", space: "oklch", ratio: 80 },
  { slug: "hue-clash", name: "Hue clash (srgb)", color1: "#ef4444", color2: "#22c55e", space: "srgb", ratio: 50 },
  { slug: "warm-cool", name: "Warm → cool (lch)", color1: "#f97316", color2: "#3b82f6", space: "lch", ratio: 50 }
];

/*
  Overrides space and ratio, not just the two colors — unlike GradientGenerator's applyPreset, which
  deliberately leaves colorSpace untouched so a preset never overrides the interpolation mode the user
  is exploring. Here the space IS the point of several presets (see PRESETS above), so it travels with it.
*/
export function applyPreset(state: ColorMixEditorState, preset: ColorMixPresetMeta): ColorMixEditorState {
  return { ...state, color1: preset.color1, color2: preset.color2, space: preset.space, ratio: preset.ratio };
}

export function resetMix(): ColorMixEditorState {
  return createDefaultEditorState();
}
