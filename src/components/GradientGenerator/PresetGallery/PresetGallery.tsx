import type { JSX } from "react";
import { compileGradientValue } from "@/utils/gradient";
import { gradientPresets } from "@/data/gradient-presets";
import type { GradientEditorState, GradientPresetMeta, PresetGalleryProps } from "@/interfaces/gradient";
import { SectionCard, PanelTitle } from "@/components/GradientGenerator/GradientGenerator.styles";
import { Grid, PresetButton, PresetSwatch, PresetLabel } from "@/components/GradientGenerator/PresetGallery/PresetGallery.styles";

// Thumbnails render in plain rgb with no hue clause regardless of what the editor's own colorSpace is currently set to — a preset is a starting point for geometry/stops, not a color-space recommendation.
function previewValue(preset: GradientPresetMeta): string {
  const state: GradientEditorState = {
    config: preset.config,
    stops: preset.stops,
    colorSpace: "rgb",
    hueInterpolation: "shorter",
    repeating: false,
    selectedStopId: null
  };
  return compileGradientValue(state);
}

export default function PresetGallery({ actions }: PresetGalleryProps): JSX.Element {
  return (
    <>
      <SectionCard>
        <PanelTitle>Presets</PanelTitle>
        <Grid>
          {gradientPresets.map((preset) => (
            <PresetButton key={preset.slug} type="button" onClick={() => actions.applyPreset(preset)}>
              <PresetSwatch style={{ backgroundImage: previewValue(preset) }} />
              <PresetLabel>{preset.name}</PresetLabel>
            </PresetButton>
          ))}
        </Grid>
      </SectionCard>
    </>
  );
}

PresetGallery.displayName = "PresetGallery";
