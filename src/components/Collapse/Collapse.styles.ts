import { css } from "@linaria/core";
import { styled } from "@linaria/react";

// Spacing lives on the root so stacked collapses stay evenly separated from each other and nearby content.
export const CollapseRoot = styled.div`
  margin-block: 1.5rem;
`;

// Full-width so the whole row is a hit target, not just the question text.
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

// Animates against Radix's measured height variable, since CSS can't animate to height: auto.
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

  // Fade and slide match the original Framer Motion config so dropping that dependency changed nothing visually.
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

  // Mirrors the open animation so closing reads as the same motion in reverse.
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

// Indented to align with the question text rather than the toggle icon.
export const CollapseContent = styled.div`
  padding-inline-start: 2rem;

  p:last-child {
    margin-block-end: 0;
  }
`;
