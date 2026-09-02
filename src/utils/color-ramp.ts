import { hexToOklch, hexToRgb, oklchToHex, rgbToHex } from "@/utils/oklch";
import type { RgbColor } from "@/utils/oklch";
import type { RampMode, RampStop } from "@/interfaces/color-palette";

// The 11-step naming convention Tailwind/Radix-style scales use, lightest to darkest.
const STEP_NAMES = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];

/*
  A fixed lightness/chroma schedule, independent of the seed's own lightness — the same choice
  Tailwind v4 and Radix Colors make when generating a scale from one seed hue: a seed that happens
  to be very light or very dark still produces a full, usable 50-950 range, rather than skewing the
  whole ramp toward one end. Chroma tapers toward both extremes because very light/dark OKLCH colors
  can hold little chroma before clipping out of the sRGB gamut anyway.
*/
const LIGHTNESS_SCALE = [0.98, 0.95, 0.9, 0.83, 0.75, 0.66, 0.56, 0.46, 0.36, 0.27, 0.19];
const CHROMA_SCALE = [0.35, 0.55, 0.75, 0.9, 1.0, 1.0, 0.95, 0.85, 0.72, 0.55, 0.4];

// Perceptually-uniform ramp: hue held constant at the seed's own OKLCH hue, lightness and chroma follow the fixed schedule above, gamut-mapped back to sRGB per step.
export function oklchRamp(seedHex: string): RampStop[] {
  const { C, H } = hexToOklch(seedHex);
  return STEP_NAMES.map((name, i) => ({ name, hex: oklchToHex(LIGHTNESS_SCALE[i], C * CHROMA_SCALE[i], H) }));
}

function lerpRgb(a: RgbColor, b: RgbColor, t: number): RgbColor {
  return { r: a.r + (b.r - a.r) * t, g: a.g + (b.g - a.g) * t, b: a.b + (b.b - a.b) * t };
}

const WHITE: RgbColor = { r: 255, g: 255, b: 255 };
const BLACK: RgbColor = { r: 0, g: 0, b: 0 };
// Never fully reach pure white/black — a "950" step that's actually pure black would lose the seed's hue entirely, which defeats the point of a named color ramp.
const MAX_TINT_MIX = 0.94;
const MAX_SHADE_MIX = 0.88;

/*
  The naive approach: linearly interpolate the seed's own sRGB channels toward white (steps 50-400)
  or black (steps 600-950), step 500 being the seed itself. Kept as a selectable mode specifically
  to contrast against oklchRamp above — mixing in sRGB space visibly desaturates and hue-shifts a
  saturated seed as it lightens or darkens, which is the exact distortion OKLCH interpolation avoids.
*/
export function mixRamp(seedHex: string): RampStop[] {
  const seed = hexToRgb(seedHex);
  return STEP_NAMES.map((name, i) => {
    if (i < 5) return { name, hex: rgbToHex(lerpRgb(seed, WHITE, ((5 - i) / 5) * MAX_TINT_MIX)) };
    if (i === 5) return { name, hex: seedHex };
    return { name, hex: rgbToHex(lerpRgb(seed, BLACK, ((i - 5) / 5) * MAX_SHADE_MIX)) };
  });
}

export function generateRamp(seedHex: string, mode: RampMode): RampStop[] {
  return mode === "oklch" ? oklchRamp(seedHex) : mixRamp(seedHex);
}
