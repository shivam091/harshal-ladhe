import { styled } from "@linaria/react";

// Header row: title on one side, the live frame counter on the other.
export const TimelineHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

// Frame counter in the sheet's monospace lettering, tabular so the digits don't jitter while the playhead runs.
export const FrameCounter = styled.output`
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  color: var(--color-fg-muted);
`;

// Side padding so the 0% and 100% ruler labels have room to centre on the track's ends without being clipped.
export const TimelineFrame = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-inline: 0.875rem;
`;

// The frame-numbered column header — percentages over frame numbers, every 10%, like the numbered rows down a real exposure sheet turned on its side.
export const Ruler = styled.div`
  position: relative;
  block-size: 1.75rem;
`;

// One ruler label, centred on its column line.
export const RulerMark = styled.span`
  position: absolute;
  inset-block-start: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translateX(-50%);
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.625rem;
  line-height: 1.2;
  color: var(--color-fg-muted);
  white-space: nowrap;

  & > span:last-child {
    font-size: 0.5625rem;
    opacity: 0.75;
  }

  /* Every other label hides on phones — eleven labels don't fit in 20rem without colliding. */
  @media (max-width: 30rem) {
    &[data-minor="true"] {
      display: none;
    }
  }
`;

/*
  Scrubber — a native range input (so it's keyboard- and screen-reader-operable for free) restyled as
  the playhead's handle: a pencil-yellow flag riding a hairline, sitting directly above the track it
  scrubs.
*/
export const ScrubInput = styled.input`
  display: block;
  inline-size: 100%;
  block-size: 1rem;
  margin: 0;
  background: transparent;
  appearance: none;
  cursor: ew-resize;

  &::-webkit-slider-runnable-track {
    block-size: 0.125rem;
    background: var(--sheet-rule);
  }

  &::-moz-range-track {
    block-size: 0.125rem;
    background: var(--sheet-rule);
  }

  &::-webkit-slider-thumb {
    appearance: none;
    inline-size: 0.75rem;
    block-size: 1rem;
    margin-block-start: -0.4375rem;
    border: none;
    border-radius: 0.125rem 0.125rem 50% 50%;
    background: var(--sheet-pencil);
    cursor: ew-resize;
  }

  &::-moz-range-thumb {
    inline-size: 0.75rem;
    block-size: 1rem;
    border: none;
    border-radius: 0.125rem 0.125rem 50% 50%;
    background: var(--sheet-pencil);
    cursor: ew-resize;
  }

  &:focus-visible {
    outline: 0.125rem solid var(--sheet-pencil);
    outline-offset: 0.125rem;
  }
`;

/*
  The exposure track itself: ruled into 5% columns with alternate columns faintly shaded, a heavier
  rule every 10% to line up with the ruler — the column grid of an exposure sheet. Clicking any bare
  part of it adds a keyframe there; touch-action: none so a drag on touch screens moves stops instead
  of scrolling the page.
*/
export const Track = styled.div`
  position: relative;
  block-size: 3.5rem;
  background-color: color-mix(in srgb, var(--sheet-pencil) 4%, var(--color-bg-default));
  background-image:
    repeating-linear-gradient(to right, var(--sheet-rule) 0 0.0625rem, transparent 0.0625rem 10%),
    repeating-linear-gradient(to right, color-mix(in srgb, var(--sheet-rule) 45%, transparent) 0 0.0625rem, transparent 0.0625rem 5%),
    repeating-linear-gradient(to right, transparent 0 5%, color-mix(in srgb, var(--sheet-pencil) 6%, transparent) 5% 10%);
  border: 0.0625rem solid var(--sheet-rule);
  border-radius: 0.25rem;
  cursor: copy;
  touch-action: none;
`;

// The playhead line through the track, following the running preview; purely visual — the scrubber above is the control.
export const PlayheadLine = styled.span`
  position: absolute;
  inset-block: -0.25rem;
  inline-size: 0.125rem;
  margin-inline-start: -0.0625rem;
  background: var(--sheet-pencil);
  box-shadow: 0 0 0 0.0625rem color-mix(in srgb, var(--color-bg-default) 60%, transparent);
  pointer-events: none;
  z-index: 1;
`;

/*
  A keyframe on the track — a generous square hit area with the classic animation-software diamond
  drawn inside it. Filled when the stop pins anything, hollow when it's an empty marker; pencil-yellow
  when selected. z-index lifts the selected stop above any neighbour sharing its offset.
*/
export const StopHandle = styled.button`
  position: absolute;
  inset-block-start: 50%;
  display: grid;
  place-items: center;
  inline-size: 1.75rem;
  block-size: 1.75rem;
  padding: 0;
  margin-inline-start: -0.875rem;
  margin-block-start: -0.875rem;
  background: transparent;
  border: none;
  border-radius: 0.25rem;
  cursor: grab;
  touch-action: none;
  z-index: 2;

  &::before {
    content: "";
    inline-size: 0.875rem;
    block-size: 0.875rem;
    rotate: 45deg;
    background: var(--color-fg-muted);
    border: 0.125rem solid var(--color-bg-default);
    box-shadow: 0 0 0 0.0625rem var(--color-fg-muted);
    transition: background 120ms ease, box-shadow 120ms ease;
  }

  &[data-empty="true"]::before {
    background: var(--color-bg-default);
  }

  &[data-selected="true"] {
    z-index: 3;
  }

  &[data-selected="true"]::before {
    background: var(--sheet-pencil);
    box-shadow: 0 0 0 0.0625rem var(--color-fg-default);
  }

  &[data-selected="true"][data-empty="true"]::before {
    background: color-mix(in srgb, var(--sheet-pencil) 30%, var(--color-bg-default));
  }

  &:active {
    cursor: grabbing;
  }

  &:focus-visible {
    outline: 0.125rem solid var(--sheet-pencil);
    outline-offset: 0.0625rem;
  }
`;

// The selected stop's offset, pencilled in just above its diamond so a drag shows exactly where it'll land.
export const StopLabel = styled.span`
  position: absolute;
  inset-block-end: calc(100% - 0.125rem);
  inset-inline-start: 50%;
  transform: translateX(-50%);
  padding: 0 0.25rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.625rem;
  font-weight: 700;
  color: var(--color-fg-default);
  background: color-mix(in srgb, var(--sheet-pencil) 35%, var(--color-bg-default));
  border-radius: 0.125rem;
  pointer-events: none;
  white-space: nowrap;
`;
