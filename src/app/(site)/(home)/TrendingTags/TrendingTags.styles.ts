import { styled } from "@linaria/react";
import { tagPillCss } from "@/components/common.styles";

/*
  Wrapping pill cloud — one item per trending tag, each pairing a #name link
  with its recency-weighted post count. Mirrors the /tags cloud styling.
*/
export const TrendingTagsList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: clamp(0.75rem, 1vw, 1rem);
  padding: 0;
  list-style: none;
  margin-block: 0;
`;

// A single trending-tag pill: the #name link plus a muted count badge.
export const TrendingTagItem = styled.li`
  ${tagPillCss}
`;
