import { styled } from "@linaria/react";

// Outer section: label + digit display side-by-side.
export const Wrapper = styled.section`
  display: inline-flex;
  gap: 0.75rem;
  align-items: center;
  color: var(--color-fg-muted);
  text-align: center;
  margin-block-start: clamp(1rem, 1.25vw, 1.5rem);
  font-size: clamp(1.125rem, 2.4vw, 1.25rem);
`;

/*
  Clickable wrapper around all six digits.
  Reads only from the local --hit-counter-* vars set by Wrapper above.
*/
export const SegmentButton = styled.button`
  display: flex;
  gap: 0.25rem;
  background: var(--color-bg-hit-counter);
  border-radius: 0.375rem;
  border: 5px solid var(--color-bg-hit-counter);
  cursor: pointer;
  padding: 0;

  path[data-active="true"] {
    fill: var(--color-hit-counter-segment-active);
  }

  path[data-active="false"] {
    fill: var(--color-hit-counter-segment-inactive);
  }

  &[data-is-on="true"] {
    background: var(--color-bg-hit-counter-on);
    border-color: var(--color-bg-hit-counter-on);
    box-shadow: 0 0 0 1.5px var(--color-hit-counter-segment-active-on), 0 0 8px 1px var(--color-hit-counter-segment-active-on);

    path[data-active="true"] {
      fill: var(--color-hit-counter-segment-active-on);
    }

    path[data-active="false"] {
      fill: var(--color-hit-counter-segment-inactive-on);
    }
  }
`;
