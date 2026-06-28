import { styled } from "@linaria/react";

// Inherits the muted footer colour so the licence link doesn't compete with the share icons.
export const CopyrightWrapper = styled.div`
  flex: 1 1 auto;

  a {
    color: inherit;
    text-underline-offset: 2px;

    &:hover {
      color: var(--color-fg-default);
    }
  }
`;
