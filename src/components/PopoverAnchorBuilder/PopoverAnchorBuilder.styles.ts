import { styled } from "@linaria/react";

/*
  "Docking Bay" shell — a radar-tower control room, unique to this tool among the goodie family
  (Console, Annotation Desk, Elevation Stack, Live Canvas, Editorial Stage, Optics Bench, Clay
  Studio, Blueprint Grid, Swatch Fan). A slow conic-gradient sweep rotates behind concentric ring
  gradients like a radar scope tracking the anchored element — a direct visual echo of what
  anchor-positioning actually does (something floating, tracked from a fixed point) rather than a
  generic backdrop. The sweep is capped at a low opacity so it reads as ambient texture, never
  competes with the controls sitting on top of it, and is switched off entirely under
  prefers-reduced-motion.
*/
export const DockingBay = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-block: clamp(0.75rem, 1vw, 1rem);
  padding: clamp(1rem, 3vw, 1.75rem);
  background: var(--color-bg-muted);
  border: 0.0625rem solid color-mix(in srgb, var(--color-fg-accent-muted) 35%, var(--color-border-muted));
  border-radius: 1rem;
  overflow: hidden;
  isolation: isolate;

  &::before {
    content: "";
    position: absolute;
    inset-block-start: 50%;
    inset-inline-end: -8rem;
    inline-size: 24rem;
    block-size: 24rem;
    translate: 0 -50%;
    background: repeating-radial-gradient(
      circle,
      color-mix(in srgb, var(--color-fg-accent-muted) 14%, transparent) 0,
      color-mix(in srgb, var(--color-fg-accent-muted) 14%, transparent) 0.0625rem,
      transparent 0.0625rem,
      transparent 2.25rem
    );
    z-index: -2;
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    inset-block-start: 50%;
    inset-inline-end: -8rem;
    inline-size: 24rem;
    block-size: 24rem;
    translate: 0 -50%;
    background: conic-gradient(
      from 0deg,
      color-mix(in srgb, var(--color-fg-accent-muted) 22%, transparent),
      transparent 25%
    );
    border-radius: 50%;
    animation: docking-bay-sweep 9s linear infinite;
    z-index: -1;
    pointer-events: none;
  }

  @media (prefers-reduced-motion: reduce) {
    &::after {
      animation: none;
    }
  }

  @keyframes docking-bay-sweep {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const ToolbarRow = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem;
  background: color-mix(in srgb, var(--color-bg-default) 70%, transparent);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.625rem;
  inline-size: fit-content;
  backdrop-filter: blur(0.5rem);
`;

export const ToolbarButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  inline-size: 2rem;
  block-size: 2rem;
  padding: 0;
  border: 0.0625rem solid transparent;
  border-radius: 50%;
  background: transparent;
  color: var(--color-fg-muted);
  cursor: pointer;
  transition: color 150ms ease, background 150ms ease, border-color 150ms ease, transform 150ms ease;

  &:hover:not(:disabled) {
    color: var(--color-fg-accent-muted);
    background: color-mix(in srgb, var(--color-fg-accent-muted) 14%, transparent);
    border-color: color-mix(in srgb, var(--color-fg-accent-muted) 35%, transparent);
    transform: translateY(-0.0625rem);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const GeneratorGrid = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;

  @media (min-width: 60rem) {
    grid-template-columns: 20rem minmax(0, 1fr);
    align-items: start;
  }
`;

export const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-inline-size: 0;
`;

export const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-inline-size: 0;
`;

// Card with a small radar-blip corner glow instead of a flat border — the docking bay's own version of "a panel mounted on the console wall".
export const SectionCard = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.875rem;
  background: color-mix(in srgb, var(--color-bg-default) 55%, transparent);
  border: 0.0625rem solid var(--color-border-muted);
  border-inline-start: 0.1875rem solid color-mix(in srgb, var(--color-fg-accent-muted) 55%, transparent);
  border-radius: 0.5rem;
`;

export const PanelTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-fg-accent-muted);

  &::before {
    content: "";
    inline-size: 0.375rem;
    block-size: 0.375rem;
    border-radius: 50%;
    background: currentColor;
    box-shadow: 0 0 0.5rem 0.0625rem currentColor;
  }
`;

// Small explanatory line under a toggle whose effect isn't self-evident from its label alone (e.g. what a fallback or a backdrop actually does).
export const FieldCaption = styled.p`
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.4;
  color: var(--color-fg-muted);
`;
