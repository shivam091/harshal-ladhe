import type { SVGProps } from "react";
import type { IconToggleStatus } from "@/types/toggle-status";

// Props for IconHash — spring-morphs between a "#" (on) and a collapsed "+" (off) shape.
export interface IconHashProps extends SVGProps<SVGSVGElement> {
  size?: number;
  // When true, strokes render in accentColor instead of currentColor.
  isEnabled?: boolean;
  accentColor: string;
  status?: IconToggleStatus;
}
