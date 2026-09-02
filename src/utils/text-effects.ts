import { toFixed } from "@/utils/number";
import type { GradientFillConfig, GradientFillStop, TextShadowLayer } from "@/interfaces/text-effects";

function px(value: number): string {
  return `${toFixed(value, 1)}px`;
}

/*
  Applies a layer's opacity to its hex color via CSS's own `color-mix()` — the exact same
  mechanism and reasoning as compileLayerColor in the box-shadow tool (a text-shadow layer is
  structurally identical to a box-shadow layer minus spread/inset), so this tool never needs a
  hex-parsing utility of its own either.
*/
function compileLayerColor(layer: TextShadowLayer): string {
  if (layer.opacity >= 100) return layer.color;
  return `color-mix(in srgb, ${layer.color} ${toFixed(layer.opacity, 1)}%, transparent)`;
}

function compileLayer(layer: TextShadowLayer): string {
  return `${px(layer.offsetX)} ${px(layer.offsetY)} ${px(layer.blur)} ${compileLayerColor(layer)}`;
}

/*
  Single entry point for the shadow half of this tool's output — one source of truth every export
  format and the live preview both read from. "none" (not an empty string) when no layers exist,
  matching text-shadow's own actual default value. Takes just the layer list (not the full
  TextEffectsEditorState) since that's the only field it ever reads — letting PresetGallery's
  thumbnails call it with a preset's own layers directly, without needing to fake up the rest of a
  full editor state just to satisfy a wider parameter type.
*/
export function compileTextShadowValue(shadowLayers: TextShadowLayer[]): string {
  if (shadowLayers.length === 0) return "none";
  return shadowLayers.map(compileLayer).join(", ");
}

function compileStopList(stops: GradientFillStop[]): string {
  return stops.map((stop) => `${stop.color} ${toFixed(stop.position, 1)}%`).join(", ");
}

// The bare `<gradient-function>(...)` value — deliberately simpler than the standalone Gradient Generator's own compiler (no color-space toggle, no repeating, no radial shape/size/position controls): a gradient TEXT FILL is read through narrow glyph strokes, where those finer controls rarely change what's visible, unlike a gradient painted across an open rectangle.
export function compileGradientFillValue(fill: GradientFillConfig): string {
  const stopList = compileStopList(fill.stops);
  switch (fill.type) {
    case "linear":
      return `linear-gradient(${toFixed(fill.angle, 1)}deg, ${stopList})`;
    case "radial":
      return `radial-gradient(circle, ${stopList})`;
    case "conic":
      return `conic-gradient(from ${toFixed(fill.angle, 1)}deg, ${stopList})`;
  }
}

/*
  Every declaration the `background-clip: text` technique needs, as ordered [property, value]
  pairs — background-image first (the gradient itself), then the clip (both prefixed and bare:
  Safari has shipped the unprefixed form only since 2023, so the -webkit- form stays for anyone on
  an older WebKit), then the two ways of making the glyphs themselves transparent so the background
  shows through (`color` for browsers that respect it here, `-webkit-text-fill-color` for the
  WebKit-specific property that historically actually controlled this).
*/
export function compileGradientFillDeclarations(fill: GradientFillConfig): Array<[string, string]> {
  const value = compileGradientFillValue(fill);
  return [
    ["background-image", value],
    ["-webkit-background-clip", "text"],
    ["background-clip", "text"],
    ["color", "transparent"],
    ["-webkit-text-fill-color", "transparent"]
  ];
}
