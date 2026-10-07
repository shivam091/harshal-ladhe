import { styled } from "@linaria/react";
import { MONO_FONT } from "@/components/ViewboxExplorer/ViewboxExplorer.styles";

// The paste box — a negative sleeve for raw markup, monospace and resizable only vertically so it never breaks the tray.
export const SourceArea = styled.textarea`
  inline-size: 100%;
  min-block-size: 7rem;
  padding: 0.5rem 0.625rem;
  font-family: ${MONO_FONT};
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.375rem;
  resize: vertical;

  &:focus-visible {
    outline: 0.125rem solid var(--color-outline-focus, var(--color-fg-accent));
    outline-offset: 0.0625rem;
    border-color: var(--safelight);
  }
`;

// The paste box's visible label, matching the site's small muted field labels.
export const SourceLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-fg-muted);
`;

// Parser complaints in danger red, announced politely so a failed load is never silent.
export const ErrorText = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  color: var(--color-fg-danger);
`;
