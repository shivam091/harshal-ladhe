import { styled } from "@linaria/react";
import { BREAKPOINTS } from "@/constants/breakpoints";

/*
  Same 8 hues as RainbowDivider's SEGMENT_COLORS, in the same left-to-right order — but
  re-tuned to a lower, per-hue saturation/lightness rather than reused verbatim. At
  RainbowDivider's own hsl(_ 100% 65-70%) values, yellow/green sit almost exactly on top of
  this banner's warm-gold background in perceived luminance (contrast ~1.0-1.4 against
  colorBgFestiveBanner in every theme) and would effectively vanish as text; yellow/green are
  pulled darkest here to compensate, everything else moderately darkened, keeping ≥3.4:1
  contrast against colorBgFestiveBanner in all three themes.
*/
const FESTIVE_BANNER_TEXT_GRADIENT = `linear-gradient(
  90deg,
  hsl(350deg 80% 38%),
  hsl(25deg 80% 34%),
  hsl(50deg 90% 18%),
  hsl(150deg 75% 20%),
  hsl(210deg 80% 38%),
  hsl(240deg 75% 40%),
  hsl(260deg 70% 40%),
  hsl(300deg 75% 38%)
)`;

/*
  Full-bleed strip, positioned so CloseButton and Zigzag below can pin to its edges regardless
  of text length. background/color alias the colorBgFestiveBanner/colorFgFestiveBanner design
  tokens (see src/constants/themes/*.ts) — a deliberately celebratory warm-gold + dark-navy look
  distinct from the site's muted "attention" tokens, with its own light/dark/soft-dark variants.
  Zigzag's SVG fill/stroke in FestiveBanner.tsx reads --color-bg-festive-banner and
  --color-stroke-festive-banner directly — the latter is a separate, more saturated navy token
  than colorFgFestiveBanner (which stays near-black for text contrast) so the scalloped outline
  reads as a colour rather than as a black stroke.

  The bottom padding reserves room for Zigzag so it sits flush against Row's content instead of
  overlapping it — and, unlike the reference's overlap-via-translateY approach, keeps the whole
  strip within normal flow so it isn't clipped by the mount/unmount height animation.
  background-clip: content-box keeps that reserved padding transparent, so only the SVG's wave
  shapes (not a solid rectangle) paint the banner color there — the gaps between crests show the
  actual page background behind, which is the scalloped-edge effect this is meant to recreate.
*/
export const Wrapper = styled.div`
  position: relative;
  background: var(--color-bg-festive-banner);
  background-clip: content-box;
  color: var(--color-fg-festive-banner);
  padding-block-end: 15px;
`;

// Decorative scalloped strip along the banner's bottom edge, filled via a repeating SVG pattern (see FestiveBanner.tsx).
export const Zigzag = styled.div`
  position: absolute;
  inset-block-end: 0;
  inset-inline: 0;
  block-size: 15px;
`;

/*
  Constrains content to the same max-width the page's own Container uses, so the wish text lines
  up with the header/logo below. position: relative makes this (not the taller Wrapper, which
  also reserves space for Zigzag) the positioning root for CloseButton, so it centers on the text
  row itself rather than on Row + the zigzag strip combined.
*/
export const Row = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  inline-size: 100%;
  max-inline-size: clamp(37.5rem, 90%, 75rem);
  margin-inline: auto;
  padding-inline: 2.75rem;
  padding-block-start: 0.5rem;
  font-size: 0.9375rem;
`;

// The wish text itself — centered, wraps on narrow screens instead of truncating.
export const Message = styled.p`
  margin: 0;
  text-align: center;
  font-weight: 600;
  letter-spacing: 0.02em;

  a {
    color: inherit;
    text-decoration: underline;
    text-underline-offset: 2px;
  }
`;

/*
  Wraps just the wish copy (not the emoji or the "Learn more" link) so it renders in the rainbow
  gradient above instead of colorFgFestiveBanner's flat near-black — background-clip: text needs
  its own background on this element, so it can't be applied to Message as a whole without also
  swallowing the emoji/link into the clip.

  Both `color` and `-webkit-text-fill-color` are set to transparent: browsers that honour the
  unprefixed `background-clip: text` read `color`, Safari/older Chromium read the `-webkit-`
  property — without both, the clip silently no-ops and the inherited opaque colorFgFestiveBanner
  paints over the gradient instead.

  text-shadow overrides Sparkles' wrapper, which applies its own inherited halo in colorBgDefault
  (the page's own background, not this banner's) meant for opaque text on the default background —
  left as-is it sits behind the gradient-clipped glyphs and washes them out. A small dark, mostly
  unblurred shadow here instead adds definition without that mismatch — it isn't part of the clip,
  so it stays visible (and on-brand for every theme) regardless of the gradient stop it sits behind.
*/
export const WishText = styled.span`
  background: ${FESTIVE_BANNER_TEXT_GRADIENT};
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.25);
`;

/*
  Pinned to the strip's right edge with a generous hit area, independent of the message's length.
  Native <button> chrome (border/background/font) is reset explicitly, same convention as
  SearchBox's ClearButton, since nothing in this codebase resets it globally.
*/
export const CloseButton = styled.button`
  position: absolute;
  inset-block: 0;
  inset-inline-end: 0.5rem;
  display: grid;
  place-content: center;
  padding-inline: 0.5rem;
  padding-block-start: .5rem;
  margin: 0;
  background: none;
  border: none;
  font: inherit;
  color: inherit;
  cursor: pointer;
`;
