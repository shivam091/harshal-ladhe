import type { JSX } from "react";
import Link from "next/link";
import { getPostUrl } from "@/utils/post-url";
import type { PostSeriesInfo } from "@/data/series";
import {
  SeriesNav,
  SeriesNavHeader,
  SeriesNavIcon,
  SeriesNavPosition,
  SeriesNavTitleLink,
  SeriesNavLinks,
  SeriesNavItem,
  SeriesNavItemIcon,
  SeriesNavPartLabel,
  SeriesNavLink
} from "@/app/(site)/(internal)/(series)/SeriesPostNav/SeriesPostNav.styles";

/*
  In-series wayfinding shown on a post that belongs to a series: which part this
  is, a link back to the series, and links to the previous / next part. Port of
  the Jekyll series/post-nav.html include.
*/
// Props for the in-series wayfinding block.
interface SeriesPostNavProps {
  // The series this post belongs to — title, url, position, and previous/next neighbours.
  series: PostSeriesInfo;
}

export default function SeriesPostNav({ series }: SeriesPostNavProps): JSX.Element {
  const { title, url, index, total, previousPost, nextPost } = series;

  return (
    <>
      <SeriesNav aria-label="Navigation for posts in series">
        <SeriesNavHeader>
          <SeriesNavIcon aria-hidden="true">📚</SeriesNavIcon>
          <SeriesNavPosition>
            This post is <strong>Part {index} of {total}</strong> in the{" "}
            <SeriesNavTitleLink as={Link} href={url}>
              {title}
            </SeriesNavTitleLink>{" "}
            series.
          </SeriesNavPosition>
        </SeriesNavHeader>

        {(previousPost || nextPost) && (
          <SeriesNavLinks>
            {previousPost && (
              <SeriesNavItem>
                <SeriesNavItemIcon aria-hidden="true">⬅️</SeriesNavItemIcon>
                <SeriesNavPartLabel>Part {previousPost.index}:</SeriesNavPartLabel>
                <SeriesNavLink
                  as={Link}
                  href={getPostUrl(previousPost)}
                  rel="prev"
                  aria-label={`Previous post in series: ${previousPost.title}`}
                >
                  {previousPost.title}
                </SeriesNavLink>
              </SeriesNavItem>
            )}

            {nextPost && (
              <SeriesNavItem>
                <SeriesNavPartLabel>Part {nextPost.index}:</SeriesNavPartLabel>
                <SeriesNavLink
                  as={Link}
                  href={getPostUrl(nextPost)}
                  rel="next"
                  aria-label={`Next post in series: ${nextPost.title}`}
                >
                  {nextPost.title}
                </SeriesNavLink>
                <SeriesNavItemIcon aria-hidden="true">➡️</SeriesNavItemIcon>
              </SeriesNavItem>
            )}
          </SeriesNavLinks>
        )}
      </SeriesNav>
    </>
  );
}

SeriesPostNav.displayName = "SeriesPostNav";
