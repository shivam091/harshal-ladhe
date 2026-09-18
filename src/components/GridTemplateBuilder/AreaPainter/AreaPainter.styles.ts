import { styled } from "@linaria/react";

// Local copy of the plain text-input treatment every goodie with a free-text field defines for itself (e.g. FluidTypeCalculator's StepControls) — no shared TextInput atom exists in this codebase to import instead.
export const TextInput = styled.input`
  inline-size: 100%;
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;
`;

// Row of common landmark-name shortcuts plus the Eraser chip, above the free-text input.
export const SuggestionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
`;

// One suggested-name pill — a shortcut into the active-area-name field, not a separate input of its own.
export const SuggestionChip = styled.button`
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-fg-muted);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 999px;
  cursor: pointer;

  &[data-active="true"] {
    color: var(--color-fg-on-emphasis);
    background: var(--color-bg-accent-emphasis);
    border-color: var(--color-bg-accent-emphasis);
  }

  // The eraser chip reads as a distinct "clear" action rather than just another name, even while active.
  &[data-eraser="true"] {
    font-style: italic;
  }
`;

// Row of already-painted area names, each its own colored Chip — lets someone re-select or clear a name without retyping it.
export const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
`;

// The colored swatch itself lives on this wrapper (via inline style) so both the name button and the remove button visually belong to the same colored pill.
export const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.25rem 0.125rem 0.5rem;
  border-radius: 999px;
  color: #fff;

  &[data-active="true"] {
    box-shadow: 0 0 0 0.125rem var(--color-fg-accent);
  }
`;

// The name half of a Chip — clicking it makes this name the active brush.
export const ChipButton = styled.button`
  padding: 0;
  font-size: 0.75rem;
  font-weight: 600;
  color: inherit;
  background: transparent;
  border: none;
  cursor: pointer;
`;

// The small circular ✕ half of a Chip — clicking it clears every cell carrying this name.
export const ChipRemove = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 1.125rem;
  block-size: 1.125rem;
  padding: 0;
  color: inherit;
  background: rgb(0 0 0 / 0.15);
  border: none;
  border-radius: 50%;
  cursor: pointer;

  &:hover {
    background: rgb(0 0 0 / 0.3);
  }
`;

// The click/drag surface itself — a real CSS grid sized to the current column/row COUNTS (not their actual track sizes; every cell reads as a uniform square regardless of what "1fr" vs "200px" will render as in PreviewPane) so painting stays legible even at the 6×6 upper bound.
export const PainterGrid = styled.div`
  display: grid;
  gap: 0.1875rem;
  padding: 0.375rem;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.375rem;
  // Dragging across cells would otherwise select their text content in most browsers, fighting the paint gesture.
  user-select: none;
  touch-action: none;
`;

// One clickable/paintable grid cell — background color is set inline per-cell (unassigned/painted/pending each need a different, data-driven color no static CSS class could express).
export const PainterCell = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-block-size: 2rem;
  padding: 0.125rem;
  overflow: hidden;
  font-size: 0.625rem;
  font-weight: 600;
  color: var(--color-fg-on-emphasis);
  background: var(--color-bg-neutral-muted);
  border: 0.0625rem dashed var(--color-border-muted);
  border-radius: 0.25rem;
  cursor: pointer;
  white-space: nowrap;
  text-overflow: ellipsis;

  // A cell currently inside the in-progress drag rectangle, before pointerup commits it — border switches to solid so the pending selection reads distinctly from an already-painted cell.
  &[data-pending="true"] {
    border-style: solid;
    border-color: var(--color-fg-accent);
  }
`;

// One-line usage hint shown under the painter grid.
export const HelpText = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: var(--color-fg-muted);
`;
