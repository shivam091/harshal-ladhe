import { styled } from "@linaria/react";

// Two columns once the main column is wide enough — the log can run to a dozen short lines and shouldn't push the code far down the page.
export const LogList = styled.ul`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0.375rem 1rem;
  margin: 0;
  padding: 0;
  list-style: none;

  @media (min-width: 48rem) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

// Baseline-aligned so the LED sits on the first line even when a message wraps.
export const LogItem = styled.li`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  font-size: 0.75rem;
  line-height: 1.4;
  color: var(--color-fg-default);
`;

/*
  A surface-mount LED: green for routine changes, amber for warnings. The tone is also spelled out
  in text beside it ("Note:"), so colour is never the only signal.
*/
export const StatusLed = styled.span`
  flex: none;
  inline-size: 0.5rem;
  block-size: 0.5rem;
  border-radius: 0.125rem;
  background: var(--color-fg-success);
  box-shadow: 0 0 0.375rem color-mix(in srgb, var(--color-fg-success) 70%, transparent);
  translate: 0 -0.0625rem;

  &[data-tone="warning"] {
    background: var(--color-fg-attention);
    box-shadow: 0 0 0.375rem color-mix(in srgb, var(--color-fg-attention) 70%, transparent);
  }
`;
