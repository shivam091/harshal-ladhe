import { styled } from "@linaria/react";

// Stacks every field vertically — this panel is a narrow sidebar column, matching ShapeControls' own FieldsColumn.
export const FieldsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

// Two-button segmented control for the open/closed toggle — mirrors ShapeControls' SubjectRow/SubjectButton (only two, fixed, equally-weighted options, so a <select> would be overkill).
export const ClosedRow = styled.div`
  display: flex;
  gap: 0.25rem;
`;

export const ClosedButton = styled.button`
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

// Inline checkbox + label row for the fill toggle, distinct from FieldWrapper's stacked default layout.
export const FillRow = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-fg-muted);
  cursor: pointer;
`;
