import { styled } from "@linaria/react";

/*
  One preset card per row, so each pattern gets the panel's full width before it has to truncate.
  Capped and scrollable so twenty-odd cards don't stretch the sticky sidebar past the viewport; the
  stable gutter stops the cards reflowing when the scrollbar appears.
*/
export const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0.5rem;
  max-block-size: 22rem;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-gutter: stable;
`;

// One preset as a small index card — dashed border and a warm hover tint rather than a plain button, so picking a preset feels like pulling a card from a recipe box.
export const PresetCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.1875rem;
  padding: 0.5rem 0.625rem;
  text-align: start;
  background: var(--color-bg-default);
  border: 0.0625rem dashed var(--color-border-muted);
  border-radius: 0.375rem;
  cursor: pointer;
  transition: border-color 150ms ease, background 150ms ease;

  &:hover {
    border-color: var(--color-fg-attention);
    background: color-mix(in srgb, var(--color-fg-attention) 8%, transparent);
  }
`;

// A preset's human-readable name, e.g. "Email address".
export const PresetName = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-default);
`;

// A preset's own pattern/flags, truncated to fit the card.
export const PresetPattern = styled.span`
  overflow: hidden;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.6875rem;
  color: var(--color-fg-muted);
  white-space: nowrap;
  text-overflow: ellipsis;
  max-inline-size: 100%;
`;
