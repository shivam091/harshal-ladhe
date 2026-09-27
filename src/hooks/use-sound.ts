"use client";

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import type { Howl, HowlOptions } from "howler";
import { SoundContext } from "@/context/SoundContext";
import { useOnMount } from "@/hooks/use-on-mount";
import { clamp } from "@/utils/number";

// A sprite map: each entry is [startMs, durationMs], or [startMs, durationMs, loop].
export type SpriteMap = Record<string, [number, number] | [number, number, boolean]>;

// Options accepted by `useSound`, layered over whatever Howl itself accepts (besides `src`/`onload`).
export interface UseSoundOptions extends Omit<HowlOptions, "src" | "volume" | "rate" | "sprite" | "onload"> {
  volume?: number;
  // Default playback speed multiplier (1 = normal) — also shifts pitch. Overridable per-call via `PlayOptions`.
  playbackRate?: number;
  // When set, `src` is treated as a single file containing multiple clips; `play({ id })` selects one.
  sprite?: SpriteMap;
  // Stops any sound already playing on this Howl instance before starting the next `play()` call.
  interrupt?: boolean;
  // Site-wide mute (SoundContext) is the real default; pass this to override it for one hook instance.
  soundEnabled?: boolean;
  onload?: (this: Howl) => void;
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
    sound: Howl | null;
    // `id` here is a sound instance id (returned by `play()`), not a sprite name — omit it to affect every instance.
    stop: (id?: number) => void;
    pause: (id?: number) => void;
    duration: number | null;
  }
];

/*
  Loads `src` into a Howler `Howl` instance (lazy-imported, since sounds can't play before a user
  gesture anyway) and returns a [play, { sound, stop, pause, duration }] pair. `sprite` turns `src`
  into a single file holding multiple named clips — `play({ id })` seeks and plays just that region,
  letting Howler (not manual timers) handle the cutoff. Playback is silenced while the site-wide
  sound preference (SoundContext) is off, unless the caller passes `{ forceSoundEnabled: true }`.
  Falls back to enabled when no SoundProvider is mounted above, so this hook works standalone.
*/
export function useSound(src: string | string[], options: UseSoundOptions = {}): UseSoundReturn {
  const soundContext = useContext(SoundContext);
  const contextSoundEnabled = soundContext?.soundEnabled ?? true;

  const {
    volume = 1,
    playbackRate = 1,
    sprite,
    interrupt = false,
    soundEnabled = contextSoundEnabled,
    onload,
    ...delegated
  } = options;

  const HowlConstructor = useRef<typeof Howl | null>(null);
  const isMounted = useRef(false);

  const [duration, setDuration] = useState<number | null>(null);
  const [sound, setSound] = useState<Howl | null>(null);

  function handleLoad(this: Howl) {
    onload?.call(this);
    if (isMounted.current) setDuration(this.duration() * 1000);
    setSound(this);
  }

  // Howler can't run during SSR, and sounds can't play before a user gesture anyway — so the
  // constructor itself is lazy-imported, rather than pulled in eagerly for every page.
  useOnMount(() => {
    import("howler").then(mod => {
      if (isMounted.current) return;

      HowlConstructor.current = mod.Howl;
      isMounted.current = true;

      new HowlConstructor.current({
        ...delegated,
        src: Array.isArray(src) ? src : [src],
        volume: clamp(volume),
        rate: playbackRate,
        sprite,
        onload: handleLoad
      });
    });

    return () => {
      isMounted.current = false;
    };
  });

  /*
    Howler exposes no way to tweak an existing Howl's `src`/`sprite`, so a change to either means
    tearing down and recreating the instance. Intentionally excludes every other option (volume,
    playbackRate, ...) — those are applied to the existing instance by the effect below instead.
  */
  useEffect(() => {
    if (HowlConstructor.current && sound) {
      sound.unload();
      setSound(
        new HowlConstructor.current({
          ...delegated,
          src: Array.isArray(src) ? src : [src],
          volume: clamp(volume),
          rate: playbackRate,
          sprite,
          onload: handleLoad
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only `src`/`sprite` should recreate the Howl
  }, [Array.isArray(src) ? src.join(",") : src, JSON.stringify(sprite)]);

  // Unloads the Howl instance (frees its underlying Web Audio/HTML5 audio node) on unmount.
  useEffect(() => {
    return () => {
      sound?.unload();
    };
  }, [sound]);

  useEffect(() => {
    sound?.volume(clamp(volume));
  }, [sound, volume]);

  useEffect(() => {
    // Howler throws when rate() is called on an instance with a sprite map defined — see
    // https://github.com/goldfire/howler.js/issues/1279. Per-call playbackRate (via PlayOptions)
    // still works, since sound.rate(rate, id) below scopes the change to a single active sound id.
    if (sound && !sprite) sound.rate(playbackRate);
  }, [sound, playbackRate, sprite]);

  const play = useCallback<PlayFunction>((playOptions = {}) => {
    if (!sound || (!soundEnabled && !playOptions.forceSoundEnabled)) return;

    if (interrupt) sound.stop();

    const soundId = sound.play(playOptions.id);
    if (playOptions.playbackRate) sound.rate(playOptions.playbackRate, soundId);
  }, [sound, soundEnabled, interrupt]);

  const stop = useCallback((id?: number) => {
    sound?.stop(id);
  }, [sound]);

  const pause = useCallback((id?: number) => {
    sound?.pause(id);
  }, [sound]);

  return [play, { sound, stop, pause, duration }];
}
