// Which visual state a segment of the timeline represents — kept consistent across both lanes.
export type BlurUpSegmentState = "blank" | "preview" | "sharp";

// One segment of a lane's row: how long it lasts (as an end-of-segment millisecond offset) and what
// the user actually sees on screen during it.
export interface BlurUpSegment {
  endMs: number;
  state: BlurUpSegmentState;
  label: string;
}

// One lane: a caption describing the strategy, and its ordered segments (must cover 0 to TIME_MAX_MS).
export interface BlurUpLane {
  caption: string;
  segments: BlurUpSegment[];
}

// Fill/stroke pair for one segment state.
export interface BlurUpSegmentColor {
  fill: string;
  stroke: string;
  dashed: boolean;
}
