import { styled } from "@linaria/react";

// Counter-clerk lettering — a condensed, slightly official sans for signs and form numbers.
const SIGN_FONT = "'Arial Narrow', 'Roboto Condensed', 'Helvetica Neue', Arial, sans-serif";

// Monospace for every weight and byte figure, so digits line up like a scale's readout.
const MONO_FONT = "'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

/*
  "Parcel Counter" shell — a post-office counter, distinct from every other goodie's shell
  (Circuit Board, Arcade Cabinet, Corkboard, Console, Blueprint, Ledger, Light Table and the rest).
  A speckled laminate worktop mixed from the attention token over the muted background, an
  aluminium nosing along its front edge, brass fittings for the scale and buttons, kraft-paper
  parcels, and airmail red/blue mixed from the danger and accent tokens. The laminate follows the
  theme (pale by day, a dark worktop at night); the paper forms on it stay legible in both.
*/
export const ParcelCounter = styled.div`
  --po-laminate: color-mix(in srgb, var(--color-fg-attention) 12%, var(--color-bg-muted));
  --po-speckle: color-mix(in srgb, var(--color-fg-default) 10%, transparent);
  --po-brass: color-mix(in srgb, var(--color-fg-attention) 82%, var(--color-fg-danger));
  --po-brass-light: color-mix(in srgb, var(--po-brass) 55%, white);
  --po-brass-dark: color-mix(in srgb, var(--po-brass) 60%, black);
  --po-kraft: color-mix(in srgb, var(--color-fg-attention) 30%, color-mix(in srgb, var(--color-fg-danger) 12%, var(--color-bg-default)));
  --po-twine: color-mix(in srgb, var(--color-fg-attention) 45%, var(--color-fg-muted));
  --po-airmail-red: var(--color-fg-danger);
  --po-airmail-blue: var(--color-fg-accent);
  --po-ink: color-mix(in srgb, var(--color-fg-danger) 75%, var(--color-fg-default));
  --po-paper: var(--color-bg-default);

  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-block: clamp(0.75rem, 1vw, 1rem);
  padding: clamp(1rem, 3vw, 1.75rem);
  padding-block-end: clamp(1.5rem, 3vw, 2.25rem);
  background:
    radial-gradient(circle, var(--po-speckle) 0 0.0625rem, transparent 0.07rem) 0 0 / 0.4375rem 0.5rem,
    radial-gradient(circle, var(--po-speckle) 0 0.05rem, transparent 0.06rem) 0.2rem 0.25rem / 0.625rem 0.5625rem,
    linear-gradient(170deg, color-mix(in srgb, white 10%, transparent), transparent 40%),
    var(--po-laminate);
  border: 0.0625rem solid color-mix(in srgb, var(--po-laminate) 70%, var(--color-fg-default));
  border-radius: 0.5rem 0.5rem 0.25rem 0.25rem;
  box-shadow:
    inset 0 -0.625rem 0 color-mix(in srgb, var(--color-fg-muted) 35%, var(--color-bg-default)),
    inset 0 -0.6875rem 0 color-mix(in srgb, white 40%, transparent),
    0 0.25rem 0.75rem color-mix(in srgb, black 18%, transparent);
`;

// The hanging enamel sign above the counter — title on the left, the undo/redo/reset fittings on the right.
export const CounterSign = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem 0.5rem 1.5rem;
  background:
    radial-gradient(circle, var(--po-brass-light) 0 0.15rem, var(--po-brass-dark) 0.17rem 0.22rem, transparent 0.24rem) 0.5rem 50% / 0.5rem 0.5rem no-repeat,
    color-mix(in srgb, var(--po-airmail-red) 88%, black);
  border: 0.1875rem solid color-mix(in srgb, white 85%, var(--po-airmail-red));
  border-radius: 0.375rem;
  box-shadow: 0 0 0 0.0625rem color-mix(in srgb, var(--po-airmail-red) 60%, black), 0 0.1875rem 0.375rem color-mix(in srgb, black 25%, transparent);
`;

// Sign lettering — painted, so decorative and hidden from assistive tech at the call site.
export const SignTitle = styled.span`
  font-family: ${SIGN_FONT};
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: white;
`;

// Holds the toolbar knobs together, so undo/redo/reset read as one set of fittings.
export const ToolbarRow = styled.div`
  display: inline-flex;
  gap: 0.375rem;
`;

/*
  A brass fitting — rubber-stamp knobs in the toolbar and the counter's other push buttons share
  this look, so every control on the counter feels like the same hardware.
*/
export const BrassButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  min-inline-size: 2rem;
  block-size: 2rem;
  padding: 0 0.625rem;
  font-family: ${SIGN_FONT};
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: color-mix(in srgb, black 82%, var(--po-brass));
  background: linear-gradient(160deg, var(--po-brass-light), var(--po-brass) 50%, var(--po-brass-dark));
  border: 0.0625rem solid var(--po-brass-dark);
  border-radius: 999px;
  box-shadow: inset 0 0.0625rem 0 color-mix(in srgb, white 55%, transparent), 0 0.125rem 0 var(--po-brass-dark);
  cursor: pointer;
  transition: filter 150ms ease, translate 150ms ease, box-shadow 150ms ease;

  &:hover:not(:disabled) {
    filter: brightness(1.08);
  }

  &:active:not(:disabled) {
    translate: 0 0.125rem;
    box-shadow: inset 0 0.0625rem 0 color-mix(in srgb, white 55%, transparent);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-outline-focus, var(--color-fg-accent));
    outline-offset: 0.125rem;
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

/*
  Two lanes on wide screens — the intake (contents and postage) on the left, the scale and parcels
  on the right — collapsing to one column on phones.
*/
export const CounterGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;

  @media (min-width: 60rem) {
    grid-template-columns: minmax(0, 22rem) minmax(0, 1fr);
    align-items: start;
  }
`;

// One lane of the counter — its forms stack in reading order.
export const CounterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-inline-size: 0;
`;

// The tray along the counter's front: presets and the forwarding slip sit side by side when there's room.
export const TrayRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;

  @media (min-width: 48rem) {
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
    align-items: start;
  }
`;

/*
  A counter form: theme-coloured paper (so its contents stay readable in either theme) with an
  airmail-striped top edge, lying slightly proud of the laminate.
*/
export const SectionCard = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.125rem 0.875rem 0.875rem;
  background:
    repeating-linear-gradient(
        -45deg,
        var(--po-airmail-red) 0 0.5rem,
        var(--po-paper) 0.5rem 0.75rem,
        var(--po-airmail-blue) 0.75rem 1.25rem,
        var(--po-paper) 1.25rem 1.5rem
      )
      top / 100% 0.3125rem no-repeat,
    var(--po-paper);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.25rem;
  box-shadow: 0 0.125rem 0.25rem color-mix(in srgb, black 12%, transparent);
`;

// Form heading with its form number ("P-12") stamped in ink before the label, the way counter paperwork is numbered.
export const PanelTitle = styled.h3`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin: 0;
  font-family: ${SIGN_FONT};
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-fg-default);

  &::before {
    content: attr(data-form);
    padding: 0 0.25rem;
    font-family: ${MONO_FONT};
    font-size: 0.625rem;
    letter-spacing: 0.04em;
    color: var(--po-ink);
    border: 0.0625rem solid currentColor;
    border-radius: 0.125rem;
    rotate: -3deg;
  }
`;

// Short helper copy under a heading — smaller and muted, matching the other goodies' hint text.
export const HintText = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  color: var(--color-fg-muted);
`;

// Tabular figures for any byte count shown inline in prose.
export const Figure = styled.span`
  font-family: ${MONO_FONT};
  font-variant-numeric: tabular-nums;
`;
