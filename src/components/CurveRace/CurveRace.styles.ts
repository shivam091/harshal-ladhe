import { styled } from "@linaria/react";

// Gives the demo breathing room from the surrounding prose.
export const Wrapper = styled.div`
  margin-block: 3rem;
  margin-inline: auto;
`;

// Spaces stacked lanes apart; a single lane is unaffected.
export const Lanes = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// Names each lane in stacked mode, where there's no picker to say which curve is which.
export const LaneLabel = styled.span`
  display: block;
  margin-block-end: 0.375rem;
  color: var(--color-fg-muted);
  font-size: 0.875rem;
`;

// Dashed start/finish borders give the marker's travel a visible beginning and end.
export const Track = styled.div`
  position: relative;
  block-size: 2.5rem;
  border-block: 0.0625rem dashed var(--color-border-muted);
  background: var(--color-bg-muted);
`;

// Faded so the trail reads as a spacing reference, not a second marker.
export const Ghost = styled.div`
  position: absolute;
  inset-inline-start: 0.5rem;
  inset-block-start: 50%;
  inline-size: 0.5rem;
  block-size: 0.5rem;
  border-radius: 624.9375rem;
  background: var(--color-fg-muted);
  opacity: 0.3;
  transform: translate(var(--offset, 0px), -50%);

  /* Raised so samples that land on the same spot, as steps() trails do, can't hide the tint. */
  &[data-endpoint] {
    z-index: 1;
    background: var(--color-bg-accent-emphasis);
    opacity: 1;
  }
`;

// Switches to the emphasis colour while playing so the active run stands out from the trail.
export const Marker = styled.div`
  position: absolute;
  inset-inline-start: 0;
  inset-block-start: 50%;
  inline-size: 1.5rem;
  block-size: 1.5rem;
  border-radius: 624.9375rem;
  background: var(--color-fg-accent);
  box-shadow: var(--box-shadow-sm);
  transform: translate(var(--offset, 0px), -50%);
  /* Stays above the raised endpoint dots. */
  z-index: 2;

  &[data-playing] {
    background: var(--color-bg-accent-emphasis);
  }

  /* Only the trip back to the start is a CSS transition; the race itself is driven frame by frame. */
  &[data-returning] {
    transition: transform 400ms ease-in-out;
  }
`;

// Keeps the curve picker and play trigger together beneath the track they control.
export const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-block-start: 1.5rem;
`;
