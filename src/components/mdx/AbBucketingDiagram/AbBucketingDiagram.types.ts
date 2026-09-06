// Which A/B bucket a scenario resolves to — drives the outcome box's color.
export type AbBucket = "a" | "b";

// One scenario: a visitor's cookie state going in, what middleware does about it, and where they land.
export interface AbVisitScenario {
  // Short heading naming the scenario.
  title: string;
  // The incoming request's cookie state, as a visitor would describe it.
  requestLabel: string;
  // What middleware does with that cookie state — assign a new one, or read the existing one.
  middlewareAction: string;
  // Which bucket this visitor ends up in.
  bucket: AbBucket;
  // The rewrite target this bucket maps to.
  rewriteTarget: string;
  // Whether middleware issues a new Set-Cookie header in this scenario.
  setsCookie: boolean;
}

// Fill/stroke pair for one bucket's outcome box.
export interface AbBucketColor {
  fill: string;
  stroke: string;
}
