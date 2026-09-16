import { styled } from "@linaria/react";

// Vertical stack of this layer's fields — offset/blur/spread/opacity sliders, then color and inset.
export const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`;

// Color + inset sit side by side under the sliders — two compact fields rather than each claiming a full-width row.
export const Row = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
`;

/*
  Inset toggle rendered as a small physical switch rather than a bare checkbox: a raised pill track
  with a knob that slides and "sets down" on either side, matching this tool's own resting/raised
  vocabulary better than the shared DemoControlField checkbox does — inset vs. cast IS the one
  binary choice in this tool that's literally about whether a shadow is raised or sunken.
*/
export const InsetToggle = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  inline-size: 2.75rem;
  block-size: 1.5rem;
  padding: 0.1875rem;
  background: var(--color-bg-muted);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 624.9375rem;
  box-shadow: inset 0 0.0625rem 0.1875rem color-mix(in srgb, var(--color-fg-default) 12%, transparent);
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease;

  &[data-checked="true"] {
    background: var(--color-fg-accent);
    border-color: var(--color-fg-accent);
  }
`;

// The InsetToggle's sliding knob — a small raised disc, the opposite visual language of the track's own sunken groove.
export const InsetKnob = styled.span`
  inline-size: 1.0625rem;
  block-size: 1.0625rem;
  border-radius: 50%;
  background: var(--color-bg-default);
  box-shadow: var(--box-shadow-sm);
  transition: transform 150ms ease;
  transform: translateX(0);

  [data-checked="true"] & {
    transform: translateX(1.25rem);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

// Empty-selection message shown when no layer is selected (e.g. every layer was removed).
export const EmptyState = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  color: var(--color-fg-muted);
`;
