import type { JSX } from "react";
import { compileClipPathValue } from "@/utils/clip-path";
import { clipPathPresets, generateRandomPolygon } from "@/data/clip-path-presets";
import { MagicWandIcon } from "@/components/Icon";
import { SectionCard, PanelTitle } from "@/components/ClipPathGenerator/ClipPathGenerator.styles";
import { Grid, PresetButton, PresetSwatch, PresetLabel } from "@/components/ClipPathGenerator/PresetGallery/PresetGallery.styles";
import type { PresetGalleryProps } from "@/interfaces/clip-path";

export default function PresetGallery({ actions }: PresetGalleryProps): JSX.Element {
  return (
    <>
      <SectionCard>
        <PanelTitle>Presets</PanelTitle>
        <Grid>
          {clipPathPresets.map((preset) => (
            <PresetButton key={preset.slug} type="button" onClick={() => actions.applyPreset(preset.shape)}>
              <PresetSwatch style={{ clipPath: compileClipPathValue(preset.shape) }} />
              <PresetLabel>{preset.name}</PresetLabel>
            </PresetButton>
          ))}
          <PresetButton type="button" onClick={() => actions.applyPreset(generateRandomPolygon())} aria-label="Shuffle: generate a random shape">
            <MagicWandIcon size={20} aria-hidden="true" />
            <PresetLabel>Shuffle</PresetLabel>
          </PresetButton>
        </Grid>
      </SectionCard>
    </>
  );
}

PresetGallery.displayName = "PresetGallery";
