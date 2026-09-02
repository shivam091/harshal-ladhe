import { toFixed } from "@/utils/number";
import type { BoxShadowEditorState, ShadowLayer } from "@/interfaces/box-shadow";

// Rounds a px value to 1 decimal place — enough precision for a pixel-accurate shadow without cluttering the generated CSS with float noise from slider drag math.
function px(value: number): string {
  return `${toFixed(value, 1)}px`;
}

/*
  Applies a layer's opacity to its hex color via CSS's own `color-mix()` rather than a hand-rolled
  hex → rgba parser — `color-mix(in srgb, #hex p%, transparent)` mixes with premultiplied alpha per
  the CSS Color 4 spec, so the result is exactly `#hex` at `p%` alpha with no muddying, and this tool
  never needs a color-conversion utility of its own (same reasoning as the gradient tool's `in
  oklch`/`in hsl` interpolation hint). Skipped entirely at 100% opacity so the common fully-opaque
  shadow compiles to a plain hex color instead of a needless color-mix() wrapper.
*/
function compileLayerColor(layer: ShadowLayer): string {
  if (layer.opacity >= 100) return layer.color;
  return `color-mix(in srgb, ${layer.color} ${toFixed(layer.opacity, 1)}%, transparent)`;
}

function compileLayer(layer: ShadowLayer): string {
  const inset = layer.inset ? "inset " : "";
  return `${inset}${px(layer.offsetX)} ${px(layer.offsetY)} ${px(layer.blur)} ${px(layer.spread)} ${compileLayerColor(layer)}`;
}

/*
  Single entry point every export format (CSS/Tailwind/React) and every preview (main pane, preset
  thumbnails) calls — one source of truth for "what does this state compile to." Layer order is
  preserved as-is: CSS itself renders the first-listed shadow closest to the viewer, so this
  function has no reordering logic of its own to get that right.
*/
export function compileBoxShadowValue(state: BoxShadowEditorState): string {
  if (state.layers.length === 0) return "none";
  return state.layers.map(compileLayer).join(", ");
}
