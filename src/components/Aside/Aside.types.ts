// Visual config lives here so variants, not MDX authors, decide an aside's look.
export interface AsideBaseProps {
  // A styled wrapper rather than a colour prop so each variant owns its accent tokens.
  wrapper: React.ElementType;
  // Optional because not every variant has an icon.
  icon?: React.ReactNode;
  // Edge shape echoes the icon, so the warning's triangle gets an angular cap.
  leftEdgeVariant: "circular" | "triangular";
  // Doubles as the deep-link anchor so an aside can be linked to like a heading.
  title?: React.ReactNode;
  // An <expanded> child lets long asides stay compact until the reader asks for more.
  children: React.ReactNode;
}

// Content fields only, so MDX authors can't override a variant's styling.
export interface AsideVariantProps {
  // Doubles as the deep-link anchor so an aside can be linked to like a heading.
  title?: React.ReactNode;
  // Aside body content.
  children: React.ReactNode;
}
