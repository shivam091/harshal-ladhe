import type { ReactNode } from "react";

// Mirrors native <details>/<summary> so MDX authors can write a disclosure the familiar way.
export interface DetailsProps {
  // Plain text so the trigger label stays a clean accessible name.
  summary: string;
  // Disclosure body revealed when the widget is expanded.
  children: ReactNode;
}
