import { styled } from "@linaria/react";
import { BREAKPOINTS } from "@/constants/breakpoints";

/*
  Fixed so it never shifts page layout, above the connectivity pill's layer since a pending choice matters more; the
  safe-area inset keeps it clear of the iOS home indicator.
*/
export const Wrapper = styled.div`
  position: fixed;
  inset-block-end: calc(1rem + env(safe-area-inset-bottom, 0px));
  inset-inline: 1rem;
  z-index: 1002;
  display: flex;
  justify-content: center;
  pointer-events: none;

  @media print {
    display: none;
  }
`;

export const Panel = styled.section`
  display: grid;
  gap: 0.75rem;
  max-inline-size: 34rem;
  padding: 1rem 1.25rem;
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.5rem;
  background: var(--color-bg-default);
  color: var(--color-fg-default);
  box-shadow: 0 0.25rem 1rem hsl(0deg 0% 0% / 0.15);
  pointer-events: auto;
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 1rem;
`;

export const Message = styled.p`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--color-fg-muted);
`;

// Equal weight on both choices, since declining must be as easy as accepting.
export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  @media ${BREAKPOINTS.smAndSmaller} {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
`;
