import { styled } from "@linaria/react";

// Horizontal row pairing the link preview with its copy button.
export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// Truncated, monospace readout of the permalink URL, set into a recessed groove — an "engraved plate" reading matching TargetControls' own HelperText treatment.
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
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.375rem;
  box-shadow: inset 0 0.0625rem 0.1875rem color-mix(in srgb, var(--color-fg-default) 12%, transparent);
`;
