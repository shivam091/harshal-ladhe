import type { IconToggleStatus } from "@/types/toggle-status";

// Props for IconRefresh — refresh glyph that spins 180° per click.
export interface IconRefreshProps {
  size?: number;
  status?: IconToggleStatus;
  // Cumulative rotation target in degrees — the caller increments this by 180 on each click.
  rotation: number;
}
