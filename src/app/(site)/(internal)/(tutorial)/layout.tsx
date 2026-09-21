"use client";

import type { JSX, ReactNode } from "react";
import ContentLayout from "@/components/ContentLayout";
import { getTutorialBySlug, getTutorialNavigation } from "@/data/tutorials";

// Segment layout for every /tutorial/<slug> page — see ContentLayout for the shared chrome (also used by /snippet/<slug>).
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
