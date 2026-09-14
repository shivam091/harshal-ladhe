import type { JSX } from "react";
import type { FieldGridProps } from "@/interfaces/cron-builder";
import FieldBuilder from "@/components/CronBuilder/FieldBuilder/FieldBuilder";
import { FIELD_COLORS, FIELD_ORDER } from "@/components/CronBuilder/cron-field-colors";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/CronBuilder/CronBuilder.styles";
import { Grid } from "@/components/CronBuilder/FieldGrid/FieldGrid.styles";

export default function FieldGrid({ state, actions }: FieldGridProps): JSX.Element {
  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelTitle>Schedule</PanelTitle>
        </PanelHeader>
        <PanelBody>
          <Grid>
            {FIELD_ORDER.map((field) => (
              <FieldBuilder
                key={field.key}
                fieldKey={field.key}
                label={field.label}
                min={field.min}
                max={field.max}
                accent={FIELD_COLORS[field.key]}
                state={state}
                actions={actions}
              />
            ))}
          </Grid>
        </PanelBody>
      </Panel>
    </>
  );
}

FieldGrid.displayName = "FieldGrid";
