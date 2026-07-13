import { useContext } from "react";
import type { SoundContextType } from "@/context/SoundContext";
import { SoundContext } from "@/context/SoundContext";

// Throws outside a provider so a misplaced consumer fails in development instead of misbehaving silently.
export function useSoundPreference(): SoundContextType {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSoundPreference must be used within SoundProvider");
  return ctx;
}
