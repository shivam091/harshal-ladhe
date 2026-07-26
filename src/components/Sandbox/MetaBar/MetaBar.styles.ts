import { styled } from "@linaria/react";
import { dotSeparatorCss } from "@/components/common.styles";

/*
  Thin status bar shared by the editor and preview columns; each renders its own copy so width
  always matches its column with no cross-column sync needed.
*/
export const Root = styled.div`
  display: flex;
  align-items: center;
  block-size: 28px;
  flex-shrink: 0;
  padding-inline: var(--space-md);
  border-block-start: var(--border-width-default) solid var(--color-border-muted);
  background: var(--color-bg-muted);
  font-family: var(--font-stack-monospace);
  font-size: var(--font-size-xs);
  color: var(--color-fg-muted);

  ${dotSeparatorCss}
`;

// "Ln X, Col Y".
export const Position = styled.span``;

// Selection stats — only rendered while there's an active, non-empty selection.
export const SelectionInfo = styled.span`
  color: var(--color-fg-muted);
`;

// A single "Ready in …" / "Updated in …" stat.
export const Metric = styled.span``;
