/*
  One highlighter hue per match position, cycled by index — ties a match's highlighter-tape color in
  MatchHighlight to its sticky-note tags in MatchList so the two flourishes visibly reference the
  same match. Five hand-picked "highlighter pen" hues rather than the site's single semantic accent,
  since real highlighters come in a handful of fixed colors, not an infinite palette — same
  convention as CronBuilder's own cron-field-colors.ts FIELD_COLORS.
*/
export const MATCH_TAPE_COLORS: string[] = [
  "hsl(46deg 96% 56%)",
  "hsl(156deg 55% 42%)",
  "hsl(202deg 78% 56%)",
  "hsl(332deg 70% 62%)",
  "hsl(22deg 88% 58%)"
];

// Picks a match's accent by its position among all matches, wrapping once the palette is exhausted — stable across re-renders since match order never changes for a given pattern/test-string pair.
export function tapeColorForMatch(index: number): string {
  return MATCH_TAPE_COLORS[index % MATCH_TAPE_COLORS.length];
}
