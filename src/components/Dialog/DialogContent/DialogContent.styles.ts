import { css } from "@linaria/core";
import { styled } from "@linaria/react";

/*
  Dimmed backdrop behind the modal — click dismisses it, same as any Radix Dialog overlay.
  data-state is set by Radix's own Presence, so the fade plays on both mount and unmount.
*/
export const overlayClass = css`
  position: fixed;
  inset: 0;
  z-index: 1001;
  background-color: hsl(0deg 0% 0% / 0.4);

  &[data-state="open"] {
    animation: dialog-overlay-in 300ms ease both;
  }

  &[data-state="closed"] {
    animation: dialog-overlay-out 150ms ease both;
  }

  @keyframes dialog-overlay-in {
    from {
      opacity: 0;
    }
  }

  @keyframes dialog-overlay-out {
    to {
      opacity: 0;
    }
  }
`;

/*
  Width caps at a comfortable reading measure by default; height scrolls internally once content
  outgrows the viewport rather than pushing the dialog off-screen.
*/
export const contentClass = css`
  position: fixed;
  inset-block-start: 50%;
  inset-inline-start: 50%;
  transform: translate(-50%, -50%);
  z-index: 1002;
  inline-size: min(92vw, 28rem);
  max-block-size: min(85vh, 85svh);
  display: flex;
  flex-direction: column;
  background: var(--color-bg-overlay);
  border-radius: 0.75rem;
  box-shadow: var(--box-shadow-md);
  padding: var(--space-lg);
  will-change: opacity, transform;

  &[data-state="open"] {
    animation: dialog-content-in 300ms cubic-bezier(0.17, 0.67, 0.51, 1) both;
  }

  &[data-state="closed"] {
    animation: dialog-content-out 150ms ease-in both;
  }

  @keyframes dialog-content-in {
    from {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.96);
    }
  }

  @keyframes dialog-content-out {
    to {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.98);
    }
  }
`;

/*
  size="large" override — applied alongside contentClass (source order makes this rule win), for
  content that needs to lay out side-by-side instead of stacking into one narrow column.
*/
export const largeContentClass = css`
  inline-size: min(94vw, 60rem);
`;

/*
  Title row — heading on one side, dismiss control pinned to the other. The border sits on this
  row (not Heading) so it spans the close button too, not just the width of the heading text.
*/
export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  gap: 0.75rem;
  padding-block-end: 0.75rem;
  margin-block-end: 0.75rem;
  border-block-end: 0.0625rem solid var(--color-border-muted);
`;

// Modal heading text — pair with DialogTitle for the accessible name. No border of its own; Header owns that.
export const Heading = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-fg-default);
  margin: 0;
  border: none;
`;

// Scrollable body — everything below Header that might outgrow the panel's max height.
export const Body = styled.div`
  overflow-y: auto;
  scrollbar-width: thin;
`;
