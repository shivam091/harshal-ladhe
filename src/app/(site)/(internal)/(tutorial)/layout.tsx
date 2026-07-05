"use client";

import type { JSX, ReactNode } from "react";
import ContentLayout from "@/components/ContentLayout";
import { tutorials, getTutorialBySlug, getTutorialNavigation } from "@/data/tutorials";
import { getRelatedEntries } from "@/lib/related-posts";

// Binds the shared content chrome to the tutorial registry so tutorial pages need no layout code of their own.
export default function TutorialLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <ContentLayout
      routeSegment="tutorial"
      label="Tutorial"
      getBySlug={getTutorialBySlug}
      getNavigation={getTutorialNavigation}
      getRelated={(slug) => getRelatedEntries(slug, tutorials)}
    >
      {children}
    </ContentLayout>
  );
}

TutorialLayout.displayName = "TutorialLayout";
