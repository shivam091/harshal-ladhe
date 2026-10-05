import { styled } from "@linaria/react";

// Tint and size controls share one row on wide screens and stack on phones.
export const ControlRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0.75rem;

  @media (min-width: 36rem) {
    grid-template-columns: 9rem minmax(0, 1fr);
    align-items: end;
  }
`;

// Side by side once there's room for two meaningful stages, stacked below that.
export const StageGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0.75rem;

  @media (min-width: 36rem) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

// A figure, so each preview is announced together with its caption.
export const Stage = styled.figure`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin: 0;
  min-inline-size: 0;
`;

// Silkscreen-style caption — uppercase monospace, like the board's other labels.
export const StageCaption = styled.figcaption`
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-fg-muted);
`;

/*
  A checkerboard stage so transparent areas read as transparent, not as the card colour. The
  original is capped to the stage (an editor's 512×512 export would otherwise overflow), while the
  converted artwork renders at the slider's exact size and scrolls if that's larger than the stage.
*/
export const StageCanvas = styled.div`
  display: flex;
  block-size: 16rem;
  padding: 0.75rem;
  overflow: auto;
  background:
    conic-gradient(var(--color-bg-muted) 25%, var(--color-bg-default) 0 50%, var(--color-bg-muted) 0 75%, var(--color-bg-default) 0) 0 0 / 1rem 1rem;
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.25rem;

  &[data-stage="original"] > svg {
    max-inline-size: 100%;
    max-block-size: 100%;
  }

  /* An unsized original would otherwise fall back to the 300×150 replaced-element default rather than filling the stage. */
  &[data-stage="original"] > svg:not([width]) {
    inline-size: 100%;
    block-size: 100%;
  }

  /* margin:auto rather than centring alignment, so an oversized SVG overflows towards the scrollable end instead of being clipped off both sides. */
  & > svg {
    flex: none;
    margin: auto;
  }
`;
