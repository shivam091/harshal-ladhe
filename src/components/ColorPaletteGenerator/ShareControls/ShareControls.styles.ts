import { styled } from "@linaria/react";

// Horizontal row pairing the link preview with its copy button.
export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// Truncated readout of the permalink URL, set like a printed order-slip reference number rather than a soft rounded groove.
export const LinkPreview = styled.span`
  flex: 1 1 auto;
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0.5rem 0.625rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.75rem;
  color: var(--color-fg-muted);
  background: var(--color-bg-muted);
  border: 0.0625rem dashed var(--color-border-default);
  border-radius: 0.25rem;
`;
