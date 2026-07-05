import type { ReactNode } from "react";

// Props for the MDX-friendly Details disclosure component.
export interface DetailsProps {
  // Plain text so the trigger label stays a clean accessible name.
  summary: string;
  // Disclosure body revealed when the widget is expanded.
  children: ReactNode;
}
