import { spawnSync } from "node:child_process";

/*
  Shared git-history helpers used by both the MDX remark plugin
  (lib/remark-git-dates.mjs) and the snippet source reader
  (lib/snippets.ts). Single source of truth for deriving
  build-time publish / last-modified dates from a file's git history.
*/

/*
  Reads the ISO-8601 last-commit date for a file from git.
  Returns null when the file is untracked, git is unavailable, or the
  repository history is too shallow.
*/
export function gitLastModified(filePath) {
  const { status, stdout } = spawnSync(
    "git",
    ["log", "-1", "--format=%ad", "--date=iso-strict", "--", filePath],
    { encoding: "utf-8" }
  );
  if (status !== 0) return null;
  return stdout.trim() || null;
}

/*
  Reads the ISO-8601 date of the first commit that added the file.
  Returns null for untracked files or shallow clones.
*/
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
