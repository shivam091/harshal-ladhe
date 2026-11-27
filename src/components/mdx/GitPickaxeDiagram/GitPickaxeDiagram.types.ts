// One line of a mini diff inside a case card.
export interface GitPickaxeDiffLine {
  // Diff marker: "+" for an added line, "-" for a removed one.
  sign: "+" | "-";
  // Line content shown after the marker.
  text: string;
}

// One kind of change, and whether each pickaxe option reports the commit that made it.
export interface GitPickaxeCase {
  // x coordinate of the card's left edge.
  x: number;
  // Short name of the change, shown as the card heading.
  title: string;
  // The commit's diff, trimmed to the lines that mention MAX_AGE.
  lines: GitPickaxeDiffLine[];
  // Occurrences of the search string before the commit.
  before: number;
  // Occurrences of the search string after the commit.
  after: number;
  // Whether `git log -S MAX_AGE` lists the commit (the count changed).
  matchesS: boolean;
  // Whether `git log -G MAX_AGE` lists the commit (a changed line matches).
  matchesG: boolean;
}
