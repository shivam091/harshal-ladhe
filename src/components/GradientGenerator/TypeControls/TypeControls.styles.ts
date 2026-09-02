import { styled } from "@linaria/react";

// Three-way segmented control for gradient type — matches ShapeControls' SubjectRow/SubjectButton treatment (a fixed, small set of equally-weighted options reads better as buttons than a <select>).
export const TypeRow = styled.div`
  display: flex;
  gap: 0.25rem;
`;

export const TypeButton = styled.button`
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
