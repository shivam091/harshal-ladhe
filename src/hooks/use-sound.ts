"use client";

import { useCallback, useContext, useEffect, useRef } from "react";
import { SoundContext } from "@/interfaces/sound-context";
import { clamp } from "@/utils/number";
import type { PlayOptions, UseSoundOptions } from "@/interfaces/icons/speaker";

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
*/
export function useSound(src: string, { volume = 1, playbackRate = 1 }: UseSoundOptions = {}): UseSoundReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volumeRef = useRef(volume);
  volumeRef.current = clamp(volume);
  // Default rate for every play() call, overridable per-call via `options.playbackRate`.
  const playbackRateRef = useRef(playbackRate);
  playbackRateRef.current = playbackRate;

  const soundContext = useContext(SoundContext);
  const soundEnabled = soundContext?.soundEnabled ?? true;

  const play = useCallback((options: PlayOptions = {}) => {
    if (typeof window === "undefined") return;
    if (!soundEnabled && !options.forceSoundEnabled) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(src);
    }

    audioRef.current.volume = volumeRef.current;
    audioRef.current.playbackRate = options.playbackRate ?? playbackRateRef.current;
    audioRef.current.currentTime = 0;
    void audioRef.current.play().catch(() => {
      // Autoplay can be blocked before any user gesture; a click handler satisfies most
      // browsers' gesture requirement, so failures here are rare and safe to ignore.
    });
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
