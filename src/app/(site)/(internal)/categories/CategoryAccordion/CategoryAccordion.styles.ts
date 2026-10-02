import { styled } from "@linaria/react";
import { motion } from "motion/react";
import { opaqueBgCss } from "@/components/common.styles";

// Stacked list of collapsible category rows.
export const AccordionList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 1.25vw, 1.5rem);
  padding: 0;
  margin: 0;
  list-style: none;
`;

// Shadow lifts in while expanded so the open row stands out.
export const AccordionItem = styled.li`
  border: 0.0625rem solid var(--color-border-accent-muted);
  border-radius: 0.375rem;
  overflow: hidden;
  box-shadow: var(--box-shadow-sm);
  transition: box-shadow 300ms cubic-bezier(0.25, 0.1, 0.25, 1);

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
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-image: ${opaqueBgCss("var(--color-bg-accent-muted)")};
  cursor: default;
  border-block-end: 0.0625rem solid var(--color-border-transparent);
  transition: border-block-end-color 300ms cubic-bezier(0.25, 0.1, 0.25, 1);

  ${AccordionItem}[data-expanded] & {
    border-block-end-color: var(--color-border-accent-muted);
  }
`;

// Takes the remaining inline space so counts and toggles align at the end.
export const AccordionTitle = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1 1 auto;
  min-inline-size: 0;

  svg {
    flex-shrink: 0;
    inline-size: 1.5rem;
    block-size: 1.5rem;
    color: var(--color-fg-muted);
  }
`;

// The category name — links to the /category/<slug> archive.
export const CategoryLink = styled.a`
  color: var(--color-fg-default);
  text-decoration: none;
  font-weight: 500;
  transition: color 150ms cubic-bezier(0.6, 0, 0.2, 1);

  &:hover {
    color: var(--color-fg-accent);
  }
`;

// Muted post-count badge.
export const PostCount = styled.span`
  flex: 0 0 auto;
  min-inline-size: 1.6em;
  padding: 0.1875rem 0.5rem;
  background-color: var(--color-bg-neutral-muted);
  color: var(--color-fg-neutral);
  font-size: 0.875rem;
  border-radius: 50rem;
  border: 0.0625rem solid var(--color-border-neutral-muted);
  text-align: center;
`;

// Pill-shaped hit area so the small chevron is easy to tap.
export const AccordionToggle = styled.button`
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  border-radius: 624.9375rem;
  padding: 0.25rem;
  background: var(--color-bg-control);
  border: 1px solid var(--color-border-control);
  border-radius: 624.9375rem;
  color: var(--color-fg-muted);
  cursor: pointer;

  svg {
    inline-size: 1.5rem;
    block-size: 1.5rem;
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

// A dotted leader links title and date so the eye can follow across wide rows.
export const PostListItem = styled.li`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  padding: 0.75rem;
  margin-block-end: 0;
  border-block-end: 0.0625rem solid var(--color-border-muted);
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
  font-size: 0.875rem;

  &:hover {
    color: var(--color-fg-accent);
  }
`;

// Dotted leader that fills the gap between title and date.
export const DottedSeparator = styled.span`
  flex: 1 1 auto;
  border-block-end: 0.0625rem dotted var(--color-border-muted);
  transform: translateY(-0.25em);
`;

// Muted published-at timestamp, pinned to the row's end.
export const PostPublishedAt = styled.time`
  flex: 0 0 auto;
  font-size: 0.875rem;
  color: var(--color-fg-muted);
  text-align: end;
`;
