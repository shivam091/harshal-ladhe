"use client";

import React, { JSX, useCallback, useEffect, useState } from "react";
import { DEFAULT_SOUND_ENABLED, SOUND_KEY } from "@/constants/sound";
import { SoundContext } from "@/interfaces/sound-context";

/*
  Provides the site-wide sound on/off preference to the tree — reads localStorage on mount
  and writes on change, mirroring ThemeProvider's persistence pattern. `useSound` reads this
  context to silence playback while muted, unless a call opts in via `forceSoundEnabled`.
*/
export function SoundProvider({ children }: { children: React.ReactNode; }): JSX.Element {
  const [soundEnabled, setSoundEnabledState] = useState(DEFAULT_SOUND_ENABLED);
  const [isMounted, setIsMounted] = useState(false);

  // Persists to localStorage, then updates state.
  const setSoundEnabled = useCallback((next: boolean) => {
    try {
      localStorage.setItem(SOUND_KEY, String(next));
    } catch {
      /* private browsing */
    }
    setSoundEnabledState(next);
  }, []);

  useEffect(() => {
    let saved = DEFAULT_SOUND_ENABLED;
    try {
      const raw = localStorage.getItem(SOUND_KEY);
      if (raw !== null) saved = raw === "true";
    } catch {
      // localStorage.getItem throws SecurityError in iOS Safari private browsing.
    }
    setSoundEnabledState(saved);
    setIsMounted(true);
  }, []);

  return (
    <>
      <SoundContext.Provider value={{ soundEnabled, isMounted, setSoundEnabled }}>
        {children}
      </SoundContext.Provider>
    </>
  );
}

SoundProvider.displayName = "SoundProvider";
