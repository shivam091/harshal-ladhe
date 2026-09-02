import { styled } from "@linaria/react";

export const TextInput = styled.input`
  inline-size: 100%;
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;
`;

// Read-only preview of the selected step's own compiled clamp() value — lets someone sanity-check one step's output without opening the full multi-step ExportPanel below.
export const ClampPreview = styled.code`
  display: block;
  padding: 0.5rem 0.625rem;
  overflow-x: auto;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.75rem;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.25rem;
  white-space: pre;
`;
