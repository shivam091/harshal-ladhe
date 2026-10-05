import { styled } from "@linaria/react";

// Four across on wide cards, reflowing to two or three on narrower ones.
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(4.25rem, 1fr));
  gap: 0.5rem;
`;

// One preset tile — a miniature exposure track over its name.
export const PresetButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.25rem;
  padding: 0.5rem 0.375rem;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--sheet-rule);
  border-radius: 0.25rem;
  cursor: pointer;

  &:hover {
    border-color: var(--sheet-pencil);
    background: color-mix(in srgb, var(--sheet-pencil) 8%, var(--color-bg-default));
  }

  &:focus-visible {
    outline: 0.125rem solid var(--sheet-pencil);
    outline-offset: 0.125rem;
  }
`;

// The thumbnail's SVG canvas, stretched to the tile width.
export const PresetSvg = styled.svg`
  display: block;
  inline-size: 100%;
  block-size: 0.875rem;
  overflow: visible;
`;

// The thumbnail's rule line.
export const PresetRule = styled.line`
  stroke: var(--sheet-rule);
  stroke-width: 1;
`;

// One keyframe diamond on the thumbnail.
export const PresetDiamond = styled.rect`
  fill: var(--sheet-pencil);
  stroke: var(--color-bg-default);
  stroke-width: 0.75;
`;

// Preset name under its thumbnail.
export const PresetLabel = styled.span`
  font-size: 0.625rem;
  color: var(--color-fg-muted);
  text-align: center;
`;
