"use client";

import type { JSX, ReactNode } from "react";
import { usePathname, notFound } from "next/navigation";
import PageSignOff from "@/components/SignOff/PageSignOff";
import PageNavigation from "@/components/PageNavigation";
import Categories from "@/components/Categories";
import Tags from "@/components/Tags";
import Changelog from "@/components/Changelog";
import ContentFooter from "@/components/ContentFooter";
import { siteConfig } from "@/config/site";
import { inlineMarkdownToHtml } from "@/utils/markdown";
import { PageTitle } from "@/components/PageHeading/PageHeading.styles";
import { PageMetaSecondary } from "@/components/PageMeta/PageMeta.styles";
import { getPostBySlug, getPostNavigation } from "@/data/posts";
import { getPostUrl } from "@/utils/post-url";
import { getSeriesForPost } from "@/data/series";
import { getPublishedDate, getRelatedPosts } from "@/lib/related-entries";
import RelatedContent from "@/components/RelatedContent";
import HitCounter from "@/components/HitCounter";
import TableOfContents from "@/components/TableOfContents";
import {
  Article,
  PostHeader,
  PageExcerpt,
  PostGrid,
  PostContent,
  PostTOC,
  PostFooter
} from "@/app/(site)/(internal)/(post)/layout.styles";
import SeriesPostNav from "@/app/(site)/(internal)/(series)/SeriesPostNav";

/*
  Registry-driven chrome so each post's page.mdx stays pure prose; the slug comes from the
  pathname because a static per-folder page can't pass params to its layout.
*/
export default function PostLayout({ children }: { children: ReactNode }): JSX.Element {
  const pathname = usePathname();
  const slug = pathname.replace(/^\/post\/[^/]+\//, "").replace(/\/$/, "");

  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { previous, next } = getPostNavigation(slug);
  const relatedPosts = getRelatedPosts(slug);
  const series = getSeriesForPost(slug);

  return (
    <>
      <Article aria-labelledby="page-title">
        <PageTitle id="page-title" dangerouslySetInnerHTML={{ __html: inlineMarkdownToHtml(post.title) }} />

        <PostHeader>
          {post.excerpt && <PageExcerpt>{post.excerpt}</PageExcerpt>}
        </PostHeader>

        <PostGrid>
          <PostContent id="post-content">{children}</PostContent>
          {post.toc?.show !== false && (
            <PostTOC>
              <TableOfContents maxLevel={post.toc?.maxLevel ?? 3} />
            </PostTOC>
          )}
        </PostGrid>

        <PageSignOff showText metadata={post} />

        {series && <SeriesPostNav series={series} />}

        <PostFooter>
          <PageMetaSecondary role="group" aria-label="Post metadata">
            <Categories categories={post.category} link />
            <Tags tags={post.tags} link />
          </PageMetaSecondary>

          <Changelog entries={post.changelog ?? []} />

          <ContentFooter title={post.title} contentLabel="post" />
        </PostFooter>

        {siteConfig.hitCounter && <HitCounter />}
      </Article>

      {/* Posts route under their category, so their cards link through getPostUrl rather than a flat path. */}
      <RelatedContent
        label="Posts"
        itemLabel="post"
        items={relatedPosts.map((related) => ({
          slug: related.slug,
          href: getPostUrl(related),
          title: related.title,
          excerpt: related.excerpt,
          description: related.description,
          publishedAt: getPublishedDate(related)
        }))}
      />

      <PageNavigation
        ariaLabel="Post navigation"
        previousLabel="Older"
        nextLabel="Newer"
        previous={previous ? { href: getPostUrl(previous), title: previous.title } : null}
        next={next ? { href: getPostUrl(next), title: next.title } : null}
      />
    </>
  );
}

PostLayout.displayName = "PostLayout";
