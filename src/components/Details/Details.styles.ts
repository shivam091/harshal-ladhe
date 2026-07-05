import { styled } from "@linaria/react";

// Block margin separates the disclosure from surrounding prose.
export const DetailsRoot = styled.div`
  margin-block: 1.5rem;
`;

// Full-width so the whole row is a hit target; bolder when open to mark the expanded state.
export const DetailsTrigger = styled.button`
  appearance: none;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0;
  background: none;
  border: 0;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-fg-default);
  text-align: start;
  inline-size: 100%;
  cursor: pointer;

  svg {
    flex-shrink: 0;
    inline-size: 1.5rem;
    block-size: 1.5rem;
  }
`;

// Indented to align with the summary text rather than the icon.
export const DetailsPanel = styled.div`
  padding-block: 0.5rem;
  padding-inline-start: 1.75rem;

  table {
    margin-block-start: 0.5rem;
  }

  ul {
    padding-inline-start: 1rem;
  }
`;
