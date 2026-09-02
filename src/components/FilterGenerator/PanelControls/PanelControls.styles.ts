import { styled } from "@linaria/react";

// Two-way segmented control for preview subject — matches every other goodie's own segmented-button treatment.
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
