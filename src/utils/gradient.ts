import { toFixed } from "@/utils/number";
import type { GradientColorSpace, GradientConfig, GradientEditorState, GradientHueInterpolation, GradientStop } from "@/interfaces/gradient";

// Rounds an angle/percentage to 1 decimal place — enough precision for a visually exact gradient without cluttering the generated CSS with float noise from dial/pad drag math.
function coord(value: number): number {
  return toFixed(value, 1);
}

// Maps this tool's "rgb" toggle option onto the keyword CSS gradients actually accept — there is no `in rgb` color-interpolation-method, only `in srgb`.
const COLOR_SPACE_KEYWORDS: Record<GradientColorSpace, string> = { oklch: "oklch", hsl: "hsl", rgb: "srgb" };

// Only these two are polar (interpolate around a hue angle) — rgb/srgb is rectangular and has no hue-interpolation clause.
const POLAR_COLOR_SPACES: readonly GradientColorSpace[] = ["oklch", "hsl"];

/*
  Builds the `<color-interpolation-method>` clause every gradient function accepts inside its
  argument list ("in oklch shorter hue "), color-space first. Returns "" for the "rgb" option so an
  untouched gradient compiles to plain srgb-default CSS with no keyword clutter, exactly like the
  legacy syntax everyone already knows.
*/
function interpolationPrefix(colorSpace: GradientColorSpace, hueInterpolation: GradientHueInterpolation): string {
  if (colorSpace === "rgb") return "";
  const hueClause = POLAR_COLOR_SPACES.includes(colorSpace) ? `${hueInterpolation} hue ` : "";
  return `in ${COLOR_SPACE_KEYWORDS[colorSpace]} ${hueClause}`;
}

// `color position%, color position%, ...` — the one piece every gradient function shares regardless of type.
function compileStopList(stops: GradientStop[]): string {
  return stops.map((stop) => `${stop.color} ${coord(stop.position)}%`).join(", ");
}

// linear-gradient's own geometry clause — just the axis angle.
function compileLinear(config: Extract<GradientConfig, { type: "linear" }>, prefix: string): string {
  return `${prefix}${coord(config.angle)}deg`;
}

// radial-gradient's own geometry clause — shape, size keyword, and center position.
function compileRadial(config: Extract<GradientConfig, { type: "radial" }>, prefix: string): string {
  return `${prefix}${config.shape} ${config.size} at ${coord(config.position.x)}% ${coord(config.position.y)}%`;
}

// conic-gradient's own geometry clause — a start angle plus a center position.
function compileConic(config: Extract<GradientConfig, { type: "conic" }>, prefix: string): string {
  return `${prefix}from ${coord(config.angle)}deg at ${coord(config.position.x)}% ${coord(config.position.y)}%`;
}

/*
  Single entry point every export format (CSS/Tailwind/React) and every preview (the live canvas
  backdrop, preset thumbnails, ExportPanel) calls — one source of truth for "what does this state
  compile to." Dispatches on config.type for the geometry clause, and always prepends the shared
  interpolation prefix and appends the shared stop list.
*/
export function compileGradientValue(state: GradientEditorState): string {
  const { config, stops, colorSpace, hueInterpolation, repeating } = state;
  const functionName = `${repeating ? "repeating-" : ""}${config.type}-gradient`;
  const prefix = interpolationPrefix(colorSpace, hueInterpolation);

  const geometry =
    config.type === "linear" ? compileLinear(config, prefix) : config.type === "radial" ? compileRadial(config, prefix) : compileConic(config, prefix);

  return `${functionName}(${geometry}, ${compileStopList(stops)})`;
}
