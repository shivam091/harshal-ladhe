import { css } from "@linaria/core";
import { Tip } from "@/components/Tip/Tip.styles";

// Built on the shared overlay tokens so the panel tracks every colour scheme without per-theme overrides.
export const contentClass = css`
  position: relative;
  max-inline-size: 18rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  line-height: 1.375;
  color: var(--color-fg-default);
  background: var(--color-bg-overlay);
  border-radius: 0.1875rem;
  box-shadow: var(--box-shadow-md);
  user-select: none;
  z-index: 1002;

  /* Radix sets data-state to delayed-open / instant-open while visible. */
  &[data-state="delayed-open"],
  &[data-state="instant-open"] {
    animation: fade-in 0.15s ease-out both;
  }

  /*
    Radix's Presence only keeps Content mounted for a close animation it can detect on the node
    itself — without this, data-state flips to "closed" and Content unmounts on the same tick,
    so the panel (and the Tip arrow's reverse spring, keyed off the same open state) never gets
    to play.
  */
  &[data-state="closed"] {
    animation: fade-out 0.15s ease-in both;
  }

  &[data-state="delayed-open"],
  &[data-state="instant-open"],
  &[data-state="closed"] {
    will-change: opacity;
  }

  /*
    The hill-shaped tip SVG is 30×10. Radix rotates it ±90° for left/right
    placements, which distorts it into a 10×30 shape — hide it in those cases.
  */
  &[data-side="left"] ${Tip},
  &[data-side="right"] ${Tip} {
    display: none;
  }
`;
