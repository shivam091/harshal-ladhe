import type { Side } from "@/types/dropdown-menu";
import { ReactNode } from "react";

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

// Props for the floating panel. "auto" measures the trigger and picks the roomiest side.
export interface DropdownContentProps {
  children: ReactNode;
  side?: Side | "auto";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  className?: string;
  "aria-label"?: string;
}

// Props for a single selectable row inside the panel.
export interface DropdownItemProps {
  children: ReactNode;
  onSelect?: () => void;
  className?: string;
  disabled?: boolean;
  // Override the default "menuitem" role — e.g. "menuitemradio" for a mutually-exclusive group.
  role?: string;
  // Forwarded to the rendered element — pair with role="menuitemradio" to mark the active choice.
  "aria-checked"?: boolean;
  // When true, selecting the item does not auto-close the dropdown (calls event.preventDefault).
  preventAutoClose?: boolean;
}

// Props for a non-interactive label row used to group items.
export interface DropdownLabelProps {
  children: ReactNode;
  className?: string;
}
