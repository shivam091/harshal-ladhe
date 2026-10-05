"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useIsClient } from "@/hooks/use-is-client";
import { useRequestAnimationFrameLoop } from "@/hooks/use-request-animation-frame-loop";
import { decomposeTransform } from "@/utils/keyframes-builder";
import type { KeyframesAnimationSettings, KeyframesPlayback, PlayheadReadout, PlayheadSnapshot } from "@/components/KeyframesBuilder/KeyframesBuilder.types";

// Just under one full iteration — seeking to exactly 100% would land on the next iteration's 0% (or, for a single run without `forwards`, past the end where the element snaps back to its resting style).
const MAX_SEEK_FRACTION = 0.99999;

// Whether two readouts would look the same on screen — rounding first so sub-pixel float jitter in a paused element's computed style doesn't wake subscribers every frame.
function sameReadout(a: PlayheadReadout | null, b: PlayheadReadout | null): boolean {
  if (!a || !b) return a === b;
  return (
    Math.round(a.translateX) === Math.round(b.translateX) &&
    Math.round(a.translateY) === Math.round(b.translateY) &&
    Math.round(a.rotate) === Math.round(b.rotate) &&
    Math.round(a.scale * 100) === Math.round(b.scale * 100) &&
    Math.round(a.opacity * 100) === Math.round(b.opacity * 100) &&
    Math.round(a.borderRadius) === Math.round(b.borderRadius) &&
    a.backgroundColor === b.backgroundColor
  );
}

// Reads the element's live computed style back into the sheet's own channels — the browser's real interpolated values, not a JS re-implementation of them.
function readComputed(element: HTMLElement): PlayheadReadout {
  const computed = window.getComputedStyle(element);
  return {
    ...decomposeTransform(computed.transform),
    opacity: Number.parseFloat(computed.opacity) || 0,
    borderRadius: Number.parseFloat(computed.borderTopLeftRadius) || 0,
    backgroundColor: computed.backgroundColor
  };
}

/*
  A minimal external store for the playhead — held in a closure rather than React state, so the
  per-frame updates reach only the playhead's own useSyncExternalStore subscribers (the scrubber,
  the playhead line, the readout) instead of re-rendering the whole builder 60 times a second.
*/
function createPlayheadStore() {
  let snapshot: PlayheadSnapshot = { progress: 0, readout: null };
  const listeners = new Set<() => void>();
  return {
    getSnapshot: () => snapshot,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    set: (progress: number, readout: PlayheadReadout | null) => {
      if (Math.abs(progress - snapshot.progress) < 0.05 && sameReadout(readout, snapshot.readout)) return;
      snapshot = { progress, readout };
      listeners.forEach((listener) => listener());
    }
  };
}

/*
  Drives the preview through the Web Animations API handle the browser creates for the element's
  real CSS animation, rather than re-implementing playback in JS — so what plays is exactly what the
  exported CSS will do. Play/pause/seek go through Animation.play()/pause()/currentTime, which (unlike
  toggling animation-play-state) also lets the scrubber park on any moment. Under
  prefers-reduced-motion the preview starts paused, but stays fully playable on request.
*/
export function useKeyframesPlayback(settings: KeyframesAnimationSettings): KeyframesPlayback {
  // The preview element, held in state via a callback ref (not a ref object) — the playback object is passed through render, and a ref object inside it would make every reader of it a "ref read during render".
  const [target, setTarget] = useState<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isClient = useIsClient();
  // null until the user presses play/pause — the default then follows the reduced-motion preference, which is only trusted once hydrated so the first client render matches the server's.
  const [userPlaying, setUserPlaying] = useState<boolean | null>(null);
  const isPlaying = userPlaying ?? !(isClient && prefersReducedMotion);
  const [store] = useState(createPlayheadStore);

  // Ref mirror of the settings so seek() can read the current duration/delay/direction without being re-created (and re-subscribed) on every settings edit.
  const settingsRef = useRef(settings);
  useEffect(() => {
    settingsRef.current = settings;
  });

  // The element's CSS animation, looked up fresh each time — the browser owns its lifetime, so a cached handle could outlive the animation it pointed at.
  const getAnimation = useCallback((): Animation | null => target?.getAnimations()[0] ?? null, [target]);

  // Syncs the real animation to the play/pause intent. Once pause()/play() has been called, the browser ignores animation-play-state for it, so this is the single source of truth from then on.
  useEffect(() => {
    const animation = getAnimation();
    if (!animation) return;
    if (isPlaying) animation.play();
    else animation.pause();
  }, [isPlaying, getAnimation]);

  // Polls the live animation each frame for the playhead and readout. A finite animation that runs out flips the transport back to "paused" so the button offers Play again.
  const tick = useCallback(() => {
    if (!target) return;
    const animation = getAnimation();
    let progress = store.getSnapshot().progress;
    if (animation) {
      const timing = animation.effect?.getComputedTiming();
      if (timing && typeof timing.progress === "number") progress = timing.progress * 100;
      // Still inside the delay (no fill to report a progress) — park the playhead at the start rather than wherever the previous run left it.
      else if (Number(animation.currentTime ?? 0) < settingsRef.current.delayMs) progress = 0;
      if (animation.playState === "finished") setUserPlaying(false);
    }
    store.set(progress, readComputed(target));
  }, [target, getAnimation, store]);

  useRequestAnimationFrameLoop(tick, true);

  // Drives the animation directly in the click handler as well as through state — otherwise a frame could tick between the click and the sync effect, see a finished animation, and flip the intent straight back to paused.
  const toggle = useCallback(() => {
    const next = !isPlaying;
    const animation = getAnimation();
    if (animation) {
      if (next) animation.play();
      else animation.pause();
    }
    setUserPlaying(next);
  }, [isPlaying, getAnimation]);

  // Rewinds to the very start (delay included) and plays, whatever state the animation was left in.
  const restart = useCallback(() => {
    const animation = getAnimation();
    if (animation) {
      animation.currentTime = 0;
      animation.play();
    }
    setUserPlaying(true);
  }, [getAnimation]);

  /*
    Maps a keyframe offset to a time within the FIRST iteration and parks the animation there. For
    `reverse`/`alternate-reverse` the first iteration runs 100% → 0%, so the offset is mirrored to
    land on the requested keyframe position rather than its opposite.
  */
  const seek = useCallback(
    (percent: number) => {
      const { durationMs, delayMs, direction } = settingsRef.current;
      const fraction = Math.min(Math.max(percent / 100, 0), MAX_SEEK_FRACTION);
      const directed = direction === "reverse" || direction === "alternate-reverse" ? MAX_SEEK_FRACTION - fraction : fraction;
      const animation = getAnimation();
      if (animation) {
        animation.pause();
        animation.currentTime = delayMs + directed * durationMs;
      }
      setUserPlaying(false);
      if (target) store.set(percent, readComputed(target));
    },
    [target, getAnimation, store]
  );

  return useMemo(
    () => ({ setTarget, isPlaying, toggle, restart, seek, subscribe: store.subscribe, getSnapshot: store.getSnapshot }),
    [isPlaying, toggle, restart, seek, store]
  );
}
