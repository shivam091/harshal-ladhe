import type { JSX } from "react";
import { validateRegex } from "@/components/RegexTester/RegexTester.utils";
import type { PatternControlsProps } from "@/components/RegexTester/RegexTester.types";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/RegexTester/RegexTester.styles";
import { FieldWrapper, FieldLabel, Delimited, Slash, PatternInput, FlagRow, FlagChip, FlagLetter, FlagName, ErrorText } from "@/components/RegexTester/PatternControls/PatternControls.styles";

// Every flag JS regex literals support, in the canonical order the rest of the tool renders/exports them in.
const FLAGS = [
  { letter: "g", name: "Global" },
  { letter: "i", name: "Ignore case" },
  { letter: "m", name: "Multiline" },
  { letter: "s", name: "Dot all" },
  { letter: "u", name: "Unicode" },
  { letter: "y", name: "Sticky" }
] as const;

/*
  The tool's hero — a slash-delimited pattern field (styled like a marked-up manuscript title) plus
  a row of toggleable flag pins. Surfaces the constructor's own error message inline so an invalid
  pattern (unmatched group, bad escape) is visible right where it was typed, rather than only in the
  match list below. Sits full-width above the two-column layout, the same structural role
  CronBuilder gives its own assembled-expression DescriptionPanel.
*/
export default function PatternControls({ state, actions }: PatternControlsProps): JSX.Element {
  const error = validateRegex(state.pattern, state.flags);

  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelTitle>Pattern</PanelTitle>
        </PanelHeader>
        <PanelBody>
          <FieldWrapper>
            <FieldLabel htmlFor="regex-tester-pattern">Regular expression</FieldLabel>
            <Delimited>
              <Slash>/</Slash>
              <PatternInput
                id="regex-tester-pattern"
                type="text"
                spellCheck={false}
                data-invalid={error ? "true" : undefined}
                value={state.pattern}
                onChange={(event) => actions.setPattern(event.target.value)}
              />
              <Slash>/{state.flags}</Slash>
            </Delimited>
            {error && <ErrorText>{error}</ErrorText>}
          </FieldWrapper>

          <FieldWrapper>
            <FieldLabel>Flags</FieldLabel>
            <FlagRow>
              {FLAGS.map((flag) => (
                <FlagChip
                  key={flag.letter}
                  type="button"
                  data-active={state.flags.includes(flag.letter) ? "true" : undefined}
                  onClick={() => actions.toggleFlag(flag.letter)}
                >
                  <FlagLetter>{flag.letter}</FlagLetter>
                  <FlagName>{flag.name}</FlagName>
                </FlagChip>
              ))}
            </FlagRow>
          </FieldWrapper>
        </PanelBody>
      </Panel>
    </>
  );
}

PatternControls.displayName = "PatternControls";
