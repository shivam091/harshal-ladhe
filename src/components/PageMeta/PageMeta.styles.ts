import { styled } from "@linaria/react";
import { dotSeparatorCss } from "@/components/common.styles";
import { BREAKPOINTS } from "@/constants/breakpoints";

/*
  Primary meta row (dates, read time, and — on posts — the series badge). A
  horizontal grid of max-content columns that reflows to two equal columns below
  lg (even items pinned to the row end) and to a single left-aligned column below
  sm. Shared by PostMeta and SnippetMeta so both read identically, and mirrored
  by PostCardFooter (PostList.styles.ts) so post cards read the same way.
*/
export const PageMetaPrimary = styled.div`
  display: inline-grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  justify-content: start;
  align-items: center;
  row-gap: var(--space-sm);
  margin-block-end: var(--space-lg);
  font-size: var(--font-size-sm);
  color: var(--color-fg-muted);

  ${dotSeparatorCss}

  // Dividers only make sense in the single-line desktop layout above — items
  // reflow onto multiple rows below this point, so a trailing dot would end
  // up with no adjacent item to separate.
  @media ${BREAKPOINTS.tabletAndSmaller} {
    display: grid;
    grid-auto-flow: initial;
    grid-template-columns: repeat(2, 1fr);

    > *:nth-child(even) {
      justify-self: end;
    }

    > *:not(:last-child)::after {
      display: none;
    }
  }

  @media ${BREAKPOINTS.smMobileAndSmaller} {
    grid-template-columns: 1fr;

    > *,
    > *:nth-child(even) {
      justify-self: start;
    }
  }
`;

// Secondary meta block (categories + tags) — stacked, wrapping groups below content.
export const PageMetaSecondary = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  flex-wrap: wrap;
  row-gap: var(--space-sm);
  margin-block: var(--fluid-space-lg);
`;

// A single inline meta row — leading icon, optional hidden label, then badges/values.
export const PageMetaItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  flex-wrap: wrap;
  font-size: var(--font-size-sm);
  color: var(--color-fg-muted);

  svg {
    inline-size: 1em;
    block-size: 1em;
  }
`;

/*
  Wraps just the listitem badges within a PageMetaItem. The ARIA List pattern only
  allows `listitem` (or `group`) as owned elements of `role="list"`, so the leading
  icon and hidden label live in PageMetaItem instead, outside this wrapper.
*/
export const PageMetaItemBadges = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  flex-wrap: wrap;
`;
