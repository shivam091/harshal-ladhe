import type { ReactNode } from "react";

// Minimal props because a label has no interaction to configure.
export interface DropdownLabelProps {
  children: ReactNode;
  className?: string;
}
