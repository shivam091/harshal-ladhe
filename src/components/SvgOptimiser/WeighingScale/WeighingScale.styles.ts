import { styled } from "@linaria/react";

// Monospace for every weight, so the readouts line up like a scale's printed ticket.
const MONO_FONT = "'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

// Dial on the left and the printed readouts on the right once there's room; stacked on phones.
export const ScaleLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;
  align-items: center;

  @media (min-width: 36rem) {
    grid-template-columns: 13rem minmax(0, 1fr);
  }
`;

// The scale itself — pan on top, stem, then the dial housing — centred in its column.
export const ScaleBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/*
  The brass pan: a shallow dish seen slightly from above, with the parcel sitting on it. The
  parcel's size follows the weight, so a good optimisation visibly shrinks the box on the pan.
*/
export const Pan = styled.div`
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  inline-size: 11rem;
  block-size: 4.5rem;

  &::after {
    content: "";
    position: absolute;
    inset-inline: 0;
    inset-block-end: 0;
    block-size: 1.25rem;
    border-radius: 50%;
    background: radial-gradient(ellipse at 50% 35%, var(--po-brass-light), var(--po-brass) 55%, var(--po-brass-dark));
    box-shadow: 0 0.1875rem 0 var(--po-brass-dark), 0 0.375rem 0.5rem color-mix(in srgb, black 25%, transparent);
  }
`;

/*
  A kraft-paper parcel tied with twine. Its scale is set inline from the weight ratio and eases
  between readings, unless the visitor prefers reduced motion.
*/
export const PanParcel = styled.div`
  position: relative;
  z-index: 1;
  inline-size: 5.5rem;
  block-size: 3.5rem;
  margin-block-end: 0.625rem;
  transform-origin: 50% 100%;
  background:
    linear-gradient(90deg, transparent calc(50% - 0.125rem), var(--po-twine) calc(50% - 0.125rem) calc(50% + 0.125rem), transparent calc(50% + 0.125rem)),
    linear-gradient(0deg, transparent calc(50% - 0.125rem), var(--po-twine) calc(50% - 0.125rem) calc(50% + 0.125rem), transparent calc(50% + 0.125rem)),
    var(--po-kraft);
  border: 0.0625rem solid color-mix(in srgb, var(--po-kraft) 60%, black);
  border-radius: 0.1875rem;
  box-shadow: inset 0 -0.25rem 0 color-mix(in srgb, black 10%, transparent);
  transition: scale 600ms cubic-bezier(0.34, 1.4, 0.64, 1);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

// The brass column joining pan to housing.
export const Stem = styled.div`
  inline-size: 0.75rem;
  block-size: 0.75rem;
  background: linear-gradient(90deg, var(--po-brass-dark), var(--po-brass-light), var(--po-brass-dark));
`;

/*
  The dial housing: a brass bezel around a cream face printed with ticks. The needle swings from
  empty (−120°) towards the original weight's mark; overweight readings simply peg past it.
*/
export const Dial = styled.div`
  position: relative;
  inline-size: 11rem;
  aspect-ratio: 1;
  border-radius: 50%;
  background:
    radial-gradient(circle, var(--po-brass-dark) 0 0.375rem, transparent 0.4rem),
    repeating-conic-gradient(from -120deg, var(--color-fg-muted) 0 0.6deg, transparent 0.6deg 10deg) center / 82% 82% no-repeat,
    radial-gradient(circle, var(--po-paper) 0 58%, transparent 58.5%),
    radial-gradient(circle, color-mix(in srgb, var(--po-paper) 92%, var(--po-kraft)) 0 70%, transparent 70.5%);
  border: 0.5rem solid var(--po-brass);
  box-shadow:
    inset 0 0 0 0.0625rem var(--po-brass-dark),
    0 0 0 0.0625rem var(--po-brass-dark),
    0 0.25rem 0.5rem color-mix(in srgb, black 25%, transparent);
`;

// The red mark on the dial where the original parcel weighed in.
export const OriginalMark = styled.span`
  position: absolute;
  inset-block-start: 50%;
  inset-inline-start: 50%;
  inline-size: 0.25rem;
  block-size: 45%;
  translate: -50% -100%;
  transform-origin: 50% 100%;
  rotate: var(--mark-angle);
  background: linear-gradient(var(--po-airmail-red) 0 22%, transparent 22%);
`;

// The needle — pivots on the dial's centre and eases to each new reading.
export const Needle = styled.span`
  position: absolute;
  inset-block-start: 50%;
  inset-inline-start: 50%;
  inline-size: 0.1875rem;
  block-size: 42%;
  translate: -50% -100%;
  transform-origin: 50% 100%;
  rotate: var(--needle-angle);
  background: linear-gradient(var(--color-fg-default), var(--po-brass-dark));
  border-radius: 0.125rem 0.125rem 0 0;
  transition: rotate 700ms cubic-bezier(0.34, 1.56, 0.64, 1);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

// The unit printed on the dial face, under the pivot.
export const DialUnit = styled.span`
  position: absolute;
  inset-block-end: 22%;
  inset-inline: 0;
  text-align: center;
  font-family: ${MONO_FONT};
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--color-fg-muted);
`;

/*
  The printed weighing slip — a two-column definition list on a strip of till roll, so each figure
  is announced with its label.
*/
export const Readouts = styled.dl`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.375rem 1rem;
  margin: 0;
  padding: 0.75rem 0.875rem;
  background: color-mix(in srgb, var(--po-paper) 90%, var(--po-kraft));
  border: 0.0625rem dashed var(--color-border-default);
  border-radius: 0.125rem;

  & > dt {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-fg-muted);
  }

  & > dd {
    margin: 0;
    font-family: ${MONO_FONT};
    font-size: 0.875rem;
    font-variant-numeric: tabular-nums;
    text-align: end;
    color: var(--color-fg-default);
  }
`;

// The headline saving, inked large like a rubber stamp on the slip.
export const SavingStamp = styled.dd`
  && {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--po-ink);
  }
`;
