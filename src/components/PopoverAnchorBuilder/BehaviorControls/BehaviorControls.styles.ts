import { styled } from "@linaria/react";

// Local copy of TechniqueControls' own segmented-toggle pair, used here for the auto/manual popover mode choice — every goodie owns its copy rather than reaching into another tool's styles file.
export const SegmentRow = styled.div`
  display: flex;
  gap: 0.25rem;
`;

export const SegmentButton = styled.button`
  flex: 1 1 auto;
  padding: 0.375rem 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-muted);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.375rem;
  cursor: pointer;

  &[data-selected="true"] {
    color: var(--color-fg-on-emphasis);
    background: var(--color-bg-accent-emphasis);
    border-color: var(--color-bg-accent-emphasis);
  }
`;
