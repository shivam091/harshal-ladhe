import { styled } from "@linaria/react";

// Two narrow cards per row fit the 20rem side panel; one column would make six presets a long scroll.
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;
`;

// A pattern-piece card with a dashed cutting line, lighting up tape-yellow on hover or focus.
export const PresetCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.125rem;
  padding: 0.5rem 0.625rem;
  text-align: start;
  background: var(--color-bg-default);
  border: 0.0625rem dashed var(--color-border-default);
  border-radius: 0.25rem;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    border-style: solid;
    border-color: var(--color-fg-attention);
    background: color-mix(in srgb, var(--color-fg-attention) 8%, var(--color-bg-default));
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.125rem;
  }
`;

// The preset's name — the part people scan for.
export const PresetName = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-default);
`;

// The context in numbers, monospaced so "16px root" and "375×667" read as measurements.
export const PresetMeta = styled.span`
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.6875rem;
  color: var(--color-fg-muted);
`;
