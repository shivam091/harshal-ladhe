import { styled } from "@linaria/react";
import { BREAKPOINTS } from "@/constants/breakpoints";

/*
  Horizontal flex row containing the copyright notice (left) and share icons (right).
  Wraps to a vertical column on narrow viewports so neither side gets truncated.
*/
export const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-block-start: clamp(1.5rem, 2vw, 2rem);
  font-size: 0.875rem;
  color: var(--color-fg-muted);

  @media ${BREAKPOINTS.mobile} {
    flex-direction: column;
    align-items: flex-start;
    text-align: start;
    gap: 1rem;
  }
`;
