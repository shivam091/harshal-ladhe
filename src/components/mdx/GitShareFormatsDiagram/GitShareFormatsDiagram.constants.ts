import type { GitShareFormatRow } from "@/components/mdx/GitShareFormatsDiagram/GitShareFormatsDiagram.types";

// x coordinates of the three boxes in every row: sender's commits, the travelling file, what arrives.
export const BOX_X = [10, 145, 280];

// Shared size of every box.
export const BOX_W = 110;
export const BOX_H = 30;

// Gap between a row's label baseline and the top of its boxes.
export const BOX_OFFSET = 10;

// The three formats, matching the tutorial's own A/B/C commits and file names.
export const ROWS: GitShareFormatRow[] = [
  {
    y: 22,
    label: "git format-patch  →  git am",
    from: "A · B · C",
    file: "3 .patch files",
    to: "A' · B' · C'",
    note: "Author, date and message kept; new SHAs",
    sameShas: false
  },
  {
    y: 107,
    label: "git bundle create  →  git clone / pull",
    from: "A · B · C",
    file: "repo.bundle",
    to: "A · B · C",
    note: "Same commits, same SHAs, refs included",
    sameShas: true
  },
  {
    y: 192,
    label: "git archive  →  unzip / tar -x",
    from: "A · B · C",
    file: "app-1.2.0.zip",
    to: "files only",
    note: "One snapshot of C; no .git, no history",
    sameShas: false
  }
];
