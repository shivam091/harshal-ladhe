import type { IconHamburgerStatus } from "@/types/icon";

// Parent passes iconStatus (derived from isPressed + drawerOpen) and isOpen (controls scale); boop is owned internally.
export interface IconHamburgerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // Derived by the parent from its isPressed + drawerOpen state
  iconStatus: IconHamburgerStatus;
  // Controls the scale(1.5) wrapper — true when drawer is open
  isOpen: boolean;
  size?: number;
}
