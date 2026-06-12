import { Alan_Sans, Source_Sans_3, Source_Code_Pro } from "next/font/google";

/*
  Self-hosted at build time so first paint waits on no third-party stylesheet. The @font-face
  rules keep the real family names, so the existing stacks, canvas fonts and SVG attributes
  resolve unchanged; the variables are exposed only for code that wants to reference them.
*/

// No metric overrides exist for Alan Sans, so Next can't build an adjusted fallback for it anyway.
const alanSans = Alan_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-alan-sans",
  adjustFontFallback: false
});

// Not preloaded: it only renders glyphs Alan Sans lacks, so most pages never request it.
const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-source-sans-3",
  preload: false
});

// Not preloaded: only pages with code use it, and a preload on every other page would be wasted.
const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-code-pro",
  preload: false
});

export const fontVariables = [alanSans.variable, sourceSans3.variable, sourceCodePro.variable].join(" ");
