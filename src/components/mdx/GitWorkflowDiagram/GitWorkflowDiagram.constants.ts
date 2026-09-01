import type { GitWorkflowVariant } from "@/types/git-workflow-diagram";
import type { GitWorkflowVariantConfig } from "@/interfaces/git-workflow-diagram";

// Radius of every commit node circle.
export const NODE_R = 9;

// GitHub Flow: one short-lived feature branch off main, merged back via a PR.
const MAIN_Y = 50;
const FEATURE_Y = 100;

/*
  Git Flow: main and develop are the two long-lived lines; feature/release/hotfix share one branch lane
  between them.
*/
const FLOW_MAIN_Y = 50;
const FLOW_BRANCH_Y = 115;
const FLOW_DEVELOP_Y = 180;

// Trunk-Based: a single line, since commits land directly on main with no long-lived branches.
const TRUNK_Y = 50;

// Full per-variant diagram config — one entry per workflow this post's "Common Workflows" section compares.
export const GIT_WORKFLOW_CONFIG: Record<GitWorkflowVariant, GitWorkflowVariantConfig> = {
  "github-flow": {
    viewBox: "-40 0 480 195",
    title: "Diagram of GitHub Flow: a short-lived feature branch forks off main, gets its own commits, and merges back into main via a single merge commit.",
    nodes: [
      { x: 60, y: MAIN_Y, label: "A", style: "default" },
      { x: 150, y: MAIN_Y, label: "B", style: "default" },
      { x: 320, y: MAIN_Y, label: "E", style: "merge" },
      { x: 380, y: MAIN_Y, label: "F", style: "default" },
      { x: 220, y: FEATURE_Y, label: "C", style: "default" },
      { x: 280, y: FEATURE_Y, label: "D", style: "default" }
    ],
    edges: [
      { x1: 60, y1: MAIN_Y, x2: 150, y2: MAIN_Y },
      { x1: 150, y1: MAIN_Y, x2: 320, y2: MAIN_Y },
      { x1: 320, y1: MAIN_Y, x2: 380, y2: MAIN_Y },
      { x1: 150, y1: MAIN_Y, x2: 220, y2: FEATURE_Y },
      { x1: 220, y1: FEATURE_Y, x2: 280, y2: FEATURE_Y },
      { x1: 280, y1: FEATURE_Y, x2: 320, y2: MAIN_Y }
    ],
    labels: [
      { text: "main", x: 15, y: MAIN_Y + 4, anchor: "end" },
      { text: "feature", x: 15, y: FEATURE_Y + 4, anchor: "end" }
    ],
    caption: "branch, commit, open a PR, merge back into main",
    captionX: 200,
    captionY: 145
  },
  "git-flow": {
    viewBox: "-40 0 530 275",
    title: "Diagram of Git Flow: main and develop are two long-lived lines. A feature branch forks off develop and merges back into develop. A release branch forks off develop and merges into both develop and main. A hotfix branch forks off main and merges into both main and develop.",
    nodes: [
      { x: 40, y: FLOW_MAIN_Y, label: "", style: "default" },
      { x: 340, y: FLOW_MAIN_Y, label: "", style: "merge" },
      { x: 370, y: FLOW_MAIN_Y, label: "", style: "default" },
      { x: 430, y: FLOW_MAIN_Y, label: "", style: "merge" },
      { x: 460, y: FLOW_MAIN_Y, label: "", style: "default" },
      { x: 40, y: FLOW_DEVELOP_Y, label: "", style: "default" },
      { x: 100, y: FLOW_DEVELOP_Y, label: "", style: "default" },
      { x: 160, y: FLOW_DEVELOP_Y, label: "", style: "merge" },
      { x: 220, y: FLOW_DEVELOP_Y, label: "", style: "default" },
      { x: 340, y: FLOW_DEVELOP_Y, label: "", style: "merge" },
      { x: 400, y: FLOW_DEVELOP_Y, label: "", style: "merge" },
      { x: 460, y: FLOW_DEVELOP_Y, label: "", style: "default" },
      { x: 130, y: FLOW_BRANCH_Y, label: "", style: "feature" },
      { x: 280, y: FLOW_BRANCH_Y, label: "", style: "release" },
      { x: 390, y: FLOW_BRANCH_Y, label: "", style: "hotfix" }
    ],
    edges: [
      { x1: 40, y1: FLOW_MAIN_Y, x2: 340, y2: FLOW_MAIN_Y },
      { x1: 340, y1: FLOW_MAIN_Y, x2: 370, y2: FLOW_MAIN_Y },
      { x1: 370, y1: FLOW_MAIN_Y, x2: 430, y2: FLOW_MAIN_Y },
      { x1: 430, y1: FLOW_MAIN_Y, x2: 460, y2: FLOW_MAIN_Y },
      { x1: 40, y1: FLOW_DEVELOP_Y, x2: 100, y2: FLOW_DEVELOP_Y },
      { x1: 100, y1: FLOW_DEVELOP_Y, x2: 160, y2: FLOW_DEVELOP_Y },
      { x1: 160, y1: FLOW_DEVELOP_Y, x2: 220, y2: FLOW_DEVELOP_Y },
      { x1: 220, y1: FLOW_DEVELOP_Y, x2: 340, y2: FLOW_DEVELOP_Y },
      { x1: 340, y1: FLOW_DEVELOP_Y, x2: 400, y2: FLOW_DEVELOP_Y },
      { x1: 400, y1: FLOW_DEVELOP_Y, x2: 460, y2: FLOW_DEVELOP_Y },
      { x1: 100, y1: FLOW_DEVELOP_Y, x2: 130, y2: FLOW_BRANCH_Y },
      { x1: 130, y1: FLOW_BRANCH_Y, x2: 160, y2: FLOW_DEVELOP_Y },
      { x1: 220, y1: FLOW_DEVELOP_Y, x2: 280, y2: FLOW_BRANCH_Y },
      { x1: 280, y1: FLOW_BRANCH_Y, x2: 340, y2: FLOW_DEVELOP_Y },
      { x1: 280, y1: FLOW_BRANCH_Y, x2: 340, y2: FLOW_MAIN_Y },
      { x1: 370, y1: FLOW_MAIN_Y, x2: 390, y2: FLOW_BRANCH_Y },
      { x1: 390, y1: FLOW_BRANCH_Y, x2: 400, y2: FLOW_DEVELOP_Y },
      { x1: 390, y1: FLOW_BRANCH_Y, x2: 430, y2: FLOW_MAIN_Y }
    ],
    labels: [
      { text: "main", x: 15, y: FLOW_MAIN_Y + 4, anchor: "end" },
      { text: "develop", x: 15, y: FLOW_DEVELOP_Y + 4, anchor: "end" },
      { text: "feature", x: 130, y: FLOW_BRANCH_Y - 16, anchor: "middle" },
      { text: "release", x: 280, y: FLOW_BRANCH_Y - 16, anchor: "middle" },
      { text: "hotfix", x: 390, y: FLOW_BRANCH_Y - 16, anchor: "middle" }
    ],
    caption: "release and hotfix merge into both main and develop",
    captionX: 245,
    captionY: 225
  },
  "trunk-based": {
    viewBox: "-40 0 400 100",
    title: "Diagram of Trunk-Based Development: commits land directly on a single main line, one after another, with no long-lived branches.",
    nodes: [
      { x: 60, y: TRUNK_Y, label: "", style: "default" },
      { x: 120, y: TRUNK_Y, label: "", style: "default" },
      { x: 180, y: TRUNK_Y, label: "", style: "default" },
      { x: 240, y: TRUNK_Y, label: "", style: "default" },
      { x: 300, y: TRUNK_Y, label: "", style: "default" }
    ],
    edges: [
      { x1: 60, y1: TRUNK_Y, x2: 120, y2: TRUNK_Y },
      { x1: 120, y1: TRUNK_Y, x2: 180, y2: TRUNK_Y },
      { x1: 180, y1: TRUNK_Y, x2: 240, y2: TRUNK_Y },
      { x1: 240, y1: TRUNK_Y, x2: 300, y2: TRUNK_Y }
    ],
    labels: [
      { text: "main", x: 15, y: TRUNK_Y + 4, anchor: "end" }
    ],
    caption: "commits land directly on main, multiple times a day",
    captionX: 160,
    captionY: 85
  }
};
