import type { AbBucket, AbBucketColor } from "@/components/mdx/AbBucketingDiagram/AbBucketingDiagram.types";

// Maps a bucket to its outcome-box color — kept arbitrary (neither bucket is "better"), just distinct
// enough that the same bucket reads as the same color across both scenarios.
export function getAbBucketColor(bucket: AbBucket): AbBucketColor {
  return bucket === "a"
    ? { fill: "var(--color-bg-accent-muted)", stroke: "var(--color-border-accent-emphasis)" }
    : { fill: "var(--color-bg-success-muted)", stroke: "var(--color-border-success-emphasis)" };
}
