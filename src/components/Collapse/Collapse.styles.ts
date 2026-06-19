import { css } from "@linaria/core";
import { styled } from "@linaria/react";

// Outermost collapse wrapper — block margin separates it from surrounding content.
export const CollapseRoot = styled.div`
  margin-block: 1.5rem;
`;

// Toggle button that opens and closes the collapsed content — full-width, left-aligned text.
export const CollapseToggle = styled.button`
  appearance: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;
  background: none;
  border: 0;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-fg-default);
  text-align: start;
  inline-size: 100%;
  cursor: pointer;

  & > svg {
    inline-size: 1.5rem;
    block-size: 1.5rem;
  }
`;

// Animated panel — applied to Collapsible.Content; height is driven by --radix-collapsible-content-height.
export const collapsePanelClass = css`
  overflow: hidden;

  &[data-state="open"] {
    animation: collapsible-open 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
    will-change: transform, opacity;
  }

  &[data-state="closed"] {
    animation: collapsible-close 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
    will-change: transform, opacity;
  }

  // Expand — height grows from 0 to measured content height; opacity and y-shift match original Framer Motion config.
  @keyframes collapsible-open {
    from {
      block-size: 0;
      opacity: 0;
      transform: translateY(-15px);
    }
    to {
      block-size: var(--radix-collapsible-content-height);
      opacity: 1;
      transform: translateY(0);
    }
  }

  // Collapse — reverse of collapsible-open; height retreats to 0.
  @keyframes collapsible-close {
    from {
      block-size: var(--radix-collapsible-content-height);
      opacity: 1;
      transform: translateY(0);
    }
    to {
      block-size: 0;
      opacity: 0;
      transform: translateY(-15px);
    }
  }
`;

// Collapsed content area — indented to align with the text after the toggle icon.
export const CollapseContent = styled.div`
  padding-inline-start: 2rem;

  p:last-child {
    margin-block-end: 0;
  }
`;
