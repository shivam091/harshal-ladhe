import { styled } from "@linaria/react";
import { HAND_FONT } from "@/components/ShapeToPathConverter/ShapeToPathConverter.styles";

// The format tabs, ruled off underneath like a margin heading.
export const TabRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  border-block-end: 0.0625rem solid var(--book-pencil);
`;

// One format tab; the selected one is underlined in biro as if picked out with a ruler.
export const Tab = styled.button`
  padding: 0.375rem 0.75rem;
  font-family: ${HAND_FONT};
  font-size: 0.875rem;
  color: var(--color-fg-muted);
  background: transparent;
  border: 0;
  border-block-end: 0.1875rem solid transparent;
  margin-block-end: -0.0625rem;
  cursor: pointer;

  &[aria-selected="true"] {
    color: var(--book-ink);
    border-block-end-color: var(--book-ink);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--book-ink);
    outline-offset: -0.125rem;
  }
`;
