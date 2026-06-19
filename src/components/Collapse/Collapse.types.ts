import type { ReactNode } from "react";

// Render-prop trigger lets each caller pick its own icon while Collapse owns the open/pressed state.
export interface CollapseProps {
  trigger: (isOpen: boolean, isPressed: boolean) => ReactNode;
  children: ReactNode;
  // Must be unique per page since it seeds the ids that link the toggle and panel for assistive tech.
  id: string;
}
