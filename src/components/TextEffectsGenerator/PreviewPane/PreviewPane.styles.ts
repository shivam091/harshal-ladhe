import { styled } from "@linaria/react";

/*
  The tool's flagship flourish: a dramatically lit "stage" the live text sits on, independent of the
  site's own light/dark/soft-dark theme — a real photo/type spotlight stays a dark stage regardless
  of the room it's shot in, so this is one deliberate exception to the "no raw hex/hsl for chrome"
  rule (mirroring how BoxShadowGenerator's own preset defaults hardcode literal shadow colors in
  box-shadow-presets.ts — here it's a UI surface's fixed backdrop rather than preset data, but the
  same reasoning: the value is intentionally NOT meant to track any theme token). The radial gradient
  brightens toward the upper-middle third (where a key light would fall) and fades to near-black at
  the edges, giving the text somewhere to visibly "stand" before any of the user's own shadow/fill
  styling is even applied.
*/
export const Stage = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-block-size: 20rem;
  padding: clamp(2.5rem, 8vw, 5rem) 1.5rem;
  overflow: hidden;
  border-radius: 0.25rem;
  background: radial-gradient(ellipse 75% 65% at 50% 38%, #3a3a3a 0%, #1c1c1c 45%, #050505 100%);
`;

/*
  A slow, low-amplitude brightening/dimming of the key light — reads as a spotlight very gently
  "breathing" rather than a static gradient, without ever competing with the text itself for
  attention. Disabled outright under reduced motion rather than just slowed, since it's pure ambient
  decoration with no functional role.
*/
export const SpotlightGlow = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 34%, rgba(255, 255, 255, 0.16), transparent 55%);
  animation: text-effects-spotlight-breathe 6s ease-in-out infinite;
  pointer-events: none;

  @keyframes text-effects-spotlight-breathe {
    0%,
    100% {
      opacity: 0.65;
    }
    50% {
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 0.85;
  }
`;

/*
  A few soft flecks of light drifting very slowly across the stage — standing in for dust motes
  caught in a spotlight beam. Kept extremely subtle (low opacity, screen blend so it only ever
  brightens, never muddies, the dark backdrop) and entirely static under reduced motion, since it is
  pure atmosphere with no informational role and the brief calls for this to stay tasteful rather
  than distracting from the text effect itself.
*/
export const DustMotes = styled.div`
  position: absolute;
  inset: -10%;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.5) 0.0625rem, transparent 0.125rem),
    radial-gradient(circle, rgba(255, 255, 255, 0.32) 0.0625rem, transparent 0.125rem),
    radial-gradient(circle, rgba(255, 255, 255, 0.22) 0.0625rem, transparent 0.125rem);
  background-size:
    14rem 14rem,
    19rem 19rem,
    9rem 9rem;
  background-position:
    12% 22%,
    72% 58%,
    42% 82%;
  background-repeat: repeat;
  opacity: 0.6;
  mix-blend-mode: screen;
  animation: text-effects-dust-drift 45s linear infinite;
  pointer-events: none;

  @keyframes text-effects-dust-drift {
    from {
      transform: translate3d(0, 0, 0);
    }
    to {
      transform: translate3d(-4%, -6%, 0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

// The live text itself — rendered large and centered, wrapping rather than overflowing at the widest font sizes/longest strings, since the whole point of this stage is seeing the effect at real display size rather than a scaled-down sample.
export const StageText = styled.p`
  position: relative;
  z-index: 1;
  margin: 0;
  max-inline-size: 100%;
  text-align: center;
  line-height: 1.15;
  overflow-wrap: break-word;
`;
