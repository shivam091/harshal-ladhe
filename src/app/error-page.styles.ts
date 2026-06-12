import { styled } from "@linaria/react";

// Rendered as <main> because these boundaries replace the whole route tree, including
// the (site) layout's own <main>, which would otherwise leave the page with no landmark.
export const ErrorWrapper = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-block-size: 100vh;
  padding-inline: 1.5rem;
  padding-block: 5rem;
`;

// Danger colour signals the error state before any text is read.
export const ErrorIconCircle = styled.div`
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-block-end: 1.5rem;
  color: var(--color-fg-danger);
`;

// Matches the icon's danger colour so heading and icon read as one error state.
export const ErrorHeading = styled.h1`
  text-align: center;
  font-size: 3rem;
  line-height: 1;
  font-weight: 700;
  color: var(--color-fg-danger);
`;

// Width capped so the explanation stays at a comfortable line length under the large heading.
export const ErrorMessage = styled.p`
  text-align: center;
  font-size: 1.125rem;
  line-height: calc(1.75 / 1.125);
  margin-block-start: 1rem;
  max-inline-size: 28rem;
  color: var(--color-fg-muted);
`;

// Keeps retry and escape side by side so they read as equal recovery choices.
export const ErrorButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-block-start: 2rem;
`;

// Entrance fade softens the abrupt swap from a broken page to the error screen.
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
