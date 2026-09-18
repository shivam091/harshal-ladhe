import type { JSX } from "react";
import { fluidTypePresets } from "@/data/fluid-type-presets";
import { Grid, PresetCard, PresetName, PresetMeta } from "@/components/FluidTypeCalculator/PresetGallery/PresetGallery.styles";
import { SectionCard, PanelTitle } from "@/components/FluidTypeCalculator/FluidTypeCalculator.styles";
import type { PresetGalleryProps } from "@/interfaces/fluid-type";

/*
  Each card states the preset's viewport range and step count rather than rendering a fake sample —
  unlike a fixed effect (a shadow, a gradient), a clamp() value only means something evaluated
  against a real viewport width, so a small static thumbnail here would either lie about the scale
  or just show one arbitrary frozen size.
*/
export default function PresetGallery({ actions }: PresetGalleryProps): JSX.Element {
  return (
    <>
      <SectionCard>
        <PanelTitle>Presets</PanelTitle>
        <Grid>
          {fluidTypePresets.map((preset) => (
            <PresetCard key={preset.slug} type="button" onClick={() => actions.applyPreset(preset)}>
              <PresetName>{preset.name}</PresetName>
              <PresetMeta>
                {preset.minViewport}→{preset.maxViewport}px · {preset.steps.length} steps
              </PresetMeta>
            </PresetCard>
          ))}
        </Grid>
      </SectionCard>
    </>
  );
}

PresetGallery.displayName = "PresetGallery";
