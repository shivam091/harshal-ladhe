import { styled } from "@linaria/react";

// A figure so the clock readout can be its caption.
export const TurntableFigure = styled.figure`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  margin: 0;
`;

// Capped width so the turntable stays a supporting graphic, not the panel's centrepiece.
export const TurntableSvg = styled.svg`
  inline-size: min(100%, 11rem);
  block-size: auto;
  overflow: visible;
`;

// The pit wall and the circular rail the bridge rides on.
export const Pit = styled.circle`
  fill: color-mix(in oklab, black 10%, var(--signal-enamel-deep));
  stroke: var(--signal-rail);
  stroke-width: 2;
`;

// One radiating road — lit in the colour of the loop stage it leads to when the bridge is lined up with it.
export const Road = styled.line`
  stroke: var(--signal-rail);
  stroke-width: 3;
  stroke-linecap: round;
  transition: stroke 200ms ease;

  &[data-lit="true"] {
    stroke: var(--road-colour);
  }
`;

// Each road's end-of-line signal lamp, glowing when the loop is in that stage.
export const RoadLamp = styled.circle`
  fill: var(--signal-lamp-off);
  transition: fill 200ms ease;

  &[data-lit="true"] {
    fill: var(--road-colour);
    filter: drop-shadow(0 0 0.25rem var(--road-colour));
  }
`;

// Stage name beyond each lamp, brightened when its road is active.
export const RoadLabel = styled.text`
  font-family: var(--signal-mono);
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  fill: var(--color-fg-muted);

  &[data-lit="true"] {
    fill: var(--color-fg-default);
  }
`;

/*
  The rotating bridge. Rotation is a CSS transition on an accumulated angle (always turning
  clockwise, as the loop itself does), and is dropped under prefers-reduced-motion so the bridge
  simply snaps to the new road.
*/
export const Bridge = styled.g`
  transform-box: view-box;
  transform-origin: 50% 50%;
  transition: transform 450ms cubic-bezier(0.65, 0, 0.35, 1);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

// The bridge's deck, spanning the pit.
export const BridgeDeck = styled.rect`
  fill: var(--signal-plate);
  stroke: var(--color-fg-attention);
  stroke-width: 1.5;
`;

// The pair of rails on the deck, in the same attention colour as the pointer.
export const BridgeRail = styled.line`
  stroke: var(--color-fg-attention);
  stroke-width: 1.5;
`;

// The driving end of the bridge — a bridge deck is symmetrical, so without this it would point at two roads at once.
export const BridgePointer = styled.polygon`
  fill: var(--color-fg-attention);
`;

// The virtual clock — what decides when timers fall due, so it's always on show.
export const ClockReadout = styled.figcaption`
  font-family: var(--signal-mono);
  font-size: 0.75rem;
  color: var(--color-fg-default);
`;
