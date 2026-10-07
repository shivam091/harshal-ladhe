import { styled } from "@linaria/react";
import { MONO_FONT, SERIF_FONT } from "@/components/SvgPathMorph/SvgPathMorph.styles";

// The stack of labels, one per keyframe.
export const LabelList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

// A paper label with a string-hole punched at its corner — the bench's apothecary tag for one keyframe.
export const Label = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 0.625rem 0.75rem 0.75rem 1.5rem;
  background: color-mix(in oklab, var(--bench-parchment) 85%, var(--color-bg-default));
  border: 0.0625rem dashed var(--bench-parchment-edge);
  border-radius: 0.25rem;

  &::before {
    content: "";
    position: absolute;
    inset-block-start: 0.75rem;
    inset-inline-start: 0.5rem;
    inline-size: 0.5rem;
    block-size: 0.5rem;
    border-radius: 50%;
    background: var(--bench-wood);
    box-shadow: inset 0 0.0625rem 0.125rem color-mix(in oklab, black 40%, transparent);
  }

  &[data-invalid="true"] {
    border-color: var(--color-fg-danger);
    border-style: solid;
  }
`;

// Letter on the left, remove knob on the right.
export const LabelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

// The keyframe's name, inked in its elixir colour and doubling as the textarea's label.
export const LabelLetter = styled.label`
  font-family: ${SERIF_FONT};
  font-size: 0.9375rem;
  font-weight: 800;
  font-variant: small-caps;
`;

// The `d` string itself, in a monospace well that wraps rather than scrolling sideways.
export const PathInput = styled.textarea`
  inline-size: 100%;
  min-block-size: 4.5rem;
  padding: 0.5rem;
  font-family: ${MONO_FONT};
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.25rem;
  resize: vertical;
  word-break: break-all;

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.0625rem;
  }
`;

// Why this keyframe won't parse, with the character position.
export const LabelError = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: var(--color-fg-danger);
`;

// A small remove control — quiet until hovered, so it isn't mistaken for the label's main action.
export const RemoveButton = styled.button`
  display: grid;
  place-items: center;
  inline-size: 1.75rem;
  block-size: 1.75rem;
  padding: 0;
  color: var(--color-fg-muted);
  background: transparent;
  border: 0.0625rem solid transparent;
  border-radius: 50%;
  cursor: pointer;

  &:hover {
    color: var(--color-fg-danger);
    border-color: currentColor;
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.0625rem;
  }
`;
