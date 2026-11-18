import type { JSX } from "react";
import { toCrontabLine } from "@/components/CronBuilder/CronBuilder.utils";
import { cronPresets } from "@/data/cron-presets";
import { List, PresetRow, PresetName, PresetLine } from "@/components/CronBuilder/PresetGallery/PresetGallery.styles";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/CronBuilder/CronBuilder.styles";
import type { PresetGalleryProps } from "@/components/CronBuilder/CronBuilder.types";

export default function PresetGallery({ actions }: PresetGalleryProps): JSX.Element {
  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelTitle>Presets</PanelTitle>
        </PanelHeader>
        <PanelBody>
          <List>
            {cronPresets.map((preset) => (
              <PresetRow key={preset.slug} type="button" onClick={() => actions.applyPreset(preset)}>
                <PresetName>{preset.name}</PresetName>
                <PresetLine>{toCrontabLine(preset.fields)}</PresetLine>
              </PresetRow>
            ))}
          </List>
        </PanelBody>
      </Panel>
    </>
  );
}

PresetGallery.displayName = "PresetGallery";
