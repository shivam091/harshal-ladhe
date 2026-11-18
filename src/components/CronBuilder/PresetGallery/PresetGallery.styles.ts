import { styled } from "@linaria/react";

// Scrollable stack of compact rows — a narrow sidebar can't fit a 2-column grid of 20-odd presets without either column looking half-empty or every card losing its cron-line legibility.
export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  max-block-size: 18rem;
  overflow-y: auto;
  scrollbar-width: thin;
  margin-inline: -0.25rem;
  padding-inline: 0.25rem;
`;

export const PresetRow = styled.button`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.0625rem;
  padding: 0.5rem 0.625rem 0.5rem 0.75rem;
  text-align: start;
  background: transparent;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 150ms ease;

  &::before {
    content: "";
    position: absolute;
    inset-block: 0.25rem;
    inset-inline-start: 0;
    inline-size: 0.1875rem;
    border-radius: 0.125rem;
    background: transparent;
    transition: background 150ms ease;
  }

  &:hover {
    background: var(--color-bg-muted);
  }

  &:hover::before {
    background: var(--color-fg-accent);
  }
`;

export const PresetName = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-default);
`;

export const PresetLine = styled.span`
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.6875rem;
  color: var(--color-fg-muted);
`;
