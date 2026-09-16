import type { CSSProperties, JSX } from "react";
import { buildHighlightSegments, runRegex } from "@/utils/regex-match";
import { tapeColorForMatch } from "@/components/RegexTester/regex-match-colors";
import type { MatchHighlightProps } from "@/interfaces/regex-tester";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/RegexTester/RegexTester.styles";
import { FieldWrapper, FieldLabel } from "@/components/RegexTester/PatternControls/PatternControls.styles";
import { TestTextarea, HighlightPane, MatchTape, GroupMarks, SummaryRow, ErrorBanner } from "@/components/RegexTester/MatchHighlight/MatchHighlight.styles";

// Counts a match's captures — numbered and named groups together — so the superscript annotation knows how many marks to draw.
function groupCount(match: { numberedGroups: unknown[]; namedGroups: unknown[] }): number {
  return match.numberedGroups.length + match.namedGroups.length;
}

/*
  The test string input, plus a read-only "marked-up" rendering of the same text with every match
  wrapped in a highlighter-tape span (flagship flourish #1) — the one place a pattern's actual effect
  on real text is visible at a glance, rather than only as a list of index/match pairs. Each match's
  tape color cycles through regex-match-colors' palette by position, and a small superscript mark
  nests its capture-group count right after the tape, in a distinct "ink" color from the tape itself.
*/
export default function MatchHighlight({ state, actions }: MatchHighlightProps): JSX.Element {
  const result = runRegex(state.pattern, state.flags, state.testString);

  // Segments alternate matched/unmatched runs in the same order as result.matches, so a running counter maps each matched segment back to its own RegexMatch for color + group-count purposes.
  let matchOrdinal = -1;

  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelTitle>Test string</PanelTitle>
        </PanelHeader>
        <PanelBody>
          <FieldWrapper>
            <FieldLabel htmlFor="regex-tester-test-string">Text to test against</FieldLabel>
            <TestTextarea
              id="regex-tester-test-string"
              value={state.testString}
              spellCheck={false}
              onChange={(event) => actions.setTestString(event.target.value)}
              onBlur={actions.commitDrag}
            />
          </FieldWrapper>

          {!result.valid && <ErrorBanner>Invalid regular expression: {result.error}</ErrorBanner>}

          {result.valid && (
            <>
              <SummaryRow>
                {result.matches.length === 0 ? "No matches" : `${result.matches.length} match${result.matches.length === 1 ? "" : "es"}`}
                {result.truncated ? " (showing the first 500)" : ""}
              </SummaryRow>
              <HighlightPane>
                {state.testString.length === 0
                  ? "Nothing to test yet — type something above."
                  : buildHighlightSegments(state.testString, result.matches).map((segment, i) => {
                      if (!segment.matched) return <span key={i}>{segment.text}</span>;
                      matchOrdinal += 1;
                      const match = result.matches[matchOrdinal];
                      const count = match ? groupCount(match) : 0;
                      return (
                        <MatchTape key={i} style={{ "--tape-color": tapeColorForMatch(matchOrdinal) } as CSSProperties}>
                          {segment.text}
                          {count > 0 && <GroupMarks aria-hidden="true">{count}</GroupMarks>}
                        </MatchTape>
                      );
                    })}
              </HighlightPane>
            </>
          )}
        </PanelBody>
      </Panel>
    </>
  );
}

MatchHighlight.displayName = "MatchHighlight";
