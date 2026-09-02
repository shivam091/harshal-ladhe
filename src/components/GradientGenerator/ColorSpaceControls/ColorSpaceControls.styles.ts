import { styled } from "@linaria/react";

// Three-way segmented control for interpolation color space — same treatment as TypeControls' TypeRow/TypeButton.
export const SpaceRow = styled.div`
  display: flex;
  gap: 0.25rem;
`;

export const SpaceButton = styled.button`
  flex: 1;
  padding: 0.375rem 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-muted);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.375rem;
  cursor: pointer;

  &[data-selected="true"] {
    color: var(--color-fg-on-emphasis);
    background: var(--color-bg-accent-emphasis);
    border-color: var(--color-bg-accent-emphasis);
  }
`;

export const HelperText = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: var(--color-fg-muted);
`;
