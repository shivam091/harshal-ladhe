import { SVGProps } from "react";
import type { IconToggleStatus } from "@/types/toggle-status";

// Props for IconFolding — spring-morphs between the fold gutter's own expanded/collapsed chevron shapes.
export interface IconFoldingProps extends SVGProps<SVGSVGElement> {
  size?: number;
  // When true, strokes render in accentColor instead of currentColor.
  isEnabled?: boolean;
  accentColor: string;
  status?: IconToggleStatus;
}
