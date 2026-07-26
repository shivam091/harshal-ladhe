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
  padding-inline: 0.75rem;
  border-block-start: 0.0625rem solid var(--color-border-muted);
  background: var(--color-bg-muted);
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.75rem;
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
