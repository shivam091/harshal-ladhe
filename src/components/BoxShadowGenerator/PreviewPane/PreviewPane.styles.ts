import { styled } from "@linaria/react";

/*
  The stage itself — a small "room" the swatch sits inside rather than a bare backdrop. The
  background is a two-tone gradient standing in for a wall meeting a floor (like the corner of a
  photo studio's seamless backdrop), so the swatch always has an implied horizon to rest on even
  before any of the user's own shadow layers are visible. Its own background-color is set inline
  per-render to state.pageColor since neumorphism specifically depends on this being near-identical
  to the swatch's own surfaceColor.
*/
export const PreviewStage = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  inline-size: 100%;
  aspect-ratio: 16 / 9;
  max-inline-size: 40rem;
  margin-inline: auto;
  overflow: hidden;
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.75rem;
`;

/*
  A soft, blurred ellipse sitting under where the swatch floats — the tool's own baseline "ambient
  contact shadow," entirely independent of the user's configured layers. It's what keeps an
  all-white swatch on an all-white page from reading as if it's floating in a void, and it stays
  fixed while the user's own compiled shadow (rendered on the swatch itself, see Swatch below)
  changes shape and color on top of it — the split makes it obvious which part of what's on screen
  is "the surface resting on the table" and which part is "the effect you configured."
*/
export const GroundShadow = styled.div`
  position: absolute;
  inset-inline: 18%;
  inset-block-end: 12%;
  block-size: 22%;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, color-mix(in srgb, var(--color-fg-default) 22%, transparent), transparent 72%);
  filter: blur(0.875rem);
  pointer-events: none;
`;

// The shadowed element itself — sized as a fraction of the stage rather than filling it, so an inset shadow's own edges and a raised shadow's cast area both have room to actually show against the "room" behind it.
export const Swatch = styled.div`
  position: relative;
  inline-size: 42%;
  aspect-ratio: 1 / 1;
`;
