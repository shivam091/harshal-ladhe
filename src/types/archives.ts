/*
  Pure archive-item types and grouping logic — no server-only imports, so this
  is safe to use from both lib/archives.ts (server, git-derived data) and the
  client-side archive filter. Keeping this out of lib/archives.ts matters: that
  file also exports functions that transitively import node:child_process (via
  git-dates.mjs), and JS bundling boundaries are per-file — a client component
  importing anything from that file would drag the whole server-only chain into
  the browser bundle.
*/

export type ArchiveItemType = "post" | "snippet" | "series";
