"use client";

import { useCallback, useContext, useEffect, useRef } from "react";
import { SoundContext } from "@/context/SoundContext";
import { clamp } from "@/utils/number";

// A sprite map: each entry is [startMs, durationMs] into the shared audio file.
export type SpriteMap = Record<string, [number, number]>;

// Options accepted by `useSound`; `volume` is clamped to the 0-1 range `HTMLAudioElement` expects.
export interface UseSoundOptions {
  volume?: number;
  // Default playback speed multiplier (1 = normal) — also shifts pitch. Overridable per-call via `PlayOptions`.
  playbackRate?: number;
  // When set, `src` is treated as a single file containing multiple clips; `play({ id })` selects one.
  sprite?: SpriteMap;
}

// Options accepted by the `play` trigger itself.
export interface PlayOptions {
  // Plays even while the site-wide sound preference is off — for the mute toggle's own click feedback.
  forceSoundEnabled?: boolean;
  // Overrides this call's playback speed multiplier, otherwise falling back to the hook's own `playbackRate` option.
  playbackRate?: number;
  // Selects a region from the hook's `sprite` map. Required when `sprite` is given, ignored otherwise.
  id?: string;
}

/*
  Tuple returned by `useSound`: a `play` trigger, a `setVolume` setter, a `stop`, and a
  `setPlaybackRate` setter for the same audio element — appended last so existing positional
  destructuring (e.g. `[play, , stop]`) keeps working unchanged.
*/
type UseSoundReturn = [
  (options?: PlayOptions) => void,
  (volume: number) => void,
  () => void,
  (playbackRate: number) => void
];

/*
  Preloads `src` once and returns a stable [play, setVolume, stop, setPlaybackRate] tuple that
  replays it from the start on every call — a minimal stand-in for the `use-sound` library's basic
  API, since this repo has no audio dependency of its own. Playback is silenced while the site-wide
  sound preference (SoundContext) is off, unless the caller passes `{ forceSoundEnabled: true }`.
  Falls back to enabled when no SoundProvider is mounted above, so this hook works standalone.

  Pass `sprite` to treat `src` as one file holding multiple clips (each a [startMs, durationMs]
  region); `play({ id })` then seeks to that region and cuts playback off at its declared duration
  instead of running into the next one. Omit `sprite` (or `id`) to play the whole file, as before.
*/
export function useSound(
  src: string,
  { volume = 1, playbackRate = 1, sprite }: UseSoundOptions = {}
): UseSoundReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volumeRef = useRef(volume);
  volumeRef.current = clamp(volume);
  // Default rate for every play() call, overridable per-call via `options.playbackRate`.
  const playbackRateRef = useRef(playbackRate);
  playbackRateRef.current = playbackRate;
  const spriteRef = useRef(sprite);
  spriteRef.current = sprite;
  // Cuts a sprite region off at its declared duration instead of playing into the next one.
  const spriteEndTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const soundContext = useContext(SoundContext);
  const soundEnabled = soundContext?.soundEnabled ?? true;

  const play = useCallback((options: PlayOptions = {}) => {
    if (typeof window === "undefined") return;
    if (!soundEnabled && !options.forceSoundEnabled) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(src);
    }

    if (spriteEndTimeoutRef.current) {
      clearTimeout(spriteEndTimeoutRef.current);
      spriteEndTimeoutRef.current = null;
    }

    const region = spriteRef.current && options.id ? spriteRef.current[options.id] : undefined;
    const [startMs, durationMs] = region ?? [0, undefined];

    audioRef.current.volume = volumeRef.current;
    audioRef.current.playbackRate = options.playbackRate ?? playbackRateRef.current;
    audioRef.current.currentTime = startMs / 1000;
    void audioRef.current.play().catch(() => {
      // Autoplay can be blocked before any user gesture; a click handler satisfies most
      // browsers' gesture requirement, so failures here are rare and safe to ignore.
    });

    if (durationMs !== undefined) {
      spriteEndTimeoutRef.current = setTimeout(() => {
        audioRef.current?.pause();
      }, durationMs / (options.playbackRate ?? playbackRateRef.current));
    }
  }, [src, soundEnabled]);

  // Setter for adjusting volume on the fly, applied immediately if the element already exists.
  const setVolume = useCallback((nextVolume: number) => {
    volumeRef.current = clamp(nextVolume);
    if (audioRef.current) {
      audioRef.current.volume = volumeRef.current;
    }
  }, []);

  // Setter for adjusting the default playback rate on the fly, applied immediately if the element already exists.
  const setPlaybackRate = useCallback((nextPlaybackRate: number) => {
    playbackRateRef.current = nextPlaybackRate;
    if (audioRef.current) {
      audioRef.current.playbackRate = nextPlaybackRate;
    }
  }, []);

  // Pauses mid-playback and rewinds — for sounds that should cut off early, e.g. a press sound on release.
  const stop = useCallback(() => {
    if (spriteEndTimeoutRef.current) {
      clearTimeout(spriteEndTimeoutRef.current);
      spriteEndTimeoutRef.current = null;
    }
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = clamp(volume);
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  return [play, setVolume, stop, setPlaybackRate];
}
