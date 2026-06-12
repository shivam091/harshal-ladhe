import type { ReactNode } from "react";

// Route and close handling come from the header so the drawer stays in sync with its toggle's state and closing animation.
export interface HeaderDrawerProps {
  id: string;
  pathname: string;
  onClose: () => void;
}

// Optional children keep the scene reusable as a purely decorative backdrop.
export interface SkyVisualProps {
  children?: ReactNode;
}
