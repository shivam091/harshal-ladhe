import { styled } from "@linaria/react";
import { css } from "@linaria/core";
import { Tip } from "@/components/Tip/Tip.styles";

// A class rather than a styled component because Radix.Content owns the rendered element.
export const contentClass = css`
  position: relative;
  min-inline-size: 10rem;
  will-change: opacity, transform;
  background: var(--color-bg-overlay);
  border-radius: 0.375rem;
  padding: 0.25rem;
  box-shadow: var(--box-shadow-md);
  z-index: 1002;

  /*
    Keyed off Radix's data-side, which reflects the post-collision placement, so the animation
    direction always matches where the panel actually landed.
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
    Hidden for left/right placements, where Radix's ±90° rotation would distort the
    30×10 hill-shaped tip into a 10×30 shape.
  */
  &[data-side="left"] ${Tip},
  &[data-side="right"] ${Tip} {
    display: none;
  }

  // Entries start offset toward the trigger so the panel appears to emerge from it.
  @keyframes dropdown-in-bottom {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
  }

  @keyframes dropdown-in-top {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
  }

  @keyframes dropdown-in-left {
    from {
      opacity: 0;
      transform: translateX(8px);
    }
  }

  @keyframes dropdown-in-right {
    from {
      opacity: 0;
      transform: translateX(-8px);
    }
  }

  // Exits travel half as far as entries so closing feels snappier than opening.
  @keyframes dropdown-out-bottom {
    to {
      opacity: 0;
      transform: translateY(-4px);
    }
  }

  @keyframes dropdown-out-top {
    to {
      opacity: 0;
      transform: translateY(4px);
    }
  }

  @keyframes dropdown-out-left {
    to {
      opacity: 0;
      transform: translateX(4px);
    }
  }

  @keyframes dropdown-out-right {
    to {
      opacity: 0;
      transform: translateX(-4px);
    }
  }
`;

// Delays the items' fade so they don't ride along with the panel's slide.
export const ContentInner = styled.div`
  animation: fade-in 0.2s 0.1s backwards;
  will-change: opacity;
`;
