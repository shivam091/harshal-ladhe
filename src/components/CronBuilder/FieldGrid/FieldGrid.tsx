import type { JSX } from "react";
import type { CronFieldKey, FieldGridProps } from "@/interfaces/cron-builder";
import FieldBuilder from "@/components/CronBuilder/FieldBuilder/FieldBuilder";
import { SectionCard, PanelTitle } from "@/components/CronBuilder/CronBuilder.styles";
import { Grid } from "@/components/CronBuilder/FieldGrid/FieldGrid.styles";

// The 5 standard cron fields, in their canonical left-to-right order, each with the value range that field actually accepts.
const FIELDS: Array<{ key: CronFieldKey; label: string; min: number; max: number }> = [
  { key: "minute", label: "Minute", min: 0, max: 59 },
  { key: "hour", label: "Hour", min: 0, max: 23 },
  { key: "dayOfMonth", label: "Day of month", min: 1, max: 31 },
  { key: "month", label: "Month", min: 1, max: 12 },
  { key: "dayOfWeek", label: "Day of week", min: 0, max: 6 }
];

export default function FieldGrid({ state, actions }: FieldGridProps): JSX.Element {
  return (
    <>
      <SectionCard>
        <PanelTitle>Schedule</PanelTitle>
        <Grid>
          {FIELDS.map((field) => (
            <FieldBuilder key={field.key} fieldKey={field.key} label={field.label} min={field.min} max={field.max} state={state} actions={actions} />
          ))}
        </Grid>
      </SectionCard>
    </>
  );
}

FieldGrid.displayName = "FieldGrid";
