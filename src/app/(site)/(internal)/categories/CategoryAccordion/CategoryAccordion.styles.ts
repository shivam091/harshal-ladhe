import { styled } from "@linaria/react";
import { motion } from "motion/react";

// Stacked list of collapsible category rows.
export const AccordionList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: var(--fluid-space-base);
  padding: 0;
  margin: 0;
  list-style: none;
`;

// One category row — bordered card; shadow lifts in while expanded.
export const AccordionItem = styled.li`
  border: var(--border-width-default) solid var(--color-border-accent-muted);
  border-radius: var(--border-radius-default);
  overflow: hidden;
  box-shadow: var(--box-shadow-sm);
  transition: box-shadow var(--motion-duration-medium) var(--motion-easing-ease);

  &[data-expanded] {
    box-shadow: var(--box-shadow-md);
  }
`;

/*
  Header row: title + icon on the start, count and toggle on the end. Not
  itself interactive (only the link and toggle inside it are), hence the
  default cursor rather than the pointer a whole-row hover might imply.
*/
export const AccordionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-base);
  background-image: linear-gradient(var(--color-bg-accent-muted), var(--color-bg-accent-muted));
  cursor: default;
  border-block-end: var(--border-width-default) solid var(--color-border-transparent);
  transition: border-block-end-color var(--motion-duration-medium) var(--motion-easing-ease);

  ${AccordionItem}[data-expanded] & {
    border-block-end-color: var(--color-border-accent-muted);
  }
`;

// Diamonds icon + category link grouping — takes the remaining inline space.
export const AccordionTitle = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  flex: 1 1 auto;
  min-inline-size: 0;

  svg {
    flex-shrink: 0;
    inline-size: var(--size-lg);
    block-size: var(--size-lg);
    color: var(--color-fg-muted);
  }
`;

// The category name — links to the /category/<slug> archive.
export const CategoryLink = styled.a`
  color: var(--color-fg-default);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: color var(--motion-duration-fast) var(--motion-easing-ease-in-out);

  &:hover {
    color: var(--color-fg-accent);
  }
`;

// Muted post-count badge.
export const PostCount = styled.span`
  flex: 0 0 auto;
  min-inline-size: 1.6em;
  padding: var(--space-xxs) var(--space-sm);
  background-color: var(--color-bg-neutral-muted);
  color: var(--color-fg-neutral);
  font-size: var(--font-size-sm);
  border-radius: var(--border-radius-pill);
  border: var(--border-width-default) solid var(--color-border-neutral-muted);
  text-align: center;
`;

/*
  Chevron toggle — pill hit-area. The chevron's own down↔up morph is
  spring-animated by IconChevronDown, driven by the row's \`open\` state.
*/
export const AccordionToggle = styled.button`
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  border-radius: var(--border-radius-full);
  padding: var(--space-xs);
  background: var(--color-bg-control);
  border: 1px solid var(--color-border-control);
  border-radius: var(--border-radius-full);
  color: var(--color-fg-muted);
  cursor: pointer;

  svg {
    inline-size: var(--size-lg);
    block-size: var(--size-lg);
  }
`;

// Revealed panel — its own background distinguishes it from the header's tinted gradient.
export const AccordionBody = styled(motion.div)`
  overflow: hidden;
  background-color: var(--color-bg-default);
`;

// Revealed list of posts within a category.
export const PostList = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
`;

// A single post row — title on the start, published date on the end, dotted fill between.
export const PostListItem = styled.li`
  display: flex;
  align-items: baseline;
  gap: var(--space-sm);
  padding: var(--space-md);
  margin-block-end: 0;
  border-block-end: var(--border-width-default) solid var(--color-border-muted);
`;

// Post title link — truncates to a single line so long titles never wrap.
export const PostTitle = styled.a`
  flex: 0 1 auto;
  min-inline-size: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--color-fg-default);
  text-decoration: none;
  font-size: var(--font-size-sm);

  &:hover {
    color: var(--color-fg-accent);
  }
`;

// Dotted leader that fills the gap between title and date.
export const DottedSeparator = styled.span`
  flex: 1 1 auto;
  border-block-end: var(--border-width-default) dotted var(--color-border-muted);
  transform: translateY(-0.25em);
`;

// Muted published-at timestamp, pinned to the row's end.
export const PostPublishedAt = styled.time`
  flex: 0 0 auto;
  font-size: var(--font-size-sm);
  color: var(--color-fg-muted);
  text-align: end;
`;
