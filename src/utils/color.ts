import { hyphenate } from "@/utils/string";
import { transformObject } from "@/utils/object";

/*
  Shared types for the color-token pipeline.

  Data flow:
    ColorMapRaw  →  createStyleObject()  →  ColorMap  →  createCssString()  →  CSS string

  The raw maps live in constants/themes/*.ts and are consumed by app/utils/colors.ts.
  The serialised CSS strings are injected into <head> by app/layout.tsx.
*/

// [H, S, L] or [H, S, L, alpha] — all values numeric; alpha is 0–1.
export type ColorTuple = [number, number, number, number?];

// A raw token value: either an HSL tuple (colors) or a literal CSS string used
// verbatim (e.g. box-shadow / text-shadow lists, which aren't single colours).
export type TokenValueRaw = ColorTuple | string;

// Raw token map before processing: camelCase token names → HSL tuples or literal CSS strings.
export type ColorMapRaw = Record<string, TokenValueRaw>;

// Processed map: CSS custom-property keys (`--*`) → resolved `hsl()` strings.
export interface ColorMap {
  [key: `--${string}`]: string;
}

// Converts a raw token map into a `ColorMap` of CSS custom-property declarations.
// Tuple values become `hsl(...)` colours; string values (box/text shadows) pass
// through verbatim.
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

/*
  Serialises a `ColorMap` to an indented block of CSS declarations.
  The output has no selector wrapper — the caller is responsible for wrapping it.
*/
export function createCssString(colorMap: ColorMap): string {
  return Object.entries(colorMap)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join("\n");
}

/*
  Returns the H/S/L channels of a tuple as a space-separated string.
  Useful when you need to construct an `hsl()` call with a custom alpha at the call site.
*/
export function vals([h, s, l]: ColorTuple): string {
  return `${h} ${s}% ${l}%`;
}

// Wraps a CSS declaration block in a selector + color-scheme rule.
export function themeRule(selector: string, colorScheme: string, css: string): string {
  return `${selector} {\n  color-scheme: ${colorScheme};\n${css}\n}`;
}
