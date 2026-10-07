import type { JSX } from "react";
import { svgOptimiserPresets } from "@/data/svg-optimiser-presets";
import { SectionCard, PanelTitle } from "@/components/SvgOptimiser/SvgOptimiser.styles";
import { Grid, PresetTag, PresetName, PresetMeta } from "@/components/SvgOptimiser/PresetGallery/PresetGallery.styles";
import type { PresetGalleryProps } from "@/components/SvgOptimiser/SvgOptimiser.types";

// Each tag names the tool that packed the sample, since the point of a preset is to see that tool's particular cruft weighed and removed.
export default function PresetGallery({ actions }: PresetGalleryProps): JSX.Element {
  return (
    <>
      <SectionCard>
        <PanelTitle data-form="P-40">Specimen parcels</PanelTitle>
        <Grid>
          {svgOptimiserPresets.map((preset) => (
            <PresetTag key={preset.slug} type="button" onClick={() => actions.applyPreset(preset)}>
              <PresetName>{preset.name}</PresetName>
              <PresetMeta>{preset.origin}</PresetMeta>
            </PresetTag>
          ))}
        </Grid>
      </SectionCard>
    </>
  );
}

PresetGallery.displayName = "PresetGallery";
