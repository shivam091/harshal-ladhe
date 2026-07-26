import type { IconToggleStatus } from "@/types/toggle-status";

// Props for IconFormat — animated magic-wand glyph that bursts sparkles whenever a format action fires.
export interface IconFormatProps {
  size?: number;
  status?: IconToggleStatus;
  // True for a brief pulse right after a format action fires — spawns one sparkle burst per pulse.
  isFormatting?: boolean;
  // Sparkle stroke colour; defaults to currentColor.
  accentColor?: string;
}
