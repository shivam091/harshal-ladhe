import { styled } from "@linaria/react";

// Monospace and boxed, unlike the underlined form fields — this one holds pasted source code, not a single value.
export const SourceTextarea = styled.textarea`
  inline-size: 100%;
  min-block-size: 7rem;
  padding: 0.5rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--color-fg-default);
  background: color-mix(in srgb, var(--color-bg-default) 85%, transparent);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;
  resize: vertical;

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.0625rem;
  }
`;

// The import action as a solid button — it replaces the whole form, so it deserves more weight than a text link.
export const ImportButton = styled.button`
  align-self: flex-start;
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-on-emphasis);
  background: var(--color-bg-accent-emphasis);
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// The result line after an import — coloured by outcome so a paste with no recognised tags is obvious at a glance.
export const StatusText = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: var(--color-fg-success);

  &[data-tone="warn"] {
    color: var(--color-fg-attention);
  }
`;
