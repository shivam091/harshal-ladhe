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
  padding-inline: 1.5rem;
  padding-block: 5rem;
`;

// Circular icon container coloured danger-red to signal the error state.
export const ErrorIconCircle = styled.div`
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-block-end: 1.5rem;
  color: var(--color-fg-danger);
`;

// Primary error heading — bold, danger-coloured, and centred.
export const ErrorHeading = styled.h1`
  text-align: center;
  font-size: 3rem;
  line-height: 1;
  font-weight: 700;
  color: var(--color-fg-danger);
`;

// Descriptive error paragraph — muted colour, constrained width for readability.
export const ErrorMessage = styled.p`
  text-align: center;
  font-size: 1.125rem;
  line-height: calc(1.75 / 1.125);
  margin-block-start: 1rem;
  max-inline-size: 28rem;
  color: var(--color-fg-muted);
`;

// Horizontal action row — groups CTA buttons with even spacing.
export const ErrorButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-block-start: 2rem;
`;

// Outer page shell — fades and slides in via @starting-style on mount.
export const ErrorPage = styled.div`
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 500ms ease,
    transform 500ms ease;

  @starting-style {
    opacity: 0;
    transform: translateY(0.75rem);
  }
`;
