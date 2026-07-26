import { styled } from "@linaria/react";

/*
  Shared borderless icon-button chrome for every Sandbox toolbar action: transparent at
  rest, hover fill, accent tint once active/pressed.
*/
export const Root = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 1.75rem;
  block-size: 1.75rem;
  padding: 0;
  border: none;
  border-radius: 0.375rem;
  background: transparent;
  color: var(--color-fg-muted);
  cursor: pointer;
  text-decoration: none;
  transition:
    color 150ms ease,
    background 150ms ease;

  &:hover {
    color: var(--color-fg-default);
    background: var(--color-bg-neutral-muted);
  }

  &[aria-pressed="true"],
  &[data-active="true"] {
    color: var(--color-fg-accent);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:disabled:hover {
    background: transparent;
  }
`;
