// The three branching workflows this post's "Common Workflows" table compares.
export type GitWorkflowVariant = "github-flow" | "git-flow" | "trunk-based";

// How one commit node renders: a plain commit, a merge commit, or one of the three Git Flow branch types.
export type GitWorkflowNodeStyle = "default" | "merge" | "feature" | "release" | "hotfix";
