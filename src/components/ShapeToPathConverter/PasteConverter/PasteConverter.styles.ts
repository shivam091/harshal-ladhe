import { styled } from "@linaria/react";
import { HAND_FONT, MONO_FONT } from "@/components/ShapeToPathConverter/ShapeToPathConverter.styles";

// Pasted markup beside its converted version on wide screens, stacked on narrow ones.
export const PasteGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;

  @media (min-width: 48rem) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
  }
`;

// One side of the before/after pair: a handwritten caption over its content.
export const PasteColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-inline-size: 0;
`;

// The caption for each side, in pencil handwriting.
export const PasteCaption = styled.label`
  font-family: ${HAND_FONT};
  font-size: 0.875rem;
  color: var(--book-pencil);
`;

// The markup to convert, on lined paper so it reads as copied out into the book.
export const PasteInput = styled.textarea`
  inline-size: 100%;
  min-block-size: 12rem;
  padding: 0.5rem 0.625rem;
  font-family: ${MONO_FONT};
  font-size: 0.8125rem;
  line-height: 1.5rem;
  color: var(--color-fg-default);
  background-color: color-mix(in srgb, var(--color-bg-default) 92%, transparent);
  background-image: linear-gradient(to bottom, transparent calc(1.5rem - 0.0625rem), color-mix(in srgb, var(--book-ink) 14%, transparent) 0);
  background-size: 100% 1.5rem;
  background-position-y: 0.5rem;
  background-attachment: local;
  border: 0.0625rem solid var(--book-pencil);
  border-radius: 0.25rem;
  resize: vertical;

  &:focus-visible {
    outline: 0.125rem solid var(--book-ink);
    outline-offset: 0.0625rem;
  }
`;

// The per-tag marking list: a tick or a cross in the margin for each shape found.
export const ResultList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin: 0;
  padding: 0;
  list-style: none;
`;

// One marked tag, with its verdict and an optional button to work it through on the canvas.
export const ResultItem = styled.li`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem 0.625rem;
  font-size: 0.8125rem;
  color: var(--color-fg-default);

  & code {
    font-family: ${MONO_FONT};
    font-size: 0.75rem;
    color: var(--book-ink);
  }
`;

// The teacher's tick or cross in red pen, set before each tag.
export const ResultMark = styled.span`
  inline-size: 1.25rem;
  font-family: ${HAND_FONT};
  font-size: 1rem;
  color: var(--book-pen);
  text-align: center;
`;

// Why a tag was skipped, in a quieter colour than the verdict.
export const ResultNote = styled.span`
  flex-basis: 100%;
  padding-inline-start: 1.875rem;
  color: var(--color-fg-muted);
  font-size: 0.75rem;
`;

// The small "work it through" button beside a converted tag.
export const ResultButton = styled.button`
  padding: 0.125rem 0.5rem;
  font-family: ${HAND_FONT};
  font-size: 0.8125rem;
  color: var(--book-ink);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--book-pencil);
  border-radius: 0.375rem;
  cursor: pointer;

  &:hover {
    border-color: var(--book-ink);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--book-ink);
    outline-offset: 0.125rem;
  }
`;
