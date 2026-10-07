import { styled } from "@linaria/react";
import { MONO_FONT } from "@/components/StrokeLab/StrokeLab.styles";

// The gauge drawing — a short steel rule with a sliding red marker, scaled in miter ratios rather than inches.
export const GaugeSvg = styled.svg`
  display: block;
  inline-size: 100%;
  block-size: auto;
`;

/*
  The live verdict for the sharpest corner, set like a stamped reading on the gauge's slider —
  monospace figures so the maths lines up as it changes.
*/
export const Verdict = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.625rem 0.75rem;
  font-family: ${MONO_FONT};
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--color-fg-default);
  background: color-mix(in srgb, var(--color-fg-muted) 8%, var(--color-bg-default));
  border: 0.0625rem solid var(--haber-card-edge);
  border-inline-start: 0.25rem solid var(--haber-pass);
  border-radius: 0.25rem;

  &[data-tone="fail"] {
    border-inline-start-color: var(--haber-fail);
  }

  &[data-tone="muted"] {
    border-inline-start-color: var(--haber-card-edge);
  }
`;

// Every corner's reading in a wrapping row of chips.
export const CornerList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
`;
