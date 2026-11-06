// One transitioned property group and which of the four pipeline stages it re-runs on every frame.
export interface PipelineRow {
  // The property change being transitioned, e.g. "height: 0 → 320px".
  label: string;
  // Parallel to PIPELINE_STAGES: true where this change forces that stage each frame.
  stages: [boolean, boolean, boolean, boolean];
  // Colour token for the stages it hits — attention for costly, success for cheap.
  tone: "attention" | "success";
  // One-line verdict printed under the row.
  caption: string;
}
