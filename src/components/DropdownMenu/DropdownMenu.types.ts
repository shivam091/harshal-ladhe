import type { ReactNode } from "react";

// Which edge of the trigger the panel opens from.
export type Side = "top" | "right" | "bottom" | "left";

// Shared between Root, Tip, and Content so they stay in sync without prop-drilling.
export type DropdownCtxType = { isOpen: boolean; autoSide: Side };

// Props for the root wrapper that owns open state.
export interface DropdownMenuProps {
  children: ReactNode;
  modal?: boolean;
}

// Props for the trigger slot — wraps any button via Radix asChild.
export interface DropdownTriggerProps {
  children: ReactNode;
  className?: string;
}
