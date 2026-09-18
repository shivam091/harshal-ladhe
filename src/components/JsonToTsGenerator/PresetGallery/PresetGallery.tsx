import type { JSX } from "react";
import { jsonToTsPresets } from "@/data/json-to-ts-presets";
import { Grid, PresetCard, PresetName, PresetMeta } from "@/components/JsonToTsGenerator/PresetGallery/PresetGallery.styles";
import { SectionCard, PanelTitle } from "@/components/JsonToTsGenerator/JsonToTsGenerator.styles";
import type { PresetGalleryProps } from "@/interfaces/json-to-ts";

export default function PresetGallery({ actions }: PresetGalleryProps): JSX.Element {
  return (
    <>
      <SectionCard>
        <PanelTitle>Presets</PanelTitle>
        <Grid>
          {jsonToTsPresets.map((preset) => (
            <PresetCard key={preset.slug} type="button" onClick={() => actions.applyPreset(preset)}>
              <PresetName>{preset.name}</PresetName>
              <PresetMeta>{preset.direction === "json-to-ts" ? "JSON → TS" : "TS → JSON"}</PresetMeta>
            </PresetCard>
          ))}
        </Grid>
      </SectionCard>
    </>
  );
}

PresetGallery.displayName = "PresetGallery";
