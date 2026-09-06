import type { RedirectRewritePanel } from "@/components/mdx/RedirectVsRewriteDiagram/RedirectVsRewriteDiagram.types";

// Overall canvas — two stacked panels, each showing a "before" and "after" browser mockup.
export const CANVAS_W = 560;
export const PANEL_H = 210;
export const TOP_PAD = 16;

// One browser mockup's dimensions: a window with an address-bar strip and a content area beneath it.
export const BROWSER_W = 190;
export const BROWSER_H = 108;
export const ADDRESS_BAR_H = 26;

// Local (pre-offset) positions shared by every panel.
export const TITLE_Y = 16;
export const BROWSER_TOP_Y = 32;
export const BEFORE_BROWSER_X = 14;
export const AFTER_BROWSER_X = CANVAS_W - BROWSER_W - 14;
export const ARROW_Y = BROWSER_TOP_Y + BROWSER_H / 2;
export const ARROW_LABEL_Y = ARROW_Y - 10;
export const NOTE_Y = BROWSER_TOP_Y + BROWSER_H + 34;

/*
  The single clearest contrast in the whole post: redirect() and rewrite() both send the visitor
  "somewhere else," but only one of them is visible in the address bar. Both panels share the exact
  same before/after browser-mockup layout, so the only thing that visually differs between them is
  which element — the address bar strip, or the content area beneath it — actually changes color
  between "before" and "after." That's deliberate: it's the one detail beginners consistently mix up.
*/
export const REDIRECT_REWRITE_PANELS: RedirectRewritePanel[] = [
  {
    title: "NextResponse.redirect() — the address bar changes",
    arrowLabel: "302 → brand-new GET request",
    beforeUrl: "/dashboard",
    afterUrl: "/login?from=%2Fdashboard",
    addressBarChanged: true,
    beforeContent: "requested page",
    afterContent: "login page",
    note: "A real HTTP round trip: the browser receives a redirect status and issues an entirely new request. The visitor sees the URL change."
  },
  {
    title: "NextResponse.rewrite() — the URL never moves",
    arrowLabel: "rewrite (internal, one response)",
    beforeUrl: "/home",
    afterUrl: "/home",
    addressBarChanged: false,
    beforeContent: "home-variant-a",
    afterContent: "home-variant-b",
    note: "No round trip, no status code the visitor ever sees — the server just serves different content at the same URL. The address bar never moves."
  }
];
