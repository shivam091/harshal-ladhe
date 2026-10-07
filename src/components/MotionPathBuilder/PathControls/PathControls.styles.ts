import { styled } from "@linaria/react";
import { MONO_FONT } from "@/components/MotionPathBuilder/MotionPathBuilder.styles";

// Rows of track-laying tools that wrap on narrow screens.
export const ToolRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.75rem;
`;

// The editable `d` string — monospace and tall enough to read a few segments at once.
export const PathTextarea = styled.textarea`
  inline-size: 100%;
  min-block-size: 5rem;
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
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.0625rem;
  }
`;

// Result of the last paste — red for a parse error, muted for a note like "scaled to fit".
export const PasteStatus = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: var(--color-fg-muted);

  &[data-error="true"] {
    color: var(--color-fg-danger);
  }
`;

// The selected pin's readout, so keyboard users can hear and see exactly where it sits.
export const SelectionReadout = styled.span`
  font-family: ${MONO_FONT};
  font-size: 0.75rem;
  color: var(--color-fg-muted);
`;
