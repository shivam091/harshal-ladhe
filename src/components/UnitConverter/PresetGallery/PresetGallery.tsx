import type { JSX } from "react";
import { unitConverterPresets } from "@/data/unit-converter-presets";
import { Grid, PresetCard, PresetName, PresetMeta } from "@/components/UnitConverter/PresetGallery/PresetGallery.styles";
import { SectionCard, PanelTitle } from "@/components/UnitConverter/UnitConverter.styles";
import type { PresetGalleryProps } from "@/components/UnitConverter/UnitConverter.types";

// Each card states its context in numbers rather than a thumbnail — a context has no look of its own, only the values every row is about to be recalculated against.
export default function PresetGallery({ actions }: PresetGalleryProps): JSX.Element {
  return (
    <>
      <SectionCard>
        <PanelTitle>Presets</PanelTitle>
        <Grid>
          {unitConverterPresets.map((preset) => (
            <PresetCard key={preset.slug} type="button" onClick={() => actions.applyPreset(preset)}>
              <PresetName>{preset.name}</PresetName>
              <PresetMeta>{preset.summary}</PresetMeta>
            </PresetCard>
          ))}
        </Grid>
      </SectionCard>
    </>
  );
}

PresetGallery.displayName = "PresetGallery";
