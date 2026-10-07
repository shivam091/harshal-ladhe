import { styled } from "@linaria/react";

// One monospace stack for every path command, so the generated `d` reads as code even on handwritten pages.
export const MONO_FONT = "'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

// A handwriting stack from fonts most systems already ship, for headings and the teacher's marks, without loading a web font.
export const HAND_FONT = "'Segoe Print', 'Bradley Hand', 'Chalkboard SE', 'Comic Sans MS', 'Comic Neue', cursive";

/*
  "Exercise Book" shell — a school maths exercise book, distinct from every other goodie's shell
  (Console, Annotation Desk, Elevation Stack, Live Canvas, Editorial Stage, Optics Bench, Clay
  Studio, Blueprint Grid, Swatch Fan, Docking Bay, Ledger Sheet, Cutting Mat, Light Table,
  Oscilloscope, Mixing Bench, Type Specimen, Drafting Compass, Terminal Split, Arcade Cabinet).
  Squared paper with a red double margin line down the left, blue biro for the pupil's working
  and red pen for the teacher's marks, since converting a shape to a path is a sum shown in full.
  Every colour is a color-mix of the theme's accent/danger/attention tokens, so the page re-inks
  itself for light and dark. The custom properties are declared once here and inherited by every
  panel, including the canvas's own squared paper.
*/
export const ExerciseBook = styled.div`
  --book-ink: var(--color-fg-accent);
  --book-pen: var(--color-fg-danger);
  --book-pencil: color-mix(in srgb, var(--color-fg-muted) 80%, var(--color-fg-default));
  --book-grid: color-mix(in srgb, var(--color-fg-accent) 15%, transparent);
  --book-paper: color-mix(in srgb, var(--color-bg-default) 94%, var(--color-fg-attention));
  --book-margin: clamp(1.75rem, 5vw, 3rem);

  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-block: clamp(0.75rem, 1vw, 1rem);
  padding-block: clamp(1rem, 3vw, 1.5rem);
  padding-inline: calc(var(--book-margin) + clamp(0.75rem, 2vw, 1.25rem)) clamp(0.75rem, 3vw, 1.5rem);
  background-color: var(--book-paper);
  background-image:
    linear-gradient(to right, var(--book-grid) 0.0625rem, transparent 0.0625rem),
    linear-gradient(to bottom, var(--book-grid) 0.0625rem, transparent 0.0625rem);
  background-size: 1.25rem 1.25rem;
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.25rem 0.75rem 0.75rem 0.25rem;
  box-shadow:
    inset 0.375rem 0 0.5rem -0.375rem color-mix(in srgb, black 25%, transparent),
    0 0.25rem 0.75rem -0.375rem color-mix(in srgb, black 30%, transparent);

  &::before {
    content: "";
    position: absolute;
    inset-block: 0;
    inset-inline-start: var(--book-margin);
    inline-size: 0.25rem;
    background: linear-gradient(to right, var(--book-pen) 0 0.0625rem, transparent 0.0625rem 0.1875rem, var(--book-pen) 0.1875rem 0.25rem);
    opacity: 0.7;
    pointer-events: none;
  }
`;

/*
  The exercise book's cover label — a bordered name plate with the handwritten subject filled in,
  plus the toolbar. Sits on the squared page like the label stuck on the front of the book.
*/
export const BookHeader = styled.header`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

// The name plate itself — double rule border, the way printed exercise book labels are framed.
export const BookLabel = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 0.625rem;
  row-gap: 0.125rem;
  padding: 0.5rem 0.875rem;
  min-inline-size: min(100%, 16rem);
  background: var(--color-bg-default);
  border: 0.1875rem double var(--book-pencil);
  border-radius: 0.5rem;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-fg-muted);
`;

// A filled-in blank on the label, written in biro on a dotted line.
export const BookLabelValue = styled.span`
  font-family: ${HAND_FONT};
  font-size: 0.9375rem;
  text-transform: none;
  letter-spacing: 0;
  color: var(--book-ink);
  border-block-end: 0.0625rem dotted var(--book-pencil);
`;

// The undo/redo/reset cluster, kept together so it wraps under the label as one group on phones.
export const ToolbarRow = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
`;

/*
  A rubber (eraser) block for every toolbar action: undo, redo and reset are all ways of rubbing
  out working, so they share the two-tone sleeve-and-rubber look.
*/
export const ToolbarButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2.25rem;
  block-size: 2.25rem;
  padding: 0;
  color: var(--color-fg-default);
  background: linear-gradient(to right, color-mix(in srgb, var(--book-ink) 25%, var(--color-bg-default)) 0 35%, color-mix(in srgb, var(--book-pen) 14%, var(--color-bg-default)) 35%);
  border: 0.0625rem solid var(--book-pencil);
  border-radius: 0.375rem;
  cursor: pointer;
  transition: transform 120ms ease, background 150ms ease;

  &:hover:not(:disabled) {
    transform: translateY(-0.0625rem);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--book-ink);
    outline-offset: 0.125rem;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover:not(:disabled) {
      transform: none;
    }
  }
`;

// Controls and gallery on the left, the drawing and its working on the right; stacked on narrow viewports.
export const GeneratorGrid = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;

  @media (min-width: 60rem) {
    grid-template-columns: 19rem minmax(0, 1fr);
    align-items: start;
  }
`;

// The left-hand column of inputs, presets and sharing.
export const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-inline-size: 0;
`;

// The canvas, the working out and the export; pulled above the controls on narrow screens so the drawing is seen first.
export const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-inline-size: 0;

  @media (max-width: 59.99rem) {
    order: -1;
  }
`;

/*
  A worksheet glued into the book: nearly opaque paper so text stays legible over the squares,
  a pencil outline, and a strip of sticky tape across the top edge holding it in.
*/
export const SectionCard = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem 0.875rem 0.875rem;
  background: color-mix(in srgb, var(--color-bg-default) 90%, transparent);
  border: 0.0625rem solid color-mix(in srgb, var(--book-pencil) 45%, transparent);
  border-radius: 0.25rem;
  box-shadow: 0 0.0625rem 0.25rem color-mix(in srgb, black 12%, transparent);

  &::before {
    content: "";
    position: absolute;
    inset-block-start: -0.4375rem;
    inset-inline-start: 50%;
    inline-size: 3.5rem;
    block-size: 0.875rem;
    translate: -50% 0;
    rotate: -2deg;
    background: color-mix(in srgb, var(--color-fg-attention) 18%, color-mix(in srgb, var(--color-bg-default) 60%, transparent));
    border-inline: 0.0625rem dashed color-mix(in srgb, var(--book-pencil) 30%, transparent);
    pointer-events: none;
  }
`;

// A worksheet heading, handwritten in biro and underlined twice with a ruler, as maths teachers insist on.
export const PanelTitle = styled.h3`
  margin: 0;
  font-family: ${HAND_FONT};
  font-size: 1rem;
  font-weight: 700;
  color: var(--book-ink);
  text-decoration: underline double var(--book-ink);
  text-underline-offset: 0.25rem;
`;

// Small explanatory copy inside a worksheet.
export const PanelHint = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--color-fg-muted);

  & code {
    font-family: ${MONO_FONT};
    font-size: 0.75rem;
  }
`;

/*
  The teacher's verdict on whether the path really matches the shape: a red-pen tick and comment,
  or a cross, slightly askew as a hurried mark would be.
*/
export const TeacherMark = styled.p`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  inline-size: fit-content;
  padding: 0.25rem 0.625rem;
  font-family: ${HAND_FONT};
  font-size: 0.9375rem;
  color: var(--book-pen);
  border: 0.125rem solid color-mix(in srgb, var(--book-pen) 70%, transparent);
  border-radius: 999px;
  rotate: -2deg;
`;
