import { styled } from "@linaria/react";

// "Something went wrong" title.
export const Title = styled.p`
  margin: 0;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 1rem;
  line-height: 1.6;
  font-weight: 600;
  color: var(--color-fg-danger);
`;

// The error's own message text, preformatted so multi-line bundler output keeps its line breaks.
export const Message = styled.pre`
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--color-fg-danger);
  background: var(--color-bg-transparent);
  border: 0;
  padding-block: clamp(0.75rem, 1vw, 1rem);
  padding-inline: 0;
`;

// "path/to/File.tsx:12:5" — only rendered when the error carries a known source location.
export const Location = styled.p`
  margin: 0;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.75rem;
  color: var(--color-fg-muted);
`;
