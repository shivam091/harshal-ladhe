import type { ReactNode } from "react";

// id ties aria-controls on the hamburger to this dialog; pathname drives active-link highlighting; onClose triggers the closing animation.
export interface HeaderDrawerProps {
  id: string;
  pathname: string;
  onClose: () => void;
}

// Accepts optional overlay content (e.g. quick-link list) rendered above the scene.
export interface SkyVisualProps {
  children?: ReactNode;
}
