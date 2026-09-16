import type { JSX } from "react";
import { compileBoxShadowValue } from "@/utils/box-shadow";
import { boxShadowPresets } from "@/data/box-shadow-presets";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/BoxShadowGenerator/BoxShadowGenerator.styles";
import { Grid, PresetButton, PresetStage, PresetSwatch, PresetLabel } from "@/components/BoxShadowGenerator/PresetGallery/PresetGallery.styles";
import type { BoxShadowEditorState, BoxShadowPresetMeta, PresetGalleryProps } from "@/interfaces/box-shadow";

// Renders each preset on ITS OWN pageColor (unlike a gradient tool's presets, which are all fine on a shared thumbnail background) — a shadow's legibility depends on the surface it sits on, so a Neon Glow thumbnail on a light card would just look like a blur.
function previewValue(preset: BoxShadowPresetMeta): string {
  const state: BoxShadowEditorState = { layers: preset.layers, selectedLayerId: null, surfaceColor: preset.surfaceColor, pageColor: preset.pageColor, borderRadius: preset.borderRadius };
  return compileBoxShadowValue(state);
}

// A grid of curated starting looks — neumorphism, material, long-shadow, neon, and more — each swapping in a whole layer set plus surface/page colors at once.
export default function PresetGallery({ actions }: PresetGalleryProps): JSX.Element {
  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelTitle>Presets</PanelTitle>
        </PanelHeader>
        <PanelBody>
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
        </PanelBody>
      </Panel>
    </>
  );
}

PresetGallery.displayName = "PresetGallery";
