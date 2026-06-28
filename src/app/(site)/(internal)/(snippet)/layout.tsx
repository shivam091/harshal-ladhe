"use client";

import type { JSX, ReactNode } from "react";
import ContentLayout from "@/components/ContentLayout";
import { getSnippetBySlug, getSnippetNavigation } from "@/data/snippets";

// Binds the shared content chrome to the snippet registry so snippet pages need no layout code of their own.
export default function SnippetLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <>
      <ContentLayout
        routeSegment="snippet"
        label="Snippet"
        getBySlug={getSnippetBySlug}
        getNavigation={getSnippetNavigation}
      >
        {children}
      </ContentLayout>
    </>
  );
}

SnippetLayout.displayName = "SnippetLayout";
