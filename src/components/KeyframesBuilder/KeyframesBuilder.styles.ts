import { styled } from "@linaria/react";

/*
  "Dope Sheet" shell — an animator's exposure sheet, distinct from every other goodie's shell
  (Console, Annotation Desk, Elevation Stack, Live Canvas, Editorial Stage, Optics Bench, Clay
  Studio, Blueprint Grid, Swatch Fan, Docking Bay, Ledger Sheet, Cutting Mat, Light Table,
  Oscilloscope, Mixing Bench, Type Specimen, Drafting Compass, Terminal Split). Pencil-yellow ruled
  paper between two strips of sprocket-holed film stock, the way keyframes were timed out frame by
  frame long before timelines were software. Every colour is color-mixed from theme tokens
  (attention for the pencil, bg/border for the paper and rules), so the sheet holds up in light and
  dark. The film strips only feed while the preview plays — and never under prefers-reduced-motion.
*/
export const DopeSheet = styled.div`
  --sprocket-strip: 1rem;
  --sheet-pencil: var(--color-fg-attention);
  --sheet-paper: color-mix(in srgb, var(--color-fg-attention) 6%, var(--color-bg-default));
  --sheet-rule: color-mix(in srgb, var(--color-fg-attention) 24%, var(--color-border-muted));
  --sheet-film: color-mix(in srgb, var(--color-fg-attention) 30%, color-mix(in srgb, var(--color-bg-default) 35%, black));

  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-block: clamp(0.75rem, 1vw, 1rem);
  padding-block: clamp(1rem, 3vw, 1.75rem);
  padding-inline: calc(var(--sprocket-strip) + clamp(0.625rem, 2.5vw, 1.5rem));
  background-color: var(--sheet-paper);
  background-image: repeating-linear-gradient(
    to bottom,
    transparent 0 1.4375rem,
    color-mix(in srgb, var(--sheet-rule) 45%, transparent) 1.4375rem 1.5rem
  );
  border: 0.0625rem solid var(--sheet-rule);
  border-radius: 0.5rem;
  overflow: hidden;

  @media (min-width: 40rem) {
    --sprocket-strip: 1.375rem;
  }

  &::before,
  &::after {
    content: "";
    position: absolute;
    inset-block: 0;
    inline-size: var(--sprocket-strip);
    background-color: var(--sheet-film);
    background-image: linear-gradient(to bottom, var(--sheet-paper) 0 0.625rem, transparent 0.625rem);
    background-size: 0.5rem 1.125rem;
    background-repeat: repeat-y;
    background-position: center 0.25rem;
    animation: dope-sheet-feed 0.75s linear infinite paused;
    pointer-events: none;
  }

  &::before {
    inset-inline-start: 0;
  }

  &::after {
    inset-inline-end: 0;
  }

  &[data-playing="true"]::before,
  &[data-playing="true"]::after {
    animation-play-state: running;
  }

  @media (prefers-reduced-motion: reduce) {
    &::before,
    &::after {
      animation: none;
    }
  }

  @keyframes dope-sheet-feed {
    to {
      background-position: center 1.375rem;
    }
  }
`;

// The sheet's header strip — title block on one side, the transport-independent undo/redo/reset on the other, wrapping on narrow screens.
export const SheetHeader = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding-block-end: 0.75rem;
  border-block-end: 0.125rem solid var(--sheet-rule);
`;

// Title block lettered like the production slug at the top of a real exposure sheet.
export const SheetTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-fg-default);
`;

// The "SC · SHEET · FPS" slug line under the title — muted, since it's flavour rather than a control.
export const SheetSlug = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: var(--color-fg-muted);
`;

// Undo/redo/reset cluster, boxed like a pencilled-in margin note.
export const ToolbarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem;
  background: var(--color-bg-default);
  border: 0.0625rem dashed var(--sheet-rule);
  border-radius: 0.375rem;
`;

// Square icon button; the hover is a pencil-yellow wash rather than the site accent, keeping the sheet's palette consistent.
export const ToolbarButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2rem;
  block-size: 2rem;
  padding: 0;
  border: none;
  border-radius: 0.25rem;
  background: transparent;
  color: var(--color-fg-muted);
  cursor: pointer;
  transition: color 150ms ease, background 150ms ease;

  &:hover:not(:disabled) {
    color: var(--color-fg-default);
    background: color-mix(in srgb, var(--sheet-pencil) 18%, transparent);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--sheet-pencil);
    outline-offset: 0.125rem;
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

// Two-up row for the keyframe inspector and the animation settings — side by side once there's room, stacked on phones.
export const EditorRow = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;
  align-items: start;

  @media (min-width: 48rem) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

// Export alongside presets/share — the code gets the wide column, the gallery the narrow one.
export const GeneratorGrid = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;

  @media (min-width: 60rem) {
    grid-template-columns: minmax(0, 1fr) 20rem;
    align-items: start;
  }
`;

// Stacking column for the wide side of GeneratorGrid; min-inline-size: 0 lets long code lines scroll instead of blowing out the grid.
export const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-inline-size: 0;
`;

// Stacking column for the narrow side of GeneratorGrid.
export const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-inline-size: 0;
`;

/*
  A sheet section — an opaque card laid over the ruled paper, with a pencil-yellow tab down its
  leading edge like the coloured column headers that divide an exposure sheet into action, dialogue,
  and camera.
*/
export const SectionCard = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-inline-size: 0;
  padding: 0.875rem;
  padding-inline-start: 1.125rem;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--sheet-rule);
  border-radius: 0.375rem;
  box-shadow: 0 0.0625rem 0 0 var(--sheet-rule);

  &::before {
    content: "";
    position: absolute;
    inset-block: 0.5rem;
    inset-inline-start: 0.375rem;
    inline-size: 0.1875rem;
    border-radius: 0.125rem;
    background: color-mix(in srgb, var(--sheet-pencil) 70%, transparent);
  }
`;

/*
  Cel variant — a sheet of clear acetate laid on top, for the keyframe inspector: a faint diagonal
  sheen and the three registration peg holes punched along its top edge, since the stop being edited
  is literally one drawing in the sequence.
*/
export const CelCard = styled(SectionCard)`
  padding-block-start: 1.5rem;
  background:
    linear-gradient(135deg, color-mix(in srgb, white 10%, transparent), transparent 45%),
    color-mix(in srgb, var(--sheet-pencil) 4%, var(--color-bg-default));

  &::after {
    content: "";
    position: absolute;
    inset-block-start: 0.5rem;
    inset-inline-start: 50%;
    inline-size: 4.5rem;
    block-size: 0.5rem;
    transform: translateX(-50%);
    background:
      radial-gradient(circle at 0.25rem 50%, var(--sheet-rule) 0.1875rem, transparent 0.21875rem),
      radial-gradient(ellipse 0.75rem 0.25rem at 50% 50%, var(--sheet-rule) 98%, transparent),
      radial-gradient(circle at calc(100% - 0.25rem) 50%, var(--sheet-rule) 0.1875rem, transparent 0.21875rem);
    pointer-events: none;
  }
`;

// Section heading with a pencil-yellow highlighter stroke under the lower half of the letters, the way a timing note gets marked up on paper.
export const PanelTitle = styled.h3`
  align-self: flex-start;
  margin: 0;
  padding-inline: 0.125rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-fg-default);
  background: linear-gradient(to bottom, transparent 55%, color-mix(in srgb, var(--sheet-pencil) 35%, transparent) 55%);
`;

// Small explanatory line inside a card — muted so it never competes with the controls.
export const HelperText = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  color: var(--color-fg-muted);
`;
