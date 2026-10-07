import { styled } from "@linaria/react";
import { MONO_FONT } from "@/components/IconSpriteBuilder/IconSpriteBuilder.styles";

// The drop target — a dashed glassine-envelope outline that firms up while files hover over it, so the drop affordance is obvious.
export const DropZone = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 0.125rem dashed color-mix(in srgb, var(--album-ink) 40%, var(--color-border-default));
  border-radius: 0.375rem;
  transition: border-color 150ms ease, background-color 150ms ease;

  &[data-dragging="true"] {
    border-style: solid;
    border-color: var(--album-ink);
    background-color: color-mix(in srgb, var(--album-ink) 8%, transparent);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

// The paste field — monospace and vertically resizable, since a pasted icon can be one line or fifty.
export const SourceTextarea = styled.textarea`
  inline-size: 100%;
  min-block-size: 7rem;
  padding: 0.5rem;
  font-family: ${MONO_FONT};
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;
  resize: vertical;

  &:focus-visible {
    outline: 0.125rem solid var(--color-bg-accent-emphasis);
    outline-offset: 0.0625rem;
  }
`;

// Add and upload sit on one line, wrapping on narrow leaves.
export const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
`;

/*
  A <label> styled as a paper tab, wrapping the real (visually hidden) file input — keyboard focus
  and Enter/Space open the picker natively, with no JS click relay.
*/
export const UploadLabel = styled.label`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  min-block-size: 2rem;
  padding: 0.25rem 0.625rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-default);
  background: var(--album-stamp-paper);
  border: 0.0625rem solid color-mix(in srgb, var(--album-ink) 35%, var(--color-border-default));
  border-radius: 0.25rem;
  cursor: pointer;

  &:hover {
    border-color: var(--album-ink);
  }

  &:focus-within {
    outline: 0.125rem solid var(--color-bg-accent-emphasis);
    outline-offset: 0.125rem;
  }
`;

// Visually hidden but still focusable, so the label above stays the visible control.
export const HiddenFileInput = styled.input`
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  opacity: 0;
  cursor: pointer;
`;

// Instructions under the drop zone — muted and small, like a pencilled note in a margin.
export const DropHint = styled.span`
  font-size: 0.75rem;
  color: var(--color-fg-muted);
`;

// Parse or file problems — polite live text in the danger colour, so it's announced without stealing focus.
export const ErrorText = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: var(--color-fg-danger);

  &:empty {
    display: none;
  }
`;

// The starter packet laid out like loose stamps in a glassine envelope — five across fits the side leaf.
export const StarterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(3.25rem, 1fr));
  gap: 0.375rem;
`;

// One loose starter stamp — a tiny tinted square with its name underneath; clicking mounts it in the album.
export const StarterChip = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.125rem;
  padding: 0.375rem 0.25rem;
  font-size: 0.625rem;
  color: var(--album-ink);
  background: var(--album-stamp-paper);
  border: 0.0625rem dotted color-mix(in srgb, var(--album-ink) 45%, transparent);
  border-radius: 0.125rem;
  cursor: pointer;
  transition: rotate 150ms ease;

  & svg {
    inline-size: 1.25rem;
    block-size: 1.25rem;
    color: var(--album-ink);
  }

  & svg * {
    stroke: currentColor;
  }

  &:hover {
    rotate: -3deg;
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-bg-accent-emphasis);
    outline-offset: 0.125rem;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover {
      rotate: none;
    }
  }
`;

// Wraps the trusted starter artwork so its markup sits inside the chip without an extra wrapper element in the chip's own layout.
export const StarterArt = styled.span`
  display: inline-flex;
`;
