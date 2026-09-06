// Which format branch an outcome represents — drives its color.
export type ImageFormatKind = "avif" | "webp" | "original";

// One outcome branch: the Accept-header condition that produces it, and what gets served as a result.
export interface ImageFormatOutcome {
  kind: ImageFormatKind;
  label: string;
  // The request condition shown in the branch's "method" box, e.g. "Accept: image/avif".
  condition: string;
  // What happens as a result, shown in the branch's "result" box.
  result: string;
}

// Fill/stroke pair for one outcome branch's boxes and connecting line.
export interface ImageFormatColor {
  fill: string;
  stroke: string;
}
