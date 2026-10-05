import { styled } from "@linaria/react";

// Link preview beside its copy button on one line.
export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// The permalink itself, truncated with an ellipsis — enough to show it's a real URL without letting a long `?state=` blow out the card.
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
  background: color-mix(in srgb, var(--sheet-pencil) 5%, var(--color-bg-default));
  border: 0.0625rem dashed var(--sheet-rule);
  border-radius: 0.25rem;
`;
