import type { IconToggleStatus } from "@/types/toggle-status";

// Props for IconDiffGutter — springs its two colored marker bars in/out as isEnabled toggles.
export interface IconDiffGutterProps {
  size?: number;
  // When true, the gutter's own divider/code-line strokes render in accentColor instead of currentColor.
  isEnabled?: boolean;
  accentColor: string;
  status?: IconToggleStatus;
}
