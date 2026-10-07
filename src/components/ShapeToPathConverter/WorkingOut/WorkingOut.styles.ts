import { styled } from "@linaria/react";
import { HAND_FONT, MONO_FONT } from "@/components/ShapeToPathConverter/ShapeToPathConverter.styles";

// A small handwritten sub-heading inside the working, like "Rules" or "Steps" written in the margin.
export const WorkingHeading = styled.h4`
  margin: 0;
  font-family: ${HAND_FONT};
  font-size: 0.875rem;
  font-weight: 400;
  color: var(--book-pencil);
`;

// The rule lines worked before the first command, lettered a), b), c) as a pupil sets out given facts.
export const RuleList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin: 0;
  padding-inline-start: 1.5rem;
  list-style: lower-alpha;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--color-fg-default);

  & ::marker {
    font-family: ${HAND_FONT};
    color: var(--book-pencil);
  }
`;

// Numbered command lines on ruled paper; the list resets per conversion so the numbers match the canvas badges.
export const StepList = styled.ol`
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
  background-image: linear-gradient(to bottom, transparent calc(100% - 0.0625rem), color-mix(in srgb, var(--book-ink) 18%, transparent) 0);
  background-size: 100% 2.25rem;
`;

/*
  One line of working as a button: clicking it draws the path up to that step, hovering or
  focusing it traces the segment on the canvas. Steps the scrubber has not reached are pale
  pencil, still readable, but clearly not "written" yet.
*/
export const StepButton = styled.button`
  display: grid;
  grid-template-columns: 2rem minmax(0, auto) minmax(0, 1fr);
  align-items: baseline;
  column-gap: 0.625rem;
  inline-size: 100%;
  min-block-size: 2.25rem;
  padding: 0.375rem 0.25rem;
  text-align: start;
  font: inherit;
  color: var(--color-fg-default);
  background: transparent;
  border: 0;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: opacity 150ms ease, background 150ms ease;

  &[data-pending="true"] {
    opacity: 0.45;
  }

  &:hover,
  &[data-hovered="true"] {
    background: color-mix(in srgb, var(--book-pen) 8%, transparent);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--book-pen);
    outline-offset: -0.125rem;
  }

  @media (max-width: 36rem) {
    grid-template-columns: 2rem minmax(0, 1fr);

    & > :last-child {
      grid-column: 2;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

// The step number, written in the margin and ringed in red pen once the teacher is looking at that line.
export const StepNumber = styled.span`
  display: inline-grid;
  place-items: center;
  inline-size: 1.5rem;
  block-size: 1.5rem;
  font-family: ${HAND_FONT};
  font-size: 0.875rem;
  color: var(--book-pencil);
  border: 0.125rem solid transparent;
  border-radius: 50%;

  [data-hovered="true"] > & {
    color: var(--book-pen);
    border-color: var(--book-pen);
  }
`;

// The path command itself, in biro-blue monospace so it reads as the answer to that line.
export const StepCommand = styled.code`
  font-family: ${MONO_FONT};
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--book-ink);
  white-space: nowrap;
`;

// The plain-English reasoning that follows the command.
export const StepText = styled.span`
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--color-fg-default);
`;

// The final answer line, double-underlined the way an answer is ruled off at the bottom of a sum.
export const AnswerLine = styled.p`
  margin: 0;
  padding-block-end: 0.375rem;
  font-family: ${MONO_FONT};
  font-size: 0.8125rem;
  line-height: 1.6;
  color: var(--book-ink);
  overflow-wrap: anywhere;
  border-block-end: 0.1875rem double var(--book-ink);

  & strong {
    font-family: ${HAND_FONT};
    font-weight: 400;
    margin-inline-end: 0.375rem;
  }
`;

// The stepper and scrubber that draw the path one command at a time.
export const ScrubberRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
`;

// A pencil-outlined text button for Back, Play and Next.
export const ScrubberButton = styled.button`
  min-block-size: 2rem;
  padding: 0 0.75rem;
  font-family: ${HAND_FONT};
  font-size: 0.875rem;
  color: var(--book-ink);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--book-pencil);
  border-radius: 0.375rem;
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: var(--book-ink);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--book-ink);
    outline-offset: 0.125rem;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

// The range input styled as a ruler edge, with the thumb in biro.
export const ScrubberRange = styled.input`
  flex: 1 1 8rem;
  min-inline-size: 6rem;
  accent-color: var(--book-ink);
`;

// "Step 3 of 10", read out politely as the scrubber moves.
export const ScrubberStatus = styled.output`
  font-family: ${HAND_FONT};
  font-size: 0.875rem;
  color: var(--book-pencil);
  white-space: nowrap;
`;

// A red-pen warning when the shape draws nothing, set apart from the ordinary working.
export const WorkingWarning = styled.p`
  margin: 0;
  font-family: ${HAND_FONT};
  font-size: 0.9375rem;
  color: var(--book-pen);
`;
