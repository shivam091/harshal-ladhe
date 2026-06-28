import type { ReactNode } from "react";
import type { ContentEntry, ContentNavigation } from "@/data/content";

// Parameterised by route segment and registry so every content type can share one layout.
export interface ContentLayoutProps {
  children: ReactNode;
  // Must match the route folder name, since the slug is parsed off the pathname with it.
  routeSegment: string;
  // Capitalised display form, kept apart from routeSegment for aria-labels.
  label: string;
  getBySlug: (slug: string) => ContentEntry | undefined;
  getNavigation: (slug: string) => ContentNavigation;
}
