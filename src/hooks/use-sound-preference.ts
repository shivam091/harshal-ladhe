import { useContext } from "react";
import type { SoundContextType } from "@/context/SoundContext";
import { SoundContext } from "@/context/SoundContext";

// Typed SoundContext accessor — throws if called outside a SoundProvider.
export function useSoundPreference(): SoundContextType {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSoundPreference must be used within SoundProvider");
  return ctx;
}
