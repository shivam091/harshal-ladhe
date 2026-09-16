import { styled } from "@linaria/react";

// Export format switcher — a row of small ticket tabs, matching RampDisplay's own RecipeRow language but its own copy so each panel's styles stay self-contained.
export const FormatRow = styled.div`
  display: inline-flex;
  gap: 0.125rem;
  padding: 0.1875rem;
  background: var(--color-bg-muted);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.25rem;
`;

// One format's own tab, raised with the accent fill while active.
export const FormatTab = styled.button`
  padding: 0.3125rem 0.625rem;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--color-fg-muted);
  background: transparent;
  border: none;
  border-radius: 0.1875rem;
  cursor: pointer;
  transition: color 150ms ease, background 150ms ease;

  &[data-selected="true"] {
    color: var(--color-fg-on-emphasis);
    background: var(--color-bg-accent-emphasis);
  }

  &:not([data-selected="true"]):hover {
    color: var(--color-fg-default);
  }
`;
