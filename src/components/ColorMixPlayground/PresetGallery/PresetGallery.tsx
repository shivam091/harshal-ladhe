import type { JSX } from "react";
import { buildColorMixValue, PRESETS } from "@/helpers/color-mix-editor";
import type { ColorMixEditorState, ColorMixPresetMeta, PresetGalleryProps } from "@/interfaces/color-mix";
import { SectionCard, PanelTitle } from "@/components/ColorMixPlayground/ColorMixPlayground.styles";
import { Grid, PresetButton, PresetSwatch, PresetLabel } from "@/components/ColorMixPlayground/PresetGallery/PresetGallery.styles";

// Thumbnail renders the exact result the preset would produce, at a fixed "shorter" hue since presets don't carry their own hue method — the same "the thumbnail IS the output" approach as GradientGenerator's own PresetGallery.
function previewValue(preset: ColorMixPresetMeta): string {
  const state: ColorMixEditorState = { color1: preset.color1, color2: preset.color2, space: preset.space, ratio: preset.ratio, hueMethod: "shorter" };
  return buildColorMixValue(state);
}

export default function PresetGallery({ actions }: PresetGalleryProps): JSX.Element {
  return (
    <>
      <SectionCard>
        <PanelTitle>Presets</PanelTitle>
        <Grid>
          {PRESETS.map((preset) => (
            <PresetButton key={preset.slug} type="button" onClick={() => actions.applyPreset(preset)}>
              <PresetSwatch style={{ backgroundColor: previewValue(preset) }} />
              <PresetLabel>{preset.name}</PresetLabel>
            </PresetButton>
          ))}
        </Grid>
      </SectionCard>
    </>
  );
}

PresetGallery.displayName = "PresetGallery";
