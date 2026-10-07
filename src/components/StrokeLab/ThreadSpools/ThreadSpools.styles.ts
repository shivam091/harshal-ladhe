import { styled } from "@linaria/react";
import { MONO_FONT } from "@/components/StrokeLab/StrokeLab.styles";

// Three spools side by side, wrapping to a column on the narrowest phones.
export const SpoolRack = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(6.5rem, 1fr));
  gap: 0.5rem;
`;

/*
  One spool on the rack — a radio card whose picture is a reel of thread with its loose end cut
  in that linecap. The chosen spool is lifted and ringed in thread colour.
*/
export const Spool = styled.label`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.375rem;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--haber-card-edge);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: border-color 150ms ease, transform 150ms ease, box-shadow 150ms ease;

  &:hover {
    border-color: var(--haber-thread-soft);
  }

  &:has(input:checked) {
    border-color: var(--haber-thread);
    box-shadow: 0 0 0 0.125rem var(--haber-thread-soft);
    transform: translateY(-0.125rem);
  }

  &:has(input:focus-visible) {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.125rem;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:has(input:checked) {
      transform: none;
    }
  }
`;

// The spool drawing.
export const SpoolSvg = styled.svg`
  display: block;
  inline-size: 100%;
  max-inline-size: 8rem;
  block-size: auto;
`;

// The keyword, printed on the spool's end label.
export const SpoolName = styled.span`
  font-family: ${MONO_FONT};
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-fg-default);
`;
