import { styled } from "@linaria/react";

// Same spin technique as Button's loading Spinner, reusing the globally-defined spin keyframe.
export const Spinner = styled.span`
  display: block;
  inline-size: 1.5rem;
  block-size: 1.5rem;
  border-radius: 50%;
  border: 0.125rem solid var(--color-border-muted);
  border-block-start-color: var(--color-fg-accent);
  animation: spin 0.9s ease-in-out infinite;
  will-change: transform;
`;

// "Starting sandbox…" / bundler progress text ("[1/3] Downloading manifest", etc).
export const Message = styled.p`
  margin: 0;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.75rem;
  color: var(--color-fg-muted);
`;
