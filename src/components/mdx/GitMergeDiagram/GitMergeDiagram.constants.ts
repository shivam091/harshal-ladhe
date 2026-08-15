import type { GitMergeVariant, GitMergeVariantConfig } from "@/components/mdx/GitMergeDiagram/GitMergeDiagram.types";

// y coordinate of the "main" row in the before panel.
export const BEFORE_MAIN_Y = 50;

// y coordinate of the "feature" row in the before panel.
export const BEFORE_FEATURE_Y = 96;

// y coordinate of the "main" row in the after panel.
export const AFTER_MAIN_Y = 210;

// y coordinate of the "feature" row in the after panel — only used by the three-way variant.
export const AFTER_FEATURE_Y = 256;

// Radius of every commit node circle.
export const NODE_R = 10;

// Full before/after commit graph for each merge outcome this post's own ASCII art compares.
export const GIT_MERGE_CONFIG: Record<GitMergeVariant, GitMergeVariantConfig> = {
  "fast-forward": {
    before: {
      nodes: [
        { x: 60, y: BEFORE_MAIN_Y, label: "A", emphasis: false },
        { x: 115, y: BEFORE_MAIN_Y, label: "B", emphasis: false },
        { x: 170, y: BEFORE_FEATURE_Y, label: "C", emphasis: false },
        { x: 225, y: BEFORE_FEATURE_Y, label: "D", emphasis: false }
      ],
      edges: [
        { x1: 60, y1: BEFORE_MAIN_Y, x2: 115, y2: BEFORE_MAIN_Y },
        { x1: 115, y1: BEFORE_MAIN_Y, x2: 170, y2: BEFORE_FEATURE_Y },
        { x1: 170, y1: BEFORE_FEATURE_Y, x2: 225, y2: BEFORE_FEATURE_Y }
      ]
    },
    after: {
      nodes: [
        { x: 60, y: AFTER_MAIN_Y, label: "A", emphasis: false },
        { x: 115, y: AFTER_MAIN_Y, label: "B", emphasis: false },
        { x: 170, y: AFTER_MAIN_Y, label: "C", emphasis: false },
        { x: 225, y: AFTER_MAIN_Y, label: "D", emphasis: false }
      ],
      edges: [
        { x1: 60, y1: AFTER_MAIN_Y, x2: 115, y2: AFTER_MAIN_Y },
        { x1: 115, y1: AFTER_MAIN_Y, x2: 170, y2: AFTER_MAIN_Y },
        { x1: 170, y1: AFTER_MAIN_Y, x2: 225, y2: AFTER_MAIN_Y }
      ]
    },
    captionCommand: "git merge feature",
    captionExplanation: "pointer just moves — no new commit"
  },
  "three-way": {
    before: {
      nodes: [
        { x: 60, y: BEFORE_MAIN_Y, label: "A", emphasis: false },
        { x: 115, y: BEFORE_MAIN_Y, label: "B", emphasis: false },
        { x: 230, y: BEFORE_MAIN_Y, label: "E", emphasis: false },
        { x: 170, y: BEFORE_FEATURE_Y, label: "C", emphasis: false },
        { x: 225, y: BEFORE_FEATURE_Y, label: "D", emphasis: false }
      ],
      edges: [
        { x1: 60, y1: BEFORE_MAIN_Y, x2: 115, y2: BEFORE_MAIN_Y },
        { x1: 115, y1: BEFORE_MAIN_Y, x2: 230, y2: BEFORE_MAIN_Y },
        { x1: 115, y1: BEFORE_MAIN_Y, x2: 170, y2: BEFORE_FEATURE_Y },
        { x1: 170, y1: BEFORE_FEATURE_Y, x2: 225, y2: BEFORE_FEATURE_Y }
      ]
    },
    after: {
      nodes: [
        { x: 60, y: AFTER_MAIN_Y, label: "A", emphasis: false },
        { x: 115, y: AFTER_MAIN_Y, label: "B", emphasis: false },
        { x: 230, y: AFTER_MAIN_Y, label: "E", emphasis: false },
        { x: 285, y: AFTER_MAIN_Y, label: "M", emphasis: true },
        { x: 170, y: AFTER_FEATURE_Y, label: "C", emphasis: false },
        { x: 225, y: AFTER_FEATURE_Y, label: "D", emphasis: false }
      ],
      edges: [
        { x1: 60, y1: AFTER_MAIN_Y, x2: 115, y2: AFTER_MAIN_Y },
        { x1: 115, y1: AFTER_MAIN_Y, x2: 230, y2: AFTER_MAIN_Y },
        { x1: 230, y1: AFTER_MAIN_Y, x2: 285, y2: AFTER_MAIN_Y },
        { x1: 115, y1: AFTER_MAIN_Y, x2: 170, y2: AFTER_FEATURE_Y },
        { x1: 170, y1: AFTER_FEATURE_Y, x2: 225, y2: AFTER_FEATURE_Y },
        { x1: 225, y1: AFTER_FEATURE_Y, x2: 285, y2: AFTER_MAIN_Y }
      ]
    },
    captionCommand: "git merge feature",
    captionExplanation: "creates merge commit M (parents: E, D)"
  }
};
