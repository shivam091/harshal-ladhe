import { styled } from "@linaria/react";
import { opaqueBgCss } from "@/components/common.styles";

/*
  Absolutely covers its position:relative parent so whatever's mounted underneath (an iframe
  mid-init, a crashed sandbox, ...) never shows through. tone/align are driven by data-*
  attributes (see Button's data-intent convention) so consumers only pick a variant instead of
  redeclaring layout.
*/
export const Overlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: var(--color-bg-default);

  &[data-align="center"] {
    align-items: center;
    justify-content: center;
  }

  &[data-align="start"] {
    padding: 1rem;
    overflow: auto;
  }

  /*
    color-bg-danger-muted is only ~10% opaque in some themes, so it's layered as a background-image
    over the solid color above to guarantee full opacity.
  */
  &[data-tone="danger"] {
    background-image: ${opaqueBgCss("var(--color-bg-danger-muted)")};
  }
`;
