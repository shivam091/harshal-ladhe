import { styled } from "@linaria/react";

// One monospace stack for every readout on the controller and the baseboard's labels.
export const MONO_FONT = "'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

/*
  "Model Railway Layout" shell — a hobbyist's layout on a trestle table, distinct from every other
  goodie's shell (Arcade Cabinet, Railway Signal Box, Light Table, Blueprint Grid, Clay Studio and
  the rest). Unlike the Signal Box's enamel lever panel, this is the layout itself: a plywood
  frame with visible grain, a scenery-felt baseboard in the middle, and a dark moulded controller
  beside it. Every colour is a color-mix of the theme's success/attention/danger/muted tokens, so
  the felt, timber and loco re-tint for light and dark without a single hex. The custom
  properties declared here are inherited by every panel inside.
*/
export const RailwayLayout = styled.div`
  --rail-felt: color-mix(in oklab, var(--color-fg-success) 42%, var(--color-bg-default));
  --rail-felt-deep: color-mix(in oklab, var(--color-fg-success) 55%, color-mix(in oklab, black 35%, var(--color-bg-default)));
  --rail-timber: color-mix(in oklab, var(--color-fg-attention) 34%, var(--color-bg-muted));
  --rail-timber-dark: color-mix(in oklab, var(--color-fg-attention) 30%, color-mix(in oklab, var(--color-fg-default) 45%, var(--color-bg-default)));
  --rail-ballast: color-mix(in oklab, var(--color-fg-muted) 50%, var(--rail-felt));
  --rail-sleeper: color-mix(in oklab, var(--color-fg-attention) 30%, color-mix(in oklab, var(--color-fg-default) 62%, var(--color-bg-default)));
  --rail-steel: color-mix(in oklab, var(--color-fg-muted) 65%, var(--color-fg-default));
  --rail-loco: color-mix(in oklab, var(--color-fg-danger) 85%, var(--color-fg-default));
  --rail-brass: color-mix(in oklab, var(--color-fg-attention) 70%, white);
  --rail-case: color-mix(in oklab, black 72%, var(--color-bg-muted));
  --rail-case-text: color-mix(in oklab, white 86%, var(--color-fg-attention));

  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-block: clamp(0.75rem, 1vw, 1rem);
  padding: clamp(1rem, 3vw, 1.75rem);
  background:
    repeating-linear-gradient(
      92deg,
      color-mix(in oklab, var(--rail-timber-dark) 18%, transparent) 0 0.125rem,
      transparent 0.125rem 0.6rem,
      color-mix(in oklab, white 6%, transparent) 0.6rem 0.7rem,
      transparent 0.7rem 1.4rem
    ),
    linear-gradient(to bottom, color-mix(in oklab, white 8%, var(--rail-timber)), var(--rail-timber));
  border: 0.25rem solid var(--rail-timber-dark);
  border-radius: 0.375rem;
  box-shadow:
    inset 0 0.125rem 0 color-mix(in oklab, white 18%, transparent),
    0 0.75rem 1.5rem -0.75rem color-mix(in oklab, black 45%, transparent);
`;

// The layout's name board across the top, with the history buttons on the right — wraps beneath on narrow screens.
export const NameBoard = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

// A cast brass nameplate like the ones screwed to a layout's fascia — raised lettering on a bevelled plate.
export const Nameplate = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.875rem;
  font-family: ${MONO_FONT};
  font-size: clamp(0.8125rem, 2vw, 1rem);
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: color-mix(in oklab, var(--rail-brass) 30%, black);
  background: linear-gradient(to bottom, color-mix(in oklab, var(--rail-brass) 90%, white), var(--rail-brass));
  border: 0.125rem solid color-mix(in oklab, var(--rail-brass) 60%, black);
  border-radius: 0.25rem;
  box-shadow:
    inset 0 0.0625rem 0 color-mix(in oklab, white 50%, transparent),
    0 0.125rem 0 color-mix(in oklab, black 30%, transparent);
  text-shadow: 0 0.0625rem 0 color-mix(in oklab, white 45%, transparent);
`;

// The cluster of history buttons beside the nameplate.
export const ToolbarRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
`;

/*
  A chunky push-button moulded into the controller case — dark plastic with a brass rim, the
  same idiom as the controller's own buttons, so every discrete action reads as hardware.
*/
export const CaseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  min-block-size: 2.25rem;
  min-inline-size: 2.25rem;
  padding-block: 0;
  padding-inline: 0.625rem;
  font-family: ${MONO_FONT};
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--rail-case-text);
  background: linear-gradient(to bottom, color-mix(in oklab, white 10%, var(--rail-case)), var(--rail-case));
  border: 0.125rem solid color-mix(in oklab, var(--rail-brass) 55%, var(--rail-case));
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0 color-mix(in oklab, black 45%, transparent);
  cursor: pointer;
  transition: transform 100ms ease, box-shadow 100ms ease;

  &:active:not(:disabled) {
    transform: translateY(0.125rem);
    box-shadow: none;
  }

  &[aria-pressed="true"] {
    border-color: var(--rail-brass);
    box-shadow: 0 0 0 0.125rem color-mix(in oklab, var(--rail-brass) 40%, transparent);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.125rem;
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:active:not(:disabled) {
      transform: none;
    }
  }
`;

// Baseboard beside the controller on wide screens, stacked on narrow ones with the baseboard first — the moving loco is the payoff.
export const LayoutGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;

  @media (min-width: 60rem) {
    grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
    align-items: start;
  }
`;

// The baseboard and track-laying tools.
export const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-inline-size: 0;
`;

// The controller, easing and rolling-stock panels.
export const SideColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-inline-size: 0;
`;

// Presets and sharing along the bottom of the table.
export const TrayRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;

  @media (min-width: 48rem) {
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
    align-items: start;
  }
`;

// A painted fascia board screwed to the layout's frame — a slightly lighter panel with a timber edge, so every card reads as part of the same woodwork.
export const SectionCard = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.875rem;
  background: color-mix(in oklab, var(--color-bg-default) 82%, var(--rail-timber));
  border: 0.0625rem solid var(--rail-timber-dark);
  border-radius: 0.375rem;
  box-shadow: 0 0.125rem 0 color-mix(in oklab, var(--rail-timber-dark) 55%, transparent);
`;

// The dark moulded case of the train controller — distinct from the fascia boards so the controls read as one handheld unit.
export const ControllerCase = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  padding: 1rem;
  color: var(--rail-case-text);
  background:
    radial-gradient(circle at 0.625rem 0.625rem, color-mix(in oklab, var(--rail-brass) 70%, transparent) 0.1875rem, transparent 0.25rem),
    radial-gradient(circle at calc(100% - 0.625rem) 0.625rem, color-mix(in oklab, var(--rail-brass) 70%, transparent) 0.1875rem, transparent 0.25rem),
    linear-gradient(to bottom, color-mix(in oklab, white 8%, var(--rail-case)), var(--rail-case));
  border: 0.125rem solid color-mix(in oklab, black 40%, var(--rail-case));
  border-radius: 0.75rem;
  box-shadow:
    inset 0 0.125rem 0 color-mix(in oklab, white 12%, transparent),
    0 0.25rem 0 color-mix(in oklab, black 40%, transparent);
`;

// Panel heading stencilled like a layout's painted signage, with a small sleeper-shaped bar before it.
export const PanelTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-family: ${MONO_FONT};
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: inherit;

  &::before {
    content: "";
    inline-size: 0.875rem;
    block-size: 0.3125rem;
    border-radius: 0.0625rem;
    background: var(--rail-sleeper);
    box-shadow: 0 0 0 0.0625rem color-mix(in oklab, var(--rail-steel) 50%, transparent);
  }
`;

// Small explanatory copy inside a card.
export const PanelHint = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--color-fg-muted);

  & code {
    font-family: ${MONO_FONT};
    font-size: 0.75rem;
  }
`;

// The same hint copy, re-tinted for the dark controller case where the muted token would vanish.
export const CaseHint = styled(PanelHint)`
  color: color-mix(in oklab, var(--rail-case-text) 70%, transparent);
`;

/*
  A row of mutually exclusive options styled as a slide selector — native radios underneath, so
  arrow keys move between options and screen readers announce a proper radio group for free.
*/
export const SegmentGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  padding: 0.1875rem;
  background: color-mix(in oklab, black 25%, transparent);
  border-radius: 0.5rem;
`;

// One option in a SegmentGroup; the visually hidden radio inside drives the checked look via :has().
export const SegmentOption = styled.label`
  position: relative;
  flex: 1 1 auto;
  padding: 0.375rem 0.625rem;
  font-family: ${MONO_FONT};
  font-size: 0.6875rem;
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: inherit;
  border-radius: 0.375rem;
  cursor: pointer;

  & input {
    position: absolute;
    inset: 0;
    margin: 0;
    opacity: 0;
    cursor: pointer;
  }

  &:has(input:checked) {
    color: color-mix(in oklab, var(--rail-brass) 25%, black);
    background: var(--rail-brass);
    box-shadow: inset 0 -0.125rem 0 color-mix(in oklab, black 25%, transparent);
  }

  &:has(input:focus-visible) {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.0625rem;
  }
`;

// A labelled native input or select styled to sit on the fascia boards.
export const FieldInput = styled.input`
  inline-size: 100%;
  padding: 0.375rem 0.5rem;
  font-family: ${MONO_FONT};
  font-size: 0.8125rem;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.0625rem;
  }
`;

// Label above a small field; shared by inputs on both the fascia and the controller case.
export const FieldLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: inherit;
`;

// A checkbox beside its label, for the few on/off settings.
export const CheckRow = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: inherit;
  cursor: pointer;

  & input {
    inline-size: 1rem;
    block-size: 1rem;
    accent-color: var(--rail-brass);
  }
`;
