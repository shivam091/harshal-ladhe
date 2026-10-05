import { styled } from "@linaria/react";

/*
  The crop box every platform puts its image in — aspect-ratio does the cropping and object-fit:
  cover the filling, exactly how the real cards treat an image that isn't already the right
  shape. The placeholder background stays visible behind a missing or failed image.
*/
export const ImageFrame = styled.div`
  position: relative;
  inline-size: 100%;
  aspect-ratio: 1.91 / 1;
  overflow: hidden;
  background: var(--surface-placeholder);

  &[data-aspect="square"] {
    aspect-ratio: 1 / 1;
  }

  & > img {
    display: block;
    inline-size: 100%;
    block-size: 100%;
    object-fit: cover;
  }
`;

// A crossed-out frame glyph in place of a missing image, so an empty slot reads as "no image" rather than a rendering glitch.
export const ImagePlaceholder = styled.span`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 0.6875rem;
  color: var(--surface-muted);
  text-align: center;
  padding: 0.5rem;
`;

/*
  Multi-line truncation via line-clamp — the same mechanism the platforms' own web clients use, so
  the cut lands where theirs would at this width. The line count arrives as --lines from each card
  rather than a set of near-identical styled variants.
*/
export const Clamp = styled.span`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: var(--lines, 2);
  line-clamp: var(--lines, 2);
  overflow: hidden;
  overflow-wrap: anywhere;
`;

// Single-line ellipsis for hostnames and site names, which never wrap on any platform.
export const OneLine = styled.span`
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

// The 16px favicon most unfurlers show beside the site name — a square placeholder when none is set.
export const Favicon = styled.span`
  display: inline-block;
  flex: 0 0 auto;
  inline-size: 1rem;
  block-size: 1rem;
  border-radius: 0.1875rem;
  overflow: hidden;
  background: var(--surface-placeholder);

  & > img {
    display: block;
    inline-size: 100%;
    block-size: 100%;
    object-fit: cover;
  }
`;
