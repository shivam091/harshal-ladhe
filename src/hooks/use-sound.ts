"use client";

import { useCallback, useContext, useEffect, useRef, useState } from "react";
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
  // Selects a region from the hook's `sprite` map. Required when `sprite` is given, ignored otherwise.
  id?: string;
  // Plays even while the site-wide sound preference is off — for the mute toggle's own click feedback.
  forceSoundEnabled?: boolean;
  // Overrides this call's playback speed multiplier, otherwise falling back to the hook's own `playbackRate` option.
  playbackRate?: number;
}

export type PlayFunction = (options?: PlayOptions) => void;

export type UseSoundReturn = [
  PlayFunction,
  {
    // Pauses mid-playback and rewinds — for a sound that should cut off early, e.g. a press sound on release.
    stop: () => void;
    pause: () => void;
    // In ms, once the file's metadata has loaded.
    duration: number | null;
  }
];

/*
  Preloads `src` once and returns a [play, { stop, pause, duration }] pair — a minimal stand-in for
  the `use-sound` library's basic API, backed by a plain `HTMLAudioElement` rather than a Howler
  dependency, since nothing here needs Howler's codec fallbacks or audio pooling. The element itself
  lives in a ref, never read during render, so it's only ever touched from effects/callbacks.
  Playback is silenced while the site-wide sound preference (SoundContext) is off, unless the caller
  passes `{ forceSoundEnabled: true }`. Falls back to enabled when no SoundProvider is mounted above,
  so this hook works standalone.

  Pass `sprite` to treat `src` as one file holding multiple clips (each a [startMs, durationMs]
  region); `play({ id })` then seeks to that region and cuts playback off at its declared duration
  (via a timer, since `HTMLAudioElement` has no native sprite support) instead of running into the
  next one. Omit `sprite` (or `id`) to play the whole file, as before.
*/
export function useSound(src: string, { volume = 1, playbackRate = 1, sprite }: UseSoundOptions = {}): UseSoundReturn {
  const soundContext = useContext(SoundContext);
  const soundEnabled = soundContext?.soundEnabled ?? true;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Cuts a sprite region off at its declared duration instead of playing into the next one.
  const spriteEndTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    const element = new Audio(src);
    audioRef.current = element;

    function handleLoadedMetadata() {
      setDuration(element.duration * 1000);
    }
    element.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      element.removeEventListener("loadedmetadata", handleLoadedMetadata);
      element.pause();
      audioRef.current = null;
      if (spriteEndTimeoutRef.current) clearTimeout(spriteEndTimeoutRef.current);
    };
  }, [src]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = clamp(volume);
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  const play = useCallback<PlayFunction>((options = {}) => {
    const audio = audioRef.current;
    if (!audio || (!soundEnabled && !options.forceSoundEnabled)) return;

    if (spriteEndTimeoutRef.current) {
      clearTimeout(spriteEndTimeoutRef.current);
      spriteEndTimeoutRef.current = null;
    }

    const region = sprite && options.id ? sprite[options.id] : undefined;
    const [startMs, regionDurationMs] = region ?? [0, undefined];
    const rate = options.playbackRate ?? playbackRate;

    audio.volume = clamp(volume);
    audio.playbackRate = rate;
    audio.currentTime = startMs / 1000;
    void audio.play().catch(() => {
      // Autoplay can be blocked before any user gesture; a click handler satisfies most
      // browsers' gesture requirement, so failures here are rare and safe to ignore.
    });

    if (regionDurationMs !== undefined) {
      spriteEndTimeoutRef.current = setTimeout(() => {
        audioRef.current?.pause();
      }, regionDurationMs / rate);
    }
  }, [soundEnabled, sprite, volume, playbackRate]);

  const stop = useCallback(() => {
    if (spriteEndTimeoutRef.current) {
      clearTimeout(spriteEndTimeoutRef.current);
      spriteEndTimeoutRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  return [play, { stop, pause, duration }];
}
