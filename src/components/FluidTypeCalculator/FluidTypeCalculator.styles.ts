import { styled } from "@linaria/react";

/*
  "Type Specimen" shell — a printer's point-size specimen sheet, distinct from every other
  goodie's shell (Console, Annotation Desk, Elevation Stack, Live Canvas, Editorial Stage, Optics
  Bench, Clay Studio, Blueprint Grid, Swatch Fan, Docking Bay, Ledger Sheet, Cutting Mat, Light
  Table, Oscilloscope, Mixing Bench). A ruler-tick strip runs along the top edge the way a
  point-size ruler prints along a specimen sheet, and a huge, near-invisible watermark glyph sits
  in the corner — a nod to type specimens' own oversized letterform showcases. Cream rather than
  any other goodie's cool/dark backdrop, and the one shell using a serif accent typeface, since
  this tool is fundamentally about type.
*/
export const TypeSpecimen = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-block: clamp(0.75rem, 1vw, 1rem);
  padding: clamp(1rem, 3vw, 1.75rem);
  padding-block-start: clamp(1.75rem, 4vw, 2.25rem);
  background: color-mix(in srgb, var(--color-fg-heading) 4%, var(--color-bg-muted));
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.5rem;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset-block-start: 0;
    inset-inline: 0;
    block-size: 0.875rem;
    background-image: repeating-linear-gradient(
        to right,
        color-mix(in srgb, var(--color-fg-heading) 45%, transparent) 0,
        color-mix(in srgb, var(--color-fg-heading) 45%, transparent) 0.0625rem,
        transparent 0.0625rem,
        transparent 0.5rem
      ),
      repeating-linear-gradient(
        to right,
        color-mix(in srgb, var(--color-fg-heading) 45%, transparent) 0,
        color-mix(in srgb, var(--color-fg-heading) 45%, transparent) 0.0625rem,
        transparent 0.0625rem,
        transparent 2.5rem
      );
    background-size:
      100% 0.375rem,
      100% 0.875rem;
    background-position:
      0 100%,
      0 100%;
    background-repeat: repeat-x;
    border-block-end: 0.0625rem solid var(--color-border-muted);
  }

  &::after {
    content: "Aa";
    position: absolute;
    inset-block-end: -2.5rem;
    inset-inline-end: -0.5rem;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 10rem;
    font-weight: 700;
    line-height: 1;
    color: color-mix(in srgb, var(--color-fg-heading) 5%, transparent);
    pointer-events: none;
    user-select: none;
  }
`;

export const ToolbarRow = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const ToolbarButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  inline-size: 2rem;
  block-size: 2rem;
  padding: 0;
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.1875rem;
  background: color-mix(in srgb, var(--color-bg-default) 85%, transparent);
  color: var(--color-fg-muted);
  cursor: pointer;
  transition: color 150ms ease, background 150ms ease, border-color 150ms ease;

  &:hover:not(:disabled) {
    color: var(--color-fg-heading);
    background: color-mix(in srgb, var(--color-fg-heading) 10%, transparent);
    border-color: color-mix(in srgb, var(--color-fg-heading) 35%, transparent);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const GeneratorGrid = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;

  @media (min-width: 60rem) {
    grid-template-columns: 20rem minmax(0, 1fr);
    align-items: start;
  }
`;

export const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-inline-size: 0;
`;

export const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-inline-size: 0;
`;

export const SectionCard = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.875rem;
  background: color-mix(in srgb, var(--color-bg-default) 90%, transparent);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.375rem;
`;

export const PanelTitle = styled.h3`
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 0.875rem;
  font-weight: 700;
  font-style: italic;
  letter-spacing: 0.01em;
  color: var(--color-fg-heading);
`;
