import { spawnSync } from "node:child_process";

// Single source of truth so every build-time publish / last-modified date is derived from git the same way.

// Null rather than throwing so untracked files, missing git, or shallow clones just omit the date.
export function gitLastModified(filePath) {
  const { status, stdout } = spawnSync(
    "git",
    ["log", "-1", "--format=%ad", "--date=iso-strict", "--", filePath],
    { encoding: "utf-8" }
  );
  if (status !== 0) return null;
  return stdout.trim() || null;
}

// Uses the commit that first added the file (following renames) so moving a file doesn't reset its publish date.
export function gitPublishedAt(filePath) {
  const { status, stdout } = spawnSync(
    "git",
    ["log", "--diff-filter=A", "--follow", "--format=%ad", "--date=iso-strict", "--", filePath],
    { encoding: "utf-8" }
  );
  if (status !== 0) return null;
  const lines = stdout.trim().split("\n").filter(Boolean);
  return lines.at(-1) ?? null;
}
