import { styled } from "@linaria/react";

// Grid of preset ticket cards.
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;

// One preset rendered as a small library ticket — three ink dots (its real seed/foreground/background) plus a printed name, like an index card in a swatch library's catalog drawer.
export const TicketCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.625rem;
  background: var(--color-bg-muted);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.375rem;
  cursor: pointer;
  transition: border-color 150ms ease, transform 150ms ease;

  &:hover {
    border-color: var(--color-fg-accent);
    transform: translateY(-0.0625rem);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: border-color 150ms ease;

    &:hover {
      transform: none;
    }
  }
`;

// The preset's three defining colors, rendered as overlapping ink dabs.
export const Swatches = styled.div`
  display: flex;
`;

// One of the three dabs, overlapping the one before it like ink dots pressed close together.
export const SwatchDot = styled.span`
  inline-size: 1.25rem;
  block-size: 1.25rem;
  border-radius: 50%;
  border: 0.0625rem solid var(--color-border-default);
  margin-inline-end: -0.375rem;

  &:last-child {
    margin-inline-end: 0;
  }
`;

// The preset's printed name.
export const TicketLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-fg-default);
  text-align: start;
`;
