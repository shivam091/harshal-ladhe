import { styled } from "@linaria/react";
import { BREAKPOINTS } from "@/constants/breakpoints";

// Outer wrapper that positions the form and any success overlay as siblings.
export const OuterWrapper = styled.div`
  position: relative;
`;

/*
  Form container — min-height prevents layout shift when elements fall away on success.
  overflow-y: clip cuts off elements that translate below the bottom edge.
*/
export const FormWrapper = styled.form`
  position: relative;
  padding-block-end: 1rem;
  min-height: 7.25rem;
  overflow-block: clip;
`;

// Two-line intro text — cursor: default so clicking anywhere focuses the input.
export const IntroText = styled.p`
  font-size: 0.875rem;
  margin-block-start: 0;
  cursor: default;
  max-width: 25rem;

  @media ${BREAKPOINTS.mobile} {
    max-width: 100%;
  }
`;

/*
  Input + button row — focus ring is on the container (not the input) via :has().
  No inline margin so the box edge lines up with IntroText above it.
*/
export const Row = styled.div`
  display: flex;
  gap: 0.5rem;
  background: var(--color-bg-default);
  max-width: 22rem;
  border-radius: 0.25rem;
  padding: 0.25rem;

  @media ${BREAKPOINTS.mobile} {
    max-width: 100%;
  }

  &:has(input:focus-visible) {
    background: var(--color-bg-default);
    outline-color: Highlight;
    outline-color: -webkit-focus-ring-color;
    outline-style: auto;
    outline-width: 3px;
    outline-offset: 0.125rem;
  }
`;

// Borderless email input inside the Row — the Row provides the visual container.
export const EmailInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 1rem;
  padding-block: 0.25rem;
  padding-inline: 0.5rem;
  color: var(--color-fg-default);
  font-family: inherit;
  min-width: 0;

  &::placeholder {
    color: var(--color-fg-muted);
    font-style: italic;
    opacity: 0.5;
  }
`;

// Error box with drop-in entrance animation.
export const ErrorBox = styled.div`
  max-width: 22rem;
  border-radius: 0.375rem;
  padding: 0.75rem;
  margin-block-start: 0.25rem;
  background: var(--color-bg-danger-muted);
  animation: drop-in 500ms cubic-bezier(0.23, 0.62, 0.41, 1.01) both;
  animation-delay: 300ms;

  @media ${BREAKPOINTS.mobile} {
    max-width: 100%;
  }

  p {
    margin-block-end: 1em;
    font-size: 0.875rem;
    color: var(--color-fg-danger);
    animation: fadeIn 300ms 400ms both;

    &:last-child {
      margin-block: 0;
    }
  }

  @keyframes drop-in {
    from {
      opacity: 0;
      transform: translateY(-6px);
    }
  }
`;

// Success message shown after the form elements fall away.
export const SuccessMessage = styled.p`
  font-size: 0.875rem;
  color: var(--color-fg-success);
  line-height: 1.625;
  animation: fadeInSuccess 500ms 200ms both;

  @keyframes fadeInSuccess {
    from {
      opacity: 0;
    }
  }
`;
