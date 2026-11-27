// The four pairing markers git range-diff prints between the old and new version of a branch.
export type GitRangeDiffMarker = "=" | "!" | "<" | ">";

// One output line of git range-diff: a commit from the old range, its match in the new range, or both.
export interface GitRangeDiffRow {
  // How the old commit relates to the new one, exactly as git range-diff prints it.
  marker: GitRangeDiffMarker;
  // "<position>: <subject>" of the commit in the old range, or null when the commit only exists in the new range.
  oldLabel: string | null;
  // "<position>: <subject>" of the commit in the new range, or null when the commit was dropped.
  newLabel: string | null;
}

// Fill, stroke, and text colours for one marker, so every row and legend entry reads the same way.
export interface GitRangeDiffMarkerStyle {
  // Background of the marker badge and of any commit box the marker highlights.
  fill: string;
  // Border of the marker badge and of any commit box the marker highlights.
  stroke: string;
  // Colour of the marker character itself.
  text: string;
  // Legend wording for the marker.
  label: string;
}
