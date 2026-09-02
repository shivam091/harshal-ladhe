import { clamp, toFixed } from "@/utils/number";

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface WcagResult {
  ratio: number;
  aaNormal: boolean;
  aaLarge: boolean;
  aaaNormal: boolean;
  aaaLarge: boolean;
}

export function isValidHex(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

export function hexToRgb(hex: string): RgbColor {
  const h = hex.replace("#", "");
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
}

export function rgbToHex({ r, g, b }: RgbColor): string {
  const byte = (v: number) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0");
  return `#${byte(r)}${byte(g)}${byte(b)}`;
}

// sRGB's own piecewise gamma curve — the same formula both relative-luminance (WCAG) and OKLab conversion need, so it's shared rather than duplicated per caller.
function srgbToLinear(channel255: number): number {
  const cs = channel255 / 255;
  return cs <= 0.04045 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4);
}

function linearToSrgb01(linear: number): number {
  return linear <= 0.0031308 ? linear * 12.92 : 1.055 * Math.pow(linear, 1 / 2.4) - 0.055;
}

// WCAG 2.x relative luminance — https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
function relativeLuminance(rgb: RgbColor): number {
  return 0.2126 * srgbToLinear(rgb.r) + 0.7152 * srgbToLinear(rgb.g) + 0.0722 * srgbToLinear(rgb.b);
}

// WCAG 2.x contrast ratio — the lighter color's luminance always goes on top, so the result is always >= 1 regardless of which hex was passed first.
export function contrastRatio(hexA: string, hexB: string): number {
  const luminanceA = relativeLuminance(hexToRgb(hexA));
  const luminanceB = relativeLuminance(hexToRgb(hexB));
  const lighter = Math.max(luminanceA, luminanceB);
  const darker = Math.min(luminanceA, luminanceB);
  return (lighter + 0.05) / (darker + 0.05);
}

// The four pass/fail thresholds WCAG 2.x defines for text contrast — "large text" means 18pt+ (or 14pt+ bold).
export function evaluateWcag(ratio: number): WcagResult {
  return {
    ratio: toFixed(ratio, 2),
    aaNormal: ratio >= 4.5,
    aaLarge: ratio >= 3,
    aaaNormal: ratio >= 7,
    aaaLarge: ratio >= 4.5
  };
}

interface Oklab {
  L: number;
  a: number;
  b: number;
}

export interface Oklch {
  L: number;
  C: number;
  H: number;
}

// Björn Ottosson's sRGB -> linear -> LMS -> OKLab matrices (https://bottosson.github.io/posts/oklab/).
function rgbToOklab({ r, g, b }: RgbColor): Oklab {
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);

  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  return {
    L: 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
  };
}

// The inverse matrices — returns UNCLAMPED 0-1-ish linear-light sRGB components (can fall outside [0, 1] for an OKLab point outside the sRGB gamut), so oklchToHex's gamut search below can tell an out-of-range result from a merely-dark one.
function oklabToRgbRaw({ L, a, b }: Oklab): RgbColor {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;

  return {
    r: linearToSrgb01(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    g: linearToSrgb01(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    b: linearToSrgb01(-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s)
  };
}

function oklabToOklch({ L, a, b }: Oklab): Oklch {
  const C = Math.sqrt(a * a + b * b);
  const H = ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360;
  return { L, C, H };
}

function oklchToOklab({ L, C, H }: Oklch): Oklab {
  const hueRad = (H * Math.PI) / 180;
  return { L, a: C * Math.cos(hueRad), b: C * Math.sin(hueRad) };
}

export function hexToOklch(hex: string): Oklch {
  return oklabToOklch(rgbToOklab(hexToRgb(hex)));
}

const GAMUT_TOLERANCE = 1e-4;

function inSrgbGamut({ r, g, b }: RgbColor): boolean {
  return r >= -GAMUT_TOLERANCE && r <= 1 + GAMUT_TOLERANCE && g >= -GAMUT_TOLERANCE && g <= 1 + GAMUT_TOLERANCE && b >= -GAMUT_TOLERANCE && b <= 1 + GAMUT_TOLERANCE;
}

/*
  Converts an OKLCH color to a displayable hex, gamut-mapping by chroma reduction: most (L, C, H)
  triples don't correspond to any real sRGB color, so this binary-searches for the largest chroma
  <= the requested one that still lands inside the sRGB cube, holding lightness and hue fixed
  (reducing chroma toward gray is the standard, least-distorting way to pull an out-of-gamut OKLCH
  color back in, since desaturating changes perceived color far less than shifting lightness or hue would).
*/
export function oklchToHex(L: number, C: number, H: number): string {
  let raw = oklabToRgbRaw(oklchToOklab({ L, C, H }));

  if (!inSrgbGamut(raw)) {
    let lo = 0;
    let hi = C;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      const candidate = oklabToRgbRaw(oklchToOklab({ L, C: mid, H }));
      if (inSrgbGamut(candidate)) lo = mid;
      else hi = mid;
    }
    raw = oklabToRgbRaw(oklchToOklab({ L, C: lo, H }));
  }

  const toByte = (v: number) => clamp(Math.round(clamp(v, 0, 1) * 255), 0, 255);
  return rgbToHex({ r: toByte(raw.r), g: toByte(raw.g), b: toByte(raw.b) });
}
