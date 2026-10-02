import { styled } from "@linaria/react";

// Matches code blocks' vertical rhythm so diagrams sit consistently with surrounding prose.
export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-block: clamp(0.75rem, 1vw, 1rem);
`;

// One responsive base so every diagram scales the same way, varying only its size and font.
export const Svg = styled.svg`
  inline-size: 100%;
  block-size: auto;
`;

/*
  Live "why" readout under an interactive stacking demo — the stripe colour mirrors the outcome, so a reader who
  only glances still sees whether the change they just made helped or hurt.
*/
export const DemoVerdict = styled.output`
  display: block;
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-muted);
  border-inline-start: 0.25rem solid var(--color-border-success-emphasis);
  border-radius: 0.375rem;

  &[data-outcome="bad"] {
    border-inline-start-color: var(--color-border-danger-emphasis);
  }

  code {
    font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
    font-size: 0.8125rem;
  }
`;
