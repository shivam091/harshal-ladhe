import { styled } from "@linaria/react";

// Two-column grid of preset swatches — a sidebar can comfortably fit two per row without either the swatch or its label losing legibility, unlike CronBuilder's single-column list of text-only preset rows.
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;
`;

// One preset — a swatch riding above its name, with a glass hover/focus ring rather than a background-fill highlight, so the swatch's own colors stay the focal point.
export const PresetButton = styled.button`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 0.375rem;
  background: transparent;
  border: 0.0625rem solid transparent;
  border-radius: 0.625rem;
  cursor: pointer;
  transition: border-color 150ms ease, background 150ms ease;

  &:hover,
  &:focus-visible {
    background: color-mix(in srgb, var(--color-bg-muted) 55%, transparent);
    border-color: color-mix(in srgb, var(--color-fg-accent) 45%, transparent);
  }
`;

// The preset's own colors at full saturation — deliberately not glass-tinted, the same exception StopEditor's Bar makes, since a translucent swatch would misrepresent the preset's real colors.
export const PresetSwatch = styled.div`
  inline-size: 100%;
  block-size: 2.5rem;
  border-radius: 0.5rem;
  background-size: cover;
`;

// The preset's name beneath its swatch.
export const PresetLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-fg-default);
  text-align: center;
`;
