import type { CSSProperties, JSX } from "react";
import { colorForIndex, compileAreasValue, listAreaNames } from "@/utils/grid-template-builder";
import { gridTemplateBuilderPresets } from "@/data/grid-template-builder-presets";
import { Grid, PresetStage, PresetSample, PresetSampleCell, PresetLabel } from "@/components/GridTemplateBuilder/PresetGallery/PresetGallery.styles";
import { SectionCard, PanelTitle } from "@/components/GridTemplateBuilder/GridTemplateBuilder.styles";
import type { GridTemplateBuilderPresetMeta, PresetGalleryProps } from "@/interfaces/grid-template-builder";

// The thumbnail's own grid shape — track COUNTS rather than the preset's literal sizes (a 40px-wide thumbnail can't meaningfully render "200px" vs "1fr"), but the exact same compileAreasValue call PreviewPane's real grid uses, so a preset with named areas always thumbnails as the actual shape those areas describe.
function sampleGridStyle(preset: GridTemplateBuilderPresetMeta): CSSProperties {
  return {
    gridTemplateColumns: `repeat(${preset.columns.length}, 1fr)`,
    gridTemplateRows: `repeat(${preset.rows.length}, 1fr)`,
    gridTemplateAreas: compileAreasValue(preset.areas)
  };
}

// Click-to-apply preset cards — each one replaces the whole grid (tracks, gap, and areas) in a single actions.applyPreset call/undo step.
export default function PresetGallery({ actions }: PresetGalleryProps): JSX.Element {
  return (
    <>
      <SectionCard>
        <PanelTitle>Presets</PanelTitle>
        <Grid>
          {gridTemplateBuilderPresets.map((preset) => {
            const names = listAreaNames(preset.areas);
            return (
              <PresetStage key={preset.slug} type="button" onClick={() => actions.applyPreset(preset)}>
                <PresetSample style={sampleGridStyle(preset)}>
                  {names.map((name, index) => (
                    <PresetSampleCell key={name} style={{ gridArea: name, background: colorForIndex(index) }} />
                  ))}
                </PresetSample>
                <PresetLabel>{preset.name}</PresetLabel>
              </PresetStage>
            );
          })}
        </Grid>
      </SectionCard>
    </>
  );
}

PresetGallery.displayName = "PresetGallery";
