import { styled } from "@linaria/react";

// Two columns fit four presets as a tidy square on the side card.
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;
`;

// Each preset as a sticky note — a tinted square with a slight lift, so it reads as something to grab off the board.
export const PresetCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.125rem;
  padding: 0.5rem 0.625rem;
  text-align: start;
  background: color-mix(in srgb, var(--color-fg-attention) 14%, var(--color-bg-default));
  border: none;
  border-radius: 0.125rem;
  box-shadow: 0 0.125rem 0.25rem color-mix(in srgb, black 18%, transparent);
  cursor: pointer;
  transition: translate 150ms ease, box-shadow 150ms ease;

  &:hover {
    translate: 0 -0.0625rem;
    box-shadow: 0 0.25rem 0.5rem color-mix(in srgb, black 22%, transparent);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.125rem;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover {
      translate: none;
    }
  }
`;

// The preset's name, in full-strength text.
export const PresetName = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-default);
`;

// A few words on what the preset demonstrates.
export const PresetMeta = styled.span`
  font-size: 0.6875rem;
  color: var(--color-fg-muted);
`;
