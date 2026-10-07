import { useCallback, useMemo, useRef, useState } from "react";
import { clamp } from "@/utils/number";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useIsClient } from "@/hooks/use-is-client";
import { useRequestAnimationFrameLoop } from "@/hooks/use-request-animation-frame-loop";
import { MAX_KEYFRAMES, MIN_KEYFRAMES, MORPH_EASINGS } from "@/components/SvgPathMorph/SvgPathMorph.utils";
import { svgPathMorphPresets } from "@/data/svg-path-morph-presets";
import type { MorphPlayback, MorphPresetMeta, MorphSettingKey, SvgPathMorphShareableState, SvgPathMorphState } from "@/components/SvgPathMorph/SvgPathMorph.types";

// The quickest one keyframe-to-keyframe morph may be, below which it reads as a flicker.
export const MIN_DURATION_MS = 150;
// The slow end of that range, past which a morph reads as a stall.
export const MAX_DURATION_MS = 4000;

// How far the manual start-point twist can go either way — beyond this it just wraps round small shapes again.
export const MAX_START_OFFSET = 12;

// A permalink is untrusted input, so each keyframe string is capped well above any sensible icon.
const MAX_KEYFRAME_LENGTH = 20000;

// What a fresh bench starts as: the circle → star recipe, which shows off arcs, subdivision and the report at once.
export function createDefaultEditorState(): SvgPathMorphState {
  return fromPreset(svgPathMorphPresets[0]);
}

// A preset's recipe as editor state — alignment settings reset to auto, since presets are tuned with it on.
function fromPreset(preset: MorphPresetMeta): SvgPathMorphState {
  return {
    keyframes: [...preset.keyframes],
    autoAlign: true,
    allowReverse: true,
    startOffset: 0,
    durationMs: preset.durationMs,
    easing: preset.easing,
    renderMode: preset.renderMode
  };
}

// The state worth persisting — currently all of it, kept as a function so a UI-only field later has one place to be dropped.
export function toShareableState(state: SvgPathMorphState): SvgPathMorphShareableState {
  return { ...state, keyframes: [...state.keyframes] };
}

/*
  Validates anything claiming to be saved state (a permalink or an old autosave) field by field,
  falling back to defaults per field rather than rejecting the lot — but a missing or malformed
  keyframe list means there's no recipe to restore, so that alone returns null.
*/
export function sanitiseShareableState(raw: unknown): SvgPathMorphShareableState | null {
  if (!raw || typeof raw !== "object") return null;
  const input = raw as Partial<Record<keyof SvgPathMorphState, unknown>>;
  if (!Array.isArray(input.keyframes)) return null;
  const keyframes = input.keyframes.filter((d): d is string => typeof d === "string").map((d) => d.slice(0, MAX_KEYFRAME_LENGTH)).slice(0, MAX_KEYFRAMES);
  if (keyframes.length < MIN_KEYFRAMES) return null;

  const defaults = createDefaultEditorState();
  const easing = MORPH_EASINGS.find((meta) => meta.id === input.easing)?.id ?? defaults.easing;
  const durationMs = typeof input.durationMs === "number" && Number.isFinite(input.durationMs) ? Math.round(clamp(input.durationMs, MIN_DURATION_MS, MAX_DURATION_MS)) : defaults.durationMs;
  const startOffset = typeof input.startOffset === "number" && Number.isFinite(input.startOffset) ? Math.round(clamp(input.startOffset, -MAX_START_OFFSET, MAX_START_OFFSET)) : 0;
  return {
    keyframes,
    autoAlign: typeof input.autoAlign === "boolean" ? input.autoAlign : defaults.autoAlign,
    allowReverse: typeof input.allowReverse === "boolean" ? input.allowReverse : defaults.allowReverse,
    startOffset,
    durationMs,
    easing,
    renderMode: input.renderMode === "stroke" ? "stroke" : "fill"
  };
}

// Plain JSON → base64 → URL-safe characters, the same encoding every other goodie's permalink uses.
export function encodeShareableState(state: SvgPathMorphShareableState): string {
  const json = JSON.stringify(state);
  const base64 = btoa(unescape(encodeURIComponent(json)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Reverses encodeShareableState and sanitises the result; null on anything malformed so the page falls back instead of crashing.
export function decodeShareableState(encoded: string): SvgPathMorphShareableState | null {
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(base64)));
    return sanitiseShareableState(JSON.parse(json));
  } catch {
    return null;
  }
}

// Replaces one keyframe's `d` string as typed — parsing happens downstream, so a half-typed path is allowed to sit in state.
export function setKeyframe(state: SvgPathMorphState, index: number, d: string): SvgPathMorphState {
  return { ...state, keyframes: state.keyframes.map((current, i) => (i === index ? d : current)) };
}

// Appends a keyframe that starts as a copy of the last, so the chain stays valid until it's edited into something new.
export function addKeyframe(state: SvgPathMorphState): SvgPathMorphState {
  if (state.keyframes.length >= MAX_KEYFRAMES) return state;
  return { ...state, keyframes: [...state.keyframes, state.keyframes[state.keyframes.length - 1]] };
}

// Drops a keyframe, refusing to go below two — a morph needs somewhere to go.
export function removeKeyframe(state: SvgPathMorphState, index: number): SvgPathMorphState {
  if (state.keyframes.length <= MIN_KEYFRAMES) return state;
  return { ...state, keyframes: state.keyframes.filter((_, i) => i !== index) };
}

// Runs the recipe backwards (B → A) — quicker than retyping when the morph reads better in the other direction.
export function reverseKeyframes(state: SvgPathMorphState): SvgPathMorphState {
  return { ...state, keyframes: [...state.keyframes].reverse() };
}

// One setting change, clamped where the control's own bounds might be bypassed (keyboard nudges, stale permalinks).
export function setSetting<K extends MorphSettingKey>(state: SvgPathMorphState, key: K, value: SvgPathMorphState[K]): SvgPathMorphState {
  if (key === "durationMs") return { ...state, durationMs: Math.round(clamp(value as number, MIN_DURATION_MS, MAX_DURATION_MS)) };
  if (key === "startOffset") return { ...state, startOffset: Math.round(clamp(value as number, -MAX_START_OFFSET, MAX_START_OFFSET)) };
  return { ...state, [key]: value };
}

// Loads a preset's recipe wholesale.
export function applyPreset(preset: MorphPresetMeta): SvgPathMorphState {
  return fromPreset(preset);
}

// Back to the default recipe — an undoable reset, so it's never a destructive click.
export function resetMorph(): SvgPathMorphState {
  return createDefaultEditorState();
}

// A single frame longer than this (a backgrounded tab waking up) is clamped, so the morph resumes where it was rather than jumping.
const MAX_FRAME_MS = 100;

/*
  The preview's own clock: a ping-pong phase in [0, 2) advanced by requestAnimationFrame and read
  back as a 0 → 1 → 0 progress, with no animation library involved — the matched cubics are
  interpolated directly. Under prefers-reduced-motion it starts paused (and only reads the
  preference once hydrated, so the server and first client render agree), but stays playable on
  request.
*/
export function useMorphPlayback(passDurationMs: number, enabled: boolean): MorphPlayback {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isClient = useIsClient();
  // null until someone presses play/pause — until then the default follows the motion preference.
  const [userPlaying, setUserPlaying] = useState<boolean | null>(null);
  const [phase, setPhase] = useState(0);
  const [speed, setSpeed] = useState(1);
  const lastTimestamp = useRef<number | null>(null);
  const isPlaying = enabled && (userPlaying ?? (isClient && !prefersReducedMotion));

  // Advances by real elapsed time rather than a fixed step per frame, so 120 Hz screens don't play twice as fast.
  const tick = useCallback(() => {
    const now = performance.now();
    const previous = lastTimestamp.current;
    lastTimestamp.current = now;
    if (previous === null) return;
    const elapsed = Math.min(now - previous, MAX_FRAME_MS);
    setPhase((current) => (current + (elapsed * speed) / Math.max(passDurationMs, 1)) % 2);
  }, [speed, passDurationMs]);

  useRequestAnimationFrameLoop(tick, isPlaying);

  // Forgets the last timestamp on every play, so the first frame after a pause doesn't count the whole pause as elapsed time.
  const toggle = useCallback(() => {
    lastTimestamp.current = null;
    setUserPlaying(!isPlaying);
  }, [isPlaying]);

  // Parks the preview on an exact moment; scrubbing implies looking, so it pauses too.
  const seek = useCallback((progress: number) => {
    setPhase(Math.min(Math.max(progress, 0), 1));
    setUserPlaying(false);
  }, []);

  const progress = phase <= 1 ? phase : 2 - phase;

  return useMemo(() => ({ isPlaying, progress, speed, toggle, seek, setSpeed }), [isPlaying, progress, speed, toggle, seek]);
}
