import { styled } from "@linaria/react";

// The draggable gradient bar itself — its own background is set inline per-render to a flat linear-gradient preview of the current stops (position only matters here, not the editor's actual type), so the bar always shows exactly what's being edited.
export const Bar = styled.div`
  position: relative;
  inline-size: 100%;
  block-size: 1.5rem;
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.25rem;
  cursor: copy;
  touch-action: none;
  background-image:
    linear-gradient(45deg, var(--color-bg-neutral-muted) 25%, transparent 25%),
    linear-gradient(-45deg, var(--color-bg-neutral-muted) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, var(--color-bg-neutral-muted) 75%),
    linear-gradient(-45deg, transparent 75%, var(--color-bg-neutral-muted) 75%);
  background-size: 0.75rem 0.75rem;
  background-position: 0 0, 0 0.375rem, 0.375rem -0.375rem, -0.375rem 0;
`;

// The flat-preview overlay, layered above Bar's checkerboard so a stop with alpha (if ever added) would show through it — currently opaque hex stops, but the layering costs nothing and matches how a real background-image/background-color stack would compose.
export const BarGradient = styled.div`
  position: absolute;
  inset: 0;
  border-radius: inherit;
`;

export const StopHandle = styled.button`
  position: absolute;
  top: 50%;
  inline-size: 1rem;
  block-size: 1rem;
  transform: translate(-50%, -50%);
  padding: 0;
  background: var(--color-bg-default);
  border: 0.125rem solid var(--color-border-default);
  border-radius: 50%;
  cursor: grab;

  &[data-selected="true"] {
    border-color: var(--color-fg-accent);
    box-shadow: 0 0 0 0.125rem color-mix(in srgb, var(--color-fg-accent) 30%, transparent);
  }

  &:active {
    cursor: grabbing;
  }
`;

export const StopList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const StopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &[data-selected="true"] {
    outline: 0.0625rem solid var(--color-fg-accent);
    outline-offset: 0.25rem;
    border-radius: 0.25rem;
  }
`;

export const StopColorInput = styled.input`
  flex: 0 0 auto;
  appearance: none;
  inline-size: 2rem;
  block-size: 1.75rem;
  padding: 0;
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;
  background: transparent;
  cursor: pointer;

  &::-webkit-color-swatch-wrapper {
    padding: 0.125rem;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: 0.125rem;
  }
`;

export const StopPositionInput = styled.input`
  inline-size: 3.25rem;
  padding: 0.25rem 0.375rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.8125rem;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;
`;

export const StopRemoveButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-inline-start: auto;
  inline-size: 1.75rem;
  block-size: 1.75rem;
  padding: 0;
  color: var(--color-fg-muted);
  background: transparent;
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.25rem;
  cursor: pointer;

  &:hover:not(:disabled) {
    color: var(--color-fg-danger, var(--color-fg-default));
    border-color: var(--color-fg-danger, var(--color-border-default));
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const AddStopButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.375rem 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-muted);
  background: var(--color-bg-default);
  border: 0.0625rem dashed var(--color-border-default);
  border-radius: 0.375rem;
  cursor: pointer;

  &:hover {
    color: var(--color-fg-default);
    border-color: var(--color-fg-accent);
  }
`;
