import type { JSX } from "react";
import { svgToReactPresets } from "@/data/svg-to-react-presets";
import { Grid, PresetCard, PresetName, PresetMeta } from "@/components/SvgToReactConverter/PresetGallery/PresetGallery.styles";
import { SectionCard, PanelTitle } from "@/components/SvgToReactConverter/SvgToReactConverter.styles";
import type { PresetGalleryProps } from "@/components/SvgToReactConverter/SvgToReactConverter.types";

// Each card names the editor whose cruft it carries, since the point of a preset is to see what that editor's export needs cleaning up.
export default function PresetGallery({ actions }: PresetGalleryProps): JSX.Element {
  return (
    <>
      <SectionCard>
        <PanelTitle data-designator="J2">Presets</PanelTitle>
        <Grid>
          {svgToReactPresets.map((preset) => (
            <PresetCard key={preset.slug} type="button" onClick={() => actions.applyPreset(preset)}>
              <PresetName>{preset.name}</PresetName>
              <PresetMeta>{preset.origin}</PresetMeta>
            </PresetCard>
          ))}
        </Grid>
      </SectionCard>
    </>
  );
}

PresetGallery.displayName = "PresetGallery";
