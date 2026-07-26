import { styled } from "@linaria/react";

// "Something went wrong" title.
export const Title = styled.p`
  margin: var(--space-none);
  font-family: var(--font-stack-monospace);
  font-size: var(--font-size-base);
  line-height: var(--line-height-code);
  font-weight: 600;
  color: var(--color-fg-danger);
`;

// The error's own message text, preformatted so multi-line bundler output keeps its line breaks.
export const Message = styled.pre`
  margin: var(--space-none);
  white-space: pre-wrap;
  word-break: break-word;
  font-family: var(--font-stack-monospace);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-code);
  color: var(--color-fg-danger);
  background: var(--color-bg-transparent);
  border: var(--border-width-none);
  padding-block: var(--fluid-space-md);
  padding-inline: var(--space-none);
`;

// "path/to/File.tsx:12:5" — only rendered when the error carries a known source location.
export const Location = styled.p`
  margin: var(--space-none);
  font-family: var(--font-stack-monospace);
  font-size: var(--font-size-xs);
  color: var(--color-fg-muted);
`;
