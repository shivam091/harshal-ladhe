import { styled } from "@linaria/react";

// Page-level h1 — soft text-shadow lifts it off image backgrounds; tracks theme via transition.
export const PageTitle = styled.h1`
  letter-spacing: 0.5px;
  margin-block-end: 2rem;
  color: var(--color-fg-heading);
`;
