import { styled } from "@linaria/react";

// Side by side once there's room for two meaningful parcels, stacked below that.
export const ParcelGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;

  @media (min-width: 36rem) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

/*
  A parcel: kraft paper tied with twine, opened at the top so the artwork shows through a
  checkerboard window (transparent areas read as transparent, not as the paper colour).
*/
export const Parcel = styled.figure`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0;
  padding: 0.75rem;
  min-inline-size: 0;
  background:
    linear-gradient(90deg, transparent calc(50% - 0.125rem), var(--po-twine) calc(50% - 0.125rem) calc(50% + 0.125rem), transparent calc(50% + 0.125rem)) bottom / 100% 2.75rem no-repeat,
    var(--po-kraft);
  border: 0.0625rem solid color-mix(in srgb, var(--po-kraft) 60%, black);
  border-radius: 0.25rem;
`;

// The checkerboard window the artwork sits in.
export const Window = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  block-size: 13rem;
  padding: 0.75rem;
  background: conic-gradient(var(--color-bg-muted) 25%, var(--color-bg-default) 0 50%, var(--color-bg-muted) 0 75%, var(--color-bg-default) 0) 0 0 / 1rem 1rem;
  border: 0.0625rem solid color-mix(in srgb, var(--po-kraft) 50%, black);
  border-radius: 0.125rem;

  & > img {
    max-inline-size: 100%;
    max-block-size: 100%;
    inline-size: 100%;
    block-size: 100%;
    object-fit: contain;
  }
`;

// The address label across the twine — which parcel this is and what it weighs.
export const AddressLabel = styled.figcaption`
  position: relative;
  z-index: 1;
  align-self: center;
  padding: 0.25rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-fg-default);
  background: var(--po-paper);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.125rem;
  box-shadow: 0 0.0625rem 0.125rem color-mix(in srgb, black 15%, transparent);
`;

// The row of stamps stuck along the optimised parcel's top edge — purely decorative.
export const StampRow = styled.div`
  position: absolute;
  inset-block-start: -0.5rem;
  inset-inline-end: 0.5rem;
  display: flex;
  flex-wrap: wrap-reverse;
  justify-content: flex-end;
  gap: 0.25rem;
  max-inline-size: 75%;
`;

// A miniature stamp — a perforated edge from a dotted outline, its denomination in airmail colours.
export const MiniStamp = styled.span`
  padding: 0.125rem 0.25rem;
  font-size: 0.5625rem;
  font-weight: 700;
  color: var(--po-airmail-red);
  background: var(--po-paper);
  border: 0.0625rem solid var(--po-airmail-blue);
  outline: 0.125rem dotted var(--po-paper);
  outline-offset: 0.0625rem;
  rotate: var(--tilt, 0deg);
`;

// The sanitiser's warning — amber, with the word "Note" spelled out so colour isn't the only signal.
export const SanitiseNote = styled.p`
  margin: 0;
  padding: 0.5rem 0.625rem;
  font-size: 0.75rem;
  color: var(--color-fg-default);
  background: color-mix(in srgb, var(--color-fg-attention) 12%, var(--po-paper));
  border-inline-start: 0.25rem solid var(--color-fg-attention);
`;
