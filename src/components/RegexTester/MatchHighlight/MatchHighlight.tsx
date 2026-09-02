import type { JSX } from "react";
import { buildHighlightSegments, runRegex } from "@/utils/regex-match";
import type { MatchHighlightProps } from "@/interfaces/regex-tester";
import { FieldWrapper, FieldLabel } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import { SectionCard, PanelTitle } from "@/components/RegexTester/RegexTester.styles";
import { TestTextarea, HighlightPane, MatchSpan, SummaryRow, ErrorBanner } from "@/components/RegexTester/MatchHighlight/MatchHighlight.styles";

// The test string input, plus a read-only rendering of the same text with every match wrapped in a <mark> — the one place a pattern's actual effect on real text is visible at a glance, rather than only as a list of index/match pairs.
export default function MatchHighlight({ state, actions }: MatchHighlightProps): JSX.Element {
  const result = runRegex(state.pattern, state.flags, state.testString);

  return (
    <>
      <SectionCard>
        <PanelTitle>Test string</PanelTitle>

        <FieldWrapper>
          <FieldLabel htmlFor="regex-tester-test-string">Text to test against</FieldLabel>
          <TestTextarea id="regex-tester-test-string" value={state.testString} spellCheck={false} onChange={(event) => actions.setTestString(event.target.value)} onBlur={actions.commitDrag} />
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
                : buildHighlightSegments(state.testString, result.matches).map((segment, i) =>
                    segment.matched ? <MatchSpan key={i}>{segment.text}</MatchSpan> : <span key={i}>{segment.text}</span>
                  )}
            </HighlightPane>
          </>
        )}
      </SectionCard>
    </>
  );
}

MatchHighlight.displayName = "MatchHighlight";
