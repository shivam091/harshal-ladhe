import { styled } from "@linaria/react";
import { BREAKPOINTS } from "@/constants/breakpoints";
import { gradientTextCss } from "@/components/HeroRoleTyped/HeroRoleTyped.styles";

// Outer flex wrapper — minimum height anchors the hero above the fold.
// Not a section: it carries no distinct content boundary and has no accessible name.
// No horizontal padding of its own — it now lives inside <Main>, which already supplies it.
export const HeroSection = styled.div`
  min-block-size: 20rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

// Flex column constraining hero content to a readable max-width.
export const HeroWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0.5rem;
  inline-size: 100%;
  max-inline-size: 56rem;
`;

// Animated rainbow gradient applied to the hero heading text via background-clip: text.
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

  // Slides the gradient leftward across the heading text, looping seamlessly since background-size is 200%.
  @keyframes hero-bg-slide {
    to {
      background-position: -200% center;
    }
  }
`;

// Lowercase greeting line; ::first-letter capitalises without touching markup.
export const GreetingLine = styled.span`
  display: block;
  margin-block-end: 0.75rem;
  text-transform: lowercase;
  color: var(--color-fg-muted);

  &::first-letter {
    text-transform: uppercase;
  }
`;

// Full name rendered as a block-level span within the animated heading.
export const NameLine = styled.span`
  display: block;
  font-weight: 500;
`;

// Sub-headline below the name — relaxed line-height, responsive font-size at the md breakpoint.
export const Tagline = styled.p`
  font-size: 1.125rem;
  line-height: 1.625;
  font-weight: 400;
  color: var(--color-fg-muted);

  @media ${BREAKPOINTS.desktop} {
    font-size: 1.25rem;
  }
`;

// Role-title line below the tagline — medium-weight, relaxed line-height.
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
