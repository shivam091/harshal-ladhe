import { styled } from "@linaria/react";

// Relative-positioned span providing a baseline for the gradient underline pseudo-element.
const HighlightBase = styled.span`
  position: relative;
  letter-spacing: 0.05em;
  padding-block-end: 0.125rem;
`;

/*
  Shared gradient-clip text treatment (background-image gradient masked to the glyphs via
  background-clip: text). Exported so Hero.styles.ts's HeroRoleSpan — the wrapper around this
  same typed role text — can render identically without duplicating the gradient stops.
*/
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

// Gradient text + matching underline applied to the typed role string.
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
