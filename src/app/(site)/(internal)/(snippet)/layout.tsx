"use client";

import type { JSX, ReactNode } from "react";
import ContentLayout from "@/components/ContentLayout";
import { snippets, getSnippetBySlug, getSnippetNavigation } from "@/data/snippets";
import { getRelatedEntries } from "@/lib/related-posts";

// Binds the shared content chrome to the snippet registry so snippet pages need no layout code of their own.
export default function SnippetLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <>
      <ContentLayout
        routeSegment="snippet"
        label="Snippet"
        getBySlug={getSnippetBySlug}
        getNavigation={getSnippetNavigation}
        getRelated={(slug) => getRelatedEntries(slug, snippets)}
      >
        {children}
      </ContentLayout>
    </>
  );
}

SnippetLayout.displayName = "SnippetLayout";
