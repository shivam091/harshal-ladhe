import type { CssUnit, UnitMeta } from "@/components/UnitConverter/UnitConverter.types";

// Fixed display order — absolute units first, then font-relative, then the box-relative ones, so the table reads from "always the same" to "depends on where it lands".
export const UNIT_ORDER: CssUnit[] = ["px", "rem", "em", "vw", "vh", "cqi", "%", "pt"];

/*
  The one place each unit's explanation lives. Notes focus on the gotcha a person converting by hand
  tends to miss (em compounding, cqi's container requirement, % meaning a different thing per
  property) rather than restating the definition the basis label already shows.
*/
export const UNIT_META: Record<CssUnit, UnitMeta> = {
  px: {
    unit: "px",
    name: "Pixel",
    resolvesAgainst: "Nothing — it is the reference unit",
    note: "A CSS px is an angle-based reference length, not a device pixel: it stays the same size on a 1×, 2× or 3× screen, which is why every other row here is expressed in it."
  },
  rem: {
    unit: "rem",
    name: "Root em",
    resolvesAgainst: "The <html> element's computed font-size",
    note: "Always the root, never the parent, so it never compounds. It follows the reader's browser font-size setting — the main reason to size type and spacing in rem rather than px."
  },
  em: {
    unit: "em",
    name: "Em",
    resolvesAgainst: "The element's own font-size (its parent's, when used on font-size)",
    note: "em compounds: 1.2em inside 1.2em inside 1.2em is 1.728× the outer size. On padding or margin it uses the element's own font-size, so the same 1em can mean two lengths in one rule."
  },
  vw: {
    unit: "vw",
    name: "Viewport width",
    resolvesAgainst: "1% of the initial containing block's width",
    note: "Includes the vertical scrollbar on desktop browsers, so 100vw is usually slightly wider than the page and causes a horizontal scroll. Font sizes in pure vw ignore the reader's zoom — pair them with rem in a clamp()."
  },
  vh: {
    unit: "vh",
    name: "Viewport height",
    resolvesAgainst: "1% of the initial containing block's height",
    note: "On mobile, vh uses the largest viewport (toolbar hidden), so 100vh overflows when the address bar is showing. svh, lvh and dvh name the small, large and dynamic heights explicitly."
  },
  cqi: {
    unit: "cqi",
    name: "Container inline",
    resolvesAgainst: "1% of the nearest query container's inline size",
    note: "Needs an ancestor with container-type: inline-size (or size). With none, it quietly falls back to the small viewport units — so a missing container-type looks like it works until the card moves."
  },
  "%": {
    unit: "%",
    name: "Percentage",
    resolvesAgainst: "The containing block's width (for width, padding and margin)",
    note: "Percent means something different per property: width and even vertical padding/margin use the containing block's width, height uses its height, and font-size uses the parent's font-size."
  },
  pt: {
    unit: "pt",
    name: "Point",
    resolvesAgainst: "Fixed: 1pt = 1/72in = 4/3px",
    note: "An absolute print unit. Useful for print stylesheets matching a design spec, but on screen it is just px multiplied by 4/3 and never scales with anything."
  }
};
