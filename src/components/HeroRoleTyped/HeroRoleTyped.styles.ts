import { styled } from "@linaria/react";

// Relative so the gradient underline is anchored to the text's own width.
const HighlightBase = styled.span`
  position: relative;
  letter-spacing: 0.05em;
  padding-block-end: 0.125rem;
`;

// Shared so neighbouring text can match this gradient exactly without duplicating its stops.
export const gradientTextCss = `
  background-color: var(--color-fg-danger);
  background-image: linear-gradient(
    45deg,
    var(--color-fg-danger) 20%,
    var(--color-fg-success) 45%,
    var(--color-fg-attention) 70%
  );
  background-size: 100%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
`;

// Underline shares the text gradient so the role reads as one highlighted phrase.
export const HeroHighlight = styled(HighlightBase)`
  ${gradientTextCss}

  &::after {
    content: "";
    position: absolute;
    inset: auto 0 0;
    block-size: 1px;
    inline-size: 100%;
    background: linear-gradient(
      45deg,
      var(--color-fg-danger) 20%,
      var(--color-fg-success) 45%,
      var(--color-fg-attention) 70%
    );
  }

  :global(.typed-cursor) {
    color: var(--color-fg-attention);
    -webkit-text-fill-color: var(--color-fg-attention);
  }
`;
