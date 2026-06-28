import { styled } from "@linaria/react";

// Intro copy above the snippet grid.
export const SnippetsSection = styled.section`
  p {
    font-size: var(--fluid-font-size-md);
    line-height: var(--line-height-relaxed);
    margin-block-end: var(--fluid-space-base);
  }
`;

// Responsive auto-filling card grid — each card is at least 22rem wide.
export const SnippetsList = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(22rem, 1fr));
  gap: var(--space-base);
  margin-block-start: var(--space-base);
  padding: 0;
  list-style: none;
`;

// A single snippet card — flex column so the meta block can be pushed to the bottom.
export const Snippet = styled.li`
  background: var(--color-bg-default);
  border: var(--border-width-default) solid var(--color-border-default);
  border-radius: var(--border-radius-default);
  margin-block-end: var(--space-none);
  box-shadow: var(--box-shadow-sm);
  transition: box-shadow var(--motion-duration-medium) var(--motion-easing-ease);

  &:hover {
    @media (hover: hover) {
      box-shadow: var(--box-shadow-md);
    }
  }

  a {
    display: flex;
    flex-direction: column;
    row-gap: var(--space-sm);
    padding: var(--space-base);
    text-decoration: none;
    color: var(--color-fg-default);
    block-size: 100%;
  }
`;

// Accent-coloured title at the top of the card.
export const SnippetName = styled.h2`
  font-size: var(--font-size-lg);
  margin-block-start: var(--space-none);
  color: var(--color-fg-default);
`;

// Grows to fill remaining vertical space, pushing SnippetMeta to the card bottom.
export const SnippetDescription = styled.div`
  flex: 1;
  color: var(--color-fg-muted);
`;

// Tinted pill at the bottom of the card showing category and last-modified date.
export const SnippetMeta = styled.div`
  display: flex;
  flex-direction: column;
  padding: var(--space-sm) var(--space-base);
  background: var(--color-bg-cloud-300);
  border-radius: var(--border-radius-sm);
  color: var(--color-fg-accent-muted);
`;

// Individual meta row — adds bottom margin between items except the last.
export const SnippetMetaItem = styled.span`
  font-size: var(--font-size-sm);

  &:not(:last-child) {
    margin-block-end: var(--space-sm);
  }
`;
