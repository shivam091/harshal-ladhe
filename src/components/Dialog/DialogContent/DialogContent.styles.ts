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
    animation: dialog-overlay-in var(--motion-duration-medium) ease both;
  }

  &[data-state="closed"] {
    animation: dialog-overlay-out var(--motion-duration-fast) ease both;
  }

  @keyframes dialog-overlay-in {
    from {
      opacity: var(--opacity-none);
    }
  }

  @keyframes dialog-overlay-out {
    to {
      opacity: var(--opacity-none);
    }
  }
`;

/*
  Centered modal panel — width caps out at a comfortable reading measure by default (pass
  size="large" for wider content, or a className for anything more bespoke); height scrolls
  internally once content outgrows the viewport rather than pushing the dialog off-screen.
*/
export const contentClass = css`
  position: fixed;
  inset-block-start: 50%;
  inset-inline-start: 50%;
  transform: translate(-50%, -50%);
  z-index: 1002;
  inline-size: min(92vw, var(--size-narrow));
  max-block-size: min(85vh, 85svh);
  display: flex;
  flex-direction: column;
  background: var(--color-bg-overlay);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--box-shadow-md);
  padding: var(--space-md);
  will-change: opacity, transform;

  &[data-state="open"] {
    animation: dialog-content-in var(--motion-duration-medium) cubic-bezier(0.17, 0.67, 0.51, 1) both;
  }

  &[data-state="closed"] {
    animation: dialog-content-out var(--motion-duration-fast) ease-in both;
  }

  @keyframes dialog-content-in {
    from {
      opacity: var(--opacity-none);
      transform: translate(-50%, -50%) scale(0.96);
    }
  }

  @keyframes dialog-content-out {
    to {
      opacity: var(--opacity-none);
      transform: translate(-50%, -50%) scale(0.98);
    }
  }
`;

/*
  size="large" override — applied alongside contentClass (source order makes this rule win), for
  content that needs to lay out side-by-side instead of stacking into one narrow column.
*/
export const largeContentClass = css`
  inline-size: min(94vw, var(--size-large));
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
  gap: var(--space-md);
  padding-block-end: var(--space-md);
  margin-block-end: var(--space-md);
  border-block-end: var(--border-width-default) solid var(--color-border-muted);
`;

// Modal heading text — pair with DialogTitle for the accessible name. No border of its own; Header owns that.
export const Heading = styled.h2`
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semi-bold);
  color: var(--color-fg-default);
  margin: var(--space-none);
  border: none;
`;

// Scrollable body — everything below Header that might outgrow the panel's max height.
export const Body = styled.div`
  overflow-y: auto;
  scrollbar-width: thin;
`;
