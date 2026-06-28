import { styled } from "@linaria/react";
import { dotSeparatorCss } from "@/components/common.styles";
import { BREAKPOINTS } from "@/constants/breakpoints";

/*
  Reflows from one line to two columns to one as width shrinks so items never wrap
  mid-value; keep PostCardFooter in step so post cards read the same way.
*/
export const PageMetaPrimary = styled.div`
  display: inline-grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  justify-content: start;
  align-items: center;
  row-gap: 0.5rem;
  margin-block-end: 1.5rem;
  font-size: 0.875rem;
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

// Stacks each group on its own row so long tag lists wrap without running into categories.
export const PageMetaSecondary = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  flex-wrap: wrap;
  row-gap: 0.5rem;
  margin-block: clamp(1.5rem, 2vw, 2rem);
`;

// 1em icons scale with the meta text instead of needing per-size overrides.
export const PageMetaItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  flex-wrap: wrap;
  font-size: 0.875rem;
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
  gap: 0.25rem;
  flex-wrap: wrap;
`;
