import { styled } from "@linaria/react";
import { css } from "@linaria/core";
import { Tip } from "@/components/Tip/Tip.styles";

// Floating panel — className applied to Radix.Content in the component.
export const contentClass = css`
  position: relative;
  min-inline-size: 10rem;
  will-change: opacity, transform;
  background: var(--color-bg-overlay);
  border-radius: var(--border-radius-md);
  padding: var(--space-xs);
  box-shadow: var(--box-shadow-md);
  z-index: 1002;

  /*
    Direction varies by the side Radix resolves to (after collision avoidance).
    data-side is always present on Radix.Content — no JS needed.
  */
  &[data-state="open"] {
    &[data-side="bottom"] {
      animation: dropdown-in-bottom 0.55s cubic-bezier(0.17, 0.67, 0.51, 1) both;
    }

    &[data-side="top"] {
      animation: dropdown-in-top 0.55s cubic-bezier(0.17, 0.67, 0.51, 1) both;
    }

    &[data-side="left"] {
      animation: dropdown-in-left 0.55s cubic-bezier(0.17, 0.67, 0.51, 1) both;
    }

    &[data-side="right"] {
      animation: dropdown-in-right 0.55s cubic-bezier(0.17, 0.67, 0.51, 1) both;
    }
  }

  &[data-state="closed"] {
    &[data-side="bottom"] {
      animation: dropdown-out-bottom 0.2s ease-in both;
    }

    &[data-side="top"] {
      animation: dropdown-out-top 0.2s ease-in both;
    }

    &[data-side="left"] {
      animation: dropdown-out-left 0.2s ease-in both;
    }

    &[data-side="right"] {
      animation: dropdown-out-right 0.2s ease-in both;
    }
  }

  /*
    The hill-shaped tip SVG is 30×10. Radix rotates it ±90° for left/right
    placements, which distorts it into a 10×30 shape — hide it in those cases.
  */
  &[data-side="left"] ${Tip},
  &[data-side="right"] ${Tip} {
    display: none;
  }

  // Entry animation when dropdown opens below the trigger — panel slides in from above.
  @keyframes dropdown-in-bottom {
    from {
      opacity: var(--opacity-none);
      transform: translateY(-8px);
    }
  }

  // Entry animation when dropdown opens above the trigger — panel slides up from below.
  @keyframes dropdown-in-top {
    from {
      opacity: var(--opacity-none);
      transform: translateY(8px);
    }
  }

  // Entry animation when dropdown opens to the right of the trigger — panel slides in from the left.
  @keyframes dropdown-in-left {
    from {
      opacity: var(--opacity-none);
      transform: translateX(8px);
    }
  }

  // Entry animation when dropdown opens to the left of the trigger — panel slides in from the right.
  @keyframes dropdown-in-right {
    from {
      opacity: var(--opacity-none);
      transform: translateX(-8px);
    }
  }

  // Exit animation when dropdown closes below the trigger — panel retreats upward.
  @keyframes dropdown-out-bottom {
    to {
      opacity: var(--opacity-none);
      transform: translateY(-4px);
    }
  }

  // Exit animation when dropdown closes above the trigger — panel retreats downward.
  @keyframes dropdown-out-top {
    to {
      opacity: var(--opacity-none);
      transform: translateY(4px);
    }
  }

  // Exit animation when dropdown closes to the right of the trigger — panel retreats left.
  @keyframes dropdown-out-left {
    to {
      opacity: var(--opacity-none);
      transform: translateX(4px);
    }
  }

  // Exit animation when dropdown closes to the left of the trigger — panel retreats right.
  @keyframes dropdown-out-right {
    to {
      opacity: var(--opacity-none);
      transform: translateX(-4px);
    }
  }
`;

// Inner wrapper that fades in slightly after the panel's enter animation completes.
export const ContentInner = styled.div`
  animation: fade-in 0.2s 0.1s backwards;
  will-change: opacity;
`;
