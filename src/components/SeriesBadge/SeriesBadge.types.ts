import type { PostSeriesInfo } from "@/data/series";

// Props for the series indicator badge.
export interface SeriesBadgeProps {
  // The series this post belongs to, including its title and this post's position.
  series: PostSeriesInfo;
  // When true (default), the badge links to the series page; otherwise it's static.
  link?: boolean;
}
