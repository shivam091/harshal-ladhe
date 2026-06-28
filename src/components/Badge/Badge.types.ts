import type { ReactNode } from "react";

// Reusable pill badge. Renders as a link when `href` is provided, otherwise a span.
export interface BadgeProps {
  children: ReactNode;
  // When set, the badge becomes an anchor pointing here.
  href?: string;
  ariaLabel?: string;
  // Link relationship, e.g. "tag" or "category".
  rel?: string;
  // ARIA role, e.g. "listitem" when rendered inside a role="list" group.
  role?: string;
}
