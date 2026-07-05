import { styled } from "@linaria/react";

// Outer wrapper — block margin separates the disclosure from surrounding prose.
export const DetailsRoot = styled.div`
  margin-block: var(--space-lg);
`;

// Toggle button — full-width, left-aligned, font-weight shifts to semi-bold when open.
export const DetailsTrigger = styled.button`
  appearance: none;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-none);
  background: none;
  border: 0;
  font-family: inherit;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-fg-default);
  text-align: start;
  inline-size: 100%;
  cursor: pointer;

  &[data-state="open"] {
    font-weight: var(--font-weight-semi-bold);
  }

  svg {
    flex-shrink: 0;
    inline-size: var(--size-lg);
    block-size: var(--size-lg);
  }
`;

// Content padding — indented to sit under the text after the icon.
export const DetailsPanel = styled.div`
  padding-block: var(--space-sm);
  padding-inline-start: var(--space-xl);
`;
