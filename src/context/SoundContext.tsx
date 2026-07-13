"use client";

import type { JSX} from "react";
import React, { createContext, useCallback, useEffect, useState } from "react";
import { DEFAULT_SOUND_ENABLED, SOUND_KEY } from "@/constants/sound";

// Shape of the value exposed by SoundContext — global mute flag, mount flag, and setter.
export interface SoundContextType {
  soundEnabled: boolean;
  // False on the server and before the first useEffect fires; guards hydration-sensitive renders.
  isMounted: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

// Undefined default so a missing provider is detectable instead of silently faking a preference.
export const SoundContext = createContext<SoundContextType | undefined>(undefined);

/*
  Restores the saved preference only after mount to avoid a hydration mismatch; playback that
  must always be heard can still opt out of the mute.
*/
export function SoundProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [soundEnabled, setSoundEnabledState] = useState(DEFAULT_SOUND_ENABLED);
  const [isMounted, setIsMounted] = useState(false);

  // Persisted so the choice survives reloads.
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
