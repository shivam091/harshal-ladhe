"use client";

import { JSX, ReactNode } from "react";
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
import { getSeriesForPost } from "@/data/series";
import SeriesPostNav from "@/app/(site)/(internal)/(series)/SeriesPostNav";
import { getRelatedPosts } from "@/lib/related-posts";
import RelatedPosts from "@/app/(site)/(internal)/(post)/RelatedPosts";
import HitCounter from "@/components/HitCounter";
import TableOfContents from "@/components/TableOfContents";
import LikeButton from "@/components/LikeButton";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Article,
  PostHeader,
  PageExcerpt,
  PostGrid,
  PostContent,
  PostTOC,
  PostFooter
} from "@/app/(site)/(internal)/(post)/layout.styles";

/*
  Segment layout shared by every /post/<slug> page. Wraps each post's
  page.mdx body with registry-driven chrome (title, excerpt, signoff,
  categories/tags, changelog, prev/next). The slug comes from the pathname.
  Dates + read time are injected into the body at build by remark-post-meta.
*/
export default function PostLayout({ children }: { children: ReactNode }): JSX.Element {
  const pathname = usePathname();
  const slug = pathname.replace(/^\/post\//, "").replace(/\/$/, "");

  /*
    Below this breakpoint LikeButton switches to its own floating-pill mode —
    same threshold PostGrid/TableOfContents collapse at. Computed here (not in
    TableOfContents) so LikeButton isn't nested inside — and therefore isn't
    hidden along with — the TOC when a post has no headings to list.
  */
  const isTOCCollapsed = useMediaQuery("(width <= 64rem)");

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
              <LikeButton floating={isTOCCollapsed} />
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

      <RelatedPosts posts={relatedPosts} />

      <PageNavigation
        ariaLabel="Post navigation"
        previousLabel="Older"
        nextLabel="Newer"
        previous={previous ? { href: `/post/${previous.slug}`, title: previous.title } : null}
        next={next ? { href: `/post/${next.slug}`, title: next.title } : null}
      />
    </>
  );
}

PostLayout.displayName = "PostLayout";
