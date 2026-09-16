import { styled } from "@linaria/react";

// Row pairing the permalink preview with its copy button.
export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// Truncated monospace preview of the permalink, glass-tinted like every other inset field in this tool.
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
  background: color-mix(in srgb, var(--color-bg-muted) 60%, transparent);
  border: 0.0625rem solid color-mix(in srgb, var(--color-border-default) 55%, transparent);
  border-radius: 0.375rem;
`;
