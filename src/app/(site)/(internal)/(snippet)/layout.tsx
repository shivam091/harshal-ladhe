"use client";

import type { JSX, ReactNode } from "react";
import ContentLayout from "@/components/ContentLayout";
import { getSnippetBySlug, getSnippetNavigation } from "@/data/snippets";

// Segment layout for every /snippet/<slug> page — see ContentLayout for the shared chrome (also used by /tutorial/<slug>).
export default function SnippetLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <ContentLayout
      routeSegment="snippet"
      label="Snippet"
      getBySlug={getSnippetBySlug}
      getNavigation={getSnippetNavigation}
    >
      {children}
    </ContentLayout>
  );
}

SnippetLayout.displayName = "SnippetLayout";
