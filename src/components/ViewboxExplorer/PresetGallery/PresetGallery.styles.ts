import { styled } from "@linaria/react";
import { MONO_FONT } from "@/components/ViewboxExplorer/ViewboxExplorer.styles";

// As many contact-sheet frames per row as fit — eight presets wrap more evenly with auto-fill than a fixed count.
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
  gap: 0.5rem;
`;

// Each preset as a frame on a contact sheet: a thumbnail of the paper and its framing, then the title and a one-line hint.
export const PresetCard = styled.button`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 0.5rem;
  text-align: start;
  background: color-mix(in srgb, black 12%, var(--color-bg-default));
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.25rem;
  cursor: pointer;
  transition: border-color 150ms ease;

  &:hover {
    border-color: var(--safelight);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-outline-focus, var(--color-fg-accent));
    outline-offset: 0.125rem;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

// The thumbnail well — a fixed-height strip of baseboard so differently shaped papers line up.
export const Thumb = styled.svg`
  display: block;
  inline-size: 100%;
  block-size: 3.5rem;
  background: color-mix(in srgb, var(--color-bg-muted) 55%, black);
  border-radius: 0.125rem;
  overflow: hidden;
`;

// The frame's title, stamped in the room's monospace.
export const PresetName = styled.span`
  font-family: ${MONO_FONT};
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-fg-default);
`;

// One line on what the preset demonstrates.
export const PresetHint = styled.span`
  font-size: 0.6875rem;
  line-height: 1.4;
  color: var(--color-fg-muted);
`;
