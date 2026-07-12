import type { ReactNode } from "react";
import type { Side } from "@/components/DropdownMenu/DropdownMenu.types";

// "auto" lets the panel pick the roomiest side so it isn't clipped near viewport edges.
export interface DropdownContentProps {
  children: ReactNode;
  side?: Side | "auto";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  className?: string;
  "aria-label"?: string;
}
