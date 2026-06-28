import { styled } from "@linaria/react";

/*
  Horizontal flex row containing the copyright notice (left) and share icons (right).
  Wraps to a vertical column on narrow viewports so neither side gets truncated.
*/
export const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-base);
  margin-block-start: var(--fluid-space-lg);
  font-size: var(--font-size-sm);
  color: var(--color-fg-muted);

  @media (width < 48rem) {
    flex-direction: column;
    align-items: flex-start;
    text-align: start;
    gap: var(--space-base);
  }
`;
