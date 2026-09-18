import { styled } from "@linaria/react";

// Row of format tabs (CSS/Tailwind/React) above the code block.
export const TabRow = styled.div`
  display: flex;
  gap: 0.25rem;
  border-bottom: 0.0625rem solid var(--color-border-muted);
`;

// One format tab — underline slides to whichever is active via [data-selected].
export const Tab = styled.button`
  padding: 0.5rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-muted);
  background: transparent;
  border: none;
  border-bottom: 0.125rem solid transparent;
  margin-block-end: -0.0625rem;
  cursor: pointer;

  &[data-selected="true"] {
    color: var(--color-fg-accent);
    border-bottom-color: var(--color-fg-accent);
  }
`;
