// Props for the shared Aside base — each variant (info/success/warning/quote) fills these in.
export interface AsideBaseProps {
  // Variant-specific styled wrapper (e.g. InfoWrapper) that sets --aside-accent / --aside-bg.
  wrapper: React.ElementType;
  // Icon rendered on the aside's top-left corner; variants without one show no icon.
  icon?: React.ReactNode;
  // Which decorative SVG caps the accent line: "circular" or "triangular" (warning).
  leftEdgeVariant: "circular" | "triangular";
  // Optional bold title line; also becomes the deep-link anchor via useTitleId.
  title?: React.ReactNode;
  // Aside body; an <expanded> child is hidden behind a "Show more" toggle.
  children: React.ReactNode;
}

/*
  Props for the public variant components (AsideInfo/AsideSuccess/AsideWarning/AsideQuote) —
  the authoring surface exposed to MDX. Each variant supplies its own wrapper, icon, and
  edge shape from AsideBaseProps, leaving only the content fields for the caller.
*/
export interface AsideVariantProps {
  // Optional bold title line; also becomes the aside's deep-link anchor.
  title?: React.ReactNode;
  // Aside body content.
  children: React.ReactNode;
}
