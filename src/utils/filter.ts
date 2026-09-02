import { toFixed } from "@/utils/number";
import { FILTER_FUNCTION_ORDER } from "@/interfaces/filter";
import type { DropShadowState, FilterEditorState, FilterFunctionName } from "@/interfaces/filter";

// Each function's CSS name (where it differs from the camelCase state key — only hue-rotate does), unit suffix, and slider bounds/default. The single source every FunctionList slider and compileFilterValue both read from, so a range never drifts between the UI and the compiled output.
export const FUNCTION_META: Record<FilterFunctionName, { cssName: string; unit: string; min: number; max: number; default: number }> = {
  blur: { cssName: "blur", unit: "px", min: 0, max: 40, default: 0 },
  brightness: { cssName: "brightness", unit: "%", min: 0, max: 200, default: 100 },
  contrast: { cssName: "contrast", unit: "%", min: 0, max: 200, default: 100 },
  grayscale: { cssName: "grayscale", unit: "%", min: 0, max: 100, default: 0 },
  hueRotate: { cssName: "hue-rotate", unit: "deg", min: 0, max: 360, default: 0 },
  invert: { cssName: "invert", unit: "%", min: 0, max: 100, default: 0 },
  opacity: { cssName: "opacity", unit: "%", min: 0, max: 100, default: 100 },
  saturate: { cssName: "saturate", unit: "%", min: 0, max: 300, default: 100 },
  sepia: { cssName: "sepia", unit: "%", min: 0, max: 100, default: 0 }
};

function coord(value: number): string {
  return toFixed(value, 1).toString();
}

/*
  Applies drop-shadow's own alpha via CSS's `color-mix()` rather than a hand-rolled hex → rgba
  parser — same mechanism and reasoning as compileLayerColor in the box-shadow tool (drop-shadow()
  is structurally a single box-shadow layer, so its color handling is identical).
*/
function compileDropShadowColor(dropShadow: DropShadowState): string {
  if (dropShadow.opacity >= 100) return dropShadow.color;
  return `color-mix(in srgb, ${dropShadow.color} ${toFixed(dropShadow.opacity, 1)}%, transparent)`;
}

function compileDropShadow(dropShadow: DropShadowState): string {
  return `drop-shadow(${coord(dropShadow.offsetX)}px ${coord(dropShadow.offsetY)}px ${coord(dropShadow.blur)}px ${compileDropShadowColor(dropShadow)})`;
}

/*
  Single entry point every export format (CSS/Tailwind/React) and every preview (main pane, preset
  thumbnails) calls — one source of truth for "what does this state compile to." Only enabled
  functions contribute, applied in FILTER_FUNCTION_ORDER, with drop-shadow appended last (matching
  where a shadow conventionally reads best — after every color/blur adjustment that would otherwise
  also wash out the shadow itself). Returns "none" rather than an empty string when nothing is
  enabled, since that's the actual CSS default value, not just an absent declaration.
*/
export function compileFilterValue(state: FilterEditorState): string {
  const parts = FILTER_FUNCTION_ORDER.filter((name) => state.functions[name].enabled).map((name) => {
    const meta = FUNCTION_META[name];
    return `${meta.cssName}(${coord(state.functions[name].value)}${meta.unit})`;
  });

  if (state.dropShadow.enabled) parts.push(compileDropShadow(state.dropShadow));

  return parts.length > 0 ? parts.join(" ") : "none";
}

// Which CSS property compileFilterValue's result belongs on — dispatched separately from the value itself since export formats (React's camelCase, Tailwind's arbitrary-property bracket) each spell "backdrop-filter" differently.
export function compileFilterProperty(state: FilterEditorState): "filter" | "backdrop-filter" {
  return state.target === "filter" ? "filter" : "backdrop-filter";
}
