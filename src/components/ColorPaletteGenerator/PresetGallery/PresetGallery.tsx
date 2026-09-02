import type { JSX } from "react";
import { colorPalettePresets } from "@/data/color-palette-presets";
import { Grid, PresetCard, Swatches, SwatchDot, PresetName } from "@/components/ColorPaletteGenerator/PresetGallery/PresetGallery.styles";
import { SectionCard, PanelTitle } from "@/components/ColorPaletteGenerator/ColorPaletteGenerator.styles";
import type { PresetGalleryProps } from "@/interfaces/color-palette";

// Each card's three dots ARE the preset's own seed/foreground/background — a real preview of what applying it changes, not a separate hand-drawn thumbnail.
export default function PresetGallery({ actions }: PresetGalleryProps): JSX.Element {
  return (
    <>
      <SectionCard>
        <PanelTitle>Presets</PanelTitle>
        <Grid>
          {colorPalettePresets.map((preset) => (
            <PresetCard key={preset.slug} type="button" onClick={() => actions.applyPreset(preset)}>
              <Swatches>
                <SwatchDot style={{ background: preset.seedColor }} />
                <SwatchDot style={{ background: preset.foreground }} />
                <SwatchDot style={{ background: preset.background }} />
              </Swatches>
              <PresetName>{preset.name}</PresetName>
            </PresetCard>
          ))}
        </Grid>
      </SectionCard>
    </>
  );
}

PresetGallery.displayName = "PresetGallery";
