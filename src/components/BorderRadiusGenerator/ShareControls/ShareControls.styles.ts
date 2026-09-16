import { styled } from "@linaria/react";

// Horizontal row pairing the link preview with its copy button.
export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// Truncated readout of the permalink URL, pressed into a soft rounded groove — the "clay studio" reading of the same treatment every other goodie's own ShareControls uses.
export const LinkPreview = styled.span`
  flex: 1 1 auto;
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  color: var(--color-fg-muted);
  background: var(--color-bg-muted);
  border-radius: 999px;
  box-shadow: inset 0 0.0625rem 0.1875rem color-mix(in srgb, var(--color-fg-default) 12%, transparent);
`;
