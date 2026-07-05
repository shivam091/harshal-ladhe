import { styled } from "@linaria/react";
import { BaseWrapper } from "@/components/Aside/Aside.styles";

// Info variant skin — accent-blue edge and muted accent background.
export const InfoWrapper = styled(BaseWrapper)`
  --aside-accent: var(--color-fg-accent);
  --aside-bg: var(--color-bg-accent-muted);
`;
