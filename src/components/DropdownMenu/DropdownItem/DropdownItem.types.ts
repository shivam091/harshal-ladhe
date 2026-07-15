import type { ReactNode } from "react";

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
  // Forwarded to the rendered element — lets a per-item icon boop on hover/keyboard focus.
  onPointerEnter?: () => void;
  onFocus?: () => void;
}
