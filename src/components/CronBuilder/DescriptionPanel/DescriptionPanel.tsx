import type { JSX } from "react";
import { toCrontabLine } from "@/utils/cron-export";
import { describeCron } from "@/utils/cron-describe";
import type { DescriptionPanelProps } from "@/interfaces/cron-builder";
import { SectionCard, PanelTitle } from "@/components/CronBuilder/CronBuilder.styles";
import { CronLine, Sentence } from "@/components/CronBuilder/DescriptionPanel/DescriptionPanel.styles";

// The cron ⇄ human-readable pairing itself — the assembled 5-field string built straight from state (never re-parsed), and its plain-English reading built by describeCron from those same 5 fields.
export default function DescriptionPanel({ state }: DescriptionPanelProps): JSX.Element {
  return (
    <>
      <SectionCard>
        <PanelTitle>Cron expression</PanelTitle>
        <CronLine>{toCrontabLine(state)}</CronLine>
        <Sentence>{describeCron(state)}</Sentence>
      </SectionCard>
    </>
  );
}

DescriptionPanel.displayName = "DescriptionPanel";
