import type { IconToggleStatus } from "@/types/toggle-status";

// Props for IconSkipBack — skip-back glyph that kicks further back whenever a reset action fires.
export interface IconSkipBackProps {
  size?: number;
  status?: IconToggleStatus;
  // True for the entire click-and-hold gesture (from press to release/reset) — creeps the triangle back over the hold's duration rather than snapping it.
  isHolding?: boolean;
  // True for a brief pulse right after a reset action fires — holds the triangle further back under a heavier spring.
  isResetting?: boolean;
}
