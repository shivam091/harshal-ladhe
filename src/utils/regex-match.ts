// One regex match's full text plus every capture group — numbered groups by their fixed left-to-right position (undefined if that group didn't participate), named groups as name/value pairs (a named group is also one of the numbered ones, kept separately so callers can render either view).
export interface RegexMatch {
  index: number;
  match: string;
  numberedGroups: Array<string | undefined>;
  namedGroups: Array<{ name: string; value: string | undefined }>;
}

// Outcome of running a pattern against a test string — `valid`/`error` cover a pattern the RegExp constructor itself rejected, distinct from a valid pattern that simply found zero matches.
export interface RegexResult {
  valid: boolean;
  error: string | null;
  matches: RegexMatch[];
  truncated: boolean;
}

// One run of the test string — either inside a match or not — as consumed by the highlighted preview.
export interface HighlightSegment {
  text: string;
  matched: boolean;
}

// Hard cap on rendered matches — a pathological pattern/input pair can still match thousands of times; capping keeps the match list and highlighted view from choking the DOM.
const MAX_MATCHES = 500;

/*
  Runs `pattern`/`flags` against `testString` and returns every match plus its capture groups.
  Always searches with the 'g' flag internally (adding it if the user's own flags omit it) so
  String.prototype.matchAll can be used — matchAll both requires 'g' and, unlike a hand-rolled
  exec()/lastIndex loop, correctly advances past zero-length matches on its own, so there's no risk
  of an infinite loop here.
*/
export function runRegex(pattern: string, flags: string, testString: string): RegexResult {
  try {
    const searchFlags = flags.includes("g") ? flags : `${flags}g`;
    const regex = new RegExp(pattern, searchFlags);
    const matches: RegexMatch[] = [];
    let truncated = false;

    for (const m of testString.matchAll(regex)) {
      if (matches.length >= MAX_MATCHES) {
        truncated = true;
        break;
      }
      const numberedGroups = Array.from(m).slice(1);
      const namedGroups = m.groups ? Object.entries(m.groups).map(([name, value]) => ({ name, value })) : [];
      matches.push({ index: m.index ?? 0, match: m[0], numberedGroups, namedGroups });
    }

    return { valid: true, error: null, matches, truncated };
  } catch (error) {
    return { valid: false, error: error instanceof Error ? error.message : "Invalid regular expression", matches: [], truncated: false };
  }
}

// Splits `testString` into matched/unmatched runs for the highlighted preview — a single pass over the already-sorted match list (matchAll yields matches in order), so no additional sorting is needed.
export function buildHighlightSegments(testString: string, matches: RegexMatch[]): HighlightSegment[] {
  const segments: HighlightSegment[] = [];
  let cursor = 0;

  for (const m of matches) {
    if (m.index > cursor) segments.push({ text: testString.slice(cursor, m.index), matched: false });
    if (m.match.length > 0) {
      segments.push({ text: m.match, matched: true });
      cursor = m.index + m.match.length;
    } else {
      cursor = Math.max(cursor, m.index);
    }
  }

  if (cursor < testString.length) segments.push({ text: testString.slice(cursor), matched: false });
  return segments;
}
