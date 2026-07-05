import { styled } from "@linaria/react";
import { BaseWrapper } from "@/components/Aside/Aside.styles";

// Quote variant skin — same accent palette as info, plus italic body text.
export const QuoteWrapper = styled(BaseWrapper)`
  --aside-accent: var(--color-fg-accent);
  --aside-bg: var(--color-bg-accent-muted);
  font-style: italic;
`;

// Large decorative opening quote mark — replaces the icon in the top-left slot.
export const QuoteChar = styled.span`
  display: block;
  font-family: 'Times New Roman', Times, serif;
  font-size: 4.5rem;
  line-height: 2.5rem;
  font-weight: bold;
  color: var(--aside-accent);
  user-select: none;
`;
