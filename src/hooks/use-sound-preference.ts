import { useContext } from "react";
import type { SoundContextType } from "@/interfaces/sound-context";
import { SoundContext } from "@/interfaces/sound-context";

// Typed SoundContext accessor — throws if called outside a SoundProvider.
export function useSoundPreference(): SoundContextType {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSoundPreference must be used within SoundProvider");
  return ctx;
}
