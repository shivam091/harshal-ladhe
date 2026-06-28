import { styled } from "@linaria/react";

// Outer section: label + digit display side-by-side.
export const Wrapper = styled.section`
  display: inline-flex;
  gap: var(--space-md);
  align-items: center;
  color: var(--color-fg-muted);
  text-align: center;
  margin-block-start: var(--fluid-space-base);
  font-size: var(--fluid-font-size-lg);
`;

/*
  Clickable wrapper around all six digits.
  Reads only from the local --hit-counter-* vars set by Wrapper above.
*/
export const SegmentButton = styled.button`
  display: flex;
  gap: var(--space-xs);
  background: var(--color-bg-hit-counter);
  border-radius: var(--border-radius-default);
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
