import { styled } from "@linaria/react";

// Outer wrapper — block margin separates the disclosure from surrounding prose.
export const DetailsRoot = styled.div`
  margin-block: 1.5rem;
`;

// Toggle button — full-width, left-aligned, font-weight shifts to semi-bold when open.
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

  &[data-state="open"] {
    font-weight: 600;
  }

  svg {
    flex-shrink: 0;
    inline-size: 1.5rem;
    block-size: 1.5rem;
  }
`;

// Content padding — indented to sit under the text after the icon.
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
