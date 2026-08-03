import { styled } from "@linaria/react";

// One narrow card, centred, so the single decision on the page is all there is to look at.
export const Card = styled.section`
  max-inline-size: 30rem;
  margin: clamp(1rem, 6vh, 4rem) auto;
  padding: clamp(1.5rem, 5cqi, 2.5rem);
  border: 1px solid var(--color-border-default);
  border-radius: 1rem;
  background: var(--color-bg-default);
  text-align: center;
`;

// Coloured by outcome, so how it went shows before any text is read.
export const Badge = styled.div`
  display: grid;
  place-items: center;
  inline-size: 3.5rem;
  block-size: 3.5rem;
  margin: 0 auto 1.25rem;
  border-radius: 50%;
  color: var(--color-fg-accent);
  background: var(--color-bg-accent-muted);

  &[data-tone="success"] {
    color: var(--color-fg-success);
    background: var(--color-bg-success-muted);
  }

  &[data-tone="attention"] {
    color: var(--color-fg-attention);
    background: var(--color-bg-attention-muted);
  }
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  line-height: 1.3;
`;

export const Lead = styled.p`
  margin: 0.75rem 0 0;
  line-height: 1.7;
  color: var(--color-fg-muted);
`;

// Long addresses wrap instead of pushing the card wider than the screen.
export const Email = styled.strong`
  color: var(--color-fg-default);
  overflow-wrap: anywhere;
`;

// Left-aligned, unlike the rest of the card, since it reads as a list.
export const Note = styled.div`
  margin-block-start: 1.5rem;
  padding: 1rem;
  border-radius: 0.75rem;
  background: var(--color-bg-muted);
  font-size: 0.875rem;
  line-height: 1.6;
  text-align: start;
  color: var(--color-fg-muted);

  ul {
    margin: 0;
    padding-inline-start: 1.25rem;
  }

  li + li {
    margin-block-start: 0.375rem;
  }

  strong {
    color: var(--color-fg-default);
  }
`;

export const Actions = styled.div`
  display: grid;
  gap: 0.75rem;
  margin-block-start: 1.5rem;
`;

export const ErrorText = styled.p`
  margin: 0.75rem 0 0;
  font-size: 0.875rem;
  color: var(--color-fg-danger);
`;
