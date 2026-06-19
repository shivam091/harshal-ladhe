import { ReactNode } from "react";

// Render-prop trigger receives open/pressed state so the caller can drive icon appearance.
export interface CollapseProps {
  trigger: (isOpen: boolean, isPressed: boolean) => ReactNode;
  children: ReactNode;
  // Unique id used to wire aria-controls / aria-labelledby between toggle and panel.
  id: string;
}
