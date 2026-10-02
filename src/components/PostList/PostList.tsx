import type { JSX } from "react";
import Link from "next/link";
import VisuallyHidden from "@/components/VisuallyHidden";
import Categories from "@/components/Categories";
import SeriesBadge from "@/components/SeriesBadge";
import { CalendarIcon, ClockIcon, CodeBlockIcon, BulbIcon } from "@/components/Icon";
import { PageMetaItem } from "@/components/PageMeta/PageMeta.styles";
import { getSeriesForPost } from "@/data/series";
import { getTaxonomyEntryUrl, TAXONOMY_ENTRY_LABELS } from "@/utils/taxonomy-entries";
import { formatDate } from "@/utils/date";
import { inlineMarkdownToHtml } from "@/utils/markdown";
import type { TaxonomyEntryType } from "@/utils/taxonomy-entries";
import type { PostListProps } from "@/components/PostList/PostList.types";
import {
  PostFeed,
  PostPreview,
  PostCardHeader,
  PostCardTitle,
  PostCardExcerpt,
  PostCardBody,
  PostCardDescription,
  PostCardFooter
} from "@/components/PostList/PostList.styles";

// Matches the archives' icons so a format reads the same wherever it's listed.
const ENTRY_TYPE_ICONS: Record<Exclude<TaxonomyEntryType, "post">, typeof CodeBlockIcon> = {
  snippet: CodeBlockIcon,
  tutorial: BulbIcon
};

/*
  One card per entry so readers can scan titles, series and read times before choosing;
  dates come from git, so this list is server-only.
*/
export default function PostList({ posts }: PostListProps): JSX.Element {
  return (
    <>
      <PostFeed>
        {posts.map((post, index) => {
          const type = "type" in post ? post.type : "post";
          // Slugs are only unique per content type, so series lookups stay with posts.
          const series = type === "post" ? getSeriesForPost(post.slug) : null;
          const EntryTypeIcon = type === "post" ? null : ENTRY_TYPE_ICONS[type];

          return (
            <PostPreview
              key={`${type}-${post.slug}`}
              style={{ "--stagger": String(index) } as React.CSSProperties}
            >
              <PostCardHeader>
                <PostCardTitle>
                  <Link href={getTaxonomyEntryUrl({ ...post, type })} title={post.title}>
                    <span dangerouslySetInnerHTML={{ __html: inlineMarkdownToHtml(post.title) }} />
                  </Link>
                </PostCardTitle>

                {series && <SeriesBadge series={series} />}

                {post.excerpt && <PostCardExcerpt>{post.excerpt}</PostCardExcerpt>}
              </PostCardHeader>

              {post.description && (
                <PostCardBody>
                  <PostCardDescription title={post.description}>
                    {post.description}
                  </PostCardDescription>
                </PostCardBody>
              )}

              <PostCardFooter>
                {post.publishedAt && (
                  <PageMetaItem className="page-published-date">
                    <CalendarIcon />
                    <VisuallyHidden>Published at:</VisuallyHidden>
                    <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                  </PageMetaItem>
                )}

                <Categories categories={post.category} />

                {"readingMinutes" in post && (
                  <PageMetaItem className="page-read-time">
                    <ClockIcon />
                    <VisuallyHidden>Estimated reading time:</VisuallyHidden>
                    <span>{post.readingMinutes} min read</span>
                  </PageMetaItem>
                )}

                {EntryTypeIcon && (
                  <PageMetaItem className="page-content-type">
                    <EntryTypeIcon />
                    <VisuallyHidden>Content type:</VisuallyHidden>
                    <span>{TAXONOMY_ENTRY_LABELS[type].singular}</span>
                  </PageMetaItem>
                )}
              </PostCardFooter>
            </PostPreview>
          );
        })}
      </PostFeed>
    </>
  );
}

PostList.displayName = "PostList";
