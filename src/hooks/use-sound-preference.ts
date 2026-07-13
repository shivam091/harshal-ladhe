import { useContext } from "react";
import { SoundContext, SoundContextType } from "@/interfaces/sound-context";

// Typed SoundContext accessor — throws if called outside a SoundProvider.
export function useSoundPreference(): SoundContextType {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSoundPreference must be used within SoundProvider");
  return ctx;
}
