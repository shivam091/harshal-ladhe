import { styled } from "@linaria/react";

/*
  Grows to fill the left side of the ContentFooter flex row.
  Link colour inherits from the surrounding muted text so it doesn't compete
  with the share icons on the right; hover lifts it to full default colour.
*/
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
