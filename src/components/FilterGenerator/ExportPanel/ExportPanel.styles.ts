import { styled } from "@linaria/react";

// Format selector styled like a lens's aperture-stop ring — a sunken groove the active "stop" clicks into, matching TargetControls'/PanelControls' own recessed-switch language.
export const StopRing = styled.div`
  display: inline-flex;
  gap: 0.125rem;
  padding: 0.1875rem;
  background: var(--color-bg-default);
  border-radius: 0.5rem;
  box-shadow: inset 0 0.0625rem 0.1875rem color-mix(in srgb, var(--color-fg-default) 12%, transparent);
`;

// One export format's own stop on the ring — raised with a small cast shadow while active, flat otherwise.
export const Stop = styled.button`
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-muted);
  background: transparent;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: color 150ms ease, background 150ms ease, box-shadow 150ms ease;

  &[data-selected="true"] {
    color: var(--color-fg-on-emphasis);
    background: var(--color-fg-accent);
    box-shadow: var(--box-shadow-sm);
  }

  &:not([data-selected="true"]):hover {
    color: var(--color-fg-default);
  }
`;
