import type { SVGProps } from "react";
import type { IconToggleStatus } from "@/types/toggle-status";

// Props for IconIndentGuides — static glyph with an isEnabled accent + boop pop, no shape morph.
export interface IconIndentGuidesProps extends SVGProps<SVGSVGElement> {
  size?: number;
  // When true, strokes render in accentColor instead of currentColor.
  isEnabled?: boolean;
  accentColor: string;
  status?: IconToggleStatus;
}
