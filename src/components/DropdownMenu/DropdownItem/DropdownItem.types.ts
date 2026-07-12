import type { ReactNode } from "react";

// Exposes only the Radix item behaviour menus actually need, keeping callers decoupled from Radix.
export interface DropdownItemProps {
  children: ReactNode;
  onSelect?: () => void;
  className?: string;
  disabled?: boolean;
  // Lets a row join a mutually-exclusive group, which the default "menuitem" role can't express.
  role?: string;
  // Lets assistive tech announce which choice in a radio-style group is active.
  "aria-checked"?: boolean;
  // Keeps the menu open for toggle-style items that may be changed several times in a row.
  preventAutoClose?: boolean;
  // Lets a per-item icon react to keyboard focus as well as hover.
  onPointerEnter?: () => void;
  onFocus?: () => void;
}
