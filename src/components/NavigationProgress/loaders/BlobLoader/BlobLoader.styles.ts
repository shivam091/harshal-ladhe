import { styled } from "@linaria/react";

export const BlobSvg = styled.svg`
  position: relative;
  z-index: 1;
  inline-size: 72px;
  block-size: 72px;
  filter: drop-shadow(0 0 6px hsl(from var(--color-fg-accent) h s l / 0.4));
`;

/*
  Slow independent spin for the whole shape. `transform-box: fill-box` is safe here (unlike
  the dots loader's orbit pivot) because the blob path is drawn roughly centred on itself, so
  its own bounding-box centre already sits close to the visual centre.
*/
export const BlobGroup = styled.g`
  transform-box: fill-box;
  transform-origin: center;
  animation: spin 7s linear infinite;
  will-change: transform;

  &[data-state="done"] {
    animation-play-state: paused;
  }
`;

/* 
  The pop lives on the path itself (a separate element from the rotating group above) so it
  doesn't have to fight the group's own `transform`-driven spin for the same CSS property.
*/
export const BlobPath = styled.path`
  transform-box: fill-box;
  transform-origin: center;
  transition: transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1);

  &[data-state="done"] {
    transform: scale(1.12);
  }
`;
