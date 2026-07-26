import { styled } from "@linaria/react";
import { opaqueBgCss } from "@/components/common.styles";

/*
  Covers its parent so whatever's underneath (an iframe mid-init, a crashed sandbox) never shows
  through; tone and align are data attributes so consumers pick a variant instead of redeclaring layout.
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
    over the solid colour above to guarantee full opacity.
  */
  &[data-tone="danger"] {
    background-image: ${opaqueBgCss("var(--color-bg-danger-muted)")};
  }
`;
