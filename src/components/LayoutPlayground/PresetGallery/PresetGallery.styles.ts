import { styled } from "@linaria/react";
import { SHEET_BLUE } from "@/components/LayoutPlayground/PreviewPane/PreviewPane.styles";

// Grid of preset tiles, wrapping to fit the side panel's own width.
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(6.5rem, 1fr));
  gap: 0.625rem;
`;

// One curated preset — a miniature drawing sheet plus its own name, styled like a small reference print pinned to the corkboard beside the main drafting table.
export const PresetTile = styled.button`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 0.5rem;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;
  cursor: pointer;
  transition: border-color 150ms ease, transform 150ms ease;

  &:hover {
    border-color: var(--color-fg-accent);
    transform: translateY(-0.0625rem);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: border-color 150ms ease;

    &:hover {
      transform: none;
    }
  }
`;

// The miniature cyanotype sheet a preset's own container renders onto — same fixed blueprint-blue exception as PreviewPane's own full-size DraftingSheet, scaled down.
export const PresetSheet = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  block-size: 3rem;
  overflow: hidden;
  background: ${SHEET_BLUE};
  border-radius: 0.1875rem;
`;

// One preset item's own drafted swatch — a flattened, non-interactive echo of PreviewPane's own Item hatch treatment, sized by the preset's real compiled style rather than a fixed shape.
export const PresetPart = styled.div`
  background-color: color-mix(in srgb, currentColor 20%, transparent);
  background-image: repeating-linear-gradient(
    135deg,
    color-mix(in srgb, currentColor 60%, transparent) 0,
    color-mix(in srgb, currentColor 60%, transparent) 0.0625rem,
    transparent 0.0625rem,
    transparent 0.25rem
  );
  border: 0.03125rem solid currentColor;
`;

// A preset's own name, e.g. "Holy Grail" — small monospace caption beneath its sheet.
export const PresetLabel = styled.span`
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--color-fg-default);
  text-align: center;
`;
