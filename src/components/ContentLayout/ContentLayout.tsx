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
import IconExternalLink from "@/icons/IconExternalLink";
import { useToggleIconStatus } from "@/hooks/use-toggle-icon-status";
import { siteConfig } from "@/config/site";
import type { ContentLayoutProps } from "@/components/ContentLayout/ContentLayout.types";
import {
  Article,
  ContentHeader,
  ContentExcerpt,
  ContentCtaLink,
  ContentBody
} from "@/components/ContentLayout/ContentLayout.styles";

/*
  Segment layout shared by every /snippet/<slug> and /tutorial/<slug> page —
  wraps the page.mdx body with registry-driven chrome (title, excerpt,
  signoff, categories/tags, changelog, prev/next). The slug comes from the
  pathname (a static per-folder page can't pass params to a layout); all data
  here is from the client-safe registry. The dates + read-time meta row is
  injected into the body at build by the remark-content-metadata plugin.
*/
export default function ContentLayout({
  children,
  routeSegment,
  label,
  getBySlug,
  getNavigation
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

        <ContentBody>{children}</ContentBody>

        <PageSignOff />

        <PageMetaSecondary role="group" aria-label={`${label} metadata`}>
          <Categories categories={entry.category} />
          <Tags tags={entry.tags} />
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
    </>
  );
}

ContentLayout.displayName = "ContentLayout";
