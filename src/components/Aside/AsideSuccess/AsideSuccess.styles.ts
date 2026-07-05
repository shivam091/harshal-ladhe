import { styled } from "@linaria/react";
import { BaseWrapper } from "@/components/Aside/Aside.styles";

// Success variant skin — green edge and muted success background.
export const SuccessWrapper = styled(BaseWrapper)`
  --aside-accent: var(--color-fg-success);
  --aside-bg: var(--color-bg-success-muted);
`;
