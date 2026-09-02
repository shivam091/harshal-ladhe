import { styled } from "@linaria/react";

// The "page" the text sits on — its own background is set inline per-render to state.pageColor, since several presets (Neon Glow, Glitch) only read correctly against a dark page.
export const PreviewStage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-block-size: 12rem;
  padding: 1.5rem;
  overflow: hidden;
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.5rem;
`;

export const PreviewText = styled.span`
  max-inline-size: 100%;
  overflow-wrap: break-word;
  text-align: center;
  line-height: 1.2;
`;
