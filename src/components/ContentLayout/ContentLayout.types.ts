import type { ReactNode } from "react";
import type { ContentEntry, ContentNavigation } from "@/data/content";

/*
  Props for ContentLayout — the chrome shared by every /snippet/<slug> and
  /tutorial/<slug> page (see @/data/content for why the underlying registry
  shape is shared too).
*/
export interface ContentLayoutProps {
  children: ReactNode;
  // URL segment ("snippet" | "tutorial") — drives slug parsing from the pathname, prev/next hrefs, and ContentFooter's copyright/share copy.
  routeSegment: string;
  // Human-readable label ("Snippet" | "Tutorial") — drives aria-labels.
  label: string;
  getBySlug: (slug: string) => ContentEntry | undefined;
  getNavigation: (slug: string) => ContentNavigation;
}
