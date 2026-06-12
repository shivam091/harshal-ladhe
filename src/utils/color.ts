import { hyphenate } from "@/utils/string";
import { transformObject } from "@/utils/object";

// Theme colours are authored as data, not CSS, so every theme can be generated and validated from one typed source.

// Numeric HSL rather than strings so channels can be reused with a different alpha.
export type ColorTuple = [number, number, number, number?];

// Some tokens (shadow lists) aren't single colours, so they escape the tuple format as raw CSS.
export type TokenValueRaw = ColorTuple | string;

// camelCase keys keep theme files ergonomic to author in TS.
export type ColorMapRaw = Record<string, TokenValueRaw>;

// Template-literal keys make it a type error to emit anything that isn't a custom property.
export interface ColorMap {
  [key: `--${string}`]: string;
}

// Bridges authored tokens to CSS custom properties so components only ever reference var(--*).
export function createStyleObject(colors: ColorMapRaw): ColorMap {
  return transformObject(colors, (key, value) => {
    const cssVar = `--${hyphenate(key)}` as `--${string}`;
    if (typeof value === "string") return [cssVar, value];

    const [h, s, l, a = 1] = value;
    const cssValue =
      a === 1
        ? `hsl(${h} ${s}% ${l}%)`
        : `hsl(${h} ${s}% ${l}% / ${a})`;
    return [cssVar, cssValue];
  });
}

// Left selector-free so the same declarations can be scoped to any theme selector.
export function createCssString(colorMap: ColorMap): string {
  return Object.entries(colorMap)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join("\n");
}

// Lets a call site build its own `hsl()` with a custom alpha from an existing token.
export function vals([h, s, l]: ColorTuple): string {
  return `${h} ${s}% ${l}%`;
}

// Pairs each theme with its color-scheme so native controls and scrollbars match it.
export function themeRule(selector: string, colorScheme: string, css: string): string {
  return `${selector} {\n  color-scheme: ${colorScheme};\n${css}\n}`;
}

// Hex for consumers outside the browser's CSS engine (OG image renderer, web manifest) that can't be trusted with modern hsl() syntax.
export function toHex(token: TokenValueRaw): string {
  if (typeof token === "string") return token;

  const [h, s, l] = token;
  const saturation = s / 100;
  const lightness = l / 100;
  const chroma = saturation * Math.min(lightness, 1 - lightness);
  const channel = (n: number) => {
    const k = (n + h / 30) % 12;
    const value = lightness - chroma * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(value * 255).toString(16).padStart(2, "0");
  };

  return `#${channel(0)}${channel(8)}${channel(4)}`;
}
