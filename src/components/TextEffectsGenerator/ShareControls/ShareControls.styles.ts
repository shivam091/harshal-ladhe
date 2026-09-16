import { styled } from "@linaria/react";

// Horizontal row pairing the link preview with its copy button.
export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// Monospace readout of the permalink URL, underlined like TextControls' own manuscript blank rather than boxed in a recessed groove — this theme's chrome draws with rules, not insets.
export const LinkPreview = styled.span`
  flex: 1 1 auto;
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-block-end: 0.375rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.75rem;
  color: var(--color-fg-muted);
  border-block-end: 0.0625rem solid var(--color-border-default);
`;
