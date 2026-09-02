import type { JSX } from "react";
import { compileFilterValue } from "@/utils/filter";
import { filterPresets } from "@/data/filter-presets";
import { SectionCard, PanelTitle } from "@/components/FilterGenerator/FilterGenerator.styles";
import { Grid, PresetButton, PresetStage, PresetGlassPanel, PresetLabel } from "@/components/FilterGenerator/PresetGallery/PresetGallery.styles";
import type { PresetGalleryProps } from "@/interfaces/filter";

// Every thumbnail renders on the same reference gradient (baked into PresetStage's own CSS) regardless of a preset's own previewSubject — a photo would need per-thumbnail image loading for little benefit at this size, and the gradient alone already shows what each preset's functions actually do.
export default function PresetGallery({ actions }: PresetGalleryProps): JSX.Element {
  return (
    <>
      <SectionCard>
        <PanelTitle>Presets</PanelTitle>
        <Grid>
          {filterPresets.map((preset) => {
            const value = compileFilterValue(preset);
            const isBackdrop = preset.target === "backdropFilter";
            return (
              <PresetButton key={preset.slug} type="button" onClick={() => actions.applyPreset(preset)}>
                <PresetStage style={{ filter: isBackdrop ? "none" : value }}>
                  {isBackdrop && (
                    <PresetGlassPanel style={{ backdropFilter: value, background: `color-mix(in srgb, ${preset.panelColor} ${preset.panelOpacity}%, transparent)` }} />
                  )}
                </PresetStage>
                <PresetLabel>{preset.name}</PresetLabel>
              </PresetButton>
            );
          })}
        </Grid>
      </SectionCard>
    </>
  );
}

PresetGallery.displayName = "PresetGallery";
