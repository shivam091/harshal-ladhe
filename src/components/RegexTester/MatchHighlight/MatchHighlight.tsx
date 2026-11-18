import type { CSSProperties, JSX } from "react";
import { buildHighlightSegments, validateRegex } from "@/components/RegexTester/RegexTester.utils";
import { tapeColorForMatch } from "@/components/RegexTester/regex-match-colors";
import type { MatchHighlightProps } from "@/components/RegexTester/RegexTester.types";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/RegexTester/RegexTester.styles";
import { FieldWrapper, FieldLabel } from "@/components/RegexTester/PatternControls/PatternControls.styles";
import { TestTextarea, HighlightPane, MatchTape, EmptyMatchMarker, GroupMarks, SummaryRow, ErrorBanner } from "@/components/RegexTester/MatchHighlight/MatchHighlight.styles";

// Counts a match's captures — numbered and named groups together — so the superscript annotation knows how many marks to draw.
function groupCount(match: { numberedGroups: unknown[]; namedGroups: unknown[] }): number {
  return match.numberedGroups.length + match.namedGroups.length;
}

/*
  The test string input, plus a read-only "marked-up" rendering of the same text with every match
  wrapped in a highlighter-tape span (flagship flourish #1) — the one place a pattern's actual effect
  on real text is visible at a glance, rather than only as a list of index/match pairs. Each match's
  tape color cycles through regex-match-colors' palette by match number (matching the Captures list), and a small superscript mark
  nests its capture-group count right after the tape, in a distinct "ink" color from the tape itself.
*/
export default function MatchHighlight({ state, actions, result, pending }: MatchHighlightProps): JSX.Element {
  // Checked synchronously, so a typo is flagged immediately instead of waiting for the worker.
  const patternError = validateRegex(state.pattern, state.flags);

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
            />
          </FieldWrapper>

          {patternError && <ErrorBanner>Invalid regular expression: {patternError.replace(/^Invalid regular expression:\s*/, "")}</ErrorBanner>}

          {!patternError && result.timedOut && (
            <ErrorBanner role="alert">
              Matching took longer than a second and was stopped. The pattern is probably backtracking catastrophically — nested quantifiers such as{" "}
              <code>(a+)+</code> retry exponentially many ways on text that almost matches. Rewrite it so each character can only be matched one way, e.g.{" "}
              <code>(a+)+</code> → <code>a+</code>.
            </ErrorBanner>
          )}

          {!patternError && !result.timedOut && (
            <>
              <SummaryRow aria-live="polite">
                {pending ? "Matching…" : result.matches.length === 0 ? "No matches" : `${result.matches.length} match${result.matches.length === 1 ? "" : "es"}`}
                {!pending && result.truncated ? " (showing the first 500)" : ""}
                {!pending && result.matches.some((m) => m.match === "") ? " — a thin marker shows each empty match" : ""}
              </SummaryRow>
              <HighlightPane data-pending={pending ? "true" : undefined}>
                {state.testString.length === 0
                  ? "Nothing to test yet — type something above."
                  : buildHighlightSegments(state.testString, result.matches).map((segment, i) => {
                      if (!segment.matched || segment.matchIndex === undefined) return <span key={i}>{segment.text}</span>;
                      const match = result.matches[segment.matchIndex];
                      const color = { "--tape-color": tapeColorForMatch(segment.matchIndex) } as CSSProperties;
                      if (segment.text === "") return <EmptyMatchMarker key={i} style={color} title={`Empty match #${segment.matchIndex + 1} at index ${match.index}`} />;
                      const count = groupCount(match);
                      return (
                        <MatchTape key={i} style={color}>
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
