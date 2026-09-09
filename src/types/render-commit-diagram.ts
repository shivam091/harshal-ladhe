// The four pipeline stages this diagram lays out left to right.
export type RenderCommitPhaseId = "render" | "reconcile" | "commit" | "paint";

// Which side of the render/commit boundary a phase or group belongs to — the one distinction the
// whole diagram exists to make obvious at a glance.
export type RenderCommitGroupKind = "render" | "commit";
