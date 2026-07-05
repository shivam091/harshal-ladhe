import type { ReactNode } from "react";

// Props for the MDX-friendly Details disclosure component.
export interface DetailsProps {
  // Plain-text trigger label rendered inside the toggle button.
  summary: string;
  // Disclosure body revealed when the widget is expanded.
  children: ReactNode;
}
