import type { ReactNode } from "react";

// Which edge of the trigger the panel opens from.
export type Side = "top" | "right" | "bottom" | "left";

// One shared value so open state and the measured side stay in sync without prop-drilling.
export type DropdownCtxType = { isOpen: boolean; autoSide: Side };

// modal is opt-in so the page behind stays scrollable and interactive while the menu is open.
export interface DropdownMenuProps {
  children: ReactNode;
  modal?: boolean;
}

// Takes any button as children so each menu keeps its own trigger styling.
export interface DropdownTriggerProps {
  children: ReactNode;
  className?: string;
}
