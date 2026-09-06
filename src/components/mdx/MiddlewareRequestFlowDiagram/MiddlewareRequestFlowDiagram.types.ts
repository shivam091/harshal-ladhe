// Which of the three Next.js middleware response types an outcome branch represents — drives its color.
export type MiddlewareOutcomeKind = "next" | "redirect" | "rewrite";

// One outcome branch: the NextResponse call that produces it, and what happens to the request after.
export interface MiddlewareOutcome {
  kind: MiddlewareOutcomeKind;
  // The NextResponse call, e.g. "NextResponse.next()".
  method: string;
  // What happens to the request/response once this call runs.
  result: string;
}

// Fill/stroke pair for one outcome branch's boxes and connecting line.
export interface MiddlewareOutcomeColor {
  fill: string;
  stroke: string;
}
