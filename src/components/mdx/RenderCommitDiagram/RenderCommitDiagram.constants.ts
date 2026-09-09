import type { RenderCommitPhase, RenderCommitGroup } from "@/interfaces/render-commit-diagram";

// Shared box size for every phase, so all four read as equal-weight steps in one pipeline.
export const PHASE_W = 130;
export const PHASE_H = 80;
export const PHASE_Y = 120;

// y position of a group band's banner label (above the band) and sublabel (below it).
export const GROUP_LABEL_Y = 80;
export const GROUP_SUBLABEL_Y = 233;

// x position of the boundary line between the render and commit groups — the diagram's whole point,
// so it's centered in the gap between the two bands and drawn bolder than anything else here.
export const DIVIDER_X = 350;
export const DIVIDER_Y_TOP = 90;
export const DIVIDER_Y_BOTTOM = 215;

/*
  The two background bands. Render covers Render + Reconcile; Commit covers Commit + Paint. Sized
  with 15px of padding around their two phase boxes so the grouping reads as one shape, not two.
*/
export const RENDER_COMMIT_GROUPS: RenderCommitGroup[] = [
  {
    kind: "render",
    label: "RENDER PHASE",
    sublabel: "interruptible • can restart • no DOM access",
    x: 5,
    y: 90,
    w: 320,
    h: 125
  },
  {
    kind: "commit",
    label: "COMMIT PHASE",
    sublabel: "synchronous • DOM is mutated here",
    x: 375,
    y: 90,
    w: 320,
    h: 125
  }
];

// The four pipeline stages, left to right, with the one-line takeaway for each.
export const RENDER_COMMIT_PHASES: RenderCommitPhase[] = [
  {
    id: "render",
    group: "render",
    label: "Render",
    caption: "Call components, build a tree",
    x: 20,
    y: PHASE_Y,
    w: PHASE_W,
    h: PHASE_H
  },
  {
    id: "reconcile",
    group: "render",
    label: "Reconcile",
    caption: "Diff against the last tree",
    x: 180,
    y: PHASE_Y,
    w: PHASE_W,
    h: PHASE_H
  },
  {
    id: "commit",
    group: "commit",
    label: "Commit",
    caption: "Mutate the real DOM",
    x: 390,
    y: PHASE_Y,
    w: PHASE_W,
    h: PHASE_H
  },
  {
    id: "paint",
    group: "commit",
    label: "Paint",
    caption: "Browser draws the frame",
    x: 550,
    y: PHASE_Y,
    w: PHASE_W,
    h: PHASE_H
  }
];
