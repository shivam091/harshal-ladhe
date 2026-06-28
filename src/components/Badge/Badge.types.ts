import type { ReactNode } from "react";

// `href` is optional so the same badge works as a static label or a link.
export interface BadgeProps {
  children: ReactNode;
  href?: string;
  ariaLabel?: string;
  // Lets crawlers read the link's meaning, e.g. rel="tag" for tag archives.
  rel?: string;
  // Needed inside a role="list" group, which only allows listitem children.
  role?: string;
}
