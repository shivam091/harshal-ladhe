import { styled } from "@linaria/react";

// Luggage tags hang in a row that wraps — three across in the wide tray, fewer on phones.
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
  gap: 0.625rem;
`;

/*
  A preset as a luggage tag: a manila card with a punched, brass-ringed eyelet at its left end and
  a clipped corner either side of it, so it reads as a tag tied to a parcel.
*/
export const PresetTag = styled.button`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.125rem;
  padding: 0.5rem 0.625rem 0.5rem 1.75rem;
  text-align: start;
  background:
    radial-gradient(circle, var(--po-paper) 0 0.2rem, var(--po-brass) 0.22rem 0.32rem, transparent 0.34rem) 0.5rem 50% / 0.75rem 0.75rem no-repeat,
    color-mix(in srgb, var(--color-fg-attention) 16%, var(--po-paper));
  border: 0;
  clip-path: polygon(0.625rem 0, 100% 0, 100% 100%, 0.625rem 100%, 0 calc(100% - 0.625rem), 0 0.625rem);
  cursor: pointer;
  transition: rotate 150ms ease;

  &:hover {
    rotate: -1.5deg;
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-outline-focus, var(--color-fg-accent));
    outline-offset: -0.25rem;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover {
      rotate: none;
    }
  }
`;

// The sample's own name leads.
export const PresetName = styled.span`
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--color-fg-default);
`;

// Which tool packed it, smaller underneath.
export const PresetMeta = styled.span`
  font-size: 0.6875rem;
  color: var(--color-fg-muted);
`;
