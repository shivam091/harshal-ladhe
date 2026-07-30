"use client";

import type { JSX, ReactNode } from "react";
import { usePathname, notFound } from "next/navigation";
import PageSignOff from "@/components/SignOff/PageSignOff";
import PageNavigation from "@/components/PageNavigation";
import Categories from "@/components/Categories";
import Tags from "@/components/Tags";
import Changelog from "@/components/Changelog";
import ContentFooter from "@/components/ContentFooter";
import { PageTitle } from "@/components/PageHeading/PageHeading.styles";
import { inlineMarkdownToHtml } from "@/utils/markdown";
import { PageMetaSecondary } from "@/components/PageMeta/PageMeta.styles";
import { getSnippetBySlug, getSnippetNavigation } from "@/data/snippets";
import HitCounter from "@/components/HitCounter";
import LikeButton from "@/components/LikeButton";
import { siteConfig } from "@/config/site";
import {
  Article,
  SnippetHeader,
  SnippetExcerpt,
  SnippetContent
} from "@/app/(site)/(internal)/(snippet)/layout.styles";

/*
  Segment layout shared by every /snippet/<slug> page. Wraps each snippet's
  page.mdx body with registry-driven chrome (title, excerpt, signoff,
  categories/tags, changelog, prev/next). The slug comes from the pathname (a
  static per-folder page can't pass params to a layout); all data here is from
  the client-safe registry. The dates + read-time meta row is injected into the
  body at build by the remark-snippet-meta plugin.
*/
export default function SnippetLayout({ children }: { children: ReactNode }): JSX.Element {
  const pathname = usePathname();
  const slug = pathname.replace(/^\/snippet\//, "").replace(/\/$/, "");

  const snippet = getSnippetBySlug(slug);
  if (!snippet) notFound();

  const { previous, next } = getSnippetNavigation(slug);

  return (
    <>
      <Article aria-labelledby="page-title">
        <PageTitle id="page-title" dangerouslySetInnerHTML={{ __html: inlineMarkdownToHtml(snippet.title) }} />

        <SnippetHeader>
          {snippet.excerpt && <SnippetExcerpt>{snippet.excerpt}</SnippetExcerpt>}
        </SnippetHeader>

        <SnippetContent>{children}</SnippetContent>

        <PageSignOff />

        <PageMetaSecondary role="group" aria-label="Snippet metadata">
          <Categories categories={snippet.category} />
          <Tags tags={snippet.tags} />
        </PageMetaSecondary>

        <Changelog entries={snippet.changelog} />

        <ContentFooter title={snippet.title} contentLabel="snippet" />

        {siteConfig.hitCounter && <HitCounter />}

        <LikeButton floating />

        <PageNavigation
          ariaLabel="Snippet navigation"
          previousLabel="Previous"
          nextLabel="Next"
          previous={previous ? { href: `/snippet/${previous.slug}`, title: previous.title } : null}
          next={next ? { href: `/snippet/${next.slug}`, title: next.title } : null}
        />
      </Article>
    </>
  );
}

SnippetLayout.displayName = "SnippetLayout";
