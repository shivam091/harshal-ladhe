import { styled } from "@linaria/react";

// Vertical label+control stack for the stop bar — mirrors AngleDial/PositionPad's own local FieldWrapper rather than a shared import.
export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

// Small-caps hint above the bar.
export const FieldLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-fg-muted);
`;

/*
  The draggable stop bar — deliberately renders the user's OWN gradient colors at full saturation
  (one of the few places in this tool that isn't glass-tinted, alongside the live canvas backdrop
  itself and PresetGallery's swatches), since a translucent bar would misrepresent the very colors
  it exists to edit.
*/
export const Bar = styled.div`
  position: relative;
  block-size: 2.5rem;
  border-radius: 0.625rem;
  border: 0.0625rem solid color-mix(in srgb, var(--color-border-default) 60%, transparent);
  cursor: crosshair;
  touch-action: none;
`;

// The actual gradient fill inside Bar — a separate layer (rather than painting Bar itself) so Bar's border-radius clips the fill without also clipping the stop handles, which slightly overhang the bar's edges.
export const BarGradient = styled.div`
  position: absolute;
  inset: 0;
  border-radius: inherit;
  overflow: hidden;
  background-size: cover;
`;

/*
  One draggable stop handle — a small ring tinted with the stop's own color (via the --stop-color
  custom property StopEditor.tsx sets inline), riding above the bar so its true color stays visible
  regardless of what's directly beneath it.
*/
export const StopHandle = styled.button`
  position: absolute;
  inset-block-start: 50%;
  inline-size: 1.125rem;
  block-size: 1.125rem;
  transform: translate(-50%, -50%);
  padding: 0;
  border-radius: 50%;
  background: var(--stop-color, var(--color-fg-accent));
  border: 0.1875rem solid var(--color-bg-default);
  box-shadow: var(--box-shadow-sm);
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  &[data-selected="true"] {
    box-shadow: 0 0 0 0.1875rem color-mix(in srgb, var(--stop-color, var(--color-fg-accent)) 55%, transparent), var(--box-shadow-sm);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-outline-focus);
    outline-offset: 0.1875rem;
  }
`;

// Scrollable stack of per-stop rows beneath the bar, for precise/keyboard-only editing.
export const StopList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  max-block-size: 14rem;
  overflow-y: auto;
  scrollbar-width: thin;
`;

// One stop's color/position/remove trio.
export const StopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.5rem;
  border-radius: 0.5rem;
  transition: background 150ms ease;

  &[data-selected="true"] {
    background: color-mix(in srgb, var(--color-fg-accent) 10%, transparent);
  }
`;

// Native color input, kept small and square so it reads as a swatch rather than a full-width form field.
export const StopColorInput = styled.input`
  inline-size: 2rem;
  block-size: 2rem;
  padding: 0;
  border: 0.0625rem solid color-mix(in srgb, var(--color-border-default) 60%, transparent);
  border-radius: 0.375rem;
  background: transparent;
  cursor: pointer;
`;

// Precise 0-100 position field, kept in sync with the bar's own drag in both directions.
export const StopPositionInput = styled.input`
  inline-size: 3.75rem;
  padding: 0.375rem 0.5rem;
  font-variant-numeric: tabular-nums;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.8125rem;
  color: var(--color-fg-default);
  background: color-mix(in srgb, var(--color-bg-default) 70%, transparent);
  border: 0.0625rem solid color-mix(in srgb, var(--color-border-default) 60%, transparent);
  border-radius: 0.375rem;

  &:focus {
    outline: none;
    border-color: var(--color-fg-accent);
    box-shadow: 0 0 0 0.1875rem color-mix(in srgb, var(--color-fg-accent) 22%, transparent);
  }
`;

// Removes a stop outright; disabled once only 2 stops remain.
export const StopRemoveButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 1.75rem;
  block-size: 1.75rem;
  margin-inline-start: auto;
  padding: 0;
  border: none;
  border-radius: 0.375rem;
  background: transparent;
  color: var(--color-fg-muted);
  cursor: pointer;
  transition: color 150ms ease, background 150ms ease;

  &:hover:not(:disabled) {
    color: var(--color-fg-danger);
    background: color-mix(in srgb, var(--color-fg-danger) 14%, transparent);
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

// "+ Add stop" affordance beneath the list.
export const AddStopButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  align-self: flex-start;
  padding: 0.4375rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-accent);
  background: color-mix(in srgb, var(--color-fg-accent) 12%, transparent);
  border: 0.0625rem solid color-mix(in srgb, var(--color-fg-accent) 28%, transparent);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 150ms ease;

  &:hover {
    background: color-mix(in srgb, var(--color-fg-accent) 20%, transparent);
  }
`;
