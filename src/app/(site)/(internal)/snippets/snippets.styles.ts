import { styled } from "@linaria/react";
import { hoverShadowLiftCss } from "@/components/common.styles";

// Intro copy above the snippet grid.
export const SnippetsSection = styled.section`
  p {
    font-size: clamp(1rem, 2vw, 1.125rem);
    line-height: 1.625;
    margin-block-end: clamp(1rem, 1.25vw, 1.5rem);
  }
`;

// Responsive auto-filling card grid — each card is at least 22rem wide.
export const SnippetsList = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(22rem, 1fr));
  gap: 1rem;
  margin-block-start: 1rem;
  padding: 0;
  list-style: none;
`;

// A single snippet card — flex column so the meta block can be pushed to the bottom.
export const Snippet = styled.li`
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.375rem;
  margin-block-end: 0;
  ${hoverShadowLiftCss}

  a {
    display: flex;
    flex-direction: column;
    row-gap: 0.5rem;
    padding: 1rem;
    text-decoration: none;
    color: var(--color-fg-default);
    block-size: 100%;
  }
`;

// Accent-coloured title at the top of the card.
export const SnippetName = styled.h2`
  font-size: 1.25rem;
  margin-block-start: 0;
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
  padding: 0.5rem 1rem;
  background: var(--color-bg-cloud-300);
  border-radius: 0.1875rem;
  color: var(--color-fg-accent-muted);
`;

// Individual meta row — adds bottom margin between items except the last.
export const SnippetMetaItem = styled.span`
  font-size: 0.875rem;

  &:not(:last-child) {
    margin-block-end: 0.5rem;
  }
`;
