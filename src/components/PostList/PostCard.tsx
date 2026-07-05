import type { JSX } from "react";
import Link from "next/link";
import VisuallyHidden from "@/components/VisuallyHidden";
import Categories from "@/components/Categories";
import SeriesBadge from "@/components/SeriesBadge";
import { CalendarIcon, ClockIcon } from "@/components/Icon";
import { PageMetaItem } from "@/components/PageMeta/PageMeta.styles";
import { getSeriesForPost } from "@/data/series";
import { CONTENT_TYPE_ICONS } from "@/constants/content-type-icons";
import { getTaxonomyEntryUrl, TAXONOMY_ENTRY_LABELS } from "@/utils/taxonomy-entries";
import { formatDate } from "@/utils/date";
import { inlineMarkdownToHtml } from "@/utils/markdown";
import type { PostCardProps } from "@/components/PostList/PostList.types";
import {
  PostPreview,
  PostCardHeader,
  PostCardTitle,
  PostCardExcerpt,
  PostCardBody,
  PostCardDescription,
  PostCardFooter
} from "@/components/PostList/PostList.styles";

// One card markup so a post looks identical whether or not its list can filter.
export default function PostCard({ post, index, showTypeIcon = false, as = "li" }: PostCardProps): JSX.Element {
  const type = post.type ?? "post";
  // Slugs are only unique per content type, so series lookups stay with posts.
  const series = type === "post" ? getSeriesForPost(post.slug) : null;
  const TypeIcon = CONTENT_TYPE_ICONS[type];

  return (
    <PostPreview as={as} style={{ "--stagger": String(index) } as React.CSSProperties}>
      <PostCardHeader>
        <PostCardTitle>
          {showTypeIcon && (
            <>
              <TypeIcon className="post-type-icon" size={20} aria-hidden />
              <VisuallyHidden>{TAXONOMY_ENTRY_LABELS[type].singular}:</VisuallyHidden>
            </>
          )}
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

        <PageMetaItem className="page-read-time">
          <ClockIcon />
          <VisuallyHidden>Estimated reading time:</VisuallyHidden>
          <span>{post.readingMinutes} min read</span>
        </PageMetaItem>
      </PostCardFooter>
    </PostPreview>
  );
}

PostCard.displayName = "PostCard";
