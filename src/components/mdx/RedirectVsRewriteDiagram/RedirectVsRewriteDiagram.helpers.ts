import type { RedirectRewritePanel } from "@/components/mdx/RedirectVsRewriteDiagram/RedirectVsRewriteDiagram.types";

// Fill/stroke pair for a browser mockup's address-bar strip or content area.
export interface BrowserPartColor {
  fill: string;
  stroke: string;
}

const CHANGED_COLOR: BrowserPartColor = { fill: "var(--color-bg-attention-muted)", stroke: "var(--color-border-attention-emphasis)" };
const UNCHANGED_COLOR: BrowserPartColor = { fill: "var(--color-bg-muted)", stroke: "var(--color-border-muted)" };

// The "after" address bar highlights only when this panel's response type actually changes the URL.
export function getAfterAddressBarColor(panel: RedirectRewritePanel): BrowserPartColor {
  return panel.addressBarChanged ? CHANGED_COLOR : UNCHANGED_COLOR;
}

// The "after" content area highlights only when the address bar did NOT change — i.e. a rewrite,
// where the content is the one thing that's actually different.
export function getAfterContentColor(panel: RedirectRewritePanel): BrowserPartColor {
  return panel.addressBarChanged ? UNCHANGED_COLOR : CHANGED_COLOR;
}
