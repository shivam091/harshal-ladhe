// One commit in the line's history, and the blame invocation that stops there.
export interface GitBlameStep {
  // x coordinate of the file lane the commit sits in.
  x: number;
  // y coordinate of the commit's row.
  y: number;
  // Abbreviated commit hash, matching the post's example output.
  sha: string;
  // What the commit did to the line.
  summary: string;
  // The blame command that reports this commit as the line's author.
  stopLabel: string;
  // Whether this is where the line was really written, styled distinctly from the later commits.
  emphasis: boolean;
}
