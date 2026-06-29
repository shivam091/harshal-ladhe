"use client";

import type { JSX, ReactNode } from "react";
import ContentLayout from "@/components/ContentLayout";
import { getTutorialBySlug, getTutorialNavigation } from "@/data/tutorials";

// Binds the shared content chrome to the tutorial registry so tutorial pages need no layout code of their own.
export default function TutorialLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <ContentLayout
      routeSegment="tutorial"
      label="Tutorial"
      getBySlug={getTutorialBySlug}
      getNavigation={getTutorialNavigation}
    >
      {children}
    </ContentLayout>
  );
}

TutorialLayout.displayName = "TutorialLayout";
