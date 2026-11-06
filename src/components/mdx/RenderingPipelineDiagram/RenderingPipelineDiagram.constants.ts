import type { PipelineRow } from "@/components/mdx/RenderingPipelineDiagram/RenderingPipelineDiagram.types";

// The four stages in pipeline order, matching the post's Style → Layout → Paint → Composite recap.
export const PIPELINE_STAGES = ["Style", "Layout", "Paint", "Composite"] as const;

// Keeps the first stage clear of the canvas edge.
export const STAGE_LEFT = 24;
// Wide enough for the longest stage name, "Composite".
export const STAGE_W = 78;
// Leaves room for an arrow so the stages read as a sequence.
export const STAGE_GAP = 20;
// Tall enough to hold one line of label text.
export const STAGE_H = 34;

// The post's "Avoid / Prefer" pair: the same entrance written two ways, with very different per-frame cost.
export const PIPELINE_ROWS: PipelineRow[] = [
  {
    label: "height: 0 → 320px",
    stages: [true, true, true, true],
    tone: "attention",
    caption: "Every frame re-runs Layout and Paint for the whole transition.",
  },
  {
    label: "transform: scaleY(0) → scaleY(1)",
    stages: [true, false, false, true],
    tone: "success",
    caption: "Layout and Paint are skipped — the GPU just moves the existing layer.",
  },
];

// Vertical position of each row's stage boxes.
export const ROW_Y = [64, 170];
