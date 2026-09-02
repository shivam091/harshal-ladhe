import type { JSX } from "react";
import { compileBoxShadowValue } from "@/utils/box-shadow";
import { boxShadowPresets } from "@/data/box-shadow-presets";
import { SectionCard, PanelTitle } from "@/components/BoxShadowGenerator/BoxShadowGenerator.styles";
import { Grid, PresetButton, PresetStage, PresetSwatch, PresetLabel } from "@/components/BoxShadowGenerator/PresetGallery/PresetGallery.styles";
import type { BoxShadowEditorState, BoxShadowPresetMeta, PresetGalleryProps } from "@/interfaces/box-shadow";

// Renders each preset on ITS OWN pageColor (unlike GradientGenerator's presets, which are all fine on a shared thumbnail background) — a shadow's legibility depends on the surface it sits on, so a Neon Glow thumbnail on a light card would just look like a blur.
function previewValue(preset: BoxShadowPresetMeta): string {
  const state: BoxShadowEditorState = { layers: preset.layers, selectedLayerId: null, surfaceColor: preset.surfaceColor, pageColor: preset.pageColor, borderRadius: preset.borderRadius };
  return compileBoxShadowValue(state);
}

export default function PresetGallery({ actions }: PresetGalleryProps): JSX.Element {
  return (
    <>
      <SectionCard>
        <PanelTitle>Presets</PanelTitle>
        <Grid>
          {boxShadowPresets.map((preset) => (
            <PresetButton key={preset.slug} type="button" onClick={() => actions.applyPreset(preset)}>
              <PresetStage style={{ background: preset.pageColor }}>
                <PresetSwatch style={{ background: preset.surfaceColor, borderRadius: `${Math.min(preset.borderRadius, 8)}px`, boxShadow: previewValue(preset) }} />
              </PresetStage>
              <PresetLabel>{preset.name}</PresetLabel>
            </PresetButton>
          ))}
        </Grid>
      </SectionCard>
    </>
  );
}

PresetGallery.displayName = "PresetGallery";
