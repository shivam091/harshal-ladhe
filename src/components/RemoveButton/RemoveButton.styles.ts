import { styled } from "@linaria/react";
import Button from "@/components/Button";

// Stays neutral at rest so a row of remove buttons doesn't shout; turns danger only once the reader aims at one.
export const Root = styled(Button)`
  &&[data-variant="ghost"] {
    color: var(--color-fg-default);

    &:hover:not(:disabled) {
      color: var(--color-fg-danger);
    }
  }
`;
