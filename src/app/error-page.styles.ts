import { styled } from "@linaria/react";

// Full-screen centred flex column — provides the blank canvas for error page content.
// Rendered as <main> since these boundaries replace the entire route tree, including
// the (site) layout's own <main>, leaving the page with no landmark otherwise.
export const ErrorWrapper = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-block-size: 100vh;
  padding-inline: var(--space-lg);
  padding-block: 5rem;
`;

// Circular icon container coloured danger-red to signal the error state.
export const ErrorIconCircle = styled.div`
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-block-end: var(--space-lg);
  color: var(--color-fg-danger);
`;

// Primary error heading — bold, danger-coloured, and centred.
export const ErrorHeading = styled.h1`
  text-align: center;
  font-size: var(--font-size-xxxl);
  line-height: var(--line-height-none);
  font-weight: var(--font-weight-bold);
  color: var(--color-fg-danger);
`;

// Descriptive error paragraph — muted colour, constrained width for readability.
export const ErrorMessage = styled.p`
  text-align: center;
  font-size: var(--font-size-md);
  line-height: calc(1.75 / 1.125);
  margin-block-start: var(--space-base);
  max-inline-size: 28rem;
  color: var(--color-fg-muted);
`;

// Horizontal action row — groups CTA buttons with even spacing.
export const ErrorButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-block-start: var(--space-xl);
`;

// Outer page shell — fades and slides in via @starting-style on mount.
export const ErrorPage = styled.div`
  opacity: var(--opacity-full);
  transform: translateY(0);
  transition:
    opacity var(--motion-duration-slow) ease,
    transform var(--motion-duration-slow) ease;

  @starting-style {
    opacity: var(--opacity-none);
    transform: translateY(var(--space-md));
  }
`;
