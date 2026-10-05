import { clamp } from "@/utils/number";
import { DEFAULT_BACKGROUND_COLOR, NUMERIC_PROPERTY_META, resolveNumericAt } from "@/utils/keyframes-builder";
import type {
  KeyframeProperty,
  KeyframeStop,
  KeyframesAnimationSettings,
  KeyframesBuilderShareableState,
  KeyframesBuilderState,
  KeyframesPresetMeta
} from "@/components/KeyframesBuilder/KeyframesBuilder.types";

// The fewest stops the sheet allows — an empty @keyframes block would leave the preview, the playhead, and the export with nothing to show.
const MIN_STOPS = 1;

// Mints the next `s<n>` id from the highest one already on the sheet — deterministic (so SSR and hydration agree) and never reused while its stop still exists.
function nextStopId(stops: KeyframeStop[]): string {
  const highest = stops.reduce((max, stop) => Math.max(max, Number.parseInt(stop.id.slice(1), 10) || 0), -1);
  return `s${highest + 1}`;
}

// Offsets snap to whole percentages — finer than anyone can place by eye on the track, and it keeps exported selectors tidy.
function snapOffset(offset: number): number {
  return Math.round(clamp(offset, 0, 100));
}

// Applies `update` to one stop by id, leaving the rest untouched — the shape almost every stop edit below shares.
function updateStop(state: KeyframesBuilderState, id: string, update: (stop: KeyframeStop) => KeyframeStop): KeyframesBuilderState {
  return { ...state, stops: state.stops.map((stop) => (stop.id === id ? update(stop) : stop)) };
}

// Strips UI-only state before anything is persisted — a permalink or autosave should capture the animation, not where the sender's selection happened to be.
export function toShareableState(state: KeyframesBuilderState): KeyframesBuilderShareableState {
  const { stops, settings } = state;
  return { stops, settings };
}

// Restores a shareable payload into full editor state, selecting the first stop so the inspector opens on something rather than an empty placeholder.
export function fromShareableState(shareable: KeyframesBuilderShareableState): KeyframesBuilderState {
  return { ...shareable, selectedStopId: shareable.stops[0]?.id ?? null };
}

/*
  A gentle float-and-tilt as the starting sheet: three stops that between them show off a pinned
  transform at both ends, a mid-point that adds rotation and scale, and a per-stop timing override —
  enough to see every part of the builder doing something before touching a single control.
*/
export function createDefaultEditorState(): KeyframesBuilderState {
  return {
    stops: [
      { id: "s0", offset: 0, values: { translateY: 0, rotate: 0 }, timingFunction: null },
      { id: "s1", offset: 50, values: { translateY: -40, rotate: 12, scale: 1.15 }, timingFunction: "ease-in" },
      { id: "s2", offset: 100, values: { translateY: 0, rotate: 0 }, timingFunction: null }
    ],
    settings: {
      name: "float",
      durationMs: 1600,
      delayMs: 0,
      iterationCount: "infinite",
      direction: "normal",
      fillMode: "none",
      timingFunction: "ease-in-out"
    },
    selectedStopId: "s1"
  };
}

// New stops start empty on purpose — every property stays interpolated across them until it's explicitly opted in, and the stop is selected so the inspector is ready for that.
export function addStop(state: KeyframesBuilderState, offset: number): KeyframesBuilderState {
  const id = nextStopId(state.stops);
  return { ...state, stops: [...state.stops, { id, offset: snapOffset(offset), values: {}, timingFunction: null }], selectedStopId: id };
}

// Live during a drag or arrow-nudge — the stop keeps its place in the array so focus and DOM order stay put as it passes its neighbours.
export function moveStop(state: KeyframesBuilderState, id: string, offset: number): KeyframesBuilderState {
  return updateStop(state, id, (stop) => ({ ...stop, offset: snapOffset(offset) }));
}

// Refuses to remove the last remaining stop, and moves the selection to the nearest surviving neighbour so the inspector doesn't go blank mid-edit.
export function removeStop(state: KeyframesBuilderState, id: string): KeyframesBuilderState {
  if (state.stops.length <= MIN_STOPS) return state;
  const index = state.stops.findIndex((stop) => stop.id === id);
  if (index === -1) return state;
  const stops = state.stops.filter((stop) => stop.id !== id);
  const selectedStopId = state.selectedStopId === id ? (stops[Math.min(index, stops.length - 1)]?.id ?? null) : state.selectedStopId;
  return { ...state, stops, selectedStopId };
}

// Selection lives in editor state (not component state) so undo can restore which stop an edit was made on.
export function selectStop(state: KeyframesBuilderState, id: string | null): KeyframesBuilderState {
  return { ...state, selectedStopId: id };
}

// Clamps numeric values into the property's own slider range, so a nudge past the end can't produce a value the slider then can't show.
export function setStopValue(state: KeyframesBuilderState, id: string, key: KeyframeProperty, value: number | string): KeyframesBuilderState {
  return updateStop(state, id, (stop) => {
    if (key === "backgroundColor") return { ...stop, values: { ...stop.values, backgroundColor: String(value) } };
    const meta = NUMERIC_PROPERTY_META[key];
    return { ...stop, values: { ...stop.values, [key]: clamp(Number(value), meta.min, meta.max) } };
  });
}

/*
  Switching a property on seeds it with the value the animation ALREADY has at that offset (the
  linear estimate resolveNumericAt gives) rather than its identity — so opting a property in at a
  stop doesn't visibly jolt the animation until the slider is actually moved. Switching it off
  deletes the key, handing that offset back to the browser's own interpolation.
*/
export function toggleStopProperty(state: KeyframesBuilderState, id: string, key: KeyframeProperty, enabled: boolean): KeyframesBuilderState {
  return updateStop(state, id, (stop) => {
    const values = { ...stop.values };
    if (!enabled) {
      delete values[key];
    } else if (key === "backgroundColor") {
      values.backgroundColor = DEFAULT_BACKGROUND_COLOR;
    } else {
      const meta = NUMERIC_PROPERTY_META[key];
      const seeded = resolveNumericAt(state.stops, key, stop.offset, stop.id);
      values[key] = clamp(Math.round(seeded / meta.step) * meta.step, meta.min, meta.max);
    }
    return { ...stop, values };
  });
}

// null clears the override, letting the segment fall back to the animation's own timing function.
export function setStopTimingFunction(state: KeyframesBuilderState, id: string, timingFunction: string | null): KeyframesBuilderState {
  return updateStop(state, id, (stop) => ({ ...stop, timingFunction }));
}

// Durations below 100ms are clamped up — shorter than that a preview reads as a flicker, and a zero duration would divide the playhead's progress maths by nothing.
export function setSetting<K extends keyof KeyframesAnimationSettings>(state: KeyframesBuilderState, key: K, value: KeyframesAnimationSettings[K]): KeyframesBuilderState {
  const next = { ...state.settings, [key]: value };
  next.durationMs = Math.max(100, next.durationMs);
  next.delayMs = Math.max(0, next.delayMs);
  return { ...state, settings: next };
}

// Mints fresh ids for the preset's stops (presets carry none) and selects the first, replacing the sheet wholesale — a preset is a starting point, not something to merge into.
export function applyPreset(_state: KeyframesBuilderState, preset: KeyframesPresetMeta): KeyframesBuilderState {
  const stops = preset.stops.map((stop, index) => ({ id: `s${index}`, offset: stop.offset, values: { ...stop.values }, timingFunction: stop.timingFunction ?? null }));
  return { stops, settings: { ...preset.settings }, selectedStopId: stops[0]?.id ?? null };
}

// Reset goes through the undo stack like any other edit, so an accidental reset is one Ctrl+Z away from recovery.
export function resetBuilder(): KeyframesBuilderState {
  return createDefaultEditorState();
}
