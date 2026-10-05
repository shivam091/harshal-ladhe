import type { JSX } from "react";
import { shaderPlaygroundPresets } from "@/data/shader-playground-presets";
import { SectionCard, PanelTitle } from "@/components/ShaderPlayground/ShaderPlayground.styles";
import { Grid, PresetCard, PresetSwatch, PresetName } from "@/components/ShaderPlayground/PresetGallery/PresetGallery.styles";
import type { PresetGalleryProps } from "@/components/ShaderPlayground/ShaderPlayground.types";

// Static swatches rather than live thumbnails — seven extra WebGL contexts would brush up against the browser's per-page context limit and evict the main canvas's.
export default function PresetGallery({ actions }: PresetGalleryProps): JSX.Element {
  return (
    <>
      <SectionCard>
        <PanelTitle>Cartridges</PanelTitle>
        <Grid>
          {shaderPlaygroundPresets.map((preset) => (
            <PresetCard key={preset.slug} type="button" onClick={() => actions.applyPreset(preset)} aria-label={`Load the ${preset.name} preset`}>
              <PresetSwatch aria-hidden="true" style={{ background: `linear-gradient(120deg, ${preset.swatch[0]}, ${preset.swatch[1]})` }} />
              <PresetName>{preset.name}</PresetName>
            </PresetCard>
          ))}
        </Grid>
      </SectionCard>
    </>
  );
}

PresetGallery.displayName = "PresetGallery";
