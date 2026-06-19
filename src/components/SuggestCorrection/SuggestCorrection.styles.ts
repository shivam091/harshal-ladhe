import { styled } from "@linaria/react";

// Matches the muted footer text so the prompt reads as part of the footer, not a call to action.
export const CorrectionNote = styled.p`
  margin-block: 1rem 0;
  font-size: 0.875rem;
  color: var(--color-fg-muted);

  a {
    color: inherit;
    text-underline-offset: 2px;

    &:hover {
      color: var(--color-fg-default);
    }
  }
`;
