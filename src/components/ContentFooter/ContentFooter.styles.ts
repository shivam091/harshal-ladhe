import { styled } from "@linaria/react";
import { BREAKPOINTS } from "@/constants/breakpoints";

// Wraps to a column on narrow viewports so neither the notice nor the share icons get truncated.
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
