import { styled } from "@linaria/react";

/*
  The stage: an animator's field guide — the dashed safe-frame rectangle and centre crosshair
  printed on a camera-field chart — so translate offsets read against fixed reference lines rather
  than floating in empty space. overflow: hidden keeps a large translate from spilling over the page.
*/
export const Stage = styled.div`
  position: relative;
  block-size: clamp(14rem, 34vw, 18rem);
  overflow: hidden;
  background-color: color-mix(in srgb, var(--sheet-pencil) 3%, var(--color-bg-default));
  background-image:
    linear-gradient(to right, transparent calc(50% - 0.03125rem), var(--sheet-rule) calc(50% - 0.03125rem) calc(50% + 0.03125rem), transparent calc(50% + 0.03125rem)),
    linear-gradient(to bottom, transparent calc(50% - 0.03125rem), var(--sheet-rule) calc(50% - 0.03125rem) calc(50% + 0.03125rem), transparent calc(50% + 0.03125rem));
  border: 0.0625rem solid var(--sheet-rule);
  border-radius: 0.375rem;

  &::before {
    content: "";
    position: absolute;
    inset: 12% 10%;
    border: 0.0625rem dashed var(--sheet-rule);
    border-radius: 0.25rem;
    pointer-events: none;
  }
`;

/*
  The animated subject. Centred with negative margins rather than a transform, because the
  keyframes own `transform` outright — any centring transform here would be overwritten the moment
  the animation starts. Its resting radius must match BASE_BORDER_RADIUS_PX.
*/
export const Cel = styled.div`
  position: absolute;
  inset-block-start: 50%;
  inset-inline-start: 50%;
  inline-size: 4rem;
  block-size: 4rem;
  margin-block-start: -2rem;
  margin-inline-start: -2rem;
  background: var(--color-bg-accent-emphasis);
  border-radius: 12px;
  box-shadow: 0 0.25rem 0.75rem color-mix(in srgb, var(--color-fg-default) 18%, transparent);
  z-index: 1;
`;

// An onion-skin ghost of one keyframe's pose — dashed and translucent, the way an animator flips back to a previous drawing to check spacing.
export const Ghost = styled.div`
  position: absolute;
  inset-block-start: 50%;
  inset-inline-start: 50%;
  inline-size: 4rem;
  block-size: 4rem;
  margin-block-start: -2rem;
  margin-inline-start: -2rem;
  border: 0.0625rem dashed color-mix(in srgb, var(--color-fg-muted) 70%, transparent);
  background: color-mix(in srgb, var(--color-fg-muted) 6%, transparent);
  pointer-events: none;

  &[data-selected="true"] {
    border: 0.125rem solid var(--sheet-pencil);
    background: color-mix(in srgb, var(--sheet-pencil) 14%, transparent);
  }
`;

// Ghost's offset label, so each onion skin can be matched to its diamond on the track.
export const GhostLabel = styled.span`
  position: absolute;
  inset-block-start: 0.125rem;
  inset-inline-start: 0.25rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.5625rem;
  font-weight: 700;
  color: var(--color-fg-muted);
`;

// Transport bar under the stage — play/pause, restart, and the onion-skin toggle, wrapping on phones.
export const Transport = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

// Transport button; the primary (play/pause) variant is filled pencil-yellow so it's the obvious first thing to press.
export const TransportButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.4375rem 0.875rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--sheet-rule);
  border-radius: 0.375rem;
  cursor: pointer;

  &[data-primary="true"] {
    min-inline-size: 6.5rem;
    justify-content: center;
    background: color-mix(in srgb, var(--sheet-pencil) 28%, var(--color-bg-default));
    border-color: var(--sheet-pencil);
  }

  &:hover {
    border-color: var(--sheet-pencil);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--sheet-pencil);
    outline-offset: 0.125rem;
  }
`;

// Checkbox + label pair for the onion-skin toggle, pushed to the far end of the transport.
export const ToggleLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-inline-start: auto;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-muted);
  cursor: pointer;
`;

/*
  Live readout of the subject's computed values at the playhead — a strip of labelled cells like the
  columns across the top of an exposure sheet. Auto-fit so it reflows from one row on desktop to a
  grid on phones.
*/
export const Readout = styled.dl`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(5.5rem, 1fr));
  gap: 0;
  margin: 0;
  border: 0.0625rem solid var(--sheet-rule);
  border-radius: 0.25rem;
  overflow: hidden;
`;

// One readout cell — term over value, ruled off from its neighbours.
export const ReadoutCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding: 0.375rem 0.5rem;
  border-inline-end: 0.0625rem solid var(--sheet-rule);
  border-block-end: 0.0625rem solid var(--sheet-rule);
  margin-inline-end: -0.0625rem;
  margin-block-end: -0.0625rem;

  & dt {
    font-size: 0.625rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-fg-muted);
  }

  & dd {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    margin: 0;
    font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
    font-size: 0.75rem;
    font-variant-numeric: tabular-nums;
    color: var(--color-fg-default);
  }
`;

// Tiny colour chip beside the background readout, since an rgb() string alone is hard to picture.
export const Swatch = styled.span`
  flex: 0 0 auto;
  inline-size: 0.75rem;
  block-size: 0.75rem;
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.125rem;
`;
