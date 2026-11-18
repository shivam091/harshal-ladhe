"use client";

import { useMemo, useState } from "react";
import type { JSX } from "react";
import * as edit from "@/components/CronBuilder/CronBuilder.helpers";
import { CronIcon } from "@/components/Icon";
import FieldGrid from "@/components/CronBuilder/FieldGrid/FieldGrid";
import DescriptionPanel from "@/components/CronBuilder/DescriptionPanel/DescriptionPanel";
import NextRunsPanel from "@/components/CronBuilder/NextRunsPanel/NextRunsPanel";
import ExportPanel from "@/components/CronBuilder/ExportPanel/ExportPanel";
import PresetGallery from "@/components/CronBuilder/PresetGallery/PresetGallery";
import { Console, Deck, DeckTitle, LivePulse, Layout, MainColumn, SidePanel } from "@/components/CronBuilder/CronBuilder.styles";
import type { CronActions, CronEditorState } from "@/components/CronBuilder/CronBuilder.types";

// Root client component: owns the builder's state and derives one CronActions object every subcomponent shares.
export default function CronBuilder(): JSX.Element {
  // Every visit starts from the same default schedule, so the tool always opens in a known, explainable state.
  const [state, setState] = useState<CronEditorState>(edit.createDefaultEditorState);

  const actions: CronActions = useMemo(
    () => ({
      setField: (key, raw) => setState((s) => edit.setField(s, key, raw)),
      applyPreset: (preset) => setState((s) => edit.applyPreset(s, preset))
    }),
    []
  );

  return (
    <>
      <Console>
        <Deck>
          <DeckTitle>
            <LivePulse aria-hidden="true" />
            <CronIcon size={16} aria-hidden="true" />
            Cron Console
          </DeckTitle>
        </Deck>

        <DescriptionPanel state={state} />

        <Layout>
          <MainColumn>
            <FieldGrid state={state} actions={actions} />
            <NextRunsPanel state={state} />
            <ExportPanel state={state} />
          </MainColumn>

          <SidePanel>
            <PresetGallery actions={actions} />
          </SidePanel>
        </Layout>
      </Console>
    </>
  );
}

CronBuilder.displayName = "CronBuilder";
