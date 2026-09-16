import { styled } from "@linaria/react";

// Row holding the two mode "stencils" side by side.
export const StencilRow = styled.div`
  display: flex;
  gap: 0.5rem;
`;

/*
  One drafting "stencil" — a physical template a draftsperson would swap in to trace a particular
  shape family, standing in here for the Flexbox/Grid mode toggle. The small grid of perforation
  dots along its top edge (::before, a radial-gradient dot pattern) is what actually sells the
  "stencil" read; the selected stencil lifts slightly and gains an accent-colored edge, like it's
  the one currently laid down on the board.
*/
export const StencilButton = styled.button`
  position: relative;
  flex: 1 1 0;
  padding: 0.625rem 0.5rem 0.5rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--color-fg-muted);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;
  cursor: pointer;
  transition: color 150ms ease, border-color 150ms ease, transform 150ms ease, box-shadow 150ms ease;

  &::before {
    content: "";
    display: block;
    inline-size: 100%;
    block-size: 0.375rem;
    margin-block-end: 0.375rem;
    background-image: radial-gradient(circle, currentColor 0.05rem, transparent 0.05rem);
    background-size: 0.5rem 0.375rem;
    background-position: center;
    opacity: 0.4;
  }

  &:hover {
    color: var(--color-fg-default);
  }

  &[data-selected="true"] {
    color: var(--color-fg-accent);
    border-color: var(--color-fg-accent);
    box-shadow: var(--box-shadow-sm);
    transform: translateY(-0.0625rem);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: color 150ms ease, border-color 150ms ease, box-shadow 150ms ease;

    &[data-selected="true"] {
      transform: none;
    }
  }
`;
