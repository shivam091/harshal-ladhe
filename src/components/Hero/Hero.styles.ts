import { styled } from "@linaria/react";
import { BREAKPOINTS } from "@/constants/breakpoints";
import { gradientTextCss } from "@/components/HeroRoleTyped/HeroRoleTyped.styles";

/*
  Minimum height anchors the hero above the fold. A div, not a section, since it has no distinct
  content boundary or accessible name; no inline padding because the page's main wrapper supplies it.
*/
export const HeroSection = styled.div`
  min-block-size: 20rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

// Caps line length so the hero copy stays readable on wide screens.
export const HeroWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0.5rem;
  inline-size: 100%;
  max-inline-size: 56rem;
`;

// Animated gradient makes the heading the page's focal point.
export const HeroHeading = styled.h1`
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.25;
  background: linear-gradient(
    90deg,
    var(--color-fg-attention),
    var(--color-fg-success),
    var(--color-fg-danger),
    var(--color-fg-accent),
    var(--color-fg-attention)
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  animation: hero-bg-slide 3s cubic-bezier(0, 0, 1, 1) infinite;

  // Travels the full oversized background so the gradient loops without a visible jump.
  @keyframes hero-bg-slide {
    to {
      background-position: -200% center;
    }
  }
`;

// Capitalised in CSS so greetings can stay lowercase in the source copy.
export const GreetingLine = styled.span`
  display: block;
  margin-block-end: 0.75rem;
  text-transform: lowercase;
  color: var(--color-fg-muted);

  &::first-letter {
    text-transform: uppercase;
  }
`;

// Block so the name gets its own line while staying part of the same h1.
export const NameLine = styled.span`
  display: block;
  font-weight: 500;
`;

// Muted and smaller than the heading so it reads as supporting copy.
export const Tagline = styled.p`
  font-size: 1.125rem;
  line-height: 1.625;
  font-weight: 400;
  color: var(--color-fg-muted);

  @media ${BREAKPOINTS.desktop} {
    font-size: 1.25rem;
  }
`;

// Medium weight so the role line stands apart from the muted tagline.
export const RoleLine = styled.p`
  font-size: 1.125rem;
  line-height: calc(1.75 / 1.125);
  font-weight: 500;
`;

// inline-block so it shrinks to text width — gradient expands with the phrase as the typed span grows.
export const HeroRoleSpan = styled.span`
  display: inline-block;
  ${gradientTextCss}
`;
