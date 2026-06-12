import type { ElementType } from "react";

// Takes the Arrow primitive as a prop so one tip works across different Radix overlays.
export interface TipProps {
  arrow: ElementType;
  isOpen: boolean;
}
