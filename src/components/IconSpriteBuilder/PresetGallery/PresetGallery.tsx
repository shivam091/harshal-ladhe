import type { JSX } from "react";
import { iconSpritePresets } from "@/data/icon-sprite-builder-presets";
import { Grid, PresetCard, PresetName, PresetMeta } from "@/components/IconSpriteBuilder/PresetGallery/PresetGallery.styles";
import { AlbumLeaf, PanelTitle } from "@/components/IconSpriteBuilder/IconSpriteBuilder.styles";
import type { PresetGalleryProps } from "@/components/IconSpriteBuilder/IconSpriteBuilder.types";

// Each card says what its set demonstrates, since the point of a set is to see one part of the pipeline at work.
export default function PresetGallery({ actions }: PresetGalleryProps): JSX.Element {
  return (
    <>
      <AlbumLeaf>
        <PanelTitle data-plate="Pl. III">Starter sets</PanelTitle>
        <Grid>
          {iconSpritePresets.map((preset) => (
            <PresetCard key={preset.slug} type="button" onClick={() => actions.applyPreset(preset)} aria-label={`Load the ${preset.name} set — ${preset.note}`}>
              <PresetName>{preset.name}</PresetName>
              <PresetMeta>{preset.note}</PresetMeta>
            </PresetCard>
          ))}
        </Grid>
      </AlbumLeaf>
    </>
  );
}

PresetGallery.displayName = "PresetGallery";
