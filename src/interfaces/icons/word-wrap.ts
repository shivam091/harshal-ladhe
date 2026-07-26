import type { SVGProps } from "react";
import type { IconToggleStatus } from "@/types/toggle-status";

// Props for IconWordWrap — spring-morphs between the centered no-wrap lines and the raised lines + drawn-in wrap arrow.
export interface IconWordWrapProps extends SVGProps<SVGSVGElement> {
  size?: number;
  // When true, strokes render in accentColor instead of currentColor.
  isEnabled?: boolean;
  accentColor: string;
  status?: IconToggleStatus;
}
