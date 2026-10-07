import { styled } from "@linaria/react";

// Holds the alembic drawing and, when a keyframe won't parse, the note pinned over it.
export const AlembicFrame = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-inline-size: 0;
`;

/*
  The alembic and its stand. Glass is a faint accent tint with a brighter rim; the brew in the
  bulb takes the blended elixir colour; the flame flickers and bubbles rise only while playing,
  and both stay still under prefers-reduced-motion.
*/
export const AlembicSvg = styled.svg`
  display: block;
  inline-size: 100%;
  max-inline-size: 22rem;
  block-size: auto;
  overflow: visible;

  & .stand path {
    fill: none;
    stroke: var(--bench-brass-deep);
    stroke-width: 6;
    stroke-linecap: round;
  }

  & .flame-outer {
    fill: color-mix(in oklab, var(--color-fg-attention) 80%, var(--color-fg-danger));
    opacity: 0.85;
  }

  & .flame-inner {
    fill: color-mix(in oklab, var(--color-fg-attention) 50%, white);
  }

  & .flame {
    transform-box: fill-box;
    transform-origin: 50% 100%;
  }

  & .bulb,
  & .neck,
  & .beak {
    fill: var(--bench-glass);
    stroke: var(--bench-glass-edge);
    stroke-width: 3;
    stroke-linejoin: round;
  }

  & .brew {
    fill-opacity: 0.18;
    transition: fill 200ms linear;
  }

  & .bubble {
    fill: none;
    stroke: color-mix(in oklab, var(--bench-glass-edge) 70%, transparent);
    stroke-width: 1.5;
    opacity: 0;
    transform-box: fill-box;
  }

  & .ghost {
    fill: none;
    stroke: color-mix(in oklab, var(--bench-ink) 70%, transparent);
    stroke-linejoin: round;
  }

  & .ghost[data-ahead="true"] {
    stroke: color-mix(in oklab, var(--bench-brass) 80%, transparent);
    stroke-dasharray: 2 2;
  }

  & .travel {
    stroke-dasharray: 1.5 1.5;
    opacity: 0.6;
  }

  & .point {
    stroke: var(--bench-parchment);
    stroke-width: 0.5%;
  }

  [data-playing="true"] > & .flame {
    animation: alembic-flicker 900ms ease-in-out infinite alternate;
  }

  [data-playing="true"] > & .bubble {
    animation: alembic-bubble 2.4s ease-in infinite;
  }

  [data-playing="true"] > & .bubble-2 {
    animation-delay: 0.8s;
  }

  [data-playing="true"] > & .bubble-3 {
    animation-delay: 1.6s;
  }

  @media (prefers-reduced-motion: reduce) {
    [data-playing="true"] > & .flame,
    [data-playing="true"] > & .bubble {
      animation: none;
    }
  }

  @keyframes alembic-flicker {
    from {
      transform: scale(1, 1);
    }
    to {
      transform: scale(0.92, 1.08);
    }
  }

  @keyframes alembic-bubble {
    0% {
      opacity: 0;
      transform: translateY(0);
    }
    20% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateY(-2.5rem);
    }
  }
`;

// A scorched parchment note pinned over the empty alembic, explaining which keyframe spoilt the mixture.
export const SpoiltNote = styled.p`
  position: absolute;
  inset-block-start: 40%;
  inset-inline: 10%;
  margin: 0;
  padding: 0.625rem 0.75rem;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: var(--bench-ink);
  background: var(--bench-parchment);
  border: 0.0625rem solid color-mix(in oklab, var(--color-fg-danger) 50%, var(--bench-parchment-edge));
  border-radius: 0.25rem;
  box-shadow: 0 0.25rem 0.75rem -0.25rem color-mix(in oklab, black 40%, transparent);
  transform: rotate(-1deg);

  & strong {
    color: var(--color-fg-danger);
  }
`;
