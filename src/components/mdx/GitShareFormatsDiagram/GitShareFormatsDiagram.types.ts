// One way of moving work without a remote: the commands at each end, the file in between, and what arrives.
export interface GitShareFormatRow {
  // y coordinate of the row's command label; the boxes and note sit below it.
  y: number;
  // Commands at each end of the trip, e.g. "git format-patch → git am".
  label: string;
  // What leaves the sending repository.
  from: string;
  // The file that actually travels.
  file: string;
  // What the receiving side ends up with.
  to: string;
  // One-line summary of what survives the trip.
  note: string;
  // Whether the received commits keep their original SHAs, styled distinctly from the ones that don't.
  sameShas: boolean;
}
