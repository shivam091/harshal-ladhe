import { styled } from "@linaria/react";
import { MONO_FONT } from "@/components/ShaderPlayground/ShaderPlayground.styles";

// As many cartridges per row as fit — seven presets wrap more evenly with auto-fill than with a fixed column count.
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
  gap: 0.5rem;
`;

// Each preset as a game cartridge: a label strip on top (the swatch) and the title stamped underneath.
export const PresetCard = styled.button`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 0.375rem 0.375rem 0.5rem;
  text-align: start;
  background: color-mix(in srgb, black 15%, var(--color-bg-default));
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.375rem 0.375rem 0.125rem 0.125rem;
  cursor: pointer;
  transition: border-color 150ms ease, transform 150ms ease;

  &:hover {
    border-color: var(--cabinet-neon);
    transform: translateY(-0.0625rem);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.125rem;
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover {
      transform: none;
    }
  }
`;

// The cartridge's label art — a two-stop gradient from the preset's swatch, a hint of its palette without a WebGL context per card.
export const PresetSwatch = styled.span`
  display: block;
  block-size: 2rem;
  border-radius: 0.25rem;
`;

// The cartridge title, stamped in the cabinet's monospace.
export const PresetName = styled.span`
  font-family: ${MONO_FONT};
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-fg-default);
`;
