"use client";

import { useMemo, useState } from "react";
import type { JSX } from "react";
import { useRegexResult } from "@/components/RegexTester/use-regex-result";
import * as edit from "@/components/RegexTester/RegexTester.helpers";
import { RegexIcon } from "@/components/Icon";
import PatternControls from "@/components/RegexTester/PatternControls/PatternControls";
import MatchHighlight from "@/components/RegexTester/MatchHighlight/MatchHighlight";
import MatchList from "@/components/RegexTester/MatchList/MatchList";
import ExplainPanel from "@/components/RegexTester/ExplainPanel/ExplainPanel";
import ExportPanel from "@/components/RegexTester/ExportPanel/ExportPanel";
import PresetGallery from "@/components/RegexTester/PresetGallery/PresetGallery";
import { Desk, DeskHeader, DeskTitle, InkPulse, Layout, MainColumn, SidePanel } from "@/components/RegexTester/RegexTester.styles";
import type { RegexTesterActions, RegexTesterEditorState } from "@/components/RegexTester/RegexTester.types";

/*
  Root client component: owns the tester's state and derives one RegexTesterActions object every
  subcomponent shares. Structurally a near-mirror of CronBuilder, so the two goodies stay easy to maintain together.
*/
export default function RegexTester(): JSX.Element {
  // Every visit starts from the same default pattern, so the tool always opens in a known, explainable state.
  const [state, setState] = useState<RegexTesterEditorState>(edit.createDefaultEditorState);
  const { result, pending } = useRegexResult(state.pattern, state.flags, state.testString);

  const actions: RegexTesterActions = useMemo(
    () => ({
      setPattern: (pattern) => setState((s) => edit.setPattern(s, pattern)),
      setTestString: (value) => setState((s) => edit.setTestString(s, value)),
      toggleFlag: (flag) => setState((s) => edit.toggleFlag(s, flag)),
      applyPreset: (preset) => setState((s) => edit.applyPreset(s, preset))
    }),
    []
  );

  return (
    <>
      <Desk>
        <DeskHeader>
          <DeskTitle>
            <InkPulse aria-hidden="true" />
            <RegexIcon size={16} aria-hidden="true" />
            Annotation Desk
          </DeskTitle>
        </DeskHeader>

        <PatternControls state={state} actions={actions} />

        <Layout>
          <MainColumn>
            <MatchHighlight state={state} actions={actions} result={result} pending={pending} />
            <MatchList result={result} />
            <ExplainPanel state={state} />
            <ExportPanel state={state} />
          </MainColumn>

          <SidePanel>
            <PresetGallery actions={actions} />
          </SidePanel>
        </Layout>
      </Desk>
    </>
  );
}

RegexTester.displayName = "RegexTester";
