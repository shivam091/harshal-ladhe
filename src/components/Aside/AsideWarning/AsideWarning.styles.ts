import { styled } from "@linaria/react";
import { BaseWrapper } from "@/components/Aside/Aside.styles";

// Warning variant skin — amber/attention edge and muted attention background.
export const WarningWrapper = styled(BaseWrapper)`
  --aside-accent: var(--color-fg-attention);
  --aside-bg: var(--color-bg-attention-muted);
`;
