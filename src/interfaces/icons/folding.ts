import type { SVGProps } from "react";
import type { IconToggleStatus } from "@/types/toggle-status";

// Props for IconFolding — springs the code lines' left edge and the gutter chevron's walk-in position/opacity.
export interface IconFoldingProps extends SVGProps<SVGSVGElement> {
  size?: number;
  // When true, strokes render in accentColor instead of currentColor.
  isEnabled?: boolean;
  accentColor: string;
  status?: IconToggleStatus;
}
