import { styled } from "@linaria/react";

// Same spin technique as Button's loading Spinner, reusing the globally-defined spin keyframe.
export const Spinner = styled.span`
  display: block;
  inline-size: var(--size-lg);
  block-size: var(--size-lg);
  border-radius: 50%;
  border: var(--border-width-medium) solid var(--color-border-muted);
  border-block-start-color: var(--color-fg-accent);
  animation: spin 0.9s ease-in-out infinite;
`;

// "Starting sandbox…" / bundler progress text ("[1/3] Downloading manifest", etc).
export const Message = styled.p`
  margin: var(--space-none);
  font-family: var(--font-stack-monospace);
  font-size: var(--font-size-xs);
  color: var(--color-fg-muted);
`;
