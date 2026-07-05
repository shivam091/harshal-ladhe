import { Fragment, JSX } from "react";
import type {Metadata } from "next";
import Link from "next/link";
import VisuallyHidden from "@/components/VisuallyHidden";
import { getPostsByYear } from "@/lib/archives";
import { formatDayMonth, fullTimestamp } from "@/utils/date";
import { ArchivesSection, TimelineWrapper } from "@/app/(site)/(internal)/archives/archives.styles";
import { inlineMarkdownToHtml } from "@/utils/markdown";

export const metadata: Metadata = {
  title: "Archives",
  description: "Browse the full archive of technical articles and snippets arranged by date. Track your learning journey across JavaScript, CSS, HTML, Python, and more.",
  alternates: { canonical: "/archives" },
  openGraph: {
    title: "Archives",
    description: "Browse the full archive of technical articles and snippets arranged by date. Track your learning journey across JavaScript, CSS, HTML, Python, and more.",
    url: "/archives",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Archives",
    description: "Browse the full archive of technical articles and snippets arranged by date. Track your learning journey across JavaScript, CSS, HTML, Python, and more.",
  }
};

// Chronological archive — posts grouped by year, threaded onto a single timeline spine.
export default function ArchivesPage(): JSX.Element {
  const postsByYear = getPostsByYear();

  return (
    <>
      <ArchivesSection aria-labelledby="archives-list-title">
        <VisuallyHidden as="h2" id="archives-list-title">
          Browse posts by year
        </VisuallyHidden>

        <p>{metadata.description as string}</p>

        <TimelineWrapper>
          <div className="timeline">
            {postsByYear.map(({ year, posts }) => (
              <Fragment key={year}>
                <div
                  className="timeline-year"
                  role="group"
                  aria-labelledby={`year-${year}`}
                >
                  <div id={`year-${year}`} className="timeline-left h2">
                    <VisuallyHidden>Year:</VisuallyHidden>
                    {year}
                  </div>
                  <div className="timeline-seperator" />
                </div>

                <ul
                  className="timeline-posts"
                  role="list"
                  aria-labelledby={`year-${year}`}
                >
                  <VisuallyHidden as="li" role="presentation">
                    Posts for year {year}
                  </VisuallyHidden>

                  {posts.map((post) => (
                    <li key={post.slug} className="timeline-post" role="listitem">
                      <div className="timeline-left">
                        <VisuallyHidden>Published on:</VisuallyHidden>
                        {post.publishedAt && (
                          <time
                            dateTime={post.publishedAt}
                            title={`Published on ${fullTimestamp(post.publishedAt)}`}
                          >
                            {formatDayMonth(post.publishedAt)}
                          </time>
                        )}
                      </div>
                      <div className="timeline-seperator" />
                      <div className="timeline-right">
                        <Link
                          href={`/post/${post.slug}`}
                          className="post-title"
                          title={post.title}
                          dangerouslySetInnerHTML={{ __html: inlineMarkdownToHtml(post.title) }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </Fragment>
            ))}
          </div>
        </TimelineWrapper>
      </ArchivesSection>
    </>
  );
}
