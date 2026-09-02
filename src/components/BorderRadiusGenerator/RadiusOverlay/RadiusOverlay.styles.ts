import { styled } from "@linaria/react";

export const Overlay = styled.div`
  position: absolute;
  inset: 0;
  touch-action: none;
`;

export const Handle = styled.button`
  position: absolute;
  inline-size: 0.875rem;
  block-size: 0.875rem;
  transform: translate(-50%, -50%);
  padding: 0;
  background: var(--color-bg-accent-emphasis);
  border: 0.125rem solid var(--color-bg-default);
  border-radius: 50%;
  box-shadow: 0 0 0 0.0625rem var(--color-border-muted);
  cursor: grab;

  &[data-selected="true"] {
    box-shadow: 0 0 0 0.125rem var(--color-fg-accent);
  }

  &:active {
    cursor: grabbing;
  }
`;
