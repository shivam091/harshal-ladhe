import type { AbVisitScenario } from "@/components/mdx/AbBucketingDiagram/AbBucketingDiagram.types";

// Overall canvas — two side-by-side scenario columns, each stacking 3 nodes vertically.
export const CANVAS_W = 520;
export const COLUMN_W = 240;
export const COLUMN_CENTERS = [CANVAS_W / 4 + 10, (CANVAS_W / 4) * 3 - 10];

export const TITLE_Y = 16;
export const NODE_W = 220;
export const NODE_H = 44;

export const REQUEST_Y = 28;
export const MIDDLEWARE_Y = REQUEST_Y + NODE_H + 30;
export const OUTCOME_Y = MIDDLEWARE_Y + NODE_H + 30;
export const OUTCOME_H = 62;
export const NOTE_Y = OUTCOME_Y + OUTCOME_H + 26;

export const CANVAS_H = NOTE_Y + 14;

/*
  The property that makes cookie-based A/B testing actually work: the bucket is decided exactly once,
  the first time a visitor arrives with no bucket cookie, and every visit after that just reads the
  same cookie back instead of re-rolling. Both scenarios below land the same visitor in bucket B on
  purpose — the point isn't which bucket they're in, it's that the SECOND visit does no new
  assignment at all, it just reads what the first visit already wrote down.
*/
export const AB_VISIT_SCENARIOS: AbVisitScenario[] = [
  {
    title: "First visit — no ab-bucket cookie yet",
    requestLabel: "Request has no ab-bucket cookie",
    middlewareAction: "Hash a new random id → assign a bucket",
    bucket: "b",
    rewriteTarget: "rewrite → /home-variant-b",
    setsCookie: true
  },
  {
    title: "Repeat visit — ab-bucket cookie present",
    requestLabel: "Request has ab-bucket=b cookie",
    middlewareAction: "Read the existing cookie value — no new assignment",
    bucket: "b",
    rewriteTarget: "rewrite → /home-variant-b",
    setsCookie: false
  }
];
