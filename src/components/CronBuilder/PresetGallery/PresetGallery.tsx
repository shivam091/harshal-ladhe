import type { JSX } from "react";
import { toCrontabLine } from "@/utils/cron-export";
import { cronPresets } from "@/data/cron-presets";
import { Grid, PresetCard, PresetName, PresetLine } from "@/components/CronBuilder/PresetGallery/PresetGallery.styles";
import { SectionCard, PanelTitle } from "@/components/CronBuilder/CronBuilder.styles";
import type { PresetGalleryProps } from "@/interfaces/cron-builder";

export default function PresetGallery({ actions }: PresetGalleryProps): JSX.Element {
  return (
    <>
      <SectionCard>
        <PanelTitle>Presets</PanelTitle>
        <Grid>
          {cronPresets.map((preset) => (
            <PresetCard key={preset.slug} type="button" onClick={() => actions.applyPreset(preset)}>
              <PresetName>{preset.name}</PresetName>
              <PresetLine>{toCrontabLine(preset.fields)}</PresetLine>
            </PresetCard>
          ))}
        </Grid>
      </SectionCard>
    </>
  );
}

PresetGallery.displayName = "PresetGallery";
