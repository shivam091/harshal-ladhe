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
