import { css } from "@linaria/core";
import { styled } from "@linaria/react";
import { MONO_FONT } from "@/components/StrokeLab/StrokeLab.styles";

/*
  The cutting cloth — calico printed with a dressmaker's grid (fine squares, bolder every fifth)
  and pinking-shear zig-zags along its top and bottom edges, cut with a conic-gradient mask so the
  teeth re-tint with the cloth instead of being an image. A woven selvedge runs down its left side.
*/
export const CuttingCloth = styled.div`
  --pink: 0.4375rem;
  --cloth: color-mix(in srgb, var(--color-fg-attention) 6%, var(--color-bg-default));
  --grid-fine: color-mix(in srgb, var(--haber-thread) 10%, transparent);
  --grid-bold: color-mix(in srgb, var(--haber-thread) 22%, transparent);

  position: relative;
  padding-block: calc(var(--pink) + 0.25rem);
  padding-inline: 1.25rem 0.5rem;
  background:
    linear-gradient(to right, color-mix(in srgb, var(--haber-thread) 18%, var(--cloth)) 0 0.25rem, transparent 0.25rem) 0 0 / 100% 100% no-repeat,
    radial-gradient(circle, color-mix(in srgb, var(--color-fg-default) 25%, transparent) 0 0.09rem, transparent 0.1rem) 0.4rem 0 / 0.5rem 0.5rem repeat-y,
    linear-gradient(var(--grid-bold) 0.0625rem, transparent 0.0625rem) 0 0 / 5rem 5rem,
    linear-gradient(90deg, var(--grid-bold) 0.0625rem, transparent 0.0625rem) 0 0 / 5rem 5rem,
    linear-gradient(var(--grid-fine) 0.0625rem, transparent 0.0625rem) 0 0 / 1rem 1rem,
    linear-gradient(90deg, var(--grid-fine) 0.0625rem, transparent 0.0625rem) 0 0 / 1rem 1rem,
    var(--cloth);
  -webkit-mask:
    conic-gradient(from 135deg at top, #0000, #000 1deg 89deg, #0000 90deg) top / calc(2 * var(--pink)) 51% repeat-x,
    conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) bottom / calc(2 * var(--pink)) 51% repeat-x;
  mask:
    conic-gradient(from 135deg at top, #0000, #000 1deg 89deg, #0000 90deg) top / calc(2 * var(--pink)) 51% repeat-x,
    conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) bottom / calc(2 * var(--pink)) 51% repeat-x;
`;

// The stage drawing fills the cloth's width; its viewBox keeps the subject's proportions.
export const StageSvg = styled.svg`
  display: block;
  inline-size: 100%;
  block-size: auto;
  max-block-size: 26rem;
  overflow: hidden;
`;

/*
  The marching-ants class, applied to whichever element (path or text) is the subject. The from/to
  offsets and duration come in as custom properties so one keyframe serves every dash pattern; the
  media query is a belt-and-braces stop on top of the component never adding the class when motion
  is reduced.
*/
export const marchingStroke = css`
  animation: stroke-lab-march var(--march-duration, 1s) linear infinite;

  @keyframes stroke-lab-march {
    from {
      stroke-dashoffset: var(--march-from, 0);
    }
    to {
      stroke-dashoffset: var(--march-to, 0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

// Subject picker as lengths of grosgrain ribbon on the counter, the chosen one dyed in the thread colour.
export const RibbonRail = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
`;

// One ribbon length — ribbed weave, swallow-tailed end, native radio hidden inside for keyboard use.
export const Ribbon = styled.label`
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 0.3125rem 1.125rem 0.3125rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-fg-default);
  background:
    repeating-linear-gradient(90deg, color-mix(in srgb, var(--color-fg-default) 7%, transparent) 0 0.0625rem, transparent 0.0625rem 0.1875rem),
    color-mix(in srgb, var(--haber-thread) 10%, var(--color-bg-default));
  clip-path: polygon(0 0, 100% 0, calc(100% - 0.5rem) 50%, 100% 100%, 0 100%);
  cursor: pointer;
  transition: background-color 150ms ease, color 150ms ease;

  &:has(input:checked) {
    color: var(--color-fg-on-emphasis);
    background:
      repeating-linear-gradient(90deg, color-mix(in srgb, black 12%, transparent) 0 0.0625rem, transparent 0.0625rem 0.1875rem),
      var(--haber-thread);
  }

  &:has(input:focus-visible) {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.125rem;
  }
`;

// The colour key under the cloth, so the overlays never need explaining twice.
export const Legend = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 0.75rem;
  color: var(--color-fg-muted);

  & li {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
  }
`;

// A short drawn sample of each overlay's line style in the legend.
export const LegendSwatch = styled.svg`
  flex: none;
  inline-size: 1.5rem;
  block-size: 0.75rem;
`;

// Parse errors for a custom path, in the danger colour and announced politely.
export const ErrorText = styled.p`
  margin: 0;
  font-family: ${MONO_FONT};
  font-size: 0.75rem;
  color: var(--haber-fail);
`;
