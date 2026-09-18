import { styled } from "@linaria/react";

// Stacks every field vertically — this panel is a narrow sidebar column, unlike InteractiveSvgPanel's wide auto-fit grid.
export const FieldsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

// Thumbnail row for picking which of the site's own photos backs the "image" preview subject.
export const ImageOptionRow = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const ImageOption = styled.button`
  inline-size: 2.5rem;
  block-size: 2.5rem;
  padding: 0;
  border: 0.125rem solid var(--color-border-muted);
  border-radius: 0.375rem;
  overflow: hidden;
  cursor: pointer;
  background: var(--color-bg-default);

  img {
    inline-size: 100%;
    block-size: 100%;
    object-fit: cover;
  }

  &[data-selected="true"] {
    border-color: var(--color-fg-accent);
  }
`;

// One row of three subject-type buttons (color/image/text) — a segmented control rather than a <select>, since there are only three, fixed, equally-weighted options.
export const SubjectRow = styled.div`
  display: flex;
  gap: 0.25rem;
`;

export const SubjectButton = styled.button`
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

export const TextInput = styled.input`
  inline-size: 100%;
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;
`;
