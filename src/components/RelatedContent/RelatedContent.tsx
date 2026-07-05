import type { JSX } from "react";
import Link from "next/link";
import VisuallyHidden from "@/components/VisuallyHidden";
import { CalendarIcon } from "@/components/Icon";
import { PageMetaItem } from "@/components/PageMeta/PageMeta.styles";
import { formatDate } from "@/utils/date";
import { inlineMarkdownToHtml } from "@/utils/markdown";
import type { RelatedContentProps } from "@/components/RelatedContent/RelatedContent.types";
import {
  RelatedSection,
  RelatedHeading,
  RelatedGrid,
  RelatedCard,
  RelatedCardHeader,
  RelatedCardTitle,
  RelatedCardExcerpt,
  RelatedCardBody,
  RelatedCardDescription,
  RelatedCardFooter
} from "@/components/RelatedContent/RelatedContent.styles";

// Keeps readers moving to similar entries once they finish one; renders nothing when none relate.
export default function RelatedContent({ items, label, itemLabel }: RelatedContentProps): JSX.Element | null {
  if (items.length === 0) return null;

  return (
    <>
      <RelatedSection aria-labelledby="related-content-heading">
        <RelatedHeading id="related-content-heading">Related {label}</RelatedHeading>

        <RelatedGrid>
          {items.map((item) => (
            <RelatedCard key={item.slug}>
              <RelatedCardHeader>
                <RelatedCardTitle>
                  <Link
                    href={item.href}
                    title={item.title}
                    aria-label={`Read ${itemLabel}: ${item.title}`}
                    dangerouslySetInnerHTML={{ __html: inlineMarkdownToHtml(item.title) }}
                  />
                </RelatedCardTitle>

                {item.excerpt && <RelatedCardExcerpt>{item.excerpt}</RelatedCardExcerpt>}
              </RelatedCardHeader>

              {item.description && (
                <RelatedCardBody>
                  <RelatedCardDescription title={item.description}>
                    {item.description}
                  </RelatedCardDescription>
                </RelatedCardBody>
              )}

              {item.publishedAt && (
                <RelatedCardFooter>
                  <PageMetaItem className="page-published-date">
                    <CalendarIcon />
                    <VisuallyHidden>Published at:</VisuallyHidden>
                    <time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time>
                  </PageMetaItem>
                </RelatedCardFooter>
              )}
            </RelatedCard>
          ))}
        </RelatedGrid>
      </RelatedSection>
    </>
  );
}

RelatedContent.displayName = "RelatedContent";
