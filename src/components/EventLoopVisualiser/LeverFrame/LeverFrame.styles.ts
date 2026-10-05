import { styled } from "@linaria/react";

// Levers, scrubber, then readout — stacked so the readout always sits directly under the controls that change it.
export const Frame = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

// The lever row sits in a slotted quadrant plate, like the floor slots real levers travel through.
export const LeverRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  flex-wrap: wrap;
  padding: 0.5rem 0.625rem;
  background: repeating-linear-gradient(
    to right,
    transparent 0,
    transparent 3.25rem,
    color-mix(in oklab, black 18%, transparent) 3.25rem,
    color-mix(in oklab, black 18%, transparent) 3.375rem
  );
  border-radius: 0.375rem;
  background-color: var(--signal-plate);
`;

/*
  A lever-frame lever: a tall handle with a coloured enamel cap, using the real signalling colour
  code (red for signals, yellow for distants, blue for locks, black for points) via a --lever custom
  property, so each control's meaning is carried by colour as well as its label. "Pulled" levers
  (play while running) lean back, the way a reversed lever does in its frame.
*/
export const Lever = styled.button`
  --lever: var(--color-fg-default);

  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 0.25rem;
  inline-size: 2.75rem;
  block-size: 3.75rem;
  padding: 0 0 0.375rem;
  border: 0.0625rem solid color-mix(in oklab, var(--lever) 45%, var(--color-border-muted));
  border-radius: 0.375rem 0.375rem 0.25rem 0.25rem;
  background: linear-gradient(to bottom, var(--lever) 0, var(--lever) 0.875rem, color-mix(in oklab, var(--lever) 10%, var(--signal-enamel-deep)) 0.875rem);
  color: var(--color-fg-default);
  cursor: pointer;
  transform-origin: 50% 100%;
  transition: transform 180ms ease, box-shadow 150ms ease;

  &[data-lever="red"] {
    --lever: var(--color-fg-danger);
  }
  &[data-lever="yellow"] {
    --lever: var(--color-fg-attention);
  }
  &[data-lever="blue"] {
    --lever: var(--color-fg-accent);
  }

  &:hover:not(:disabled) {
    box-shadow: 0 0 0.75rem 0 color-mix(in oklab, var(--lever) 45%, transparent);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--lever);
    outline-offset: 0.125rem;
  }

  &[data-pulled="true"] {
    transform: rotate(-8deg);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

// The little numbered plate every lever carries — here it names the action instead of a lever number.
export const LeverPlate = styled.span`
  font-family: var(--signal-mono);
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

// Two bars drawn in CSS — the icon set has a play glyph but no pause one, and the house rule is to reuse existing icons rather than invent new SVG here.
export const PauseGlyph = styled.span`
  display: inline-block;
  inline-size: 0.75rem;
  block-size: 0.875rem;
  border-inline: 0.25rem solid currentColor;
`;

// Label, scrubber, speed — the scrubber takes whatever width is left.
export const ScrubRow = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.75rem;
  font-family: var(--signal-mono);
  font-size: 0.75rem;
  color: var(--color-fg-muted);
`;

// Native range input kept for its free keyboard and screen-reader support — only tinted to the distant-signal yellow.
export const ScrubInput = styled.input`
  inline-size: 100%;
  accent-color: var(--color-fg-attention);
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }
`;

// Compact native select styled as a dial plate.
export const SpeedSelect = styled.select`
  padding: 0.25rem 0.375rem;
  font-family: var(--signal-mono);
  font-size: 0.75rem;
  color: var(--color-fg-default);
  background: var(--signal-plate);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.25rem;
`;

// The block-instrument's indicator window — where the current step's explanation is read out, and the aria-live region announces it.
export const Explanation = styled.p`
  margin: 0;
  padding: 0.625rem 0.75rem;
  min-block-size: 3.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--color-fg-default);
  background: color-mix(in oklab, var(--color-fg-attention) 8%, var(--signal-enamel-deep));
  border-inline-start: 0.25rem solid var(--color-fg-attention);
  border-radius: 0.25rem;
`;

// "Step n of m" above the explanation, so the position is announced along with it.
export const StepCounter = styled.span`
  display: block;
  margin-block-end: 0.125rem;
  font-family: var(--signal-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-fg-muted);
`;
