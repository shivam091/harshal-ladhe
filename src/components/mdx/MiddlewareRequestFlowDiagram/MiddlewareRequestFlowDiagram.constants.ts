import type { MiddlewareOutcome } from "@/components/mdx/MiddlewareRequestFlowDiagram/MiddlewareRequestFlowDiagram.types";

// Overall canvas — three outcome columns fanning out from one shared middleware box.
export const CANVAS_W = 640;

// The incoming-request box, centered at the top of the canvas.
export const REQUEST_BOX_W = 220;
export const REQUEST_BOX_H = 38;
export const REQUEST_BOX_X = (CANVAS_W - REQUEST_BOX_W) / 2;
export const REQUEST_BOX_Y = 16;

// The single middleware box every request passes through before any branch is decided.
export const MIDDLEWARE_BOX_W = 300;
export const MIDDLEWARE_BOX_H = 48;
export const MIDDLEWARE_BOX_X = (CANVAS_W - MIDDLEWARE_BOX_W) / 2;
export const MIDDLEWARE_BOX_Y = REQUEST_BOX_Y + REQUEST_BOX_H + 34;

// y where the fan-out lines leave the middleware box, and the shared x center of each of the 3 columns.
export const BRANCH_START_Y = MIDDLEWARE_BOX_Y + MIDDLEWARE_BOX_H;
export const COLUMN_CENTERS = [98, 320, 542];

// Each column's method box (the NextResponse.* call) and, below it, its result box (what happens next).
export const METHOD_BOX_Y = BRANCH_START_Y + 46;
export const METHOD_BOX_W = 184;
export const METHOD_BOX_H = 40;

export const RESULT_BOX_Y = METHOD_BOX_Y + METHOD_BOX_H + 24;
export const RESULT_BOX_W = 184;
export const RESULT_BOX_H = 92;

export const CANVAS_H = RESULT_BOX_Y + RESULT_BOX_H + 16;

/*
  The three outcomes every middleware invocation resolves to — the single distinction the whole
  "Middleware Deep Dive" post keeps coming back to. Every request funnels through the exact same
  middleware.ts, and it's this one function's return value alone that decides which of these three
  paths a given request takes. Ordered left-to-right as "keep going" / "leave, then come back" /
  "stay, but serve something else" so the fan-out reads as three genuinely different strategies, not
  three flavors of the same thing.
*/
export const MIDDLEWARE_OUTCOMES: MiddlewareOutcome[] = [
  {
    kind: "next",
    method: "NextResponse.next()",
    result: "Continues to routing and rendering as normal — optionally with request/response headers or cookies modified along the way."
  },
  {
    kind: "redirect",
    method: "NextResponse.redirect(url)",
    result: "A real 3xx HTTP response. The browser's address bar changes and issues a brand-new request — a full round trip."
  },
  {
    kind: "rewrite",
    method: "NextResponse.rewrite(url)",
    result: "Different content is served internally, in the same response. The browser's address bar never changes."
  }
];
