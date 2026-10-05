import { styled } from "@linaria/react";

/*
  "Tailor's Bench" shell — a length of woven cloth on a cutting table with a tailor's measuring tape
  laid along its top edge and a stitched hem running round the inside, distinct from every other
  goodie's shell (Console, Annotation Desk, Elevation Stack, Live Canvas, Editorial Stage, Optics
  Bench, Clay Studio, Blueprint Grid, Swatch Fan, Docking Bay, Ledger Sheet, Cutting Mat, Light
  Table, Oscilloscope, Mixing Bench, Type Specimen, Drafting Compass, Terminal Split). The weave is
  two crossed thread gradients rather than an image so it re-tints with the theme, and the tape is
  mixed from the attention token so it reads as tape-measure yellow in light and dark alike.
*/
export const TailorsBench = styled.div`
  --tape-colour: color-mix(in srgb, var(--color-fg-attention) 45%, var(--color-bg-default));
  --tape-ink: color-mix(in srgb, var(--color-fg-default) 80%, var(--color-fg-attention));
  --thread: color-mix(in srgb, var(--color-fg-default) 6%, transparent);

  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-block: clamp(0.75rem, 1vw, 1rem);
  padding: clamp(1rem, 3vw, 1.75rem);
  padding-block-start: clamp(2.25rem, 5vw, 2.75rem);
  background-color: color-mix(in srgb, var(--color-fg-default) 3%, var(--color-bg-muted));
  background-image:
    repeating-linear-gradient(0deg, var(--thread) 0 0.0625rem, transparent 0.0625rem 0.25rem),
    repeating-linear-gradient(90deg, var(--thread) 0 0.0625rem, transparent 0.0625rem 0.25rem),
    repeating-linear-gradient(45deg, color-mix(in srgb, var(--color-fg-default) 2%, transparent) 0 0.125rem, transparent 0.125rem 0.5rem);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.5rem;
  outline: 0.0625rem dashed color-mix(in srgb, var(--color-fg-muted) 45%, transparent);
  outline-offset: -0.5rem;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset-block-start: 0.625rem;
    inset-inline: -1rem;
    block-size: 1.125rem;
    background-color: var(--tape-colour);
    background-image:
      repeating-linear-gradient(to right, var(--tape-ink) 0 0.0625rem, transparent 0.0625rem 0.5rem),
      repeating-linear-gradient(to right, var(--tape-ink) 0 0.0625rem, transparent 0.0625rem 2.5rem);
    background-size:
      100% 0.3125rem,
      100% 0.625rem;
    background-repeat: repeat-x;
    background-position:
      0 0,
      0 0;
    box-shadow: 0 0.0625rem 0.125rem color-mix(in srgb, var(--color-fg-default) 20%, transparent);
    transform: rotate(-0.6deg);
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    inset-block-end: 1.25rem;
    inset-inline-end: 1.5rem;
    inline-size: 3.5rem;
    block-size: 2.25rem;
    background: color-mix(in srgb, var(--color-fg-muted) 10%, transparent);
    clip-path: polygon(0 0, 100% 0, 50% 100%);
    transform: rotate(18deg);
    pointer-events: none;
  }
`;

// Sits above the decorative weave and chalk so the controls stay clickable over the pseudo-elements.
export const ToolbarRow = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

// Square icon buttons with a stitched-patch border, so undo/redo/reset read as part of the bench rather than generic chrome.
export const ToolbarButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2rem;
  block-size: 2rem;
  padding: 0;
  border: 0.0625rem dashed var(--color-border-default);
  border-radius: 0.25rem;
  background: color-mix(in srgb, var(--color-bg-default) 85%, transparent);
  color: var(--color-fg-muted);
  cursor: pointer;
  transition: color 150ms ease, background 150ms ease, border-color 150ms ease;

  &:hover:not(:disabled) {
    color: var(--color-fg-default);
    background: color-mix(in srgb, var(--color-fg-attention) 14%, var(--color-bg-default));
    border-color: var(--color-fg-attention);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-outline-focus, var(--color-fg-accent));
    outline-offset: 0.125rem;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

// Side panel collapses under the main column on narrow screens; the 20rem side column matches every other goodie's grid.
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

// min-inline-size: 0 lets wide children (the tape, code blocks) scroll inside rather than stretching the grid track.
export const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-inline-size: 0;
`;

// Same overflow guard as SidePanel — the tape is often far wider than this column.
export const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-inline-size: 0;
`;

// A swatch of plain cloth pinned to the bench — mostly opaque so text stays legible over the weave.
export const SectionCard = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.875rem;
  background: color-mix(in srgb, var(--color-bg-default) 92%, transparent);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.375rem;
  box-shadow: 0 0.0625rem 0.1875rem color-mix(in srgb, var(--color-fg-default) 8%, transparent);
`;

// A small tape-yellow tab before each title, like the coloured tag sewn into a garment's seam.
export const PanelTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-fg-default);

  &::before {
    content: "";
    inline-size: 0.75rem;
    block-size: 0.375rem;
    background: var(--tape-colour);
    border: 0.0625rem solid color-mix(in srgb, var(--color-fg-attention) 60%, transparent);
    border-radius: 0.0625rem;
  }
`;

// Muted helper copy under a panel title — shared so every card's explanatory line looks the same.
export const PanelHint = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--color-fg-muted);
`;
