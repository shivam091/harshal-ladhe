import { clamp, toFixed } from "@/utils/number";
import type {
  AnimationDirection,
  AnimationFillMode,
  KeyframeStop,
  KeyframeValues,
  KeyframesAnimationSettings,
  KeyframesBuilderShareableState,
  NumericKeyframeProperty,
  NumericPropertyMeta,
  PlayheadReadout,
  TimingFunctionOption,
  TransformChannel
} from "@/components/KeyframesBuilder/KeyframesBuilder.types";

// The preview element's own resting border radius (px) — the identity borderRadius interpolates from, so it has to match PreviewStage's Cel styles.
export const BASE_BORDER_RADIUS_PX = 12;

// Pencil yellow — the colour a freshly enabled background starts at, so switching it on visibly does something against the stage's default accent fill.
export const DEFAULT_BACKGROUND_COLOR = "#e8b931";

// Frame rate the dope sheet's frame numbers count in — film's 24fps, the rate exposure sheets have always been ruled for.
export const SHEET_FPS = 24;

// Order matters: it's the order transform functions are written in, and translate-then-rotate-then-scale is what makes a decomposed matrix read straight back as these same values.
export const TRANSFORM_CHANNELS: TransformChannel[] = ["translateX", "translateY", "rotate", "scale"];

// One table drives the inspector sliders, the compiled units, and the identity values interpolation anchors to — so a range or unit is never defined twice.
export const NUMERIC_PROPERTIES: NumericPropertyMeta[] = [
  { key: "translateX", label: "Translate X", min: -200, max: 200, step: 1, unit: "px", identity: 0 },
  { key: "translateY", label: "Translate Y", min: -120, max: 120, step: 1, unit: "px", identity: 0 },
  { key: "rotate", label: "Rotate", min: -360, max: 360, step: 1, unit: "deg", identity: 0 },
  { key: "scale", label: "Scale", min: 0, max: 3, step: 0.05, unit: "", identity: 1 },
  { key: "opacity", label: "Opacity", min: 0, max: 1, step: 0.01, unit: "", identity: 1 },
  { key: "borderRadius", label: "Border radius", min: 0, max: 40, step: 1, unit: "px", identity: BASE_BORDER_RADIUS_PX }
];

// Keyed view of NUMERIC_PROPERTIES for O(1) lookups during compilation, derived rather than hand-written so the two can't drift.
export const NUMERIC_PROPERTY_META = Object.fromEntries(NUMERIC_PROPERTIES.map((meta) => [meta.key, meta])) as Record<NumericKeyframeProperty, NumericPropertyMeta>;

/*
  The only timing functions the builder offers — a curated whitelist rather than a free-text field,
  so a permalink can never smuggle arbitrary CSS into the preview's injected <style> tag, and every
  option is one the keyframes guide actually discusses (keywords, steps(), and a few named curves).
*/
export const TIMING_FUNCTIONS: TimingFunctionOption[] = [
  { value: "linear", label: "linear" },
  { value: "ease", label: "ease" },
  { value: "ease-in", label: "ease-in" },
  { value: "ease-out", label: "ease-out" },
  { value: "ease-in-out", label: "ease-in-out" },
  { value: "cubic-bezier(0.34, 1.56, 0.64, 1)", label: "overshoot — cubic-bezier(0.34, 1.56, 0.64, 1)" },
  { value: "cubic-bezier(0.36, 0, 0.66, -0.56)", label: "anticipate — cubic-bezier(0.36, 0, 0.66, -0.56)" },
  { value: "cubic-bezier(0.8, 0, 1, 1)", label: "fall (bounce down) — cubic-bezier(0.8, 0, 1, 1)" },
  { value: "cubic-bezier(0, 0, 0.2, 1)", label: "rise (bounce up) — cubic-bezier(0, 0, 0.2, 1)" },
  { value: "cubic-bezier(0.4, 0, 0.6, 1)", label: "breathe — cubic-bezier(0.4, 0, 0.6, 1)" },
  { value: "steps(4, end)", label: "steps(4, end)" },
  { value: "steps(8, jump-none)", label: "steps(8, jump-none)" },
  { value: "step-start", label: "step-start" },
  { value: "step-end", label: "step-end" }
];

// Set view of the whitelist for validating untrusted (permalink/autosave) values.
const TIMING_FUNCTION_VALUES = new Set(TIMING_FUNCTIONS.map((option) => option.value));

// The keyword lists the shorthand accepts — validated against on decode so a tampered link can't produce an invalid `animation` value.
const DIRECTIONS: AnimationDirection[] = ["normal", "reverse", "alternate", "alternate-reverse"];
// Fill-mode keywords, validated the same way as DIRECTIONS.
const FILL_MODES: AnimationFillMode[] = ["none", "forwards", "backwards", "both"];

/*
  Words the `animation` shorthand would read as one of its own keywords rather than the name — CSS
  resolves that ambiguity in the keyword's favour, so a name like `ease` silently stops being a name.
*/
const RESERVED_NAMES = new Set([
  "none", "initial", "inherit", "unset", "revert", "revert-layer", "default", "infinite", "normal", "reverse", "alternate",
  "alternate-reverse", "forwards", "backwards", "both", "running", "paused", "linear", "ease", "ease-in", "ease-out",
  "ease-in-out", "step-start", "step-end"
]);

// Whether a timing function is one the builder knows — the gate every untrusted value passes through.
export function isKnownTimingFunction(value: unknown): value is string {
  return typeof value === "string" && TIMING_FUNCTION_VALUES.has(value);
}

/*
  Coerces whatever the user typed into a safe CSS identifier: lowercase letters, digits, and hyphens
  only. Underscores are swapped out too, since Tailwind's arbitrary-value syntax reads `_` as a space.
*/
export function sanitiseAnimationName(raw: string): string {
  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!cleaned) return "my-animation";
  // An identifier can't start with a digit (or a hyphen followed by one).
  const named = /^-?\d/.test(cleaned) ? `anim-${cleaned}` : cleaned;
  return RESERVED_NAMES.has(named) ? `${named}-anim` : named;
}

// Two-decimal rounding with trailing zeros dropped — `0.5`, not `0.50`, and no float noise like `0.30000000000000004` in the export.
export function formatNumber(value: number): string {
  return String(toFixed(value, 2));
}

// `1s` / `1.5s` for tidy values, raw `ms` otherwise — how people actually write durations by hand.
export function formatTime(ms: number): string {
  if (ms === 0) return "0s";
  return ms % 100 === 0 ? `${ms / 1000}s` : `${ms}ms`;
}

// Stable ascending order; ties keep their insertion order so two stops at the same offset compile in the order they were placed.
export function sortStops(stops: KeyframeStop[]): KeyframeStop[] {
  return [...stops].sort((a, b) => a.offset - b.offset);
}

// Every transform channel set on ANY stop, in canonical order — the function list every transform-bearing stop must repeat so the browser interpolates function-by-function rather than falling back to matrix interpolation.
export function usedTransformChannels(stops: KeyframeStop[]): TransformChannel[] {
  return TRANSFORM_CHANNELS.filter((channel) => stops.some((stop) => stop.values[channel] !== undefined));
}

/*
  The value a numeric property would have at `offset` if the stop there didn't pin it — a linear blend
  between the nearest stops on either side that DO pin it, anchored to the property's identity at 0%
  and 100% when no stop sits there (the same implicit from/to keyframes CSS itself synthesises). Linear
  rather than eased: it's an approximation, used only to fill sibling transform functions and seed
  newly enabled values, never to drive the real preview.
*/
export function resolveNumericAt(stops: KeyframeStop[], key: NumericKeyframeProperty, offset: number, excludeId?: string): number {
  const identity = NUMERIC_PROPERTY_META[key].identity;
  const points = sortStops(stops)
    .filter((stop) => stop.id !== excludeId && stop.values[key] !== undefined)
    .map((stop) => ({ offset: stop.offset, value: stop.values[key] as number }));
  if (!points.some((point) => point.offset === 0)) points.unshift({ offset: 0, value: identity });
  if (!points.some((point) => point.offset === 100)) points.push({ offset: 100, value: identity });

  let before = points[0];
  let after = points[points.length - 1];
  for (const point of points) {
    if (point.offset <= offset) before = point;
    if (point.offset >= offset) {
      after = point;
      break;
    }
  }
  if (after.offset === before.offset) return before.value;
  const t = (offset - before.offset) / (after.offset - before.offset);
  return before.value + (after.value - before.value) * t;
}

// Formats one transform channel as its CSS function — kept separate so the export and the onion-skin ghosts write the exact same text.
function transformFunction(channel: TransformChannel, value: number): string {
  const { unit } = NUMERIC_PROPERTY_META[channel];
  return `${channel}(${formatNumber(value)}${unit})`;
}

// A full transform function list for one stop: pinned channels as-is, the rest filled by resolveNumericAt so every stop repeats the same functions in the same order.
export function compileTransform(stops: KeyframeStop[], stop: KeyframeStop, channels: TransformChannel[]): string {
  return channels.map((channel) => transformFunction(channel, stop.values[channel] ?? resolveNumericAt(stops, channel, stop.offset, stop.id))).join(" ");
}

/*
  One stop's declarations, as `property: value` strings. `transform` is only written at stops that pin
  at least one transform channel — a stop with none leaves transform to interpolate straight across
  it, same as every other unset property.
*/
export function compileStopDeclarations(stops: KeyframeStop[], stop: KeyframeStop, channels: TransformChannel[]): string[] {
  const { values } = stop;
  const declarations: string[] = [];
  if (channels.some((channel) => values[channel] !== undefined)) declarations.push(`transform: ${compileTransform(stops, stop, channels)}`);
  if (values.opacity !== undefined) declarations.push(`opacity: ${formatNumber(values.opacity)}`);
  if (values.backgroundColor !== undefined) declarations.push(`background-color: ${values.backgroundColor}`);
  if (values.borderRadius !== undefined) declarations.push(`border-radius: ${formatNumber(values.borderRadius)}px`);
  if (stop.timingFunction) declarations.push(`animation-timing-function: ${stop.timingFunction}`);
  return declarations;
}

/*
  The full @keyframes block. Stops whose declarations come out identical are grouped into one
  selector list (`0%, 100% { … }`) — the tidy form the keyframes guide teaches — and stops with
  nothing pinned at all are dropped, since an empty keyframe is a no-op.
*/
export function compileKeyframes(stops: KeyframeStop[], name: string, indent = "  "): string {
  const channels = usedTransformChannels(stops);
  const groups: Array<{ selectors: string[]; declarations: string[] }> = [];
  for (const stop of sortStops(stops)) {
    const declarations = compileStopDeclarations(stops, stop, channels);
    if (declarations.length === 0) continue;
    const selector = `${formatNumber(stop.offset)}%`;
    const signature = declarations.join(";");
    const existing = groups.find((group) => group.declarations.join(";") === signature);
    if (existing) {
      if (!existing.selectors.includes(selector)) existing.selectors.push(selector);
    } else {
      groups.push({ selectors: [selector], declarations });
    }
  }
  const body = groups
    .map((group) => `${indent}${group.selectors.join(", ")} {\n${group.declarations.map((d) => `${indent}${indent}${d};`).join("\n")}\n${indent}}`)
    .join("\n");
  return `@keyframes ${name} {\n${body}\n}`;
}

/*
  The `animation` shorthand, leaving out any value already at its initial default (zero delay, one
  iteration, `normal`, `none`) — the shortest correct form. Duration always precedes delay, since the
  shorthand assigns its first time value to duration and its second to delay.
*/
export function compileAnimationShorthand(settings: KeyframesAnimationSettings, name: string): string {
  const parts = [name, formatTime(settings.durationMs), settings.timingFunction];
  if (settings.delayMs > 0) parts.push(formatTime(settings.delayMs));
  if (settings.iterationCount !== 1) parts.push(String(settings.iterationCount));
  if (settings.direction !== "normal") parts.push(settings.direction);
  if (settings.fillMode !== "none") parts.push(settings.fillMode);
  return parts.join(" ");
}

// The longhand form — what the React export and the live preview both use, since an inline style object reads more clearly (and diffs more cleanly) as named properties than one packed string.
export function compileAnimationLonghands(settings: KeyframesAnimationSettings, name: string): Record<string, string> {
  return {
    animationName: name,
    animationDuration: formatTime(settings.durationMs),
    animationTimingFunction: settings.timingFunction,
    animationDelay: formatTime(settings.delayMs),
    animationIterationCount: String(settings.iterationCount),
    animationDirection: settings.direction,
    animationFillMode: settings.fillMode
  };
}

// The pose a stop represents with every property resolved — what the onion-skin ghost of that stop draws, so ghosts show inherited values too, not just the pinned ones.
export function resolveStopPose(stops: KeyframeStop[], stop: KeyframeStop): Record<NumericKeyframeProperty, number> {
  const pose = {} as Record<NumericKeyframeProperty, number>;
  for (const meta of NUMERIC_PROPERTIES) pose[meta.key] = stop.values[meta.key] ?? resolveNumericAt(stops, meta.key, stop.offset, stop.id);
  return pose;
}

/*
  Reads a computed `transform` back into the sheet's own channels. getComputedStyle always reports a
  matrix, never the functions that produced it; for translate → rotate → uniform scale (the only
  composition this builder writes) the matrix decomposes exactly: e/f are the translation, and the
  first column's angle and length are the rotation and scale. Rotation comes back folded into
  (-180°, 180°], which is the most a matrix can say about it.
*/
export function decomposeTransform(transform: string): Pick<PlayheadReadout, TransformChannel> {
  const match = /^matrix\(([^)]+)\)$/.exec(transform.trim());
  if (!match) return { translateX: 0, translateY: 0, rotate: 0, scale: 1 };
  const [a, b, , , e, f] = match[1].split(",").map((part) => Number.parseFloat(part));
  return {
    translateX: e,
    translateY: f,
    rotate: (Math.atan2(b, a) * 180) / Math.PI,
    scale: Math.hypot(a, b)
  };
}

// Narrows an unknown value to a finite number within range, or undefined — the per-field guard sanitiseShareableState builds on.
function finiteIn(value: unknown, min: number, max: number): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? clamp(value, min, max) : undefined;
}

/*
  Validates a permalink/autosave payload field by field, dropping anything malformed instead of
  rejecting the whole thing — and, crucially, letting nothing through that isn't a known timing
  function or a plain hex colour, since these values end up inside an injected <style> tag.
  Returns null only when nothing usable survives.
*/
export function sanitiseShareableState(raw: unknown): KeyframesBuilderShareableState | null {
  if (!raw || typeof raw !== "object") return null;
  const input = raw as { stops?: unknown; settings?: unknown };
  if (!Array.isArray(input.stops) || !input.settings || typeof input.settings !== "object") return null;

  const stops: KeyframeStop[] = [];
  input.stops.forEach((candidate: unknown, index) => {
    if (!candidate || typeof candidate !== "object") return;
    const source = candidate as { id?: unknown; offset?: unknown; values?: unknown; timingFunction?: unknown };
    const offset = finiteIn(source.offset, 0, 100);
    if (offset === undefined) return;
    const rawValues = (source.values && typeof source.values === "object" ? source.values : {}) as Record<string, unknown>;
    const values: KeyframeValues = {};
    for (const meta of NUMERIC_PROPERTIES) {
      const value = finiteIn(rawValues[meta.key], meta.min, meta.max);
      if (value !== undefined) values[meta.key] = value;
    }
    if (typeof rawValues.backgroundColor === "string" && /^#[0-9a-f]{6}$/i.test(rawValues.backgroundColor)) values.backgroundColor = rawValues.backgroundColor;
    const id = typeof source.id === "string" && /^s\d+$/.test(source.id) && !stops.some((stop) => stop.id === source.id) ? source.id : `s${1000 + index}`;
    stops.push({ id, offset, values, timingFunction: isKnownTimingFunction(source.timingFunction) ? source.timingFunction : null });
  });
  if (stops.length === 0) return null;

  const settings = input.settings as Record<string, unknown>;
  const iterationCount = settings.iterationCount === "infinite" ? "infinite" : Math.round(finiteIn(settings.iterationCount, 1, 99) ?? 1);
  return {
    stops,
    settings: {
      // Kept raw (only length-capped) — the name field stores exactly what was typed, and every compile path runs it through sanitiseAnimationName before it reaches CSS.
      name: typeof settings.name === "string" ? settings.name.slice(0, 64) : "my-animation",
      durationMs: Math.round(finiteIn(settings.durationMs, 100, 10000) ?? 1000),
      delayMs: Math.round(finiteIn(settings.delayMs, 0, 5000) ?? 0),
      iterationCount,
      direction: DIRECTIONS.includes(settings.direction as AnimationDirection) ? (settings.direction as AnimationDirection) : "normal",
      fillMode: FILL_MODES.includes(settings.fillMode as AnimationFillMode) ? (settings.fillMode as AnimationFillMode) : "none",
      timingFunction: isKnownTimingFunction(settings.timingFunction) ? settings.timingFunction : "ease"
    }
  };
}
