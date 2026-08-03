"use client";

import type { JSX } from "react";
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
import HitCounter from "@/components/HitCounter";
import LikeButton from "@/components/LikeButton";
import ArticleEndMarker from "@/components/ArticleEndMarker";
import NewsletterCallout from "@/components/NewsletterCallout";
import IconExternalLink from "@/icons/IconExternalLink";
import { useToggleIconStatus } from "@/hooks/use-toggle-icon-status";
import { siteConfig } from "@/config/site";
import TableOfContents from "@/components/TableOfContents";
import RelatedContent from "@/components/RelatedContent";
import { getPublishedDate } from "@/lib/related-posts";
import type { ContentLayoutProps } from "@/components/ContentLayout/ContentLayout.types";
import {
  Article,
  ContentHeader,
  ContentExcerpt,
  ContentCtaLink,
  ContentGrid,
  ContentBody,
  ContentTOC
} from "@/components/ContentLayout/ContentLayout.styles";

/*
  Reads the slug from the pathname because a static per-folder page can't pass params
  to its layout; data comes from the client-safe registry since this renders on the client.
*/
export default function ContentLayout({
  children,
  routeSegment,
  label,
  getBySlug,
  getNavigation,
  getRelated
}: ContentLayoutProps): JSX.Element {
  const pathname = usePathname();
  const slug = pathname.replace(new RegExp(`^/${routeSegment}/`), "").replace(/\/$/, "");

  const entry = getBySlug(slug);
  if (!entry) notFound();

  const { previous, next } = getNavigation(slug);
  const { status, onPointerEnter, onPointerLeave, onPointerDown, onPointerUp } = useToggleIconStatus();

  return (
    <>
      <Article aria-labelledby="page-title">
        <PageTitle id="page-title" dangerouslySetInnerHTML={{ __html: inlineMarkdownToHtml(entry.title) }} />

        <ContentHeader>
          {entry.excerpt && <ContentExcerpt>{entry.excerpt}</ContentExcerpt>}
          {entry.link && (
            <ContentCtaLink
              href={entry.link.href}
              onPointerEnter={onPointerEnter}
              onPointerLeave={onPointerLeave}
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
            >
              {entry.link.label}
              <IconExternalLink size={14} status={status} />
            </ContentCtaLink>
          )}
        </ContentHeader>

        {/* The id is what the table of contents scans for headings, shared with the post layout. */}
        <ContentGrid>
          <ContentBody id="post-content">{children}</ContentBody>
          <ContentTOC>
            <TableOfContents />
          </ContentTOC>
        </ContentGrid>

        <ArticleEndMarker />

        <PageSignOff />

        <NewsletterCallout source="article_end" />

        <PageMetaSecondary role="group" aria-label={`${label} metadata`}>
          <Categories categories={entry.category} link />
          <Tags tags={entry.tags} link />
        </PageMetaSecondary>

        <Changelog entries={entry.changelog} />

        <ContentFooter title={entry.title} contentLabel={routeSegment} />

        {siteConfig.hitCounter && <HitCounter />}

        <LikeButton floating />

        <PageNavigation
          ariaLabel={`${label} navigation`}
          previousLabel="Previous"
          nextLabel="Next"
          previous={previous ? { href: `/${routeSegment}/${previous.slug}`, title: previous.title } : null}
          next={next ? { href: `/${routeSegment}/${next.slug}`, title: next.title } : null}
        />
      </Article>

      <RelatedContent
        label={`${label}s`}
        itemLabel={routeSegment}
        items={getRelated(slug).map((related) => ({
          slug: related.slug,
          href: `/${routeSegment}/${related.slug}`,
          title: related.title,
          excerpt: related.excerpt,
          description: related.description,
          publishedAt: getPublishedDate(related)
        }))}
      />
    </>
  );
}

ContentLayout.displayName = "ContentLayout";
