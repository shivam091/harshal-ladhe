// Pixel widths for each named breakpoint, used to derive the BREAKPOINTS media-query strings below.
export const BREAKPOINT_SIZES = {
  xs: 320,
  sm: 563,
  md: 768,
  lg: 1200,
  xl: 1570,
  /*
    Legacy sizes kept alongside the xs–xl scale above so pre-existing media queries
   (which don't align to it) can still be expressed through this constant.
  */
  smMobile: 480,
  tablet: 1024,
  wide: 1440,
  xwide: 1600,
  ultrawide: 1840
};

/*
  Media-query condition strings keyed by breakpoint name — interpolate directly into a
  styled-component `@media` block, e.g. `@media ${BREAKPOINTS.mobile} { ... }`.
*/
export const BREAKPOINTS = {
  xs: `(max-width: ${BREAKPOINT_SIZES.xs / 16}rem)`,
  sm: `(min-width: ${BREAKPOINT_SIZES.xs / 16}rem) and (max-width: ${
    BREAKPOINT_SIZES.sm / 16
  }rem)`,
  md: `(min-width: ${BREAKPOINT_SIZES.sm / 16}rem) and (max-width: ${
    BREAKPOINT_SIZES.md / 16
  }rem)`,
  lg: `(min-width: ${BREAKPOINT_SIZES.md / 16}rem) and (max-width: ${
    BREAKPOINT_SIZES.lg / 16
  }rem)`,
  xl: `(min-width: ${BREAKPOINT_SIZES.lg / 16}rem) and (max-width: ${
    BREAKPOINT_SIZES.xl / 16
  }rem)`,
  xsAndSmaller: `(max-width: ${BREAKPOINT_SIZES.xs / 16}rem)`,
  smAndSmaller: `(max-width: ${BREAKPOINT_SIZES.sm / 16}rem)`,
  mdAndSmaller: `(max-width: ${BREAKPOINT_SIZES.md / 16}rem)`,
  lgAndSmaller: `(max-width: ${BREAKPOINT_SIZES.lg / 16}rem)`,
  xlAndSmaller: `(max-width: ${BREAKPOINT_SIZES.xl / 16}rem)`,
  xsAndLarger: `(min-width: ${(BREAKPOINT_SIZES.xs + 0.25) / 16}rem)`,
  smAndLarger: `(min-width: ${(BREAKPOINT_SIZES.sm + 0.25) / 16}rem)`,
  mdAndLarger: `(min-width: ${(BREAKPOINT_SIZES.md + 0.25) / 16}rem)`,
  lgAndLarger: `(min-width: ${(BREAKPOINT_SIZES.lg + 0.25) / 16}rem)`,
  xlAndLarger: `(min-width: ${(BREAKPOINT_SIZES.xl + 0.25) / 16}rem)`,
  mobile: `(max-width: ${BREAKPOINT_SIZES.md / 16}rem)`,
  desktop: `(min-width: ${(BREAKPOINT_SIZES.md + 0.25) / 16}rem)`,
  /*
    Legacy thresholds/ranges matching media queries already in use before this constant
    existed — kept as exact pixel matches so introducing this file changes no rendered output.
  */
  smMobileAndSmaller: `(max-width: ${BREAKPOINT_SIZES.smMobile / 16}rem)`,
  tabletAndSmaller: `(max-width: ${BREAKPOINT_SIZES.tablet / 16}rem)`,
  smMobileToMd: `(min-width: ${BREAKPOINT_SIZES.smMobile / 16}rem) and (max-width: ${
    BREAKPOINT_SIZES.md / 16
  }rem)`,
  wideAndLarger: `(min-width: ${BREAKPOINT_SIZES.wide / 16}rem)`,
  xwideAndLarger: `(min-width: ${BREAKPOINT_SIZES.xwide / 16}rem)`,
  ultrawideAndLarger: `(min-width: ${BREAKPOINT_SIZES.ultrawide / 16}rem)`
};
