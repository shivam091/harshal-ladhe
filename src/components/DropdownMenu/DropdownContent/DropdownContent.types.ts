import type { ReactNode } from "react";
import type { Side } from "@/components/DropdownMenu/DropdownMenu.types";

// Props for the floating panel. "auto" measures the trigger and picks the roomiest side.
export interface DropdownContentProps {
  children: ReactNode;
  side?: Side | "auto";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  className?: string;
  "aria-label"?: string;
}
